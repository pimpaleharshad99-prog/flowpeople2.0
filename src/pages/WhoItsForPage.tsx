import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  Briefcase,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  MapPin,
  FileText
} from 'lucide-react';

const AUDIENCES = [
  {
    icon: <Users className="h-6 w-6 text-[#590907]" />,
    tag: 'ORGANIZATIONS 10–30 STAFF',
    title: 'Small Businesses & Startups',
    summary: 'For organizations moving away from paper files, disconnected spreadsheets, and chaotic WhatsApp leave messages.',
    points: [
      'Centralized digital employee profiles with emergency contacts and identification proofs.',
      'Simple contactless kiosk attendance or web check-ins that take seconds.',
      'Predictable budget: one-time perpetual license with ₹0 monthly software bills.'
    ]
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-[#590907]" />,
    tag: 'EXPANDING TEAMS 30–75 STAFF',
    title: 'Growing Companies',
    summary: 'For businesses expanding their headcount and requiring formal, structured HR approval workflows without enterprise bloat.',
    points: [
      'Multi-tier leave approvals automatically routing to line managers and department heads.',
      'Real-time workforce visibility showing who is on-premises, remote, or on leave.',
      'Google Drive integration keeping company records synchronized in your own cloud.'
    ]
  },
  {
    icon: <Briefcase className="h-6 w-6 text-[#590907]" />,
    tag: 'PEOPLE OPERATIONS PROFESSIONALS',
    title: 'HR Teams & Managers',
    summary: 'For HR coordinators who spend too many hours manually cross-checking attendance records, calculating shifts, and fielding leave inquiries.',
    points: [
      'Self-service employee portal cuts routine leave and balance inquiry emails by 80%.',
      'One-click audit-ready reports and compliance rosters exportable in CSV and PDF.',
      'Centralized document repository organized cleanly under each employee card.'
    ]
  },
  {
    icon: <MapPin className="h-6 w-6 text-[#590907]" />,
    tag: 'REGIONAL WORKPLACES',
    title: 'Multi-Location Organizations',
    summary: 'For organizations operating across corporate offices, retail branches, or field sites requiring centralized administration (Enterprise tier).',
    points: [
      'Independent 100m GPS geofencing zones configured around multiple physical work sites.',
      'Consolidated management cockpit aggregating branch-level telemetry in real time.',
      'Scoped role permissions ensuring regional supervisors manage only their branch roster.'
    ]
  },
  {
    icon: <Building className="h-6 w-6 text-[#590907]" />,
    tag: 'FOUNDERS & DECISION MAKERS',
    title: 'Business Owners & Leadership',
    summary: 'For decision-makers who need clear executive oversight of workforce operations without recurring software hostage pricing.',
    points: [
      'Executive dashboard delivering live headcount and punctuality trends at a glance.',
      'Full data sovereignty: customer owns the database and the Google Drive storage repository.',
      'Capital-efficient: perpetual commercial license with zero compounding per-seat SaaS taxes.'
    ]
  }
];

const CHALLENGES_VS_FLOWPEOPLE = [
  {
    challenge: 'Spreadsheet Sprawl & Lost Records',
    pain: 'Multiple versions of Excel attendance trackers, broken formulas, and missing leave slips.',
    solution: 'Single unified database with automated timestamp logging and cloud backup synchronization.'
  },
  {
    challenge: 'Compounding Subscription Costs',
    pain: 'SaaS vendors charging ₹250–₹500/user/month that inflates drastically with every new hire.',
    solution: 'One-time perpetual license with ₹0 recurring software maintenance fees across all tiers.'
  },
  {
    challenge: 'Attendance Verification Disputes',
    pain: 'Buddy punching, inaccurate manual logbooks, and disputes over arrival timestamps.',
    solution: 'Hardware-verified contactless face recognition or precision 100m mobile GPS geofencing.'
  },
  {
    challenge: 'Data Privacy & Vendor Lock-In',
    pain: 'Employee records pooled into opaque vendor data lakes with difficult exit procedures.',
    solution: 'Dedicated single-tenant database and client-owned Google Drive storage with free exports.'
  }
];

export default function WhoItsForPage() {
  return (
    <div className="who-its-for-page min-h-screen bg-[#FBF7F0] text-[#242321] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase mb-6">
            <Users className="h-3.5 w-3.5 text-[#590907]" />
            <span>AUDIENCE &amp; FIT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#242321] font-serif max-w-3xl mx-auto leading-[1.1]">
            Built for Businesses That Want to <span className="text-[#590907]">Work Smarter.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#6B615A] leading-relaxed">
            Whether you're managing a growing team or organizing an established workforce, FlowPeople brings
            essential HR operations into one connected experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-[#590907] px-6 py-3 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#590907]/90"
            >
              <span>Explore Pricing Plans</span>
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
      {/* 2. AUDIENCE TIERS GRID                                                */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#242321]">
              Tailored for Every Stage of Organizational Growth
            </h2>
            <p className="text-sm text-[#6B615A]">
              FlowPeople is calibrated for teams with 10 to 200 employees seeking dependability over complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUDIENCES.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[rgba(89,9,7,0.09)] bg-white p-7 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EBDD] mb-5">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#590907]">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-bold text-[#242321] mt-1 mb-3">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6B615A] leading-relaxed mb-5">
                    {item.summary}
                  </p>

                  <div className="space-y-2 border-t border-[rgba(89,9,7,0.06)] pt-4">
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#4A423D]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#299D68] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. COMMON HR CHALLENGES VS FLOWPEOPLE SOLUTION                         */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#F3EBDD]/40 border-t border-[rgba(89,9,7,0.08)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#590907]">
              PROBLEM &amp; RESOLUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#242321]">
              Common HR Headaches. Solved Elegantly.
            </h2>
          </div>

          <div className="space-y-4">
            {CHALLENGES_VS_FLOWPEOPLE.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[rgba(89,9,7,0.08)] bg-white p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-4">
                  <span className="text-sm font-bold text-[#242321] block">{item.challenge}</span>
                  <span className="text-xs text-[#6B615A] mt-1 block leading-relaxed">{item.pain}</span>
                </div>

                <div className="hidden md:flex md:col-span-1 justify-center text-[#590907]">
                  <ArrowRight className="h-5 w-5" />
                </div>

                <div className="md:col-span-7 p-3.5 rounded-xl bg-[#299D68]/5 border border-[#299D68]/20 text-xs sm:text-sm text-[#242321] flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#299D68] shrink-0 mt-0.5" />
                  <span><b>FlowPeople Solution:</b> {item.solution}</span>
                </div>
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
              <span>Tailored for Every Stage</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#F8F6F1] leading-[1.1]">
              Find the Right Plan for <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
                Your Growing Team.
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-white/85 font-light leading-relaxed">
              Choose from Starter (30 employees), Professional (75 employees), or Enterprise (200 employees) with a single one-time license and zero recurring costs.
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

