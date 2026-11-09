import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Building,
  User,
  MessageSquare,
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  Edit3,
  X,
  Database,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { adminAuth, AdminUser } from '../lib/adminAuth';
import { leadService } from '../services/leadService';
import { Lead } from '../lib/database';
import BrandLogo from '../components/BrandLogo';

export default function AdminPage() {
  const navigate = useNavigate();

  // Authentication State
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPass, setLoginPass] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveDatabase, setIsLiveDatabase] = useState<boolean>(false);
  const [dbErrorMessage, setDbErrorMessage] = useState<string>('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals & Selected Lead
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState<boolean>(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);
  const [showDbInfoModal, setShowDbInfoModal] = useState<boolean>(false);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    full_name: '',
    business_email: '',
    company_name: '',
    phone_number: '',
    employee_count: '21-50 employees',
    interested_plan: 'Professional',
    inquiry_type: 'Book a Demo',
    message: ''
  });

  // Verify authentication on mount
  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      setUser(adminAuth.getCurrentUser());
    } else {
      setUser(null);
    }
  }, []);

  // Fetch leads when authenticated
  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeads();
      setLeads(res.leads);
      setIsLiveDatabase(res.isLive);
      if (res.error) {
        setDbErrorMessage(res.error);
      }
    } catch (e: any) {
      console.error('Failed to load leads', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await adminAuth.login(loginEmail, loginPass);
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setLoginError(res.error || 'Invalid credentials');
      }
    } catch (e: any) {
      setLoginError(e.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminAuth.logout();
    setUser(null);
    setLoginPass('');
  };

  // Status Update Handler
  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    await leadService.updateLeadStatus(leadId, newStatus);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Notes Update Handler
  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    await leadService.updateLeadNotes(selectedLead.id, notesDraft);
    setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, admin_notes: notesDraft } : l)));
    setSelectedLead((prev) => (prev ? { ...prev, admin_notes: notesDraft } : null));
    setSavingNotes(false);
  };

  // Delete Lead Handler
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      const res = await leadService.deleteLead(leadId);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLead?.id === leadId) {
          setSelectedLead(null);
        }
      } else {
        alert(res.error || 'Failed to delete lead from MongoDB Atlas database.');
      }
    }
  };

  // Create Manual Lead Handler
  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.full_name || !newLeadForm.business_email || !newLeadForm.company_name) {
      alert('Please fill all required fields');
      return;
    }

    const res = await leadService.submitLead({
      ...newLeadForm,
      source: 'manual_admin_entry'
    });

    if (res.success) {
      setLeads((prev) => [res.lead, ...prev.filter((l) => l.id !== res.lead.id)]);
      setShowAddLeadModal(false);
      setNewLeadForm({
        full_name: '',
        business_email: '',
        company_name: '',
        phone_number: '',
        employee_count: '21-50 employees',
        interested_plan: 'Professional',
        inquiry_type: 'Book a Demo',
        message: ''
      });
    } else {
      alert(res.error || 'Failed to save lead into MongoDB Atlas database.');
    }
  };

  // Computed / Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          lead.full_name.toLowerCase().includes(q) ||
          lead.business_email.toLowerCase().includes(q) ||
          lead.company_name.toLowerCase().includes(q) ||
          (lead.phone_number && lead.phone_number.includes(q)) ||
          (lead.message && lead.message.toLowerCase().includes(q));

        // Status filter
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        // Type filter
        const matchesType = typeFilter === 'all' || lead.inquiry_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [leads, searchQuery, statusFilter, typeFilter, sortOrder]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'new').length;
    const demoCount = leads.filter((l) => l.inquiry_type?.toLowerCase().includes('demo')).length;
    const qualifiedCount = leads.filter((l) => l.status === 'qualified' || l.status === 'contacted').length;
    return { total, newCount, demoCount, qualifiedCount };
  }, [leads]);

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (When not authenticated)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
        {/* Soft Ethereal Radial Background Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 15%, rgba(199, 210, 254, 0.45) 0%, rgba(224, 231, 255, 0.25) 45%, rgba(248, 250, 252, 1) 100%)'
          }}
        />

        {/* Brand Lockup */}
        <div className="relative z-10 w-full max-w-[420px] text-center mb-7">
          <Link to="/" className="inline-block transition hover:opacity-90">
            <div className="flex flex-col items-center">
              <BrandLogo variant="navbar" theme="light" className="scale-110" />
            </div>
          </Link>

          <p className="mt-3 text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
            Biometric workforce &amp; attendance suite for modern enterprises
          </p>
        </div>

        {/* Enterprise Sign In Card */}
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="rounded-2xl sm:rounded-3xl border border-[#E2E8F0] bg-white p-7 sm:p-9 shadow-xl shadow-indigo-100/40">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
              Enterprise Sign In
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B] mb-5">
              Sign in with your work email and password.
            </p>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] px-4 py-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset is managed by your enterprise administrator or MongoDB Atlas master config.')}
                    className="text-xs text-[#4F46E5] hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] px-4 py-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] px-5 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition cursor-pointer disabled:opacity-70"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying with MongoDB Atlas...</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-[11px] text-[#94A3B8] leading-relaxed">
              B2B enterprise account. Employee logins are provisioned by your system administrator.
            </p>
          </div>

          {/* Bottom Security Note */}
          <p className="text-center text-xs text-[#94A3B8] mt-7">
            Protected by enterprise-grade security and encrypted access controls.
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-[#64748B] hover:text-[#4F46E5] transition inline-flex items-center gap-1">
              <span>&larr; Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED LEADS MANAGEMENT DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-20">
      {/* 1. TOP ADMIN BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-block transition hover:opacity-90">
              <BrandLogo variant="navbar" />
            </Link>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-indigo-100">
                Leads Center
              </span>
              {isLiveDatabase ? (
                <button
                  type="button"
                  onClick={() => setShowDbInfoModal(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#10B981] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 cursor-pointer"
                  title="Connected to MongoDB Atlas (cluster0.la6tjpd.mongodb.net)"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span>MongoDB Atlas Live</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDbInfoModal(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 cursor-pointer"
                  title="Click to view MongoDB Atlas architecture"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>MongoDB Vault (Cached)</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-[#0F172A]">{user.name}</div>
              <div className="text-[10px] text-[#64748B]">{user.email}</div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-[#4F46E5] transition hover:bg-[#4F46E5] hover:text-white cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. DASHBOARD BODY */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-8 space-y-8">
        {/* Header Hero Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#0F172A] tracking-tight">
              Inbound Leads &amp; Demonstration Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Real-time submission pipeline for organizations exploring FlowPeople biometric and GPS attendance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadLeads}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => leadService.exportToCSV(filteredLeads)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#4F46E5]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddLeadModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4F46E5] text-white px-4 py-2 text-xs font-semibold hover:bg-[#4338CA] transition shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Lead Manually</span>
            </button>
          </div>
        </div>

        {/* 3. METRIC CARDS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Total Leads</span>
            <div className="mt-2 text-3xl font-bold text-[#0F172A]">{metrics.total}</div>
            <div className="mt-1 text-[11px] text-[#94A3B8]">Inbound submissions</div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">New / Action Required</span>
            <div className="mt-2 text-3xl font-bold text-amber-700">{metrics.newCount}</div>
            <div className="mt-1 text-[11px] text-amber-600">Uncontacted leads</div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">Demo Requests</span>
            <div className="mt-2 text-3xl font-bold text-[#4F46E5]">{metrics.demoCount}</div>
            <div className="mt-1 text-[11px] text-[#64748B]">Scheduled or requested</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">In Progress / Qualified</span>
            <div className="mt-2 text-3xl font-bold text-emerald-700">{metrics.qualifiedCount}</div>
            <div className="mt-1 text-[11px] text-emerald-600">Commercial dialogue</div>
          </div>
        </div>

        {/* 4. CONTROLS & FILTER TOOLBAR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by lead name, company, email, phone number, or notes..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-[#0F172A] outline-none focus:border-[#4F46E5]"
              >
                <option value="all">All Inquiry Types</option>
                <option value="Book a Demo">Book a Demo</option>
                <option value="Product Enquiry">Product Enquiry</option>
                <option value="Pricing Enquiry">Pricing Enquiry</option>
                <option value="Partnership">Partnership</option>
                <option value="Technical Support">Technical Support</option>
              </select>

              {/* Sort Toggle */}
              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-[#0F172A] hover:bg-white inline-flex items-center gap-1 cursor-pointer"
                title="Toggle sort direction"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 text-xs">
            <span className="text-[#64748B] font-semibold mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              <span>Status:</span>
            </span>

            {[
              { id: 'all', label: 'All Leads' },
              { id: 'new', label: 'New' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'qualified', label: 'Qualified' },
              { id: 'closed', label: 'Closed' },
              { id: 'archived', label: 'Archived' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. LEADS DATA TABLE */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-4 sm:px-6">Lead &amp; Organization</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Inquiry / Plan</th>
                  <th className="py-3.5 px-4">Date Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#94A3B8]">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <MessageSquare className="h-8 w-8 text-slate-300" />
                        <span className="text-sm font-medium text-[#0F172A]">No leads found</span>
                        <span className="text-xs text-[#64748B]">Try resetting your search query or status filter.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition group cursor-pointer"
                      onClick={() => {
                        setSelectedLead(lead);
                        setNotesDraft(lead.admin_notes || '');
                      }}
                    >
                      {/* Name & Company */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                            {lead.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition">
                              {lead.full_name}
                            </div>
                            <div className="text-xs text-[#64748B] flex items-center gap-1">
                              <Building className="h-3 w-3 text-slate-400" />
                              <span>{lead.company_name}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <a
                            href={`mailto:${lead.business_email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#4F46E5] hover:underline flex items-center gap-1 font-medium"
                          >
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{lead.business_email}</span>
                          </a>
                          {lead.phone_number && (
                            <a
                              href={`tel:${lead.phone_number}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#64748B] hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span>{lead.phone_number}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Inquiry Type & Plan */}
                      <td className="py-4 px-4">
                        <div>
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              lead.inquiry_type?.toLowerCase().includes('demo')
                                ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-100'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {lead.inquiry_type || 'General'}
                          </span>
                          <div className="text-[11px] text-[#94A3B8] mt-1">
                            Plan: <span className="font-medium text-[#0F172A]">{lead.interested_plan || 'Starter'}</span>
                            {lead.employee_count && ` · ${lead.employee_count}`}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-[#64748B]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          {new Date(lead.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold border outline-none cursor-pointer ${
                            lead.status === 'new'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : lead.status === 'contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : lead.status === 'qualified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLead(lead);
                              setNotesDraft(lead.admin_notes || '');
                            }}
                            className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#4F46E5] transition cursor-pointer"
                            title="Inspect Lead Details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* 6. MODAL: DETAILED LEAD INSPECTION & INTERNAL NOTES                   */}
      {/* ===================================================================== */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">
                  LEAD PROFILE DOSSIER
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
                  {selectedLead.full_name}
                </h3>
                <p className="text-xs text-[#64748B]">{selectedLead.company_name}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`mailto:${selectedLead.business_email}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] text-white py-2.5 px-4 text-xs font-semibold hover:bg-[#4338CA] transition"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email Lead</span>
              </a>

              {selectedLead.phone_number ? (
                <a
                  href={`tel:${selectedLead.phone_number}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-[#0F172A] py-2.5 px-4 text-xs font-semibold hover:bg-white transition"
                >
                  <Phone className="h-3.5 w-3.5 text-[#4F46E5]" />
                  <span>Call {selectedLead.phone_number}</span>
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 py-2.5 px-4 text-xs">
                  <span>Phone not provided</span>
                </div>
              )}
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Inquiry Type</span>
                <span className="font-semibold text-[#0F172A]">{selectedLead.inquiry_type || 'General'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Interested Plan</span>
                <span className="font-semibold text-[#0F172A]">{selectedLead.interested_plan || 'Starter'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Team Size</span>
                <span className="font-semibold text-[#0F172A]">{selectedLead.employee_count || 'Unspecified'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Received At</span>
                <span className="font-semibold text-[#0F172A]">
                  {new Date(selectedLead.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Source Channel</span>
                <span className="font-semibold text-[#0F172A]">{selectedLead.source || 'website'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Lifecycle Status</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                  className="mt-0.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-[#4F46E5] outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Submitted Message */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                Lead Inquiry Message:
              </span>
              <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#0F172A] leading-relaxed italic">
                "{selectedLead.message || 'No additional note provided by prospect.'}"
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Internal Administrative Notes:
              </span>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Log call updates, team requirements, discount commitments, or next action items..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="rounded-full bg-[#4F46E5] text-white px-5 py-2 text-xs font-semibold hover:bg-[#4338CA] transition cursor-pointer"
                >
                  {savingNotes ? 'Saving Notes...' : 'Save Internal Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL: ADD LEAD MANUALLY                                           */}
      {/* ===================================================================== */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">MANUAL PIPELINE LOG</span>
                <h3 className="text-xl font-bold text-[#0F172A] mt-1">Record Prospect Lead</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Full Name *
                  <input
                    type="text"
                    required
                    value={newLeadForm.full_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, full_name: e.target.value })}
                    placeholder="e.g. Vikramaditya Roy"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Business Email *
                  <input
                    type="email"
                    required
                    value={newLeadForm.business_email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, business_email: e.target.value })}
                    placeholder="vroy@enterprise.in"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Company Name *
                  <input
                    type="text"
                    required
                    value={newLeadForm.company_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company_name: e.target.value })}
                    placeholder="Enterprise Corp"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Phone Number
                  <input
                    type="tel"
                    value={newLeadForm.phone_number}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone_number: e.target.value })}
                    placeholder="+91 98000 11223"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Inquiry Type
                  <select
                    value={newLeadForm.inquiry_type}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, inquiry_type: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none"
                  >
                    <option value="Book a Demo">Book a Demo</option>
                    <option value="Pricing Enquiry">Pricing Enquiry</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-[#0F172A]">
                  Interested Plan
                  <select
                    value={newLeadForm.interested_plan}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, interested_plan: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none"
                  >
                    <option value="Starter">Starter (30 emp)</option>
                    <option value="Professional">Professional (75 emp)</option>
                    <option value="Enterprise">Enterprise (200 emp)</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-semibold text-[#0F172A]">
                Notes / Requirements
                <textarea
                  rows={3}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Details discussed during phone or personal meeting..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-[#0F172A] outline-none focus:border-[#4F46E5] focus:bg-white"
                />
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#4F46E5] text-white px-5 py-2 text-xs font-semibold hover:bg-[#4338CA] cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. MODAL: MONGODB ATLAS ARCHITECTURE & AI AGENT MIGRATIONS            */}
      {/* ===================================================================== */}
      {showDbInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">MongoDB Atlas Architecture</h3>
                  <p className="text-xs text-[#64748B]">Dedicated Cloud Cluster &amp; Direct AI Agent Migrations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDbInfoModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#334155]">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-[#0F172A] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  <span>Cluster Details &amp; Telemetry:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#64748B]">
                  <li><b>Cluster Host:</b> <code className="text-[#4F46E5] font-mono">cluster0.la6tjpd.mongodb.net</code></li>
                  <li><b>Database Name:</b> <code className="text-[#4F46E5] font-mono">flowpeople</code></li>
                  <li><b>Primary Collection:</b> <code className="text-[#4F46E5] font-mono">leads</code> (with 6 verified indexes)</li>
                  <li><b>AI Migration Agent:</b> Direct migrations through <code className="text-[#4F46E5] font-mono">npm run db:migrate</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto space-y-1">
                <div className="text-slate-400"># Active MongoDB Atlas Connection (.env):</div>
                <div className="text-emerald-400">MONGODB_URI="mongodb+srv://hqfluxora_db_user:***@cluster0.la6tjpd.mongodb.net/flowpeople?..."</div>
                <div className="text-emerald-400">MONGODB_DB_NAME="flowpeople"</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <b>AI Agent Direct Migration Enabled:</b> Whenever database schemas, indexes, or collections are modified, AI agents directly execute database migrations and status inspections via the dedicated MongoDB driver scripts.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDbInfoModal(false)}
                className="rounded-full bg-[#4F46E5] text-white px-5 py-2 text-xs font-semibold hover:bg-[#4338CA] cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

