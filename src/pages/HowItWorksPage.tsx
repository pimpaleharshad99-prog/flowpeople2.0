import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Clock,
  LayoutDashboard,
  FolderArchive,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  Database,
  ScanFace,
  ChevronRight,
  Laptop
} from 'lucide-react';
import { FP_IMAGES } from '../assets/fpImages';

interface Step {
  step: string;
  badge: string;
  title: string;
  summary: string;
  details: string[];
  mockupTitle: string;
  mockupDetails: { label: string; val: string }[];
}

const STEPS: Step[] = [
  {
    step: '01',
    badge: 'ORGANIZATION ONBOARDING',
    title: 'Set Up Your Organization',
    summary: 'Register your business, configure your company profile, establish administrator access, and connect your dedicated database and Google Drive.',
    details: [
      'Dedicated client database initialization (MongoDB Atlas) ensures complete tenant data isolation.',
      'Google Drive integration links your company-owned storage for employee documents and monthly automated backups.',
      'Configure organizational hierarchy, official departments, working calendar, and company-wide policies.'
    ],
    mockupTitle: 'Organization Control Plane',
    mockupDetails: [
      { label: 'Database Status', val: 'Connected · Dedicated' },
      { label: 'Drive Integration', val: 'Active · Client Storage' },
      { label: 'License Version', val: 'Perpetual Commercial' }
    ]
  },
  {
    step: '02',
    badge: 'WORKFORCE ENROLLMENT',
    title: 'Add Your Team',
    summary: 'Create employee profiles, organize employee information, configure role-based permissions, and prepare check-in credentials.',
    details: [
      'Bulk import or individual creation of employee profiles with designations, departments, and reporting managers.',
      'Configure granular access permissions: standard employee self-service vs. HR manager vs. super administrator.',
      'Enroll optional biometric facial vectors on kiosk terminals (with employee consent) or assign 100m mobile GPS geofences.'
    ],
    mockupTitle: 'Team Directory Provisioning',
    mockupDetails: [
      { label: 'Role Scope', val: 'Granular RBAC' },
      { label: 'Attendance Mode', val: 'Biometric + GPS Zone' },
      { label: 'Profiles Active', val: 'Within Plan Capacity' }
    ]
  },
  {
    step: '03',
    badge: 'DAILY WORKFLOWS',
    title: 'Manage Daily Operations',
    summary: 'Handle attendance check-ins, employee records, leave workflows, and day-to-day HR activities without paperwork or spreadsheet clutter.',
    details: [
      'Sub-second contactless face attendance via entrance kiosk tablet or 1-tap mobile check-in inside geofence.',
      'Multi-tier leave application and approval routing with instant notifications to line managers.',
      'Real-time shift calculation factoring in arrival timestamps, half-days, and custom break thresholds.'
    ],
    mockupTitle: 'Operational Event Bus',
    mockupDetails: [
      { label: 'Kiosk Speed', val: '< 1 second verification' },
      { label: 'Leave Routing', val: 'Automated 2-tier' },
      { label: 'Manual Friction', val: '0% Paperwork' }
    ]
  },
  {
    step: '04',
    badge: 'REAL-TIME TELEMETRY',
    title: 'Monitor Your Workforce',
    summary: 'Use the centralized HR dashboard to view real-time employee information, attendance summaries, working hours, and operational trends.',
    details: [
      'Live overview of on-premises, remote, and on-leave headcount with single-click drill-downs.',
      'Identify attendance trends, late arrivals, and pending leave approvals from one consolidated cockpit.',
      'Generate audit-ready reports and compliance rosters with instant structured exports.'
    ],
    mockupTitle: 'HR Dashboard Telemetry',
    mockupDetails: [
      { label: 'Live Attendance', val: '98.4% on-premises' },
      { label: 'Pending Approvals', val: 'Resolved in mins' },
      { label: 'Audit Trail', val: 'Immutable event logs' }
    ]
  },
  {
    step: '05',
    badge: 'ARCHIVAL & COMPLIANCE',
    title: 'Keep Everything Organized',
    summary: 'Use document management, data exports, and supported integrations to maintain clean, audit-ready employee records indefinitely.',
    details: [
      'Store contracts, ID proofs, certifications, and onboarding kits in client-owned Google Drive folders.',
      'Export monthly payroll summaries, attendance logs, and tax records in standard CSV or formatted PDF.',
      'Automatic monthly database backups with 3 months of rolling retention keep your organizational memory safe.'
    ],
    mockupTitle: 'Secure Document Repository',
    mockupDetails: [
      { label: 'Storage Location', val: 'Client Google Drive' },
      { label: 'Export Formats', val: 'PDF, CSV, Excel' },
      { label: 'Rolling Retention', val: '3 Months Automated' }
    ]
  }
];

