import { Lead, NewLeadPayload, checkDatabaseHealth, DatabaseHealthStatus } from '../lib/database';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'flowpeople_leads_vault';

const DEMO_EMAILS = [
  'rajesh.sharma@techcorp.in',
  'priya@zenithhr.com',
  'vmehta@logixglobal.com',
  'aakash@omnicreative.co',
  'ananya@fintechapex.in',
];

function isDemoLead(lead: Lead): boolean {
  if (!lead) return false;
  if (lead.id?.startsWith('lead_enterprise_') || lead.id?.startsWith('test_')) return true;
  if (lead.business_email && DEMO_EMAILS.includes(lead.business_email.toLowerCase())) return true;
  return false;
}

function getLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    const clean = Array.isArray(parsed) ? parsed.filter((l) => !isDemoLead(l)) : [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean));
    return clean;
  } catch (e) {
    console.error('Error reading leads from localStorage', e);
    return [];
  }
}

function saveLocalLeads(leads: Lead[]): void {
  try {
    const clean = Array.isArray(leads) ? leads.filter((l) => !isDemoLead(l)) : [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.error('Error saving leads to localStorage', e);
  }
}

export const leadService = {
  /**
   * Submit a new lead through contact / demo form into Supabase PostgreSQL
   */
  async submitLead(payload: NewLeadPayload): Promise<{ success: boolean; lead: Lead; isLive: boolean; error?: string }> {
    const fallbackLead: Lead = {
      ...payload,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lead_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'new',
      admin_notes: '',
      source: payload.source || 'website_contact_form'
    };

    try {
      // 1. Direct Supabase submission
      const newLeadData = {
        full_name: payload.full_name,
        business_email: payload.business_email,
        company_name: payload.company_name || '',
        phone_number: payload.phone_number || payload.phone || '',
        phone: payload.phone || payload.phone_number || '',
        employee_count: payload.employee_count || '',
        interested_plan: payload.interested_plan || '',
        inquiry_type: payload.inquiry_type || '',
        designation: payload.designation || '',
        message: payload.message || '',
        status: 'new',
        admin_notes: '',
        source: payload.source || 'website_inquiry_form',
      };

      const { data: inserted, error: insertError } = await supabase
        .from('leads')
        .insert([newLeadData])
        .select();

      if (!insertError && inserted && inserted.length > 0) {
        const savedLead: Lead = inserted[0];
        const local = getLocalLeads();
        saveLocalLeads([savedLead, ...local.filter(l => l.id !== savedLead.id)]);
        return { success: true, lead: savedLead, isLive: true };
      }

      // 2. Fallback to API route if direct insert policy restricted .select()
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const savedLead: Lead = data.lead;
        const local = getLocalLeads();
        saveLocalLeads([savedLead, ...local.filter(l => l.id !== savedLead.id)]);
        return { success: true, lead: savedLead, isLive: true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        const local = getLocalLeads();
        saveLocalLeads([fallbackLead, ...local]);
        return { success: false, lead: fallbackLead, isLive: false, error: errJson.error || 'Failed to insert lead into database' };
      }
    } catch (err: any) {
      console.warn('Network offline or direct static mode, falling back to local cache:', err.message);
      const local = getLocalLeads();
      saveLocalLeads([fallbackLead, ...local]);
      return { success: true, lead: fallbackLead, isLive: false, error: err.message };
    }
  },

  /**
   * Fetch all leads for the admin dashboard from Supabase PostgreSQL
   */
  async getLeads(): Promise<{ leads: Lead[]; isLive: boolean; error?: string }> {
    try {
      // 1. First attempt direct query through authenticated Supabase client
      const { data: supabaseLeads, error: supabaseError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!supabaseError && Array.isArray(supabaseLeads)) {
        const cleanLeads = supabaseLeads.filter((l: Lead) => !isDemoLead(l));
        saveLocalLeads(cleanLeads);
        return { leads: cleanLeads, isLive: true };
      }

      // 2. Fallback to /api/leads serverless endpoint with credentials
      const res = await fetch('/api/leads', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leads)) {
          const cleanLeads = data.leads.filter((l: Lead) => !isDemoLead(l));
          saveLocalLeads(cleanLeads);
          return { leads: cleanLeads, isLive: true };
        }
      } else if (res.status === 401) {
        return { leads: [], isLive: false, error: 'Unauthorized: Admin authentication required.' };
      }
      throw new Error(`API returned HTTP ${res.status}`);
    } catch (err: any) {
      console.warn('API fetch failed, loading cached leads:', err.message);
      return { leads: getLocalLeads(), isLive: false, error: err.message };
    }
  },

  /**
   * Purge all demo/sample leads from local storage and remote Supabase database
   */
  async purgeDemoLeads(): Promise<{ success: boolean; deletedCount?: number }> {
    const clean = getLocalLeads();
    saveLocalLeads(clean);
    try {
      const { data, error } = await supabase
        .from('leads')
        .delete()
        .in('business_email', DEMO_EMAILS);

      if (!error) {
        return { success: true };
      }

      const res = await fetch('/api/leads/purge-demo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, deletedCount: data.deletedCount };
      }
    } catch (e) {
      // Local clean is already complete
    }
    return { success: true };
  },

  /**
   * Update the status of a lead in Supabase PostgreSQL
   */
  async updateLeadStatus(id: string, status: Lead['status']): Promise<{ success: boolean; isLive?: boolean; error?: string }> {
    // Update local cache optimistically
    const local = getLocalLeads();
    const updated = local.map((lead) => (lead.id === id ? { ...lead, status, updated_at: new Date().toISOString() } : lead));
    saveLocalLeads(updated);

    try {
      // 1. Direct Supabase update
      const { error: sbError } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (!sbError) {
        return { success: true, isLive: true };
      }

      // 2. Fallback to API route
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      return { success: res.ok, isLive: res.ok };
    } catch (err: any) {
      return { success: true, isLive: false, error: err.message };
    }
  },

  /**
   * Update internal admin notes in Supabase PostgreSQL
   */
  async updateLeadNotes(id: string, admin_notes: string): Promise<{ success: boolean; isLive?: boolean; error?: string }> {
    // Update local cache optimistically
    const local = getLocalLeads();
    const updated = local.map((lead) => (lead.id === id ? { ...lead, admin_notes, updated_at: new Date().toISOString() } : lead));
    saveLocalLeads(updated);

    try {
      // 1. Direct Supabase update
      const { error: sbError } = await supabase
        .from('leads')
        .update({ admin_notes, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (!sbError) {
        return { success: true, isLive: true };
      }

      // 2. Fallback to API route
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ admin_notes })
      });
      return { success: res.ok, isLive: res.ok };
    } catch (err: any) {
      return { success: true, isLive: false, error: err.message };
    }
  },

  /**
   * Delete a lead from Supabase PostgreSQL
   */
  async deleteLead(id: string): Promise<{ success: boolean; isLive?: boolean; error?: string }> {
    if (!id) {
      return { success: false, isLive: false, error: 'Lead identifier is required.' };
    }
    try {
      // 1. Direct Supabase delete
      const { error: sbError } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (!sbError) {
        const local = getLocalLeads();
        saveLocalLeads(local.filter((l) => l.id !== id));
        return { success: true, isLive: true };
      }

      // 2. Fallback to API route
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const local = getLocalLeads();
        saveLocalLeads(local.filter((l) => l.id !== id));
        return { success: true, isLive: true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        let errMsg = errJson.error;
        if (res.status === 401) {
          errMsg = 'Session expired. Please log in again.';
        } else if (res.status === 404) {
          errMsg = errJson.error || 'Lead not found or incorrect API route.';
        } else if (res.status >= 500) {
          errMsg = 'Server error. Please try again.';
        }
        return { success: false, isLive: false, error: errMsg || `HTTP ${res.status} deletion failed` };
      }
    } catch (err: any) {
      console.warn('Network error while deleting lead from Supabase:', err.message);
      return { success: false, isLive: false, error: 'Network error: could not connect to server.' };
    }
  },

  /**
   * Check connection status to Supabase PostgreSQL
   */
  async checkConnection(): Promise<DatabaseHealthStatus> {
    return checkDatabaseHealth();
  }
};
