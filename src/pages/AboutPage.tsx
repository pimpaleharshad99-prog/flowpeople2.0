import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CalendarDays,
  LayoutDashboard,
  BarChart3,
  Database,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Check,
  Compass,
  Layers,
  Heart,
  ChevronRight,
  ScanFace,
  Briefcase
} from 'lucide-react';
import { FP_IMAGES } from '../assets/fpImages';
import BrandLogo from '../components/BrandLogo';
import { leadService } from '../services/leadService';
import './AboutPage.css';

const CAPABILITIES = [
  {
    icon: <Users className="h-6 w-6 text-[#590907]" />,
    title: 'Employee Management',
    desc: 'Organize employee information, profiles, documents and workforce records in a single dependable directory.'
  },
  {
    icon: <Clock className="h-6 w-6 text-[#590907]" />,
    title: 'Attendance Management',
    desc: 'Simplify attendance tracking and workforce visibility, including contactless face attendance where supported.'
  },
  {
    icon: <CalendarDays className="h-6 w-6 text-[#590907]" />,
    title: 'Leave Management',
    desc: 'Manage employee leave requests, custom approval workflows and statutory leave records seamlessly.'
  },
  {
    icon: <LayoutDashboard className="h-6 w-6 text-[#590907]" />,
    title: 'HR Dashboard',
    desc: 'Give administrators and HR teams a centralized, real-time command center for all workforce operations.'
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-[#590907]" />,
    title: 'Reports and Insights',
    desc: 'Generate useful HR operational reports and export organizational information in structured PDF or CSV formats.'
  },
  {
    icon: <Database className="h-6 w-6 text-[#590907]" />,
    title: 'Connected Infrastructure',
    desc: 'Support database-backed workflows and direct cloud integrations such as Google Drive where configured.'
  }
];

const PHILOSOPHY_PILLARS = [
  {
    number: '01',
    title: 'Simplicity First',
    desc: 'We believe powerful technology should remain easy to understand and use. Software shouldn’t require weeks of mandatory training or confusing manuals just to approve a leave or clock a shift.'
  },
  {
    number: '02',
    title: 'Built for Growing Businesses',
    desc: 'Our approach focuses on practical HR tools that support organizations as their teams grow from 10 to 200+ employees, keeping administrative overhead light and predictable.'
  },
  {
    number: '03',
    title: 'Transparency Matters',
    desc: 'Clear pricing, understandable features and transparent external infrastructure costs are central to our product philosophy. No hidden per-user renewal traps or surprise fees.'
  }
];

const COMPARISON_POINTS = [
  {
    title: 'License Purchasing Model',
    traditional: 'Perpetual recurring monthly subscription per employee seat that compounds every year.',
    flowpeople: 'Single one-time license purchase. Pay once, own the software for your organization.'
  },
  {
    title: 'Software Maintenance Fees',
    traditional: 'Mandatory annual 18–25% maintenance and upgrade contracts.',
    flowpeople: '₹0 recurring FlowPeople software maintenance fee across all plans (T&C Apply).'
  },
  {
    title: 'Capacity & Headcount Limits',
    traditional: 'Opaque pricing gates that force unexpected plan tier upgrades on every new hire.',
    flowpeople: 'Clear employee-based plan limits (30, 75, or 200 employees) with mutual upgrade clarity.'
  },
  {
    title: 'Data Architecture & Storage',
    traditional: 'Multi-tenant shared data pools hosted on vendor servers with lock-in export fees.',
    flowpeople: 'Dedicated organizational database architecture and client-owned Google Drive storage.'
  },
  {
    title: 'External Cost Transparency',
    traditional: 'Hidden markup on cloud hosting, backups, and storage fees.',
    flowpeople: 'Completely transparent third-party costs (MongoDB Atlas, Drive) billed directly by those services.'
  },
  {
    title: 'Deployment & Setup',
    traditional: 'Months of enterprise consulting engagements with billable hours.',
    flowpeople: 'Included initial setup, Google Drive connection, database initialization and handover.'
  }
];

export default function AboutPage() {
  const navigate = useNavigate();
  const [inquiryModalOpen, setInquiryModalOpen] = useState<boolean>(false);
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquirySize, setInquirySize] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const scrollToWhy = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('why-we-built')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) return;

    try {
      await leadService.submitLead({
        full_name: inquiryName.trim(),
        business_email: inquiryEmail.trim(),
        company_name: 'Inquiry via About FlowPeople',
        employee_count: inquirySize ? `${inquirySize} employees` : undefined,
        inquiry_type: 'Product Enquiry',
        interested_plan: 'Not Sure Yet',
        message: 'Inquiry submitted from About FlowPeople modal.',
        source: 'about_modal_form'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="about-page-root min-h-screen pt-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION — OUR STORY                                           */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] py-20 sm:py-28 lg:py-36">
        <div className="about-hero-bg absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase mb-6">
            <Heart className="h-3.5 w-3.5 text-[#590907]" />
            <span>ABOUT FLOWPEOPLE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#242321] font-serif max-w-4xl mx-auto leading-[1.08]">
            People Are the Heart of <span className="about-sheen-text">Every Business.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-[#6B615A] leading-relaxed">
            Managing people shouldn't mean managing endless paperwork, scattered spreadsheets and
            disconnected systems. FlowPeople brings essential HR operations together in one intelligent,
            streamlined platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#why-we-built"
              onClick={scrollToWhy}
              className="inline-flex items-center gap-2 rounded-full bg-[#590907] px-6 py-3.5 text-sm font-semibold text-[#F8F6F1] shadow-sm transition hover:bg-[#590907]/90 hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore FlowPeople</span>
              <ArrowDown className="h-4 w-4" />
            </a>

            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(89,9,7,0.2)] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#242321] shadow-xs backdrop-blur-md transition hover:bg-white hover:text-[#590907]"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Floating Cinematic Interface Cards */}
          <div className="relative mt-16 sm:mt-20 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-[rgba(89,9,7,0.12)] bg-white/60 p-4 sm:p-6 shadow-[0_20px_60px_-15px_rgba(89,9,7,0.14)] backdrop-blur-xl">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br from-[#232220] to-[#121110] p-6 text-left text-white flex flex-col justify-between">
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-[#299D68] animate-pulse" />
                    <span className="text-xs font-medium tracking-wide text-white/80 uppercase">
                      FlowPeople Workforce Node · Active Pulse
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#E8D2B5]">v1.2 Commercial Edition</span>
                </div>

                {/* Dashboard Metrics Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Today's Check-ins</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-[#F8F6F1]">98.4%</div>
                    <div className="text-[10px] text-[#299D68] mt-0.5">Verified on-time</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Active Team</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-[#F8F6F1]">142</div>
                    <div className="text-[10px] text-white/70 mt-0.5">Across 4 departments</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Pending Leaves</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-[#E8D2B5]">3</div>
                    <div className="text-[10px] text-white/70 mt-0.5">Avg resolution 14m</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Data Ownership</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-[#4C7A5C]">100%</div>
                    <div className="text-[10px] text-white/70 mt-0.5">Client Dedicated</div>
                  </div>
                </div>

                {/* Bottom Status Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/70 pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#299D68]" />
                    <span>Dedicated Client Database &amp; Google Drive Connected</span>
                  </span>
                  <span className="text-[11px] font-mono text-white/50">Zero Recurring Maintenance <span className="text-[9px] text-[#FFE4B8]/80">(T&C Apply)</span></span>
                </div>
              </div>
            </div>

            {/* Subtle Floating Interactive Badges */}
            <div className="float-element-slow hidden sm:flex absolute -bottom-5 -left-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl border border-[rgba(89,9,7,0.1)] text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#590907]/10 text-[#590907]">
                <ScanFace className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#242321]">Contactless Kiosk Mode</div>
                <div className="text-[11px] text-[#6B615A]">Sub-second face verification</div>
              </div>
            </div>

            <div className="float-element-delayed hidden sm:flex absolute -top-6 -right-6 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl border border-[rgba(89,9,7,0.1)] text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#299D68]/10 text-[#299D68]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#242321]">Perpetual License</div>
                <div className="text-[11px] text-[#6B615A]">Pay once, own the software</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. WHY WE BUILT FLOWPEOPLE                                            */}
      {/* ===================================================================== */}
      <section id="why-we-built" className="py-20 sm:py-28 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8D2B5]/40 px-3.5 py-1 text-xs font-semibold text-[#590907] uppercase">
                <Compass className="h-3.5 w-3.5" />
                <span>WHY WE BUILT FLOWPEOPLE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242321] font-serif leading-[1.15]">
                HR Should Work for People. <span className="text-[#590907]">Not Against Them.</span>
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#6B615A] leading-relaxed">
                <p>
                  Growing businesses deserve better tools to manage their teams. Yet many organizations
                  still depend on manual processes, disconnected spreadsheets and expensive software systems.
                </p>
                <p>
                  We created FlowPeople to make essential HR management simpler, more accessible and more organized.
                </p>
                <p>
                  From employee records to attendance and leave management, our goal is to bring everyday HR
                  operations into one dependable workspace.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4 text-sm font-semibold text-[#590907]">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>No Monthly Subscriptions</span>
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Zero Data Hostage Fees</span>
                </span>
              </div>
            </div>

            {/* Right Product Dashboard Visual */}
            <div className="lg:col-span-6">
              <div className="about-glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[rgba(89,9,7,0.08)] pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={FP_IMAGES.rahul_avatar}
                      alt="Employee Avatar"
                      className="h-11 w-11 rounded-full object-cover border-2 border-[#E8D2B5]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#242321]">Rahul Sharma</div>
                      <div className="text-xs text-[#6B615A]">Senior Product Designer · Marketing</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#299D68]/15 px-3 py-1 text-xs font-semibold text-[#299D68]">
                    Clocked In · 09:14 AM
                  </span>
                </div>

                {/* Timeline flow */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF7F0] border border-[rgba(89,9,7,0.06)]">
                    <div className="flex items-center gap-2.5">
                      <ScanFace className="h-4 w-4 text-[#590907]" />
                      <span className="font-semibold text-[#242321]">Entrance Kiosk Verified</span>
                    </div>
                    <span className="text-[#6B615A] font-mono">09:14:02 AM</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF7F0] border border-[rgba(89,9,7,0.06)]">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 text-[#299D68]" />
                      <span className="font-semibold text-[#242321]">Earned Leave Approved</span>
                    </div>
                    <span className="text-[#6B615A] font-mono">2 Days (Nov 14–15)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF7F0] border border-[rgba(89,9,7,0.06)]">
                    <div className="flex items-center gap-2.5">
                      <Database className="h-4 w-4 text-[#590907]" />
                      <span className="font-semibold text-[#242321]">Google Drive Backup Synchronized</span>
                    </div>
                    <span className="text-[#6B615A] font-mono">100% Synced</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-[#6B615A]">
                  Workforce records stay synchronized in real time across devices.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. OUR MISSION                                                        */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#F3EBDD]/60 border-y border-[rgba(89,9,7,0.08)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold text-[#590907] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>OUR MISSION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#242321] font-serif leading-[1.12]">
            Make Workforce Management <span className="text-[#590907]">Simpler.</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 text-base sm:text-xl text-[#6B615A] leading-relaxed">
            <p>
              Our mission is to help businesses spend less time managing administrative complexity and
              more time building productive, connected teams.
            </p>
            <p className="font-medium text-[#242321]">
              We believe HR technology should be practical, accessible and designed around the real needs
              of organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-left">
            <div className="p-6 bg-white/80 rounded-2xl border border-[rgba(89,9,7,0.08)] shadow-xs">
              <div className="text-sm font-bold text-[#590907] uppercase tracking-wider mb-2">01 · Practicality</div>
              <h3 className="text-lg font-bold text-[#242321]">Real-World Workflows</h3>
              <p className="mt-2 text-xs text-[#6B615A] leading-relaxed">
                Tools built for how people actually arrive, work, take leave, and get paid. No bloat.
              </p>
            </div>

            <div className="p-6 bg-white/80 rounded-2xl border border-[rgba(89,9,7,0.08)] shadow-xs">
              <div className="text-sm font-bold text-[#590907] uppercase tracking-wider mb-2">02 · Independence</div>
              <h3 className="text-lg font-bold text-[#242321]">Data Sovereignty</h3>
              <p className="mt-2 text-xs text-[#6B615A] leading-relaxed">
                Your records stay in your own database and client Google Drive. We never monetize employee data.
              </p>
            </div>

            <div className="p-6 bg-white/80 rounded-2xl border border-[rgba(89,9,7,0.08)] shadow-xs">
              <div className="text-sm font-bold text-[#590907] uppercase tracking-wider mb-2">03 · Predictability</div>
              <h3 className="text-lg font-bold text-[#242321]">Transparent Value</h3>
              <p className="mt-2 text-xs text-[#6B615A] leading-relaxed">
                A one-time perpetual license with ₹0 recurring maintenance fees (T&C Apply) gives businesses peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. OUR VISION                                                         */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#1E1D1B] text-[#F8F6F1] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#590907]/25 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#E8D2B5] uppercase">
            <Layers className="h-3.5 w-3.5" />
            <span>OUR VISION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.12]">
            A Smarter Way to Build <span className="text-[#E8D2B5]">Better Workplaces.</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-white/75 leading-relaxed">
            <p>
              We envision a future where businesses of every size can manage their workforce through intelligent,
              connected and easy-to-use technology.
            </p>
            <p>
              FlowPeople aims to bring clarity, efficiency and simplicity to the everyday experience of managing people.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 text-left">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-2">Frictionless Presence</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Check-ins that take seconds—whether looking at an entrance tablet or tapping within a 100m mobile geofence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-2">Transparent Operations</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Managers and employees operate from one clear, real-time single source of truth for shifts and leaves.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-2">Sustainable Technology</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Software you buy once, control perpetually, and host with trusted cloud providers without ballooning subscription taxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. WHAT FLOWPEOPLE BRINGS TOGETHER (CAPABILITIES)                     */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold text-[#590907] uppercase">
              <Briefcase className="h-3.5 w-3.5" />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242321] font-serif">
              What FlowPeople Brings Together
            </h2>
            <p className="text-base text-[#6B615A]">
              Essential workforce tools organized into one seamless, unified environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => (
              <div
                key={idx}
                className="capability-card rounded-2xl bg-white p-7 border border-[rgba(89,9,7,0.08)] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EBDD] mb-5">
                    {cap.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#242321] mb-2">{cap.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6B615A] leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. OUR PHILOSOPHY                                                     */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#FBF7F0] border-t border-[rgba(89,9,7,0.08)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8D2B5]/50 px-3.5 py-1 text-xs font-semibold text-[#590907] uppercase">
              <Compass className="h-3.5 w-3.5" />
              <span>GUIDING PRINCIPLES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242321] font-serif">
              Technology Should Simplify. <span className="text-[#590907]">Not Complicate.</span>
            </h2>
            <p className="text-base text-[#6B615A]">
              Three simple beliefs that guide how we build, license, and support FlowPeople.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PHILOSOPHY_PILLARS.map((p) => (
              <div
                key={p.number}
                className="rounded-3xl bg-white p-8 border border-[rgba(89,9,7,0.09)] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="text-3xl font-bold font-mono text-[#590907]/25 mb-4">{p.number}</div>
                <h3 className="text-xl font-bold text-[#242321] mb-3">{p.title}</h3>
                <p className="text-sm text-[#6B615A] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. WHY FLOWPEOPLE (DIFFERENTIATION)                                   */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#F3EBDD]/40 border-t border-[rgba(89,9,7,0.08)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold text-[#590907] uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>THE FLOWPEOPLE DIFFERENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242321] font-serif">
              Powerful HR Management. <span className="text-[#590907]">Without Unnecessary Complexity.</span>
            </h2>
            <p className="text-base text-[#6B615A]">
              How our software licensing and architecture stands apart from traditional enterprise software.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPARISON_POINTS.map((pt, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white p-6 border border-[rgba(89,9,7,0.08)] shadow-xs space-y-4"
              >
                <h3 className="text-base font-bold text-[#242321] border-b border-[rgba(89,9,7,0.06)] pb-3">
                  {pt.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 text-[#6B615A]">
                    <div className="font-semibold text-red-900 mb-1">Traditional HRMS</div>
                    {pt.traditional}
                  </div>
                  <div className="p-3 rounded-xl bg-[#299D68]/5 border border-[#299D68]/20 text-[#242321]">
                    <div className="font-semibold text-[#299D68] mb-1">FlowPeople Approach</div>
                    {pt.flowpeople}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. OUR BRAND (FLUXORA RELATIONSHIP)                                   */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 border-t border-[rgba(89,9,7,0.08)] bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <BrandLogo variant="navbar" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#242321] font-serif">
            FlowPeople. A Product by <span className="text-[#590907]">Fluxora.</span>
          </h2>

          <div className="max-w-2xl mx-auto space-y-4 text-base sm:text-lg text-[#6B615A] leading-relaxed">
            <p>
              FlowPeople is part of the Fluxora vision to build practical, thoughtfully designed technology
              products that help businesses work smarter.
            </p>
            <p>
              We believe great software should solve real problems, deliver meaningful value and remain
              accessible to the people who use it.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#D4AF37]/30 px-4 py-2 text-xs font-semibold text-[#242321] shadow-xs backdrop-blur-md">
              <Building2 className="h-4 w-4 text-[#590907]" />
              <span>Independent Product Engineering</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#D4AF37]/30 px-4 py-2 text-xs font-semibold text-[#242321] shadow-xs backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-[#590907]" />
              <span>Strict Privacy &amp; Data Ethics</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#D4AF37]/30 px-4 py-2 text-xs font-semibold text-[#242321] shadow-xs backdrop-blur-md">
              <Compass className="h-4 w-4 text-[#590907]" />
              <span>Crafted for Modern Workplaces</span>
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. FINAL CTA (POSH SCULPTED CURVES & GOLDEN LUXURY)                  */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#590907] via-[#430604] to-[#1C0202] text-[#F8F6F1] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(89,9,7,0.5)] border-2 border-[#D4AF37]/35">
          {/* Golden Ambient Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-[#FFE4B8]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FFE4B8] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Transform Your Workplace</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F8F6F1] font-serif leading-[1.1]">
              Let's Make Workflows <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
                Work Better.
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-white/85 font-light leading-relaxed">
              Discover a simpler, more dignified way to manage your people and everyday HR operations with FlowPeople.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FFE4B8] via-[#E8D2B5] to-[#D4AF37] px-8 py-4 text-sm font-bold text-[#3A1B12] shadow-lg shadow-[#D4AF37]/20 transition-all hover:scale-[1.03] hover:shadow-xl"
              >
                <span>Explore Pricing</span>
                <ArrowRight className="h-4 w-4 text-[#3A1B12]" />
              </Link>

              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-4 text-sm font-semibold text-white shadow-md backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Talk to Our Team</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* INQUIRY MODAL                                                         */}
      {/* ===================================================================== */}
      {inquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(42,35,32,0.4)] backdrop-blur-sm"
          onClick={() => setInquiryModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] text-[#242321] w-[min(480px,calc(100vw-32px))] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] p-7 grid gap-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-dlg-t"
          >
            <h3 id="about-dlg-t" className="text-[1.5rem] font-semibold text-[#242321]">
              Talk to our team
            </h3>

            <p className="text-xs text-[#6B615A]">
              Learn more about how FlowPeople can transform your team's HR operations.
            </p>

            <form onSubmit={handleInquirySubmit} className="grid gap-4 mt-2">
              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#242321]">
                Your name
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  autoComplete="name"
                  placeholder="Your full name"
                  className="p-3 bg-[#FBF7F0] text-[#242321] border border-[rgba(42,35,32,0.08)] rounded-[14px] text-[1rem] outline-none focus:border-[#590907]"
                />
              </label>

              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#242321]">
                Work email
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="p-3 bg-[#FBF7F0] text-[#242321] border border-[rgba(42,35,32,0.08)] rounded-[14px] text-[1rem] outline-none focus:border-[#590907]"
                />
              </label>

              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#242321]">
                Number of employees
                <input
                  type="text"
                  inputMode="numeric"
                  value={inquirySize}
                  onChange={(e) => setInquirySize(e.target.value)}
                  placeholder="For example, 45"
                  className="p-3 bg-[#FBF7F0] text-[#242321] border border-[rgba(42,35,32,0.08)] rounded-[14px] text-[1rem] outline-none focus:border-[#590907]"
                />
              </label>

              {isSubmitted && (
                <div className="p-3.5 bg-[rgba(76,122,92,0.12)] text-[#4C7A5C] text-[0.92rem] rounded-[14px] font-medium">
                  Thank you! Our product team has received your message and will reach out shortly.
                </div>
              )}

              <div className="flex gap-2.5 flex-wrap mt-2">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-[#F3EBDD] text-[#242321] px-5 py-3 text-xs font-semibold hover:bg-[#E8D2B5] transition flex-1"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#590907] text-[#F8F6F1] px-5 py-3 text-xs font-semibold hover:bg-[#590907]/90 transition flex-1"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

