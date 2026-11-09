import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Printer,
  ChevronDown,
  ArrowUp,
  FileCheck,
  Scale,
  CreditCard,
  Users,
  HardDrive,
  UserCheck,
  ScanFace,
  Calculator,
  Ban,
  Copyright,
  Lock,
  Server,
  GraduationCap,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  FileText,
  Mail,
  HelpCircle,
  Building2
} from 'lucide-react';
import './TermsPage.css';

interface NavSection {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: NavSection[] = [
  { id: 'term-1', number: '01', title: 'Acceptance of Terms' },
  { id: 'term-2', number: '02', title: 'Definitions' },
  { id: 'term-3', number: '03', title: 'Description of Services' },
  { id: 'term-4', number: '04', title: 'License & Usage Rights' },
  { id: 'term-5', number: '05', title: 'Pricing & Payment Terms' },
  { id: 'term-6', number: '06', title: 'Employee Capacity & Upgrades' },
  { id: 'term-7', number: '07', title: 'Third-Party Infrastructure' },
  { id: 'term-8', number: '08', title: 'Customer Data & Duties' },
  { id: 'term-9', number: '09', title: 'Face Attendance & Biometrics' },
  { id: 'term-10', number: '10', title: 'Payroll & Employment Advice' },
  { id: 'term-11', number: '11', title: 'Acceptable Use Policy' },
  { id: 'term-12', number: '12', title: 'Intellectual Property' },
  { id: 'term-13', number: '13', title: 'Security & Backup Safeguards' },
  { id: 'term-14', number: '14', title: 'Availability & Maintenance' },
  { id: 'term-15', number: '15', title: 'Setup, Training & Handover' },
  { id: 'term-16', number: '16', title: 'Suspension & Termination' },
  { id: 'term-17', number: '17', title: 'Refund & Cancellation' },
  { id: 'term-18', number: '18', title: 'Limitation of Liability' },
  { id: 'term-19', number: '19', title: 'Indemnification' },
  { id: 'term-20', number: '20', title: 'Modifications to Terms' },
  { id: 'term-21', number: '21', title: 'Governing Law & Jurisdiction' },
  { id: 'term-22', number: '22', title: 'Contact & Legal Notices' },
  { id: 'term-faq', number: '23', title: 'Frequently Asked Questions' },
];

const FAQS = [
  {
    q: 'Is FlowPeople a monthly subscription?',
    a: 'No. FlowPeople operates on a one-time perpetual license purchase model. FlowPeople does not bill you for monthly or recurring software subscription fees.'
  },
  {
    q: 'Is the license a one-time payment?',
    a: 'Yes. You pay once for your chosen plan tier (Starter, Professional, or Enterprise) to receive a perpetual license for the purchased software release, subject to the license agreement.'
  },
  {
    q: 'Does the license expire?',
    a: 'No. Your perpetual license to operate the purchased version does not expire, provided you comply with the license terms and acceptable use guidelines.'
  },
  {
    q: 'What happens if we exceed the employee limit?',
    a: 'Each plan covers a specific headcount ceiling (30 for Starter, 75 for Professional, 200 for Enterprise). If your organization expands beyond your tier, contact Fluxora to mutually execute a plan upgrade. We never silently auto-charge or alter accounts.'
  },
  {
    q: 'Are hosting and database charges included?',
    a: 'No. Dedicated database hosting (such as MongoDB Atlas or client cloud instances) is billed directly by those independent infrastructure providers. We configure and connect them during initial onboarding, but usage charges sit outside our software license.'
  },
  {
    q: 'Is Google Drive storage free?',
    a: 'Documents, attachments, and backups are routed to your organization-owned Google Drive workspace. Storage charges (if your organization exceeds Google Workspace free tiers) are paid directly to Google.'
  },
  {
    q: 'Does the purchase include source code?',
    a: 'No. Purchasing a FlowPeople commercial license grants you executable usage and operational rights. It does not transfer copyright, proprietary trade secrets, or underlying source code ownership.'
  },
  {
    q: 'Is face attendance available on every device?',
    a: 'No. Contactless Face Attendance Kiosk Mode is hardware-dependent and requires compatible camera sensors, operating systems, and computing capabilities. We verify hardware compatibility with your team prior to deployment.'
  },
  {
    q: 'Are custom features included?',
    a: 'Enterprise licenses include custom workflows, approvals, and scoped reports. Bespoke feature engineering or non-standard third-party integrations beyond the published tier are quoted and contracted separately.'
  },
  {
    q: 'What happens if we stop using FlowPeople?',
    a: 'Because your data resides in your dedicated database and your Google Drive, you retain uninterrupted ownership of your records. You may decommission your workspace without recurring software penalties.'
  },
  {
    q: 'Can we export our organizational data?',
    a: 'Yes. FlowPeople provides structured data exports (JSON, CSV, Excel) and PDF report generators, allowing administrators to export attendance, employee, and leave records at any time.'
  },
  {
    q: 'Are future upgrades included?',
    a: 'Your license covers the purchased software version and minor maintenance updates for that version. Major future generational platform versions or separately released premium modules may require an upgrade fee.'
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>('term-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Scrollspy via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="terms-page-root min-h-screen pt-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] bg-gradient-to-b from-[#F3EBDD]/50 to-[#FBF7F0] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase">
            <Scale className="h-3.5 w-3.5" />
            <span>LEGAL & AGREEMENTS</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#242321] sm:text-5xl lg:text-6xl font-serif">
            Clear Terms. <span className="text-[#590907]">Better Business.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-[#6B615A]">
            These Terms &amp; Conditions govern your access to and use of FlowPeople. Please read them
            carefully before purchasing, licensing, or deploying our platform.
          </p>

          {/* Metadata Strip */}
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-8 rounded-2xl bg-white/80 p-4 sm:p-5 text-xs sm:text-sm text-[#6B615A] shadow-sm border border-[rgba(89,9,7,0.08)] backdrop-blur-md">
            <div>
              <span className="font-semibold text-[#242321]">Effective Date:</span>{' '}
              <span className="font-mono text-[#590907]">November 2026</span>
            </div>
            <div className="hidden h-4 w-px bg-[#590907]/15 sm:block" />
            <div>
              <span className="font-semibold text-[#242321]">License Version:</span>{' '}
              <span className="font-mono font-medium text-[#242321]">v1.2 (Commercial Perpetual)</span>
            </div>

            <div className="ml-auto flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#590907] px-3.5 py-1.5 text-xs font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#590907]/90 cursor-pointer"
                title="Print or save as PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Terms</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN LAYOUT: STICKY TOC + LEGAL CONTENT */}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 mt-12">
        {/* Mobile Section Drawer Button */}
        <div className="lg:hidden mb-6 no-print">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-[rgba(89,9,7,0.15)] bg-white p-3.5 text-sm font-semibold text-[#242321] shadow-xs"
          >
            <span className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-[#590907]" />
              <span>Terms Table of Contents</span>
            </span>
            <ChevronDown className={`h-4 w-4 text-[#590907] transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 rounded-xl border border-[rgba(89,9,7,0.12)] bg-white p-3 shadow-lg">
              <div className="max-h-72 overflow-y-auto space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${activeSection === sec.id
                      ? 'bg-[#590907] text-[#F8F6F1]'
                      : 'text-[#242321] hover:bg-[#F3EBDD]/60'
                      }`}
                  >
                    <span className="font-mono opacity-60">{sec.number}</span>
                    <span>{sec.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Desktop Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 toc-container no-print">
            <div className="rounded-2xl border border-[rgba(89,9,7,0.1)] bg-white/70 p-5 shadow-xs backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#590907]">
                Agreement Navigation
              </h3>
              <nav className="mt-4 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`toc-link flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${activeSection === sec.id ? 'active' : 'text-[#6B615A] hover:text-[#590907] hover:bg-black/5'
                      }`}
                  >
                    <span className="font-mono text-[11px] opacity-50 shrink-0">{sec.number}</span>
                    <span className="truncate">{sec.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-[rgba(89,9,7,0.08)] text-[11px] text-[#6B615A]">
                <p>Governed by <b>Indian Commercial Law</b>. Structured for enterprise B2B licensing clarity.</p>
              </div>
            </div>
          </aside>

          {/* Legal Content Column */}
          <article className="lg:col-span-8 content-column space-y-14 text-[#242321] leading-relaxed">
            {/* SECTION 01 */}
            <section id="term-1" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">01.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Acceptance of Terms
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  These Terms &amp; Conditions ("Terms" or "Agreement") constitute a legally binding agreement
                  between <b>FLUXORA Technologies</b> ("Fluxora", "we", "us", or "our") and
                  the purchasing or utilizing organization ("Customer", "Organization", "you", or "your").
                </p>
                <p>
                  By purchasing a FlowPeople license, executing a commercial invoice, accessing administrative workspaces,
                  or authorizing employees to log time through FlowPeople, you confirm that:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li>You have read, understood, and agreed to be bound by these Terms in full.</li>
                  <li>You possess the legal authority to represent and legally bind your organization.</li>
                  <li>Your organization will operate FlowPeople in compliance with all applicable statutory labor, tax, and data protection laws.</li>
                </ul>
                <div className="terms-callout terms-callout-cream">
                  <h4 className="font-semibold text-sm text-[#590907]">Enterprise Representation</h4>
                  <p className="mt-1 text-xs text-[#6B615A]">
                    If you accept these terms on behalf of a company, partnership, or other legal entity, you warrant
                    that you have full corporate authority to execute this contract. If you lack such authority, you must
                    not purchase or deploy the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 02 */}
            <section id="term-2" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">02.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Definitions
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-[15px] text-[#4A423D]">
                <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4 shadow-xs space-y-2.5 text-xs">
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">FlowPeople:</b>
                    <span className="text-[#6B615A] block mt-0.5">The proprietary Human Resource Management System (HRMS) software, interfaces, attendance modules, and associated utilities developed by Fluxora.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">Fluxora:</b>
                    <span className="text-[#6B615A] block mt-0.5">FLUXORA Technologies, the software author, licensor, and service provider.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">Customer / Organization:</b>
                    <span className="text-[#6B615A] block mt-0.5">The legal entity purchasing a commercial license to deploy FlowPeople for internal workforce management.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">Administrator:</b>
                    <span className="text-[#6B615A] block mt-0.5">Authorized designated personnel of the Customer endowed with privileged credentials to configure workspaces, manage roles, and review records.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">Employee / End User:</b>
                    <span className="text-[#6B615A] block mt-0.5">Individual workers, contractors, or staff members authorized by the Customer to clock attendance, submit leaves, and view self-service profiles.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">License:</b>
                    <span className="text-[#6B615A] block mt-0.5">The non-exclusive, non-transferable perpetual commercial authorization granted to the Customer to operate a specific release of FlowPeople.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">Licensed Version:</b>
                    <span className="text-[#6B615A] block mt-0.5">The specific major release and feature tier (Starter, Professional, or Enterprise) delivered upon commercial settlement.</span>
                  </div>
                  <div>
                    <b className="text-sm font-semibold text-[#590907]">Third-Party Services:</b>
                    <span className="text-[#6B615A] block mt-0.5">Independent external cloud services connected to FlowPeople, including MongoDB Atlas database hosting, Google Drive storage, and authentication APIs.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 03 */}
            <section id="term-3" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">03.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Description of Services
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople delivers modular digital tools designed for internal workforce operations. Capabilities vary
                  by purchased plan tier and technical deployment:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <b className="text-sm font-semibold text-[#242321] block">Employee &amp; Profile Management</b>
                    Centralized directory, employee cards, role designations, document attachments, and organizational reporting trees.
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <b className="text-sm font-semibold text-[#242321] block">Attendance Tracking</b>
                    Shift assignments, workday calculations, web check-ins, mobile GPS geofenced check-ins, and biometric terminal kiosks (where enabled).
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <b className="text-sm font-semibold text-[#242321] block">Leave Administration</b>
                    Custom leave policies, accrual rules, multi-tier manager approval flows, and audit logs.
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <b className="text-sm font-semibold text-[#242321] block">Reports &amp; Data Exports</b>
                    PDF generation and structured tabular exports (CSV/Excel) for attendance audits and regulatory reviews.
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <b className="text-sm font-semibold text-[#242321] block">Payroll Management (Optional Module)</b>
                    Available in Professional and Enterprise tiers subject to customer requirements and technical configuration.
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <b className="text-sm font-semibold text-[#242321] block">Third-Party Storage Integrations</b>
                    Integration connectors with Google Drive for customer-owned file storage and MongoDB Atlas for database hosting.
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 04 */}
            <section id="term-4" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">04.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  License &amp; Usage Rights
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople is sold under a <b>commercial software license model</b>, not as a leased SaaS subscription.
                  Upon receipt of full one-time payment, Fluxora grants the Customer a perpetual, non-exclusive,
                  non-transferable license to deploy and operate the purchased software version.
                </p>

                <div className="terms-callout terms-callout-burgundy">
                  <h4 className="font-semibold text-sm text-[#590907]">Scope &amp; Restrictions of the Commercial License</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#242321]/80 list-disc pl-4">
                    <li><b>Internal Business Operations:</b> The license permits use solely for the Customer’s internal workforce management.</li>
                    <li><b>Headcount Ceiling:</b> Active usage must not exceed the maximum employee capacity specified in the purchased plan tier.</li>
                    <li><b>No Source Code Ownership:</b> Purchasing a license does not transfer intellectual property rights, copyright, or ownership of FlowPeople source code.</li>
                    <li><b>No Resale or Sublicensing:</b> The Customer may not sell, rent, lease, sublicense, distribute, or publicly host FlowPeople as a service bureau for third parties.</li>
                    <li><b>No Derivative Works:</b> The Customer may not decompile, disassemble, reverse engineer, or create derivative software based on FlowPeople.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 05 */}
            <section id="term-5" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">05.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Pricing &amp; Commercial Payment Terms
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople licenses are finalized according to the commercial schedule below:
                </p>

                <div className="overflow-x-auto rounded-xl border border-[rgba(89,9,7,0.1)] bg-white shadow-xs">
                  <table className="terms-table">
                    <thead>
                      <tr>
                        <th>Plan Tier</th>
                        <th>One-Time License Fee</th>
                        <th>Capacity</th>
                        <th>FlowPeople Maintenance Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-[#242321]">Starter</td>
                        <td className="font-mono font-bold text-[#590907]">₹30,000</td>
                        <td>Up to 30 employees</td>
                        <td className="font-semibold text-[#4C7A5C]">₹0 (Zero recurring)</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-[#242321]">Professional</td>
                        <td className="font-mono font-bold text-[#590907]">₹59,999</td>
                        <td>Up to 75 employees</td>
                        <td className="font-semibold text-[#4C7A5C]">₹0 (Zero recurring)</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-[#242321]">Enterprise</td>
                        <td className="font-mono font-bold text-[#590907]">₹99,999</td>
                        <td>Up to 200 employees</td>
                        <td className="font-semibold text-[#4C7A5C]">₹0 (Zero recurring)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 text-xs text-[#6B615A]">
                  <p><b>Statutory Taxes:</b> All stated fees exclude Goods and Services Tax (GST) and applicable statutory surcharges, which will be invoiced at the prevailing statutory rate.</p>
                  <p><b>Zero Software Maintenance:</b> Fluxora charges ₹0 in recurring software maintenance fees for the purchased version (T&C Apply).</p>
                  <p><b>Separate Infrastructure Charges:</b> External infrastructure fees—including database hosting (MongoDB Atlas), cloud storage (Google Drive), physical tablet kiosks, and third-party API fees—are payable directly by the Customer to those respective providers.</p>
                  <p><b>Custom Development:</b> Bespoke integrations, special workflows, or on-site engineering beyond the plan scope are quoted and invoiced separately.</p>
                </div>
              </div>
            </section>

            {/* SECTION 06 */}
            <section id="term-6" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">06.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Employee Capacity Limits &amp; Plan Upgrades
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Each license tier grants operational capacity up to a defined ceiling of concurrent active employee profiles:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li>Organizations are contractually required to remain within their purchased employee headcount limit.</li>
                  <li>When an organization approaches or exceeds its capacity limit, the Customer may transition to a higher plan tier (e.g. Starter to Professional, or Professional to Enterprise) by paying the agreed upgrade price differential.</li>
                  <li>Plan upgrades must be formally confirmed and invoiced between the Customer and Fluxora. <b>Fluxora will never automatically charge your payment instruments or silently alter your plan tier.</b></li>
                </ul>
              </div>
            </section>

            {/* SECTION 07 */}
            <section id="term-7" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">07.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Third-Party Services &amp; Infrastructure Dependencies
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople integrates with enterprise cloud utilities chosen by the Customer, including MongoDB Atlas
                  for database hosting and Google Drive for document management:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li><b>Independent Provider Terms:</b> Customer use of third-party platforms is governed strictly by the respective terms of service and privacy agreements of those external providers.</li>
                  <li><b>Customer Financial Responsibility:</b> Any cloud hosting tiers, bandwidth overages, or storage quotas assessed by external providers remain the direct financial obligation of the Customer.</li>
                  <li><b>Service Availability:</b> Fluxora does not control, and cannot guarantee, the uninterrupted availability, uptime, or technical stability of third-party cloud infrastructure.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 08 */}
            <section id="term-8" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">08.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Customer Data &amp; Operational Responsibilities
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  The Customer maintains sole ownership of and legal accountability for all workforce records uploaded to FlowPeople:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-[rgba(89,9,7,0.1)]">
                    <b className="text-sm font-semibold text-[#590907] block mb-1">Lawful Grounds for Processing</b>
                    The Customer warrants that it possesses all necessary lawful grounds, consents, and employment authority to collect and process employee information under applicable Indian privacy and labor laws.
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[rgba(89,9,7,0.1)]">
                    <b className="text-sm font-semibold text-[#590907] block mb-1">Credential Security &amp; RBAC Hygiene</b>
                    Administrators are responsible for safeguarding master passwords, API keys, and database credentials, and promptly revoking access for departing personnel.
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 09 */}
            <section id="term-9" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">09.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Face Attendance &amp; Biometric Features
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Where Face Attendance Kiosk Mode is deployed, specific operational conditions apply:
                </p>
                <div className="terms-callout terms-callout-sage">
                  <h4 className="font-semibold text-sm text-[#242321]">Biometric Compliance Obligations</h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#6B615A] list-disc pl-4">
                    <li><b>Hardware Compatibility:</b> Facial recognition performance depends on tablet optics, lighting conditions, and processing hardware. Fluxora does not guarantee universal hardware interoperability.</li>
                    <li><b>Employee Notice &amp; Consent:</b> Under the DPDPA 2023, the Customer must provide clear notice and obtain verifiable employee consent prior to biometric enrollment.</li>
                    <li><b>Mandatory Alternative:</b> The Customer must provide reasonable, accessible alternative attendance options (e.g. mobile GPS check-in, QR cards, or supervisor entries) for workers who decline biometric verification.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 10 */}
            <section id="term-10" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">10.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Payroll &amp; Employment Compliance Disclaimer
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople provides administrative software utilities to assist HR personnel in logging shifts,
                  approving leaves, and computing preliminary wage calculations:
                </p>
                <div className="terms-callout terms-callout-burgundy">
                  <h4 className="font-semibold text-sm text-[#590907]">No Certified Legal or Accounting Advice</h4>
                  <p className="mt-1 text-xs text-[#242321]/80 leading-relaxed">
                    FlowPeople is an operational software platform, not a certified accounting firm, chartered accountancy practice,
                    or legal counsel. The Customer remains solely responsible for verifying the accuracy of payroll numbers,
                    tax withholdings (TDS), provident fund (PF) deductions, employee state insurance (ESI), statutory labor caps,
                    and wage disbursements.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 11 */}
            <section id="term-11" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">11.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Acceptable Use Policy
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Customers, Administrators, and Authorized End Users must not:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-[#4A423D]">
                  <li>Attempt to bypass license validation mechanisms, employee limit counters, or security barriers.</li>
                  <li>Introduce viruses, trojans, worms, logic bombs, or other malicious or technologically harmful materials.</li>
                  <li>Engage in unauthorized penetration testing, vulnerability scanning, or automated scraping without prior written consent.</li>
                  <li>Use FlowPeople to process information in violation of statutory criminal, civil, or data privacy statutes.</li>
                  <li>Interfere with or disrupt the security or integrity of other customer environments or infrastructure.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 12 */}
            <section id="term-12" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">12.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Intellectual Property Rights
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  <b>Fluxora Ownership:</b> All intellectual property rights, trademarks, brand names, visual interfaces,
                  design tokens, and software code related to FlowPeople are and remain the exclusive property of Fluxora.
                </p>
                <p>
                  <b>Customer Data Ownership:</b> The Customer retains full, unencumbered ownership of all organizational records,
                  employee information, documents, and corporate assets stored in the Customer’s workspace.
                </p>
              </div>
            </section>

            {/* SECTION 13 */}
            <section id="term-13" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">13.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Security, Backups &amp; Safeguards
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Fluxora implements professional technical safeguards including Role-Based Access Control (RBAC),
                  TLS encryption in transit, and database isolation. Where included in the purchased deployment,
                  automated monthly backups with three months of rolling retention are configured into the Customer's Google Drive.
                </p>
                <p className="text-xs text-[#6B615A]">
                  <b>Customer Backup Prudence:</b> Customers are strongly advised to execute routine secondary exports of
                  critical workforce archives. No software provider can warrant absolute immunity from unexpected cloud failures or hardware damage.
                </p>
              </div>
            </section>

            {/* SECTION 14 */}
            <section id="term-14" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">14.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Service Availability &amp; Maintenance
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  While FlowPeople is engineered for high stability, routine maintenance, operating system patches,
                  and infrastructure updates may periodically occur.
                </p>
                <p className="text-xs text-[#6B615A]">
                  FlowPeople is provided without an unconditional commercial uptime guarantee unless a separate custom
                  Service Level Agreement (SLA) is formally executed in writing between the Customer and Fluxora.
                </p>
              </div>
            </section>

            {/* SECTION 15 */}
            <section id="term-15" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">15.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Initial Setup, Training &amp; Handover
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Each commercial license purchase includes initial workspace provisioning, Google Drive connection assistance,
                  database initialization, and administrator handover training.
                </p>
                <p className="text-xs text-[#6B615A]">
                  Following formal system handover, ongoing technical support, custom development, or advanced integration
                  work operates according to separately agreed technical maintenance scopes.
                </p>
              </div>
            </section>

            {/* SECTION 16 */}
            <section id="term-16" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">16.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Suspension &amp; Termination
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Fluxora reserves the right to suspend or terminate a Customer's license access in the event of:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#4A423D]">
                  <li>Material breach of these Terms (e.g. unauthorized software resale or license circumvention).</li>
                  <li>Failure to cure a notified breach within thirty (30) days of receiving written notice.</li>
                  <li>Critical security hazards or malicious attacks originating from the Customer’s tenant.</li>
                  <li>Binding orders issued by a competent court or regulatory body.</li>
                </ul>
                <p className="text-xs text-[#6B615A]">
                  Upon formal termination, the Customer is provided a thirty (30) day export window to extract organizational records before workspace decommissioning.
                </p>
              </div>
            </section>

            {/* SECTION 17 */}
            <section id="term-17" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">17.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Refund &amp; Cancellation Policy
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <div className="terms-callout terms-callout-cream">
                  <h4 className="font-semibold text-sm text-[#590907]">Commercial License Delivery Model</h4>
                  <p className="mt-1 text-xs text-[#6B615A] leading-relaxed">
                    FlowPeople licenses involve dedicated technical provisioning, database configuration, and digital license issuance.
                    Refund and cancellation requests are governed by specific commercial milestones:<br /><br />
                    1. <b>Prior to Setup &amp; Delivery:</b> Cancellation requests received in writing prior to database initialization and workspace delivery are eligible for review, subject to standard administrative processing fees.<br />
                    2. <b>Post-Delivery &amp; Handover:</b> Once workspace setup is completed, administrative credentials delivered, and training conducted, license fees are generally non-refundable, except where statutory consumer protection provisions mandate otherwise.<br />
                    3. <b>Custom Work:</b> Separately quoted custom engineering, integration fees, or third-party hardware costs are strictly non-refundable once work has commenced.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 18 */}
            <section id="term-18" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">18.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Limitation of Liability
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  To the maximum extent permitted by applicable Indian law:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-[#4A423D]">
                  <li>
                    <b>Exclusion of Indirect Damages:</b> Neither party shall be liable for indirect, incidental, special,
                    consequential, or punitive damages, including loss of profits, revenue, goodwill, business interruption, or data corruption.
                  </li>
                  <li>
                    <b>Aggregate Liability Cap:</b> In all circumstances, Fluxora’s aggregate financial liability arising out of
                    or relating to this Agreement shall not exceed the total software license fee actually paid by the Customer
                    in the twelve (12) months preceding the event giving rise to liability.
                  </li>
                  <li>
                    <b>Non-Excludable Statutory Liabilities:</b> Nothing in this section limits liability for fraud, willful misconduct,
                    or matters that cannot be excluded under applicable law.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 19 */}
            <section id="term-19" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">19.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Indemnification
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  The Customer agrees to defend, indemnify, and hold harmless Fluxora, its directors, officers, employees,
                  and technical partners against third-party claims, liabilities, damages, and legal costs arising from:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#4A423D]">
                  <li>The Customer’s unlawful processing of employee personal data or failure to obtain statutory consent.</li>
                  <li>Content, documents, or files uploaded into FlowPeople that infringe third-party intellectual property rights.</li>
                  <li>Material breach of the Acceptable Use Policy or software license terms.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 20 */}
            <section id="term-20" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">20.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Modifications to Terms
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Fluxora reserves the right to amend these Terms periodically to align with product updates or statutory amendments.
                  Material amendments will be communicated to Customer Administrators via registered account email or in-app notice
                  prior to taking effect.
                </p>
              </div>
            </section>

            {/* SECTION 21 */}
            <section id="term-21" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">21.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Governing Law &amp; Jurisdiction
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  This Agreement, and any disputes arising out of or related to it, shall be governed by and construed in
                  accordance with the substantive <b>laws of India</b>, without regard to conflict of law principles.
                </p>
                <div className="terms-callout terms-callout-cream">
                  <h4 className="font-semibold text-sm text-[#590907]">Jurisdiction Placeholder</h4>
                  <p className="mt-1 text-xs text-[#6B615A]">
                    Subject to mandatory statutory provisions, the courts located in <b>[City/State of Registered Corporate Jurisdiction, India]</b> shall
                    have exclusive jurisdiction over any disputes arising from this Agreement.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 22 */}
            <section id="term-22" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">22.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Contact &amp; Legal Notices
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Formal legal notices and contract communications may be delivered to our legal department:
                </p>

                <div className="rounded-2xl border border-[rgba(89,9,7,0.15)] bg-white p-6 shadow-sm space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="text-[#6B615A] block uppercase font-mono tracking-wider">Legal Entity</span>
                      <span className="font-bold text-sm text-[#242321] block mt-1">
                        FLUXORA Technologies
                      </span>
                      <span className="text-[#6B615A] text-[11px] block mt-0.5">
                        Brand: FlowPeople · Parent: Fluxora
                      </span>
                    </div>

                    <div>
                      <span className="text-[#6B615A] block uppercase font-mono tracking-wider">Legal Contact Email</span>
                      <a
                        href="mailto:hqfluxora@gmail.com"
                        className="font-bold text-sm text-[#590907] hover:underline block mt-1"
                      >
                        hqfluxora@gmail.com
                      </a>
                    </div>

                    <div>
                      <span className="text-[#6B615A] block uppercase font-mono tracking-wider">Statutory Grievance Officer</span>
                      <span className="font-bold text-sm text-[#242321] block mt-1">
                        Data Protection &amp; Compliance Lead
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 23: FAQ SECTION */}
            <section id="term-faq" className="scroll-mt-28 pt-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">23.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>
              <p className="mt-3 text-sm text-[#6B615A]">
                Key contractual and operational answers matching our commercial software model:
              </p>

              <div className="terms-faq mt-6 grid gap-3">
                {FAQS.map((faq, idx) => (
                  <details key={idx}>
                    <summary>{faq.q}</summary>
                    <div className="ans">
                      <div>
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>

      {/* 3. FLOATING BACK TO TOP CONTROL */}
      {showBackToTop && (
        <button
          type="button"
          id="backToTopBtn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#590907] text-[#F8F6F1] shadow-lg transition hover:bg-[#590907]/90 hover:scale-105 no-print cursor-pointer"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

