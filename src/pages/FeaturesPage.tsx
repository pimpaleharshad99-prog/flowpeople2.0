import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  CalendarDays,
  LayoutDashboard,
  BarChart3,
  FolderArchive,
  Database,
  ArrowRight,
  CheckCircle2,
  ScanFace,
  MapPin,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  Download,
  KeyRound,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { FP_IMAGES } from '../assets/fpImages';
import Lightfall from '../components/Lightfall';

export default function FeaturesPage() {
  return (
    <div className="features-page min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#4F46E5] uppercase mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
            <span>PLATFORM CAPABILITIES</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#0F172A] font-serif max-w-5xl mx-auto leading-[1.06]">
            Everything Your HR Team Needs. <span className="text-[#4F46E5]">In One Place.</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-[#0F172A] font-medium leading-relaxed">
            Bring employee management, attendance, leave workflows and workforce administration into
            one connected experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#4F46E5]/90"
            >
              <span>Explore Pricing Plans</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/contact?type=Book%20a%20Demo"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-xs sm:text-sm font-semibold text-[#0F172A] shadow-xs backdrop-blur-md transition hover:bg-white hover:text-[#4F46E5]"
            >
              <span>Book a Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. THE 7 CORE FEATURE SECTIONS                                        */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24 space-y-24">
        {/* A. EMPLOYEE MANAGEMENT */}
        <section id="employee-management" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <Users className="h-3.5 w-3.5" />
              <span>CORE HR DIRECTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              Employee Management
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Maintain an organized, audit-ready employee directory. Store comprehensive workforce records,
              manage official job titles, maintain emergency contacts, and configure granular role access.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Employee Profiles:</b> Complete personal, professional, and contact details.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Employee Records:</b> Employment tenure, department trees, and designations.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Role-Based Access:</b> Self-service portal for staff, control planes for managers.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-[#4F46E5]">Workforce Directory Preview</span>
                <span className="text-[11px] font-mono text-[#64748B]">48 Profiles Active</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Rahul Sharma', role: 'Lead Product Designer', dept: 'Engineering', status: 'Active' },
                  { name: 'Ananya Deshmukh', role: 'Head of Talent Acquisition', dept: 'People Ops', status: 'Active' },
                  { name: 'Karthik Nair', role: 'Senior Systems Architect', dept: 'Infrastructure', status: 'On Leave' }
                ].map((emp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                    <div>
                      <div className="font-bold text-[#0F172A]">{emp.name}</div>
                      <div className="text-[11px] text-[#64748B]">{emp.role} · {emp.dept}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      emp.status === 'Active' ? 'bg-[#299D68]/15 text-[#299D68]' : 'bg-[#EEF2FF] text-white'
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* B. ATTENDANCE MANAGEMENT */}
        <section id="attendance-management" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <Clock className="h-3.5 w-3.5" />
              <span>TIME &amp; ATTENDANCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              Attendance Management
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Track workforce arrival with precision. Support entrance contactless biometric face recognition
              where hardware allows, mobile GPS 100m geofenced check-ins, or reliable web manual entries.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Contactless Face Kiosk:</b> Sub-second recognition with anti-spoof liveness checks.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>GPS 100m Geofencing:</b> 1-tap mobile check-ins strictly inside corporate radius.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Shift Intelligence:</b> Automatic calculations of overtime, late marks, and half days.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="rounded-3xl border border-slate-200 bg-[#0B0F19] text-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-blue-300">Real-Time Attendance Terminal</span>
                <span className="h-2 w-2 rounded-full bg-[#299D68] animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[11px] text-white/60">Active Verification Engine</div>
                <div className="text-sm font-mono text-[#F8F6F1]">Kiosk Mode v8 · Terminal 01 (Entrance)</div>
                <div className="flex items-center gap-2 text-xs text-[#299D68] pt-1">
                  <ScanFace className="h-4 w-4" />
                  <span>Face Geometry Vector Verified (99.8% Confidence)</span>
                </div>
              </div>
              <div className="text-xs text-white/70 flex justify-between pt-1">
                <span>Check-in Timestamp</span>
                <span className="font-mono text-blue-300">09:14:02 AM IST</span>
              </div>
            </div>
          </div>
        </section>

        {/* C. LEAVE MANAGEMENT */}
        <section id="leave-management" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>TIME OFF ADMINISTRATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              Leave Management
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Eliminate paper leave slips and email back-and-forth. Employees request time off in taps,
              managers review balances in real time, and accruals update automatically.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Custom Policy Balances:</b> Casual, sick, earned, maternity, and comp-offs.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Multi-Tier Approvals:</b> Automatic routing to designated line managers.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Calendar Visibility:</b> Departmental out-of-office views to avoid team overlap.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/#choose-attendance"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4F46E5] hover:underline"
              >
                <span>View attendance &amp; leave options on hub</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-[#4F46E5]">Leave Request Workflow</span>
                <span className="text-[11px] font-mono text-[#4C7A5C]">Auto-Routed</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">Earned Leave Request</div>
                    <div className="text-[11px] text-[#64748B]">Rahul Sharma · 2 Days (Nov 14–15)</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#299D68]/15 text-[#299D68]">
                    Approved by Manager
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] bg-white p-2.5 rounded-xl border border-slate-200">
                  "Attending annual family commitment. Project deliverables scheduled in advance."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* D. HR DASHBOARD */}
        <section id="hr-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>COMMAND CENTER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              HR Dashboard &amp; Analytics
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Consolidated real-time visibility into all workforce operations. View department headcounts,
              daily attendance percentages, on-leave staff, and administrative alerts at a glance.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Real-Time Headcount:</b> Active, remote, and out-of-office metrics updated live.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Operational Alerts:</b> Instant flags for unapproved leaves or attendance anomalies.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Executive Clarity:</b> High-level statistics designed for swift decision-making.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-[#4F46E5]">Executive Overview</span>
                <span className="text-[11px] font-mono text-[#64748B]">Live Pulse</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <div className="text-[10px] text-[#64748B] uppercase">Total Active Staff</div>
                  <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1">142</div>
                  <div className="text-[10px] text-[#299D68] mt-0.5">100% capacity compliant</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <div className="text-[10px] text-[#64748B] uppercase">Today's Check-ins</div>
                  <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1">98.4%</div>
                  <div className="text-[10px] text-[#299D68] mt-0.5">On-time rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E. REPORTS AND ANALYTICS */}
        <section id="reports-analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>DATA &amp; EXPORTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              Reports and Analytics
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Export audit-ready records whenever required. Generate monthly attendance summaries,
              payroll-ready sheets, leave balance registers, and workforce roster PDFs in seconds.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>One-Click Exports:</b> Download structured CSV, Excel, or PDF report formats.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Audit Compliance:</b> Complete timestamp logs and manager sign-off history.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Zero Data Lock-In:</b> Export your entire organizational history at any time.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/#choose-attendance"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#4F46E5] hover:underline"
              >
                <span>Learn about reports integration</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-[#4F46E5]">Export Formats Available</span>
                <span className="text-[11px] font-mono text-[#64748B]">Structured &amp; PDF</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="h-4 w-4 text-[#299D68]" />
                    <span className="font-semibold text-[#0F172A]">Monthly Attendance Roster (.xlsx)</span>
                  </div>
                  <Download className="h-4 w-4 text-[#64748B]" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-[#4F46E5]" />
                    <span className="font-semibold text-[#0F172A]">Statutory Leave Register (.pdf)</span>
                  </div>
                  <Download className="h-4 w-4 text-[#64748B]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* F. DOCUMENT MANAGEMENT */}
        <section id="document-management" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <FolderArchive className="h-3.5 w-3.5" />
              <span>DOCUMENT ARCHIVAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              Document Management
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Organize appointment letters, identity cards, tax documents, and education credentials
              cleanly attached to individual employee profiles.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Profile Attachments:</b> ID proofs, contracts, certifications, and tax declarations.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Organization Policies:</b> Centralized distribution of company handbooks and notices.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Client-Owned Storage:</b> Files route directly to your organization Google Drive.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-[#4F46E5]">Employee Document Vault</span>
                <span className="text-[11px] font-mono text-[#64748B]">Google Drive Linked</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                  <span>Appointment_Letter_Rahul_Sharma.pdf</span>
                  <span className="text-[#299D68] font-semibold">Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                  <span>ID_Proof_Government_Aadhaar.pdf</span>
                  <span className="text-[#299D68] font-semibold">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* G. INTEGRATIONS AND DATA */}
        <section id="integrations-data" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
              <Database className="h-3.5 w-3.5" />
              <span>INFRASTRUCTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#0F172A]">
              Integrations and Data Independence
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              FlowPeople is engineered around client data independence. Your workforce records are never pooled
              into an advertising data lake—they reside in your dedicated database and client-owned storage.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#64748B]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>MongoDB Atlas:</b> Dedicated cloud database cluster isolation and enterprise encryption.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Google Drive:</b> Client-owned workspace for file archival and automated backups.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                <span><b>Monthly Backups:</b> 3 months of rolling retention protects company memory.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#F3EBDD] to-[#FBF7F0] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-[#4F46E5]">Connected Stack</span>
                <span className="text-[11px] font-mono text-[#299D68]">Dedicated Client Node</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <b className="text-sm font-bold text-[#0F172A] block">Database</b>
                  <p className="text-[11px] text-[#64748B] mt-1">MongoDB Atlas Cluster</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <b className="text-sm font-bold text-[#0F172A] block">Drive Storage</b>
                  <p className="text-[11px] text-[#64748B] mt-1">Client Organization Drive</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===================================================================== */}
      {/* 3. FINAL CTA (POSH SCULPTED CURVES & GOLDEN LUXURY)                  */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E1B4B] text-[#F8F6F1] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(89,9,7,0.5)] border-2 border-indigo-500/30">
          {/* Dynamic Golden Lightfall Canvas Background */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-60">
            <Lightfall
              colors={['#60A5FA', '#818CF8', '#38BDF8', '#C7D2FE', '#FFFFFF']}
              backgroundColor="#0B0F19"
              speed={0.25}
              streakCount={3}
              streakWidth={1.3}
              twinkle={0.35}
              backgroundGlow={0.25}
              headGlow={0.75}
              bloom={0.4}
              mouseInteraction={false}
            />
          </div>

          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-blue-400/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Scale With Confidence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F6F1] font-serif leading-[1.1]">
              Discover the Right Plan <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                for Your Business.
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-white/85 font-light leading-relaxed">
              One-time perpetual licensing with zero recurring software maintenance fees (T&C Apply). Pick the tier that matches your headcount.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.03] hover:shadow-xl"
              >
                <span>Explore Pricing Plans</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </Link>

              <Link
                to="/contact?type=Book%20a%20Demo"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-4 text-sm font-semibold text-white shadow-md backdrop-blur-md transition-all hover:scale-[1.02]"
              >
                <span>Book a Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

