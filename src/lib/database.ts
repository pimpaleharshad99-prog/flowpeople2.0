export interface Lead {
  id: string;
  created_at: string;
  updated_at?: string;
  full_name: string;
  business_email: string;
  company_name: string;
  phone_number?: string;
  phone?: string;
  employee_count?: string;
  interested_plan?: string;
  inquiry_type?: string;
  designation?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
  admin_notes?: string;
  source?: string;
}

export type NewLeadPayload = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'>;

export interface DatabaseHealthStatus {
  connected: boolean;
  database?: string;
  provider?: string;
  error?: string;
}

/**
 * Checks the status of the Supabase PostgreSQL connection via backend API
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  try {
    const res = await fetch('/api/db/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      connected: Boolean(data.connected || data.status === 'ok'),
      database: data.database || 'postgres',
      provider: data.provider || 'Supabase PostgreSQL',
    };
  } catch (e: any) {
    return {
      connected: false,
      database: 'postgres',
      provider: 'Supabase PostgreSQL',
      error: e.message || 'Offline',
    };
  }
}