export default function HowItWorksPage() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  return (
    <div className="how-it-works-page min-h-screen bg-[#FBF7F0] text-[#242321] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#590907]" />
            <span>HOW IT WORKS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#242321] font-serif max-w-3xl mx-auto leading-[1.1]">
            HR Management. <span className="text-[#590907]">Made Effortless.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#6B615A] leading-relaxed">
            From setting up your organization to managing everyday employee operations, FlowPeople brings
            your essential HR workflows together in one organized platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-[#590907] px-6 py-3 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#590907]/90"
            >
              <span>Explore Pricing</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/contact?type=Book%20a%20Demo"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(89,9,7,0.2)] bg-white/80 px-6 py-3 text-xs sm:text-sm font-semibold text-[#242321] shadow-xs backdrop-blur-md transition hover:bg-white hover:text-[#590907]"
            >
              <span>Book a Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. STEP-BY-STEP WORKFLOW INTERACTION                                 */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#242321] font-serif">
              Five Simple Steps to Total HR Clarity
            </h2>
            <p className="text-sm text-[#6B615A]">
              Click any step to inspect the workflow, data architecture, and operational mechanics.
            </p>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
            {STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStepIdx(idx)}
                className={`flex items-center gap-2.5 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeStepIdx === idx
                    ? 'bg-[#590907] text-[#F8F6F1] shadow-sm'
                    : 'bg-white border border-[rgba(89,9,7,0.12)] text-[#242321] hover:bg-[#F3EBDD]/60'
                }`}
              >
                <span className="font-mono text-xs opacity-75">{s.step}</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Showcase Card */}
          <div className="rounded-3xl border border-[rgba(89,9,7,0.12)] bg-white p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Narrative & Inclusions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#590907] font-mono text-xs font-bold text-[#F8F6F1]">
                    {STEPS[activeStepIdx].step}
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#590907]">
                    {STEPS[activeStepIdx].badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242321] font-serif">
                  {STEPS[activeStepIdx].title}
                </h3>

                <p className="text-sm sm:text-base text-[#6B615A] leading-relaxed">
                  {STEPS[activeStepIdx].summary}
                </p>

                <div className="pt-2 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#242321]">
                    Key Capabilities &amp; Architecture:
                  </div>
                  {STEPS[activeStepIdx].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A423D]">
                      <CheckCircle2 className="h-4 w-4 text-[#299D68] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Mockup Plate */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-[rgba(89,9,7,0.1)] bg-gradient-to-br from-[#FBF7F0] to-[#F3EBDD] p-6 shadow-inner space-y-5">
                  <div className="flex items-center justify-between border-b border-[rgba(89,9,7,0.08)] pb-3">
                    <span className="text-xs font-bold text-[#590907]">
                      {STEPS[activeStepIdx].mockupTitle}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#299D68]" />
                  </div>

                  <div className="space-y-3">
                    {STEPS[activeStepIdx].mockupDetails.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-[rgba(89,9,7,0.06)] shadow-2xs text-xs"
                      >
                        <span className="text-[#6B615A]">{item.label}</span>
                        <span className="font-semibold text-[#242321] font-mono">{item.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center text-[11px] text-[#6B615A]">
                    Designed for dedicated, single-tenant organizational data ownership.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. STEP-BY-STEP VERTICAL TIMELINE BREAKDOWN                           */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#F3EBDD]/40 border-t border-[rgba(89,9,7,0.08)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#242321] font-serif">
              The Complete Operational Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-[#6B615A]">
              How FlowPeople coordinates workforce administration from day one.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-7 sm:before:left-1/2 before:w-0.5 before:bg-[rgba(89,9,7,0.12)]">
            {STEPS.map((s, idx) => (
              <div
                key={s.step}
                className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-12 ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Center Node Marker */}
                <div className="absolute left-7 sm:left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#590907] text-white font-mono text-xs font-bold shadow-md ring-4 ring-[#FBF7F0]">
                  {s.step}
                </div>

                {/* Content Box */}
                <div className="ml-14 sm:ml-0 sm:w-1/2 p-6 rounded-2xl bg-white border border-[rgba(89,9,7,0.08)] shadow-xs">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#590907]">
                    {s.badge}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-[#242321]">{s.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#6B615A] leading-relaxed">
                    {s.summary}
                  </p>
                </div>

                {/* Balance empty spacer */}
                <div className="hidden sm:block sm:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. FINAL CTA (POSH SCULPTED CURVES & GOLDEN LUXURY)                  */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#590907] via-[#430604] to-[#1C0202] text-[#F8F6F1] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(89,9,7,0.5)] border-2 border-[#D4AF37]/35">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-[#FFE4B8]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFE4B8] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Simple Onboarding</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F6F1] font-serif leading-[1.1]">
              Ready to Simplify <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
                Your Everyday HR?
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-white/85 font-light leading-relaxed">
              Get your organization started with a single one-time license and zero recurring software maintenance fees (T&C Apply).
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FFE4B8] via-[#E8D2B5] to-[#D4AF37] px-8 py-4 text-sm font-bold text-[#3A1B12] shadow-lg shadow-[#D4AF37]/20 transition-all hover:scale-[1.03] hover:shadow-xl"
              >
                <span>Explore Pricing</span>
                <ArrowRight className="h-4 w-4 text-[#3A1B12]" />
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

