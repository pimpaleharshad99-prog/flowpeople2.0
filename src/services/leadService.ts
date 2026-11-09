import { Lead, NewLeadPayload, checkDatabaseHealth, MongoHealthStatus } from '../lib/database';

const LOCAL_STORAGE_KEY = 'flowpeople_leads_vault';

// Fallback initial leads if running completely offline without server
const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: 'lead_enterprise_01',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    full_name: 'Rajesh Sharma',
    business_email: 'rajesh.sharma@techcorp.in',
    company_name: 'TechCorp Solutions India',
    phone_number: '+91 98200 12345',
    employee_count: '51-200 employees',
    interested_plan: 'Professional',
    inquiry_type: 'Book a Demo',
    message: 'We want to migrate from manual punch cards to FlowPeople Biometric and GPS attendance across 3 branch offices in Mumbai.',
    status: 'new',
    admin_notes: 'High priority lead. Requested callback for Friday morning.',
    source: 'website_contact_form'
  },
  {
    id: 'lead_enterprise_02',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    full_name: 'Priya Nair',
    business_email: 'priya@zenithhr.com',
    company_name: 'Zenith HR Consultancy',
    phone_number: '+91 99887 65432',
    employee_count: '21-50 employees',
    interested_plan: 'Starter',
    inquiry_type: 'Pricing Enquiry',
    message: 'Interested in the one-time license model. Does it include multiple admin seats for our HR managers?',
    status: 'contacted',
    admin_notes: 'Sent pricing sheet and license breakdown via email.',
    source: 'website_contact_form'
  },
  {
    id: 'lead_enterprise_03',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    full_name: 'Vikram Mehta',
    business_email: 'vmehta@logixglobal.com',
    company_name: 'Logix Global Logistics',
    phone_number: '+91 98111 22334',
    employee_count: '201-500 employees',
    interested_plan: 'Enterprise',
    inquiry_type: 'Book a Demo',
    message: 'We have 250+ field delivery personnel who need 100m geofenced mobile GPS attendance. Please schedule a live demonstration.',
    status: 'qualified',
    admin_notes: 'Enterprise contract discussion scheduled for next week.',
    source: 'website_contact_form'
  },
  {
    id: 'lead_enterprise_04',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    full_name: 'Aakash Patel',
    business_email: 'aakash@omnicreative.co',
    company_name: 'Omni Creative Studios',
    phone_number: '+91 97766 55443',
    employee_count: '1-20 employees',
    interested_plan: 'Starter',
    inquiry_type: 'Product Enquiry',
    message: 'Looking for a simple biometric kiosk setup for our design studio in Ahmedabad.',
    status: 'closed',
    admin_notes: 'Onboarded on Starter tier.',
    source: 'website_contact_form'
  }
];

function getLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
      return INITIAL_DEMO_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading leads from localStorage', e);
    return INITIAL_DEMO_LEADS;
  }
}

function saveLocalLeads(leads: Lead[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
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
        const savedLead: Lead = data.lead;
        // Sync local cache
        const local = getLocalLeads();
        saveLocalLeads([savedLead, ...local.filter(l => l.id !== savedLead.id)]);
        return { success: true, lead: savedLead, isLive: true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn('MongoDB API returned error:', errJson.error);
        const local = getLocalLeads();
        saveLocalLeads([fallbackLead, ...local]);
        return { success: false, lead: fallbackLead, isLive: false, error: errJson.error || 'Failed to insert lead into MongoDB Atlas' };
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
          saveLocalLeads(data.leads);
          return { leads: data.leads, isLive: true };
        }
      }
      throw new Error(`API returned HTTP ${res.status}`);
    } catch (err: any) {
      console.warn('API fetch failed, loading cached leads:', err.message);
      return { leads: getLocalLeads(), isLive: false, error: err.message };
    }
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
