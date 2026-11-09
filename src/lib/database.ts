export interface Lead {
  id: string;
  created_at: string;
  updated_at?: string;
  full_name: string;
  business_email: string;
  company_name: string;
  phone_number?: string;
  employee_count?: string;
  interested_plan?: string;
  inquiry_type?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
  admin_notes?: string;
  source?: string;
  _id?: string;
}

export type NewLeadPayload = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status' | '_id'>;

export interface MongoHealthStatus {
  connected: boolean;
  database?: string;
  cluster?: string;
  collections?: string[];
  error?: string;
}

/**
 * Checks the status of the MongoDB Atlas connection via our backend API
 */
export async function checkDatabaseHealth(): Promise<MongoHealthStatus> {
  try {
    const res = await fetch('/api/db/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e: any) {
    return {
      connected: false,
      cluster: 'cluster0.la6tjpd.mongodb.net',
      error: e.message || 'Offline',
    };
  }
}

