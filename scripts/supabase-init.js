import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!dbUrl || !supabaseUrl || !supabaseSecretKey) {
  console.error('❌ Missing required environment variables: DATABASE_URL, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const schemaSql = `
-- =====================================================================
-- FLOWPEOPLE POSTGRESQL SCHEMA FOR SUPABASE
-- =====================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Create Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null unique,
  role text not null default 'admin' check (role in ('superadmin', 'admin', 'viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Create Leads Table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_email text not null,
  phone text default '',
  phone_number text default '',
  company_name text default '',
  designation text default '',
  employee_count text default '',
  interested_plan text default '',
  inquiry_type text default '',
  message text default '',
  source text default 'website',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'archived')),
  admin_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Create Indexes
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_email on public.leads(business_email);
create index if not exists idx_leads_company on public.leads(company_name);
create index if not exists idx_profiles_email on public.profiles(email);

-- 5. Helper Function: is_admin()
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and is_active = true
      and role in ('superadmin', 'admin')
  );
$$;

-- 6. Trigger to automatically sync auth.users to public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'superadmin'),
    true
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.leads enable row level security;

-- Drop existing policies if any to recreate cleanly
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

drop policy if exists "Public visitors can insert leads" on public.leads;
drop policy if exists "Admins can view leads" on public.leads;
drop policy if exists "Admins can update leads" on public.leads;
drop policy if exists "Admins can delete leads" on public.leads;

-- 8. Profiles RLS Policies
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles
  for select
  using (public.is_admin());

create policy "Admins can update profiles"
  on public.profiles
  for update
  using (public.is_admin());

-- 9. Leads RLS Policies
-- A. Public can insert new leads
create policy "Public visitors can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- B. Admins can view leads
create policy "Admins can view leads"
  on public.leads
  for select
  using (public.is_admin());

-- C. Admins can update leads
create policy "Admins can update leads"
  on public.leads
  for update
  using (public.is_admin());

-- D. Admins can delete leads
create policy "Admins can delete leads"
  on public.leads
  for delete
  using (public.is_admin());
`;

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚡ Initializing Supabase PostgreSQL Schema & RLS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('✓ Connected to PostgreSQL');

  await client.query(schemaSql);
  console.log('✓ Schema and RLS policies created successfully');

  // Verify tables
  const tablesRes = await client.query(`
    select table_name from information_schema.tables 
    where table_schema = 'public' and table_name in ('profiles', 'leads');
  `);
  console.log('✓ Verified public tables:', tablesRes.rows.map(r => r.table_name));

  await client.end();

  // Create initial superadmin user via Supabase Auth Admin API
  console.log('\nCreating/verifying Superadmin user in Supabase Auth...');
  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const adminEmail = process.env.ADMIN_EMAIL || 'pimpaleg80@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Harshad@9322616210';

  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    throw listError;
  }

  let adminUser = usersData.users.find(u => u.email === adminEmail);
  if (!adminUser) {
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Harsh Pimpale (Admin)',
        role: 'superadmin',
      },
    });
    if (createError) throw createError;
    adminUser = createData.user;
    console.log('✓ Created Superadmin account in Supabase Auth:', adminUser.email, `(${adminUser.id})`);
  } else {
    // Update password to ensure it matches
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Harsh Pimpale (Admin)',
        role: 'superadmin',
      },
    });
    if (updateError) throw updateError;
    console.log('✓ Updated Superadmin account password in Supabase Auth:', adminUser.email);
  }

  // Ensure profile in public.profiles
  const client2 = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client2.connect();
  await client2.query(`
    insert into public.profiles (id, full_name, email, role, is_active)
    values ($1, $2, $3, 'superadmin', true)
    on conflict (id) do update
    set role = 'superadmin', is_active = true, updated_at = now();
  `, [adminUser.id, 'Harsh Pimpale (Admin)', adminEmail]);
  console.log('✓ Verified Superadmin profile record in public.profiles with role: superadmin');

  await client2.end();

  // Test Admin Login with Anon Client
  console.log('\nTesting Admin Login via Supabase Client (Anon key)...');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authError) {
    throw authError;
  }
  console.log('✓ Admin login successful! Session access_token received.');
  console.log('✓ User:', authData.user.email);

  // Test RLS with authenticated client
  console.log('\nTesting RLS: Querying leads with authenticated admin token...');
  const { data: leadsData, error: leadsError } = await supabaseAnon
    .from('leads')
    .select('*');
  if (leadsError) {
    console.error('❌ Error reading leads:', leadsError);
  } else {
    console.log('✓ Leads query succeeded under RLS! Count:', leadsData.length);
  }

  // Sign out
  await supabaseAnon.auth.signOut();

  // Test Public Visitor Lead Insertion (Anon without auth)
  console.log('\nTesting RLS: Public visitor lead submission (Anon)...');
  const testLead = {
    full_name: 'Public Test Visitor',
    business_email: 'visitor@supabase-test.com',
    company_name: 'Supabase Tester Inc',
    phone_number: '+91 9999999999',
    interested_plan: 'Starter',
    inquiry_type: 'Demo Request',
    message: 'Testing public submission with Supabase RLS.',
    status: 'new',
    source: 'migration_test',
  };
  const { data: insertedLead, error: insertError } = await supabaseAnon
    .from('leads')
    .insert([testLead])
    .select();

  if (insertError) {
    console.error('❌ Insert error:', insertError);
  } else {
    console.log('✓ Public visitor successfully inserted lead under RLS! ID:', insertedLead[0].id);
  }

  // Clean up test lead
  const client3 = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client3.connect();
  await client3.query(`delete from public.leads where business_email = 'visitor@supabase-test.com';`);
  await client3.end();
  console.log('✓ Cleaned up test lead.');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SUPABASE POSTGRESQL & AUTH REBUILD INITIALIZED 100%!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('Init error:', err);
  process.exit(1);
});
