import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Layers,
  Database,
  Headphones,
  Mail,
  Info
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'General' | 'Pricing and Licensing' | 'Features' | 'Data and Security' | 'Implementation and Support';
}

const FAQ_DATA: FaqItem[] = [
  // A. General
  {
    category: 'General',
    q: 'What is FlowPeople?',
    a: 'FlowPeople is an intelligent, modern Human Resource Management System (HRMS) developed by Fluxora. It streamlines employee directory management, attendance tracking (including contactless biometric kiosks and mobile GPS geofencing), leave workflows, HR dashboards, and document archival into one unified, dependable workspace.'
  },
  {
    category: 'General',
    q: 'Who is FlowPeople designed for?',
    a: 'FlowPeople is designed for growing businesses, startups, established enterprises, HR teams, and business owners who want reliable workforce management without the administrative friction of spreadsheets or the compounding expense of per-seat monthly SaaS subscriptions.'
  },
  {
    category: 'General',
    q: 'How does FlowPeople work?',
    a: 'FlowPeople is deployed on your organization’s dedicated database (such as MongoDB Atlas / Cloud Database) and connected to your own Google Drive storage. Employees access self-service profiles or check in via entrance kiosks / mobile geofencing, while administrators monitor attendance, approve leaves, and generate compliance reports through a centralized dashboard.'
  },
  {
    category: 'General',
    q: 'Is FlowPeople suitable for small businesses?',
    a: 'Yes, absolutely. The Starter tier is specifically crafted for organizations with up to 30 employees, offering a complete HR management suite for a single one-time payment of ₹30,000 with ₹0 recurring maintenance fees (T&C Apply).'
  },

  // B. Pricing and Licensing
  {
    category: 'Pricing and Licensing',
    q: 'Is FlowPeople a subscription?',
    a: 'No. FlowPeople is not a monthly or annual subscription. It operates on a commercial one-time perpetual license model. You purchase the software once and own operational rights for that version without monthly per-user software fees.'
  },
  {
    category: 'Pricing and Licensing',
    q: 'Is the license a one-time payment?',
    a: 'Yes. You make a single one-time license payment based on your chosen tier: Starter (₹30,000 for up to 30 employees), Professional (₹59,999 for up to 75 employees), or Enterprise (₹99,999 for up to 200 employees).'
  },
  {
    category: 'Pricing and Licensing',
    q: 'What are the employee limits?',
    a: 'Each tier covers an active concurrent employee ceiling: Starter covers up to 30 employees, Professional covers up to 75 employees, and Enterprise covers up to 200 employees.'
  },
  {
    category: 'Pricing and Licensing',
    q: 'Are there recurring software maintenance fees?',
    a: 'No. FlowPeople charges ₹0 in recurring software maintenance fees across all plan tiers for the purchased software version (T&C Apply).'
  },
  {
    category: 'Pricing and Licensing',
    q: 'Are hosting and infrastructure charges included?',
    a: 'External hosting (such as MongoDB Atlas database hosting) and Google Drive storage fees are paid directly by your organization to those independent cloud providers. We configure and link them during onboarding, but their external infrastructure usage costs sit outside our license.'
  },
  {
    category: 'Pricing and Licensing',
    q: 'Can I upgrade my plan?',
    a: 'Yes. If your company expands beyond your headcount limit, contact Fluxora to mutually upgrade your tier by paying the agreed price differential. We never automatically charge your card or silently change your account.'
  },

  // C. Features
  {
    category: 'Features',
    q: 'Does FlowPeople support face attendance?',
    a: 'Yes, on compatible hardware. FlowPeople includes an intelligent Kiosk Mode that performs sub-second facial verification using mathematical vector hashes. It operates contactlessly and includes active anti-spoofing detection.'
  },
  {
    category: 'Features',
    q: 'Can employees access their own profiles?',
    a: 'Yes. Role-Based Access Control (RBAC) provides employees with a dedicated self-service portal where they can view working shifts, check leave balances, submit time-off requests, and review personal documents.'
  },
  {
    category: 'Features',
    q: 'Can HR managers manage employee records?',
    a: 'Yes. Authorized HR managers and administrators have full tools to create employee profiles, upload compliance documents, review attendance telemetry, and approve departmental leaves.'
  },
  {
    category: 'Features',
    q: 'Does FlowPeople support leave approvals?',
    a: 'Yes. FlowPeople features automated multi-tier leave approval routing. Requests are sent to designated line managers, department heads, or HR admins with conflict detection and instant notifications.'
  },
  {
    category: 'Features',
    q: 'Can I export HR reports?',
    a: 'Yes. FlowPeople supports one-click structured exports (CSV, Excel) and formatted PDF reports for monthly attendance rosters, leave balance registers, and workforce compliance audits.'
  },

  // D. Data and Security
  {
    category: 'Data and Security',
    q: 'Where is organizational data stored?',
    a: 'Your organizational data is stored in your dedicated database instance (MongoDB Atlas / Cloud Database) and your client-owned Google Drive. We do not aggregate customer records into a shared multi-tenant marketing pool.'
  },
  {
    category: 'Data and Security',
    q: 'Does FlowPeople support Google Drive?',
    a: 'Yes. Documents, attachments, contracts, and monthly automated backups route directly to a Google Drive workspace owned and administered by your company.'
  },
  {
    category: 'Data and Security',
    q: 'How are backups managed?',
    a: 'Where configured in your plan, FlowPeople automates monthly system snapshots with three months of rolling retention stored safely in your company Google Drive.'
  },
  {
    category: 'Data and Security',
    q: 'Can organizations export their data?',
    a: 'Yes. You have complete data sovereignty. You can export your employee profiles, shift logs, leave history, and uploaded files at any time without fees or artificial vendor lock-in.'
  },

  // E. Implementation and Support
  {
    category: 'Implementation and Support',
    q: 'How do I get started?',
    a: 'Choose your desired plan tier on our Pricing page or reach out via our Contact form. We initiate your dedicated workspace setup, connect your cloud storage, and schedule admin handover training.'
  },
  {
    category: 'Implementation and Support',
    q: 'Is setup assistance available?',
    a: 'Yes. Every license purchase includes done-with-you initial setup: database initialization, Google Drive connector configuration, and comprehensive administrator walkthrough training.'
  },
  {
    category: 'Implementation and Support',
    q: 'Can I request custom functionality?',
    a: 'Yes. Enterprise licenses include custom workflows, approvals, and scoped reports. Bespoke feature engineering or specialized third-party API integrations beyond the standard plan are quoted separately.'
  },
  {
    category: 'Implementation and Support',
    q: 'How do I book a demonstration?',
    a: 'You can book an interactive product demonstration through our Contact page by selecting "Book a Demo" or emailing hqfluxora@gmail.com.'
  }
];

