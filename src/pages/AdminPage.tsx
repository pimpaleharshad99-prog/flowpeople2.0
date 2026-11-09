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
      await leadService.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
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
      setLeads((prev) => [res.lead, ...prev]);
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
      <div className="min-h-screen bg-[#FBF7F0] text-[#242321] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link to="/" className="inline-block transition hover:opacity-90">
            <BrandLogo variant="navbar" />
          </Link>

          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#590907]">
            <Lock className="h-3 w-3 text-[#590907]" />
            <span>EXECUTIVE ACCESS CONTROL</span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#242321]">
            FlowPeople Admin Desk
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B615A]">
            Sign in with administrative credentials to access organizational leads &amp; inquiries.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="rounded-3xl border border-[rgba(89,9,7,0.12)] bg-white p-7 sm:p-9 shadow-lg">
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#242321] uppercase tracking-wider mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A5A79B]" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@flowpeople.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#242321] outline-none focus:border-[#590907]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242321] uppercase tracking-wider mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A5A79B]" />
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#242321] outline-none focus:border-[#590907]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#590907] px-5 py-3 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-sm transition hover:bg-[#590907]/90 cursor-pointer disabled:opacity-70"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying with MongoDB Atlas...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Authenticate &amp; Access Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-[#6B615A] hover:text-[#590907] transition inline-flex items-center gap-1">
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
    <div className="min-h-screen bg-[#FBF7F0] text-[#242321] pb-20">
      {/* 1. TOP ADMIN BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[rgba(89,9,7,0.1)] px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-block transition hover:opacity-90">
              <BrandLogo variant="navbar" />
            </Link>
            <div className="h-5 w-[1px] bg-[rgba(89,9,7,0.15)] hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#590907] bg-[#590907]/10 px-2.5 py-0.5 rounded-full">
                Leads Center
              </span>
              {isLiveDatabase ? (
                <button
                  type="button"
                  onClick={() => setShowDbInfoModal(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#299D68] bg-[#299D68]/10 px-2.5 py-0.5 rounded-full border border-[#299D68]/20 cursor-pointer"
                  title="Connected to MongoDB Atlas (cluster0.la6tjpd.mongodb.net)"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#299D68] animate-pulse"></span>
                  <span>MongoDB Atlas Live</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDbInfoModal(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#D97706] bg-[#D97706]/10 px-2.5 py-0.5 rounded-full border border-[#D97706]/20 cursor-pointer"
                  title="Click to view MongoDB Atlas architecture"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]"></span>
                  <span>MongoDB Vault (Cached)</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-[#242321]">{user.name}</div>
              <div className="text-[10px] text-[#6B615A]">{user.email}</div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] px-3.5 py-1.5 text-xs font-semibold text-[#590907] transition hover:bg-[#590907] hover:text-white cursor-pointer"
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(89,9,7,0.08)] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#242321]">
              Inbound Leads &amp; Demonstration Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-[#6B615A] mt-1">
              Real-time submission pipeline for organizations exploring FlowPeople biometric and GPS attendance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadLeads}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(89,9,7,0.15)] bg-white px-3.5 py-2 text-xs font-semibold text-[#242321] hover:bg-[#F3EBDD] transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => leadService.exportToCSV(filteredLeads)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(89,9,7,0.15)] bg-white px-3.5 py-2 text-xs font-semibold text-[#242321] hover:bg-[#F3EBDD] transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#590907]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddLeadModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#590907] text-[#F8F6F1] px-4 py-2 text-xs font-semibold hover:bg-[#590907]/90 transition shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Lead Manually</span>
            </button>
          </div>
        </div>

        {/* 3. METRIC CARDS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-[rgba(89,9,7,0.1)] bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B615A]">Total Leads</span>
            <div className="mt-2 text-3xl font-bold font-serif text-[#242321]">{metrics.total}</div>
            <div className="mt-1 text-[11px] text-[#A5A79B]">Inbound submissions</div>
          </div>

          <div className="rounded-2xl border border-[#D97706]/30 bg-[#FFFBEB] p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">New / Action Required</span>
            <div className="mt-2 text-3xl font-bold font-serif text-[#D97706]">{metrics.newCount}</div>
            <div className="mt-1 text-[11px] text-[#B45309]">Uncontacted leads</div>
          </div>

          <div className="rounded-2xl border border-[rgba(89,9,7,0.1)] bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#590907]">Demo Requests</span>
            <div className="mt-2 text-3xl font-bold font-serif text-[#590907]">{metrics.demoCount}</div>
            <div className="mt-1 text-[11px] text-[#6B615A]">Scheduled or requested</div>
          </div>

          <div className="rounded-2xl border border-[#299D68]/30 bg-[#F0FDF4] p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#299D68]">In Progress / Qualified</span>
            <div className="mt-2 text-3xl font-bold font-serif text-[#299D68]">{metrics.qualifiedCount}</div>
            <div className="mt-1 text-[11px] text-[#15803D]">Commercial dialogue</div>
          </div>
        </div>

        {/* 4. CONTROLS & FILTER TOOLBAR */}
        <div className="rounded-2xl border border-[rgba(89,9,7,0.1)] bg-white p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#A5A79B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by lead name, company, email, phone number, or notes..."
                className="w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#242321] outline-none focus:border-[#590907]"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] px-3 py-2 text-xs text-[#242321] outline-none focus:border-[#590907]"
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
                className="rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] px-3 py-2 text-xs text-[#242321] hover:bg-white inline-flex items-center gap-1 cursor-pointer"
                title="Toggle sort direction"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-[rgba(89,9,7,0.06)] pt-3 text-xs">
            <span className="text-[#6B615A] font-semibold mr-2 flex items-center gap-1">
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
                    ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                    : 'bg-[#FBF7F0] text-[#6B615A] hover:bg-[#F3EBDD]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. LEADS DATA TABLE */}
        <div className="rounded-3xl border border-[rgba(89,9,7,0.1)] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[rgba(89,9,7,0.1)] bg-[#FBF7F0]/60 text-[11px] font-bold uppercase tracking-wider text-[#6B615A]">
                  <th className="py-3.5 px-4 sm:px-6">Lead &amp; Organization</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Inquiry / Plan</th>
                  <th className="py-3.5 px-4">Date Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(89,9,7,0.06)]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#A5A79B]">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <MessageSquare className="h-8 w-8 text-[#A5A79B]/60" />
                        <span className="text-sm font-medium text-[#242321]">No leads found</span>
                        <span className="text-xs text-[#6B615A]">Try resetting your search query or status filter.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#FBF7F0]/80 transition group cursor-pointer"
                      onClick={() => {
                        setSelectedLead(lead);
                        setNotesDraft(lead.admin_notes || '');
                      }}
                    >
                      {/* Name & Company */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#590907]/10 text-[#590907] flex items-center justify-center font-bold text-xs shrink-0">
                            {lead.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#242321] group-hover:text-[#590907] transition">
                              {lead.full_name}
                            </div>
                            <div className="text-xs text-[#6B615A] flex items-center gap-1">
                              <Building className="h-3 w-3 text-[#A5A79B]" />
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
                            className="text-[#590907] hover:underline flex items-center gap-1 font-medium"
                          >
                            <Mail className="h-3 w-3 text-[#A5A79B]" />
                            <span>{lead.business_email}</span>
                          </a>
                          {lead.phone_number && (
                            <a
                              href={`tel:${lead.phone_number}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#6B615A] hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Phone className="h-3 w-3 text-[#A5A79B]" />
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
                                ? 'bg-[#590907]/10 text-[#590907]'
                                : 'bg-[#E8D2B5]/30 text-[#4A423D]'
                            }`}
                          >
                            {lead.inquiry_type || 'General'}
                          </span>
                          <div className="text-[11px] text-[#A5A79B] mt-1">
                            Plan: <span className="font-medium text-[#242321]">{lead.interested_plan || 'Starter'}</span>
                            {lead.employee_count && ` · ${lead.employee_count}`}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-[#6B615A]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#A5A79B]" />
                          <span>{new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="text-[10px] text-[#A5A79B]">
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
                            className="p-1.5 rounded-lg text-[#6B615A] hover:bg-[#F3EBDD] hover:text-[#590907] transition cursor-pointer"
                            title="Inspect Lead Details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-[#A5A79B] hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-[rgba(89,9,7,0.15)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-[rgba(89,9,7,0.08)] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#590907]">
                  LEAD PROFILE DOSSIER
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#242321] mt-1">
                  {selectedLead.full_name}
                </h3>
                <p className="text-xs text-[#6B615A]">{selectedLead.company_name}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-full hover:bg-[#F3EBDD] text-[#6B615A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`mailto:${selectedLead.business_email}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#590907] text-[#F8F6F1] py-2.5 px-4 text-xs font-semibold hover:bg-[#590907]/90 transition"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email Lead</span>
              </a>

              {selectedLead.phone_number ? (
                <a
                  href={`tel:${selectedLead.phone_number}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] text-[#242321] py-2.5 px-4 text-xs font-semibold hover:bg-white transition"
                >
                  <Phone className="h-3.5 w-3.5 text-[#590907]" />
                  <span>Call {selectedLead.phone_number}</span>
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[rgba(89,9,7,0.1)] bg-zinc-50 text-zinc-400 py-2.5 px-4 text-xs">
                  <span>Phone not provided</span>
                </div>
              )}
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FBF7F0] border border-[rgba(89,9,7,0.08)] text-xs">
              <div>
                <span className="text-[#A5A79B] block text-[10px] uppercase font-bold">Inquiry Type</span>
                <span className="font-semibold text-[#242321]">{selectedLead.inquiry_type || 'General'}</span>
              </div>
              <div>
                <span className="text-[#A5A79B] block text-[10px] uppercase font-bold">Interested Plan</span>
                <span className="font-semibold text-[#242321]">{selectedLead.interested_plan || 'Starter'}</span>
              </div>
              <div>
                <span className="text-[#A5A79B] block text-[10px] uppercase font-bold">Team Size</span>
                <span className="font-semibold text-[#242321]">{selectedLead.employee_count || 'Unspecified'}</span>
              </div>
              <div>
                <span className="text-[#A5A79B] block text-[10px] uppercase font-bold">Received At</span>
                <span className="font-semibold text-[#242321]">
                  {new Date(selectedLead.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[#A5A79B] block text-[10px] uppercase font-bold">Source Channel</span>
                <span className="font-semibold text-[#242321]">{selectedLead.source || 'website'}</span>
              </div>
              <div>
                <span className="text-[#A5A79B] block text-[10px] uppercase font-bold">Lifecycle Status</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                  className="mt-0.5 rounded-lg border border-[rgba(89,9,7,0.2)] bg-white px-2 py-0.5 text-xs font-semibold text-[#590907] outline-none"
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B615A] block mb-1.5">
                Lead Inquiry Message:
              </span>
              <div className="p-4 rounded-xl border border-[rgba(89,9,7,0.1)] bg-white text-xs sm:text-sm text-[#242321] leading-relaxed italic">
                "{selectedLead.message || 'No additional note provided by prospect.'}"
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B615A] block">
                Internal Administrative Notes:
              </span>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Log call updates, team requirements, discount commitments, or next action items..."
                className="w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-3 text-xs sm:text-sm text-[#242321] outline-none focus:border-[#590907] resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="rounded-full bg-[#590907] text-[#F8F6F1] px-5 py-2 text-xs font-semibold hover:bg-[#590907]/90 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[rgba(89,9,7,0.15)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-[rgba(89,9,7,0.08)] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#590907]">MANUAL PIPELINE LOG</span>
                <h3 className="text-xl font-bold font-serif text-[#242321] mt-1">Record Prospect Lead</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="p-1.5 rounded-full hover:bg-[#F3EBDD] text-[#6B615A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#242321]">
                  Full Name *
                  <input
                    type="text"
                    required
                    value={newLeadForm.full_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, full_name: e.target.value })}
                    placeholder="e.g. Vikramaditya Roy"
                    className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none focus:border-[#590907]"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#242321]">
                  Business Email *
                  <input
                    type="email"
                    required
                    value={newLeadForm.business_email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, business_email: e.target.value })}
                    placeholder="vroy@enterprise.in"
                    className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none focus:border-[#590907]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#242321]">
                  Company Name *
                  <input
                    type="text"
                    required
                    value={newLeadForm.company_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company_name: e.target.value })}
                    placeholder="Enterprise Corp"
                    className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none focus:border-[#590907]"
                  />
                </label>

                <label className="block text-xs font-semibold text-[#242321]">
                  Phone Number
                  <input
                    type="tel"
                    value={newLeadForm.phone_number}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone_number: e.target.value })}
                    placeholder="+91 98000 11223"
                    className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none focus:border-[#590907]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-semibold text-[#242321]">
                  Inquiry Type
                  <select
                    value={newLeadForm.inquiry_type}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, inquiry_type: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none"
                  >
                    <option value="Book a Demo">Book a Demo</option>
                    <option value="Pricing Enquiry">Pricing Enquiry</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-[#242321]">
                  Interested Plan
                  <select
                    value={newLeadForm.interested_plan}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, interested_plan: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none"
                  >
                    <option value="Starter">Starter (30 emp)</option>
                    <option value="Professional">Professional (75 emp)</option>
                    <option value="Enterprise">Enterprise (200 emp)</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-semibold text-[#242321]">
                Notes / Requirements
                <textarea
                  rows={3}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Details discussed during phone or personal meeting..."
                  className="mt-1 w-full rounded-xl border border-[rgba(89,9,7,0.15)] bg-[#FBF7F0] p-2.5 text-xs text-[#242321] outline-none focus:border-[#590907]"
                />
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="rounded-full border border-[rgba(89,9,7,0.15)] px-4 py-2 text-xs font-semibold text-[#6B615A] hover:bg-[#F3EBDD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#590907] text-[#F8F6F1] px-5 py-2 text-xs font-semibold hover:bg-[#590907]/90 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-[rgba(89,9,7,0.15)] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-[rgba(89,9,7,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#299D68]/10 text-[#299D68] flex items-center justify-center">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#242321]">MongoDB Atlas Architecture</h3>
                  <p className="text-xs text-[#6B615A]">Dedicated Cloud Cluster &amp; Direct AI Agent Migrations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDbInfoModal(false)}
                className="p-1.5 rounded-full hover:bg-[#F3EBDD] text-[#6B615A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#4A423D]">
              <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[rgba(89,9,7,0.08)] space-y-2">
                <div className="font-bold text-[#242321] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#299D68]"></span>
                  <span>Cluster Details &amp; Telemetry:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#6B615A]">
                  <li><b>Cluster Host:</b> <code className="text-[#590907] font-mono">cluster0.la6tjpd.mongodb.net</code></li>
                  <li><b>Database Name:</b> <code className="text-[#590907] font-mono">flowpeople</code></li>
                  <li><b>Primary Collection:</b> <code className="text-[#590907] font-mono">leads</code> (with 6 verified indexes)</li>
                  <li><b>AI Migration Agent:</b> Direct migrations through <code className="text-[#590907] font-mono">npm run db:migrate</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto space-y-1">
                <div className="text-zinc-400"># Active MongoDB Atlas Connection (.env):</div>
                <div className="text-emerald-400">MONGODB_URI="mongodb+srv://hqfluxora_db_user:***@cluster0.la6tjpd.mongodb.net/flowpeople?..."</div>
                <div className="text-emerald-400">MONGODB_DB_NAME="flowpeople"</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#299D68]/10 border border-[#299D68]/30 text-[#299D68] text-xs">
                <b>AI Agent Direct Migration Enabled:</b> Whenever database schemas, indexes, or collections are modified, AI agents directly execute database migrations and status inspections via the dedicated MongoDB driver scripts.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDbInfoModal(false)}
                className="rounded-full bg-[#590907] text-[#F8F6F1] px-5 py-2 text-xs font-semibold hover:bg-[#590907]/90 cursor-pointer"
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

