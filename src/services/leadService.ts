import { Lead, NewLeadPayload, checkDatabaseHealth, MongoHealthStatus } from '../lib/database';

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
   * Submit a new lead through contact / demo form into MongoDB Atlas
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
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const savedLead: Lead = data.lead || fallbackLead;
        // Sync local cache
        const local = getLocalLeads();
        saveLocalLeads([savedLead, ...local.filter((l) => l.id !== savedLead.id)]);
        return { success: true, lead: savedLead, isLive: data.isLive ?? true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn('MongoDB API returned error, saved to local vault:', errJson.error);
        const local = getLocalLeads();
        saveLocalLeads([fallbackLead, ...local]);
        // For customer-facing inquiry forms, guarantee submission acceptance & local preservation
        return { success: true, lead: fallbackLead, isLive: false, error: errJson.error };
      }
    } catch (err: any) {
      console.warn('Network offline or direct static mode, falling back to local cache:', err.message);
      const local = getLocalLeads();
      saveLocalLeads([fallbackLead, ...local]);
      return { success: true, lead: fallbackLead, isLive: false, error: err.message };
    }
  },

  /**
   * Fetch all leads for the admin dashboard from MongoDB Atlas
   */
  async getLeads(): Promise<{ leads: Lead[]; isLive: boolean; error?: string }> {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leads)) {
          const cleanLeads = data.leads.filter((l: Lead) => !isDemoLead(l));
          saveLocalLeads(cleanLeads);
          return { leads: cleanLeads, isLive: true };
        }
      }
      throw new Error(`API returned HTTP ${res.status}`);
    } catch (err: any) {
      console.warn('API fetch failed, loading cached leads:', err.message);
      return { leads: getLocalLeads(), isLive: false, error: err.message };
    }
  },

  /**
   * Purge all demo/sample leads from local storage and remote MongoDB Atlas
   */
  async purgeDemoLeads(): Promise<{ success: boolean; deletedCount?: number }> {
    const clean = getLocalLeads();
    saveLocalLeads(clean);
    try {
      const res = await fetch('/api/leads/purge-demo', { method: 'DELETE' });
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
   * Update the status of a lead in MongoDB Atlas
   */
  async updateLeadStatus(id: string, status: Lead['status']): Promise<{ success: boolean; isLive?: boolean; error?: string }> {
    // Update local cache optimistically
    const local = getLocalLeads();
    const updated = local.map((lead) => (lead.id === id ? { ...lead, status, updated_at: new Date().toISOString() } : lead));
    saveLocalLeads(updated);

    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return { success: res.ok, isLive: res.ok };
    } catch (err: any) {
      return { success: true, isLive: false, error: err.message };
    }
  },

  /**
   * Update internal admin notes in MongoDB Atlas
   */
  async updateLeadNotes(id: string, admin_notes: string): Promise<{ success: boolean; isLive?: boolean; error?: string }> {
    // Update local cache optimistically
    const local = getLocalLeads();
    const updated = local.map((lead) => (lead.id === id ? { ...lead, admin_notes, updated_at: new Date().toISOString() } : lead));
    saveLocalLeads(updated);

    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes })
      });
      return { success: res.ok, isLive: res.ok };
    } catch (err: any) {
      return { success: true, isLive: false, error: err.message };
    }
  },

  /**
   * Delete a lead from MongoDB Atlas
   */
  async deleteLead(id: string): Promise<{ success: boolean; isLive?: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        // Remove from local cache after confirmed database delete
        const local = getLocalLeads();
        saveLocalLeads(local.filter((l) => l.id !== id));
        return { success: true, isLive: true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.error('Failed to delete lead from MongoDB:', errJson.error);
        return { success: false, isLive: false, error: errJson.error || `HTTP ${res.status} deletion failed` };
      }
    } catch (err: any) {
      console.warn('Network error while deleting lead from MongoDB:', err.message);
      const local = getLocalLeads();
      saveLocalLeads(local.filter((l) => l.id !== id));
      return { success: true, isLive: false, error: err.message };
    }
  },

  /**
   * Check connection status to MongoDB Atlas
   */
  async checkConnection(): Promise<MongoHealthStatus> {
    return checkDatabaseHealth();
  }
};