const CATEGORIES = [
  'All',
  'General',
  'Pricing and Licensing',
  'Features',
  'Data and Security',
  'Implementation and Support'
] as const;

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-page min-h-screen bg-[#FBF7F0] text-[#242321] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase mb-6">
            <HelpCircle className="h-3.5 w-3.5 text-[#590907]" />
            <span>KNOWLEDGE BASE &amp; FAQ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#242321] font-serif max-w-3xl mx-auto leading-[1.1]">
            Questions? <span className="text-[#590907]">We've Got Answers.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#6B615A] leading-relaxed">
            Everything you need to know about FlowPeople, its features, one-time perpetual pricing and implementation.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-[#6B615A]" />
              <input
                type="text"
                placeholder="Search questions (e.g. subscription, biometric, backup)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[rgba(89,9,7,0.15)] bg-white py-3.5 pl-11 pr-4 text-xs sm:text-sm text-[#242321] shadow-xs outline-none focus:border-[#590907]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs text-[#6B615A] hover:text-[#590907]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. CATEGORY FILTER TABS                                              */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-4xl px-4 sm:px-8 pt-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'bg-white border border-[rgba(89,9,7,0.12)] text-[#242321] hover:bg-[#F3EBDD]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. FAQ ACCORDION LIST                                                 */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-4xl px-4 sm:px-8 py-10 space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[rgba(89,9,7,0.09)] bg-white shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-[#242321] hover:text-[#590907] cursor-pointer"
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#590907] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#6B615A] leading-relaxed border-t border-[rgba(89,9,7,0.06)] pt-4">
                    <p>{item.a}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#A5A79B]">
                      <span>Category:</span>
                      <span className="font-semibold text-[#590907]">{item.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty Search State */
          <div className="rounded-3xl border border-[rgba(89,9,7,0.1)] bg-white p-12 text-center max-w-md mx-auto space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EBDD] text-[#590907] mx-auto">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#242321]">No Matching Questions</h3>
            <p className="text-xs text-[#6B615A]">
              We couldn't find any questions matching your query. Try a different search term or explore all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#590907] px-4 py-2 text-xs font-semibold text-[#F8F6F1] shadow-xs hover:bg-[#590907]/90"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. HELPFUL LEGAL & CONTACT LINKS CALLOUT                              */}
      {/* ===================================================================== */}
      <section className="mx-auto max-w-4xl px-4 sm:px-8 pt-8">
        <div className="rounded-3xl border border-[rgba(89,9,7,0.1)] bg-[#F3EBDD]/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-[#242321]">Need More Specific Information?</h3>
            <p className="text-xs text-[#6B615A] mt-1">
              Review our verified compliance documentation or speak directly with our solutions team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/privacy"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#242321] border border-[rgba(89,9,7,0.12)] hover:border-[#590907]"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#242321] border border-[rgba(89,9,7,0.12)] hover:border-[#590907]"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/contact"
              className="rounded-full bg-[#590907] px-4 py-2 text-xs font-semibold text-[#F8F6F1] hover:bg-[#590907]/90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

