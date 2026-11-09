import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Printer,
  ChevronDown,
  ArrowUp,
  Lock,
  Building2,
  FileText,
  UserCheck,
  Database,
  Share2,
  AlertCircle,
  HelpCircle,
  Clock,
  Globe2,
  UserX,
  Mail,
  CheckCircle2
} from 'lucide-react';
import './PrivacyPolicyPage.css';

interface NavSection {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: NavSection[] = [
  { id: 'sec-1', number: '01', title: 'Introduction & Scope' },
  { id: 'sec-2', number: '02', title: 'Information We Collect' },
  { id: 'sec-3', number: '03', title: 'How We Use Information' },
  { id: 'sec-4', number: '04', title: 'Face Attendance & Biometrics' },
  { id: 'sec-5', number: '05', title: 'Data Ownership & Roles' },
  { id: 'sec-6', number: '06', title: 'Storage & Infrastructure' },
  { id: 'sec-7', number: '07', title: 'Data Sharing & Third Parties' },
  { id: 'sec-8', number: '08', title: 'Data Security Measures' },
  { id: 'sec-9', number: '09', title: 'Retention & Deletion' },
  { id: 'sec-10', number: '10', title: 'User Rights (DPDPA 2023)' },
  { id: 'sec-11', number: '11', title: 'Cookies & Technical Data' },
  { id: 'sec-12', number: '12', title: "Children's Privacy" },
  { id: 'sec-13', number: '13', title: 'Cross-Border Data Transfers' },
  { id: 'sec-14', number: '14', title: 'Policy Updates' },
  { id: 'sec-15', number: '15', title: 'Contact & Grievance Redressal' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>('sec-1');
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
    <div className="privacy-page-root min-h-screen pt-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] bg-gradient-to-b from-[#F3EBDD]/50 to-[#FBF7F0] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>LEGAL & PRIVACY</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#242321] sm:text-5xl lg:text-6xl font-serif">
            Your Data. Your Trust. <span className="text-[#590907]">Our Responsibility.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-[#6B615A]">
            At FlowPeople, we understand the importance of personal and organizational information.
            This Privacy Policy explains how we collect, use, store and protect information when you
            use our HR management platform.
          </p>

          {/* Metadata Strip */}
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-8 rounded-2xl bg-white/80 p-4 sm:p-5 text-xs sm:text-sm text-[#6B615A] shadow-sm border border-[rgba(89,9,7,0.08)] backdrop-blur-md">
            <div>
              <span className="font-semibold text-[#242321]">Effective Date:</span>{' '}
              <span className="font-mono text-[#590907]">November 2026</span>
            </div>
            <div className="hidden h-4 w-px bg-[#590907]/15 sm:block" />
            <div>
              <span className="font-semibold text-[#242321]">Policy Version:</span>{' '}
              <span className="font-mono font-medium text-[#242321]">v1.2 (DPDPA 2023 Aligned)</span>
            </div>

            <div className="ml-auto flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#590907] px-3.5 py-1.5 text-xs font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#590907]/90 cursor-pointer"
                title="Print or save as PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Policy</span>
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
              <FileText className="h-4 w-4 text-[#590907]" />
              <span>Table of Contents (Jump to section)</span>
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
                Table of Contents
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
                <p>Designed for complete compliance with the <b>Digital Personal Data Protection Act, 2023 (India)</b>.</p>
              </div>
            </div>
          </aside>

          {/* Legal Content Column */}
          <article className="lg:col-span-8 content-column space-y-14 text-[#242321] leading-relaxed">
            {/* SECTION 1 */}
            <section id="sec-1" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">01.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Introduction & Scope
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Welcome to <b>FlowPeople</b>, an intelligent Human Resource Management System (HRMS)
                  architected and operated by <b>FLUXORA Technologies</b> ("Fluxora", "we", "us", or "our").
                  FlowPeople is designed to help modern organizations streamline employee lifecycle management,
                  attendance logging, leave administration, organizational reporting, and document workflows.
                </p>
                <p>
                  This Privacy Policy sets out the principles and practices governing the collection,
                  processing, storage, transmission, and protection of personal data when your organization
                  subscribes to, licenses, or interacts with FlowPeople through web applications, mobile interfaces,
                  biometric kiosk terminal simulators, or associated cloud utilities.
                </p>
                <div className="legal-callout legal-callout-cream">
                  <h4 className="font-semibold text-sm text-[#590907]">Enterprise B2B Scope</h4>
                  <p className="mt-1 text-xs text-[#6B615A]">
                    FlowPeople operates as a B2B enterprise business platform. Our customers are employer
                    organizations. If you are an employee, contractor, or intern accessing FlowPeople, your
                    employer determines the categories of data collected and serves as your primary contact
                    for employment data matters.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="sec-2" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">02.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Information We Collect
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Depending on the specific FlowPeople license tier (Starter, Professional, or Enterprise)
                  and the system modules enabled by your organization administrator, the platform processes
                  the following categories of information:
                </p>

                <div className="overflow-x-auto rounded-xl border border-[rgba(89,9,7,0.1)] bg-white shadow-xs">
                  <table className="legal-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Specific Data Elements</th>
                        <th>Collection Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold">Organization Information</td>
                        <td>Company legal name, registered address, business contact email, tax identification numbers (GSTIN/PAN where applicable).</td>
                        <td>Account setup, billing, licensing, and tenant segregation.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Employee Profiles</td>
                        <td>Full name, official email, phone number, employee code, department, designation, date of joining, reporting manager.</td>
                        <td>Core workforce directory, organizational hierarchy, and access control.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Attendance & Shifts</td>
                        <td>Check-in/check-out timestamps, shift assignment, total hours worked, late arrival / early departure flags, work modes.</td>
                        <td>Workday tracking, shift scheduling, and attendance audit logs.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Geolocation Data (GPS Check-in)</td>
                        <td>Precise latitude and longitude coordinates captured strictly at the instant of a mobile check-in attempt within a defined workplace geofence (e.g. 100m radius).</td>
                        <td>Verification of physical presence at designated corporate premises. Continuous background tracking is never conducted.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Leave & Absence Records</td>
                        <td>Leave requests, leave categories (casual, sick, earned), dates, supporting notes, approval timestamps, manager remarks.</td>
                        <td>Statutory leave compliance, balances, and automated workflow routing.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Documents & Records</td>
                        <td>Employee identification proofs, resumes, educational certificates, appointment letters stored in client-linked storage.</td>
                        <td>Internal HR compliance and employee document archival.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Facial Data (Where Biometric Enabled)</td>
                        <td>
                          <b>Visual Photographs:</b> Profile images uploaded for identity display.<br />
                          <b>Biometric Vector Hash:</b> Mathematical representations of facial landmarks (where hardware-compatible vision is deployed).
                        </td>
                        <td>Contactless kiosk check-in authentication at physical entrance terminals. See Section 04 for detailed biometric practices.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Payroll Information (Optional Module)</td>
                        <td>Salary structure, bank account details, statutory deductions (PF/ESI/TDS), compensation revisions (where configured).</td>
                        <td>Payroll processing and generation of monthly compensation statements.</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Technical Logs</td>
                        <td>IP addresses, device user-agents, browser versions, session tokens, security audit logs, access timestamps.</td>
                        <td>Platform diagnostics, fraud detection, and role access security.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="sec-3" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">03.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  How We Use Information
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Fluxora processes collected information exclusively on behalf of and under the documented
                  instructions of our customer organizations, for the following legitimate business purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li>
                    <b>Delivering Core HR Services:</b> Facilitating employee directory management,
                    role-based access management, shift schedules, and self-service portal functionality.
                  </li>
                  <li>
                    <b>Verifying Attendance:</b> Computing working hours, processing contactless facial
                    verifications or GPS geofence verifications, and compiling monthly attendance summaries.
                  </li>
                  <li>
                    <b>Workflow Automation:</b> Routing leave applications, multi-tier approvals,
                    manager escalation rules, and status change alerts.
                  </li>
                  <li>
                    <b>Payroll & Compensation Administration:</b> When activated, calculating gross-to-net
                    deductions, generating pay slips, and archiving structured records.
                  </li>
                  <li>
                    <b>Enterprise Analytics & Reporting:</b> Providing administrators with workforce
                    headcount summaries, turnover metrics, attendance trends, and exportable PDF/Excel rosters.
                  </li>
                  <li>
                    <b>Security & Fraud Prevention:</b> Authenticating administrative sessions, investigating
                    unauthorized access attempts, monitoring application errors, and safeguarding system integrity.
                  </li>
                  <li>
                    <b>Customer Support & Troubleshooting:</b> Diagnosing reported technical defects,
                    provisioning database connections, and conducting administrator handover training.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 4: BIOMETRICS & FACE ATTENDANCE */}
            <section id="sec-4" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">04.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Face Attendance & Biometric Information
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople offers an optional, hardware-dependent <b>Biometric Face Attendance Kiosk Mode</b> designed
                  for contactless employee check-in. Given the sensitive nature of facial data, we maintain strict
                  architectural and legal boundaries:
                </p>

                <div className="legal-callout legal-callout-burgundy">
                  <h4 className="font-semibold text-sm text-[#590907]">Critical Distinction: Photographs vs. Biometric Templates</h4>
                  <p className="mt-1 text-xs text-[#242321]/80 leading-relaxed">
                    <b>Reference Photographs:</b> Standard 2D visual photographs displayed in employee profile badges
                    or directory avatars. These are treated as general personal identification records.<br />
                    <b>Biometric Vector Templates:</b> Where facial recognition vision algorithms are deployed on client-compatible
                    hardware, the vision engine analyzes facial landmarks to compute an irreversible mathematical coordinate
                    vector (vector hash). FlowPeople does not require permanent raw video capture to verify identity.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-[#242321]">Key Biometric Commitments:</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#590907]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Explicit Employee Consent</span>
                      </div>
                      <p className="mt-2 text-xs text-[#6B615A]">
                        Client organizations are contractually and legally obligated under the DPDPA 2023 to obtain
                        verifiable, informed consent from employees before enrolling them in biometric face attendance.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#590907]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Mandatory Non-Biometric Alternative</span>
                      </div>
                      <p className="mt-2 text-xs text-[#6B615A]">
                        Organizations must offer alternative check-in mechanisms—including Mobile GPS Geofencing,
                        PIN/QR codes, or supervisor manual entries—without prejudice or penalty to employees who decline face enrollment.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#590907]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Purpose Limitation</span>
                      </div>
                      <p className="mt-2 text-xs text-[#6B615A]">
                        Biometric vectors are processed strictly for workforce timekeeping and entrance authentication.
                        They are never utilized for commercial profiling, mood analysis, or third-party surveillance.
                      </p>
                    </div>

                    <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#590907]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Permanent Deletion Upon Exit</span>
                      </div>
                      <p className="mt-2 text-xs text-[#6B615A]">
                        Upon an employee's resignation, termination, or formal withdrawal of consent, the client
                        administrator is required to purge the corresponding biometric template immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6B615A] italic">
                  *Note: Specific facial recognition capabilities vary depending on the client’s designated physical
                  tablet hardware, operating system camera sensors, and whether local on-device processing or cloud vision APIs are configured.
                </p>
              </div>
            </section>

            {/* SECTION 5 */}
            <section id="sec-5" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">05.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Data Ownership & Legal Responsibilities
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Under the <b>Digital Personal Data Protection Act, 2023 (India)</b> and comparable global privacy frameworks:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[rgba(89,9,7,0.12)] bg-[#FBF7F0] p-5">
                    <div className="flex items-center gap-2 font-bold text-[#590907]">
                      <Building2 className="h-4 w-4" />
                      <span>Customer Organization: Data Fiduciary</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs text-[#6B615A] list-disc pl-4">
                      <li>Determines the purposes and legal grounds for processing employee data.</li>
                      <li>Responsible for issuing accurate privacy notices to employees at the time of data collection.</li>
                      <li>Responsible for collecting and documenting valid consent or relying on legitimate uses.</li>
                      <li>Maintains full ownership and authority over all employee records created in their workspace.</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-[rgba(89,9,7,0.12)] bg-[#FBF7F0] p-5">
                    <div className="flex items-center gap-2 font-bold text-[#242321]">
                      <Database className="h-4 w-4" />
                      <span>Fluxora / FlowPeople: Data Processor</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs text-[#6B615A] list-disc pl-4">
                      <li>Processes personal data solely to provide the contracted FlowPeople HRMS software services.</li>
                      <li>Does not own, lease, or monetize customer employee data.</li>
                      <li>Implements technical and organizational safeguards agreed in the software license agreement.</li>
                      <li>Assists customer organizations in responding to data principal rights requests.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6 */}
            <section id="sec-6" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">06.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Data Storage & Infrastructure Architecture
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople is engineered around client data independence rather than multi-tenant aggregation.
                  Depending on your organization's deployment configuration:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li>
                    <b>Dedicated Client Database:</b> Where configured, each client organization is provisioned with
                    a dedicated database cluster (e.g. hosted via MongoDB Atlas or client-managed cloud infrastructure).
                    Customer data is physically or logically isolated and is not co-mingled with other tenants.
                  </li>
                  <li>
                    <b>Client-Owned Google Drive Storage:</b> Employee files, profile resumes, onboarding documents,
                    and monthly system backups are routed to Google Drive storage owned and administered directly
                    by the customer organization.
                  </li>
                  <li>
                    <b>Cloud Infrastructure Providers:</b> Core web servers, APIs, and microservices are hosted with
                    established enterprise cloud infrastructure providers (such as Amazon Web Services or Google Cloud Platform).
                  </li>
                  <li>
                    <b>No Central Monolithic Repository:</b> We do not aggregate customer company records into one centralized
                    advertising data lake. Your database credentials and storage keys remain restricted to your licensed tenant.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="sec-7" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">07.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Data Sharing & Third Parties
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <div className="legal-callout legal-callout-cream">
                  <h4 className="font-semibold text-sm text-[#590907]">Our Absolute Commitment: No Sale of Personal Data</h4>
                  <p className="mt-1 text-xs text-[#242321]/80">
                    Fluxora does not sell, rent, monetize, or trade your employee records, attendance telemetry, or business
                    information to data brokers, ad networks, or third-party marketing entities. Ever.
                  </p>
                </div>
                <p>
                  We share personal information strictly with vetted service providers ("Sub-processors") essential
                  for delivering the application:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li><b>Database & Cloud Infrastructure:</b> MongoDB Atlas, Google Cloud Platform, Amazon Web Services.</li>
                  <li><b>Storage Integrations:</b> Google Workspace (Google Drive API) for document archival.</li>
                  <li><b>Communication & Email Delivery:</b> Transactional email services for invitations and password resets.</li>
                  <li><b>Statutory & Regulatory Disclosures:</b> We may disclose data only if strictly mandated by binding court orders, statutory law enforcement requests, or applicable regulatory mandates under Indian law.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 8 */}
            <section id="sec-8" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">08.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Data Security Measures
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  We deploy multi-layered technical and organizational safeguards designed to protect personal data against
                  accidental loss, unauthorized destruction, alteration, or unlawful access:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4">
                    <b className="text-sm font-semibold text-[#590907] block mb-1">Role-Based Access Control (RBAC)</b>
                    Strict permission gates ensure managers, standard employees, and super-administrators view only the data necessary for their role.
                  </div>
                  <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4">
                    <b className="text-sm font-semibold text-[#590907] block mb-1">Encrypted Transmission</b>
                    All data transmitted between browsers, mobile devices, kiosks, and servers is encrypted in transit using industry-standard TLS (HTTPS).
                  </div>
                  <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4">
                    <b className="text-sm font-semibold text-[#590907] block mb-1">Database-Level Security</b>
                    Dedicated MongoDB Atlas clusters feature TLS 1.3 encryption in transit, AES-256 storage encryption at rest, and strict network access controls.
                  </div>
                  <div className="rounded-xl border border-[rgba(89,9,7,0.1)] bg-white p-4">
                    <b className="text-sm font-semibold text-[#590907] block mb-1">Rolling Automated Backups</b>
                    Monthly automated backups with three months of rolling retention safeguard against catastrophic hardware failure.
                  </div>
                </div>
                <div className="legal-callout legal-callout-sage">
                  <h4 className="font-semibold text-sm text-[#242321]">Realistic Security Disclosure</h4>
                  <p className="mt-1 text-xs text-[#6B615A]">
                    While we implement rigorous, professional safeguards, no internet transmission or electronic storage method
                    can be guaranteed 100% immune from sophisticated cyberattacks, zero-day vulnerabilities, or human error.
                    Security is a joint responsibility requiring secure client credential hygiene.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 9 */}
            <section id="sec-9" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">09.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Data Retention & Deletion
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Retention schedules are determined primarily by our customer organizations in accordance with their
                  statutory employment, tax, and labor law obligations:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#4A423D]">
                  <li>
                    <b>Active Contracts:</b> We retain organizational data for the duration of the active FlowPeople license agreement.
                  </li>
                  <li>
                    <b>Contract Termination:</b> Following subscription expiration or perpetual license decommissioning,
                    the organization is granted a 30-day window to export all records, after which tenant databases are permanently wiped.
                  </li>
                  <li>
                    <b>Individual Employee Purges:</b> Client HR administrators maintain administrative tooling to deactivate,
                    archive, or permanently erase individual employee profiles upon employment termination.
                  </li>
                  <li>
                    <b>Backup Cycling:</b> Secondary backup archives undergo automated rolling overwrites within 90 days.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 10: USER RIGHTS */}
            <section id="sec-10" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">10.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  User Rights Under Indian Law (DPDPA 2023)
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Under the <b>Digital Personal Data Protection Act, 2023</b>, individual data principals (employees,
                  contractors, and administrators) possess specific statutory rights regarding their personal data:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <UserCheck className="h-5 w-5 text-[#590907] shrink-0 mt-0.5" />
                    <div>
                      <b className="text-sm font-semibold text-[#242321]">Right to Access Information:</b>
                      <p className="text-xs text-[#6B615A] mt-0.5">
                        You have the right to request a summary of personal data being processed and the identities of third parties with whom it has been shared.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <FileText className="h-5 w-5 text-[#590907] shrink-0 mt-0.5" />
                    <div>
                      <b className="text-sm font-semibold text-[#242321]">Right to Correction & Updating:</b>
                      <p className="text-xs text-[#6B615A] mt-0.5">
                        You have the right to correct inaccurate or misleading personal data, complete incomplete records, and update out-of-date information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <UserX className="h-5 w-5 text-[#590907] shrink-0 mt-0.5" />
                    <div>
                      <b className="text-sm font-semibold text-[#242321]">Right to Erasure:</b>
                      <p className="text-xs text-[#6B615A] mt-0.5">
                        You have the right to request the erasure of your personal data where retention is no longer necessary for the purpose for which it was processed, subject to statutory labor and tax record laws.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[rgba(89,9,7,0.08)]">
                    <HelpCircle className="h-5 w-5 text-[#590907] shrink-0 mt-0.5" />
                    <div>
                      <b className="text-sm font-semibold text-[#242321]">Right of Grievance Redressal:</b>
                      <p className="text-xs text-[#6B615A] mt-0.5">
                        You have the right to register a grievance with the Data Fiduciary or our designated Grievance Officer, and if unsatisfied, escalate to the Data Protection Board of India.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="legal-callout legal-callout-cream">
                  <h4 className="font-semibold text-sm text-[#590907]">How to Exercise Your Rights</h4>
                  <p className="mt-1 text-xs text-[#6B615A]">
                    Because FlowPeople processes data on behalf of your employer, please submit requests directly to your
                    organization’s HR department or Data Protection representative. Fluxora will facilitate and execute all
                    valid verified technical requests received from authorized organization administrators.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 11 */}
            <section id="sec-11" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">11.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Cookies & Technical Data
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople uses strictly <b>essential technical cookies and local storage tokens</b> necessary for
                  authenticating user sessions, maintaining navigation state across kiosk simulators, and securing API calls.
                </p>
                <p>
                  We do not utilize third-party cross-site behavioral tracking cookies, advertising remarketing pixels
                  (e.g. Meta Pixel, Google AdSense), or commercial data-mining trackers within the authenticated HRMS application.
                </p>
              </div>
            </section>

            {/* SECTION 12 */}
            <section id="sec-12" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">12.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Children's Privacy
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  FlowPeople is strictly a business-to-business corporate workforce software platform. It is not intended,
                  designed, or marketed for use by individuals under the age of 18 ("Children" under Indian data protection laws).
                  We do not knowingly collect personal information directly from minors.
                </p>
              </div>
            </section>

            {/* SECTION 13 */}
            <section id="sec-13" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">13.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Cross-Border Data Transfers
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Personal data collected through FlowPeople is primarily stored and processed on servers located within India.
                  However, where client organizations integrate with global cloud service providers (e.g. Google Drive, MongoDB Atlas,
                  or AWS cloud availability zones), data may be transferred, hosted, or backed up in server locations across other
                  jurisdictions, in accordance with applicable rules and transfer whitelist notifications issued under the DPDPA 2023.
                </p>
              </div>
            </section>

            {/* SECTION 14 */}
            <section id="sec-14" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">14.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Policy Updates
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  Fluxora may periodically update this Privacy Policy to reflect enhancements in FlowPeople features,
                  evolving biometric regulations, or statutory amendments under Indian law.
                </p>
                <p>
                  When material changes occur, we will update the "Last Updated" date at the top of this page and notify
                  customer organization administrators via in-app notification or registered account email prior to the
                  change taking effect. Continued use of FlowPeople following notification constitutes acknowledgment of the revised policy.
                </p>
              </div>
            </section>

            {/* SECTION 15: GRIEVANCE REDRESSAL */}
            <section id="sec-15" className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-bold text-[#590907]">15.</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#242321]">
                  Contact & Statutory Grievance Redressal
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-[15px] text-[#4A423D]">
                <p>
                  In compliance with Section 10 of India’s <b>Digital Personal Data Protection Act, 2023</b>, Fluxora
                  has designated a <b>Data Protection & Grievance Officer</b> to address concerns, queries, or statutory complaints:
                </p>

                {/* Contact Card */}
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
                      <span className="text-[#6B615A] block uppercase font-mono tracking-wider">Designated Grievance Officer</span>
                      <span className="font-bold text-sm text-[#242321] block mt-1">
                        Data Protection &amp; Compliance Lead
                      </span>
                      <span className="text-[#6B615A] text-[11px] block mt-0.5">
                        Statutory Grievance Redressal Cell
                      </span>
                    </div>

                    <div>
                      <span className="text-[#6B615A] block uppercase font-mono tracking-wider">Privacy & Grievance Email</span>
                      <a
                        href="mailto:hqfluxora@gmail.com"
                        className="font-bold text-sm text-[#590907] hover:underline block mt-1"
                      >
                        hqfluxora@gmail.com
                      </a>
                    </div>

                    <div>
                      <span className="text-[#6B615A] block uppercase font-mono tracking-wider">Registered Business Office</span>
                      <span className="text-[#242321] text-xs block mt-1 leading-relaxed">
                        Fluxora Corporate Headquarters, India
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[rgba(89,9,7,0.08)] text-xs text-[#6B615A] space-y-1">
                    <p>
                      <b>Response Procedure:</b> Our Grievance Office acknowledges receipt of statutory complaints within
                      <b> 48 business hours</b> and provides a formal substantive resolution within <b>30 calendar days</b>.
                    </p>
                    <p>
                      If you are an individual employee seeking to exercise data principal rights, please contact your
                      employer's HR administrator as the primary Data Fiduciary.
                    </p>
                  </div>
                </div>
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

