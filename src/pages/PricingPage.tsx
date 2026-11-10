import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import Lightfall from '../components/Lightfall';
import './PricingPage.css';
import { leadService } from '../services/leadService';

interface PlanFeature {
  text: string;
  note?: string;
}

interface PricingPlan {
  name: string;
  price: number;
  capacity: number;
  cta: string;
  isPro?: boolean;
  includedFrom?: string;
  features: PlanFeature[];
}

interface ComparisonRow {
  feature: string;
  starter: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
}

interface ComparisonGroup {
  groupTitle: string;
  rows: ComparisonRow[];
}

const CHECK_SVG = (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[18px] h-[18px] text-[#4C7A5C] shrink-0 mt-0.5"
    aria-hidden="true"
  >
    <path d="M4 10.5l3.8 3.8L16 6" />
  </svg>
);

const PLANS_DATA: PricingPlan[] = [
  {
    name: 'Starter',
    price: 30000,
    capacity: 30,
    cta: 'Choose Starter',
    features: [
      { text: 'Employee Management' },
      { text: 'Basic Attendance Management' },
      { text: 'Leave Management' },
      { text: 'Employee Profiles' },
      { text: 'Employee Document Management' },
      { text: 'Basic HR Dashboard' },
      { text: 'Monthly Reports' },
      { text: 'Admin and Employee Access' },
      { text: 'Database Setup' },
      { text: 'Google Drive Setup' }
    ]
  },
  {
    name: 'Professional',
    price: 59999,
    capacity: 75,
    cta: 'Choose Professional',
    isPro: true,
    includedFrom: 'Everything in Starter, plus',
    features: [
      { text: 'Face Attendance', note: 'subject to hardware compatibility' },
      { text: 'Advanced Attendance Management' },
      { text: 'Payroll', note: 'subject to requirements' },
      { text: 'Employee Self-Service Portal' },
      { text: 'Advanced HR Reports' },
      { text: 'Advanced Document Management' },
      { text: 'Google Drive Backup Integration' }
    ]
  },
  {
    name: 'Enterprise',
    price: 99999,
    capacity: 200,
    cta: 'Contact Enterprise Team',
    includedFrom: 'Everything in Professional, plus',
    features: [
      { text: 'Multi-Location Management' },
      { text: 'Advanced Role Permissions' },
      { text: 'Custom Workflows' },
      { text: 'Custom Approval Systems' },
      { text: 'Custom Reports' },
      { text: 'Scoped API Integrations' },
      { text: 'Enterprise Configuration' }
    ]
  }
];

const COMPARISON_DATA: ComparisonGroup[] = [
  {
    groupTitle: 'Capacity',
    rows: [
      { feature: 'Employee limit', starter: '30', professional: '75', enterprise: '200' }
    ]
  },
  {
    groupTitle: 'Core HR',
    rows: [
      { feature: 'Employee Management', starter: true, professional: true, enterprise: true },
      { feature: 'Employee Profiles', starter: true, professional: true, enterprise: true },
      { feature: 'Leave Management', starter: true, professional: true, enterprise: true },
      { feature: 'Admin and Employee Access', starter: true, professional: true, enterprise: true },
      { feature: 'Basic HR Dashboard', starter: true, professional: true, enterprise: true },
      { feature: 'Monthly Reports', starter: true, professional: true, enterprise: true }
    ]
  },
  {
    groupTitle: 'Attendance and documents',
    rows: [
      { feature: 'Basic Attendance Management', starter: true, professional: true, enterprise: true },
      { feature: 'Advanced Attendance Management', starter: false, professional: true, enterprise: true },
      { feature: 'Face Attendance (hardware dependent)', starter: false, professional: true, enterprise: true },
      { feature: 'Employee Document Management', starter: true, professional: true, enterprise: true },
      { feature: 'Advanced Document Management', starter: false, professional: true, enterprise: true }
    ]
  },
  {
    groupTitle: 'Payroll and reports',
    rows: [
      { feature: 'Payroll (subject to requirements)', starter: false, professional: true, enterprise: true },
      { feature: 'Employee Self-Service Portal', starter: false, professional: true, enterprise: true },
      { feature: 'Advanced HR Reports', starter: false, professional: true, enterprise: true },
      { feature: 'Custom Reports', starter: false, professional: false, enterprise: true }
    ]
  },
  {
    groupTitle: 'Setup and backup',
    rows: [
      { feature: 'Database Setup', starter: true, professional: true, enterprise: true },
      { feature: 'Google Drive Setup', starter: true, professional: true, enterprise: true },
      { feature: 'Google Drive Backup Integration', starter: false, professional: true, enterprise: true }
    ]
  },
  {
    groupTitle: 'Enterprise controls',
    rows: [
      { feature: 'Multi-Location Management', starter: false, professional: false, enterprise: true },
      { feature: 'Advanced Role Permissions', starter: false, professional: false, enterprise: true },
      { feature: 'Custom Workflows', starter: false, professional: false, enterprise: true },
      { feature: 'Custom Approval Systems', starter: false, professional: false, enterprise: true },
      { feature: 'Scoped API Integrations', starter: false, professional: false, enterprise: true },
      { feature: 'Enterprise Configuration', starter: false, professional: false, enterprise: true }
    ]
  }
];

const BENEFITS = [
  {
    key: 'db',
    title: 'Dedicated Client Database',
    desc: 'Your organization gets its own database. It is not shared with other clients.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <ellipse cx="16" cy="8" rx="10" ry="4" />
        <path d="M6 8v8c0 2.2 4.5 4 10 4s10-1.8 10-4V8M6 16v8c0 2.2 4.5 4 10 4s10-1.8 10-4v-8" />
      </svg>
    )
  },
  {
    key: 'drive',
    title: 'Client-Owned Google Drive',
    desc: 'Documents and backups go to a Google Drive that you own.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <path d="M11 4h10l8 14-5 9H8l-5-9z" />
        <path d="M11 4l8 14h10M3 18h16" />
      </svg>
    )
  },
  {
    key: 'exp',
    title: 'PDF and Structured Data Exports',
    desc: 'Take your records out as PDF files or structured data whenever you need them.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <path d="M8 3h11l6 6v20H8z" />
        <path d="M19 3v6h6M12 17h9M12 22h9" />
      </svg>
    )
  },
  {
    key: 'bak',
    title: 'Monthly Backups',
    desc: 'Backed up every month, with three months of rolling retention.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <path d="M16 5a11 11 0 1 1-9.5 5.5" />
        <path d="M5 4v7h7M16 10v6l4 3" />
      </svg>
    )
  },
  {
    key: 'set',
    title: 'Initial Setup',
    desc: 'We set up your database, Drive connection and workspace before you start.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <path d="M4 27l9-9M13 18l-3-3 12-12 5 5-12 12z" />
        <path d="M20 6l6 6" />
      </svg>
    )
  },
  {
    key: 'tr',
    title: 'Training and Handover',
    desc: 'Your admins get trained, then we hand the system over to you.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <circle cx="11" cy="11" r="5" />
        <circle cx="23" cy="13" r="4" />
        <path d="M2 27c0-5 4-8 9-8s9 3 9 8M20 22c4-1 9 1 9 5" />
      </svg>
    )
  },
  {
    key: 'lic',
    title: 'Perpetual License',
    desc: 'Yours to keep for the purchased version, subject to license terms.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" />
        <path d="M11 16l4 4 7-8" />
      </svg>
    )
  },
  {
    key: 'zero',
    title: 'No Maintenance Fee*',
    desc: 'FlowPeople charges ₹0 in recurring software maintenance (T&C Apply).',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10 p-[9px] bg-[#EEF2FF] rounded-full text-[#4F46E5] mb-4">
        <circle cx="16" cy="16" r="12" />
        <path d="M9 23L23 9" />
      </svg>
    )
  }
];

const COST_ROWS = [
  { item: 'One-time license purchase', cost: 'Paid once', isOk: true },
  { item: 'Recurring FlowPeople maintenance (T&C Apply)', cost: '₹0', isOk: true },
  { item: 'GST', cost: 'Additional', isOk: false },
  { item: 'Supabase / cloud database hosting', cost: 'Additional', isOk: false },
  { item: 'Google Drive storage', cost: 'Additional', isOk: false },
  { item: 'Hardware (for example face attendance devices)', cost: 'Additional', isOk: false },
  { item: 'Third-party API costs', cost: 'Additional', isOk: false },
  { item: 'Custom development', cost: 'Quoted separately', isOk: false }
];

const FAQS = [
  {
    q: 'Is FlowPeople a monthly subscription?',
    a: 'No. FlowPeople is licensed with a single one-time payment. There is no monthly or yearly software subscription.'
  },
  {
    q: 'Is the license a one-time purchase?',
    a: 'Yes. You pay once for the plan you choose and receive a perpetual license for the purchased version, subject to the license terms.'
  },
  {
    q: 'Are there recurring maintenance fees?',
    a: 'FlowPeople charges ₹0 in recurring software maintenance (T&C Apply). Costs from other services, such as hosting and storage, are separate.'
  },
  {
    q: 'Are hosting and storage included?',
    a: 'No. Supabase or cloud database hosting and Google Drive storage are paid directly by you to those providers. We set them up for you, but their usage costs are additional. GST is also additional.'
  },
  {
    q: 'What happens if we exceed the employee limit?',
    a: 'Each plan covers a set number of employees: 30, 75 or 200. If you grow past your limit, talk to our team and we will help you move to a plan that fits.'
  },
  {
    q: 'Is face attendance supported on every device?',
    a: 'No. Face attendance depends on hardware compatibility. Share the devices you plan to use and we will confirm before you buy. Hardware costs are additional.'
  },
  {
    q: 'Is payroll included?',
    a: 'Payroll is part of Professional and Enterprise, subject to your requirements. Starter does not include payroll.'
  },
  {
    q: 'Can we request custom features?',
    a: 'Yes. Enterprise includes custom workflows, approvals and reports. Any custom development beyond the plan is quoted separately.'
  },
  {
    q: 'How does setup and training work?',
    a: 'Every plan includes initial setup of your database and Google Drive, then training and handover for your team, so your admins can run the system on their own.'
  }
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('Starter');
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquirySize, setInquirySize] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const closeModal = () => {
    setModalOpen(false);
    setIsSubmitted(false);
    setInquiryName('');
    setInquiryEmail('');
    setInquirySize('');
  };

  const handleScheduleDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    closeModal();
    navigate(`/contact?type=Book%20a%20Demo&plan=${encodeURIComponent(selectedPlan)}`);
  };

  // Animated counters
  const [displayPrices, setDisplayPrices] = useState<number[]>([0, 0, 0]);
  const hasAnimatedRef = useRef<boolean>(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Format currency
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  // IntersectionObserver for pricing counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            const start = performance.now();
            const duration = 1300;
            const targets = PLANS_DATA.map((p) => p.price);

            const frame = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 4);

              setDisplayPrices(targets.map((tgt) => Math.round(tgt * ease)));

              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                setDisplayPrices(targets);
              }
            };

            requestAnimationFrame(frame);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 3D Card tilt handlers
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    card.style.transform = `translateY(-8px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8
      }deg)`;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = '';
  };

  // Open modal with plan
  const openInquiry = (planName: string) => {
    setSelectedPlan(planName);
    setIsSubmitted(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) return;

    setIsSubmitting(true);
    try {
      await leadService.submitLead({
        full_name: inquiryName.trim(),
        business_email: inquiryEmail.trim(),
        company_name: 'Inquiry via Pricing Card',
        employee_count: inquirySize ? `${inquirySize} employees` : undefined,
        interested_plan: selectedPlan,
        inquiry_type: 'Pricing Enquiry',
        message: `Plan inquiry submitted for ${selectedPlan}. Team size: ${inquirySize || 'Not specified'}.`,
        source: 'pricing_modal_form'
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pricing-page-root min-h-screen">
      {/* Hero Header */}
      <header className="hero-pricing">
        <div className="hero-bg-pricing" aria-hidden="true">
          {/* Floating 3D Coins */}
          <div className="coin c1 gold">
            <span>₹</span>
          </div>
          <div className="coin c2 wine">
            <span>$</span>
          </div>
          <div className="coin c3 gold">
            <span>$</span>
          </div>
          <div className="coin c4 wine">
            <span>₹</span>
          </div>
          <div className="coin c5 gold">
            <span>₹</span>
          </div>
          <i className="sym y1">₹</i>
          <i className="sym y2">$</i>
          <i className="sym y3">₹</i>
          <i className="sym y4">$</i>
        </div>

        <div className="relative max-w-[1160px] mx-auto px-4">
          <h1 className="pricing-h1" aria-label="Your People. Your System. Your Investment.">
            <span className="ln" aria-hidden="true">
              <span className="w">
                <span style={{ animationDelay: '100ms' }}>Your</span>
              </span>{' '}
              <span className="w">
                <span style={{ animationDelay: '200ms' }}>
                  <em>People.</em>
                </span>
              </span>
            </span>
            <span className="ln" aria-hidden="true">
              <span className="w">
                <span style={{ animationDelay: '300ms' }}>Your</span>
              </span>{' '}
              <span className="w">
                <span style={{ animationDelay: '400ms' }}>
                  <em>System.</em>
                </span>
              </span>
            </span>
            <span className="ln" aria-hidden="true">
              <span className="w">
                <span style={{ animationDelay: '500ms' }}>Your</span>
              </span>{' '}
              <span className="w">
                <span style={{ animationDelay: '600ms' }}>
                  <em>Investment.</em>
                </span>
              </span>
            </span>
          </h1>

          <p className="hero-pricing-lead">
            Powerful HR management, simplified into one intelligent platform. Choose the right
            FlowPeople license for your organization.
          </p>

          <div className="hero-pricing-cta">
            <a
              className="pricing-btn"
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Pricing <span className="arr">→</span>
            </a>
            <button
              type="button"
              className="pricing-btn ghost"
              onClick={() => openInquiry('Contact Sales')}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-[1160px] mx-auto px-4 sm:px-6">
        {/* Section 1: Pricing Cards */}
        <section id="pricing" className="py-16 sm:py-24" aria-labelledby="pricing-h">
          <div className="grid gap-3.5 mb-8 sm:mb-12 max-w-[850px]">
            <h2 id="pricing-h" className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold tracking-tight text-[#141312]">
              Pay once. Own the license.
            </h2>
            <p className="text-[#242321] font-medium text-[1.18rem] max-w-[65ch] leading-relaxed">
              Three licenses, each a single payment with no recurring FlowPeople maintenance fee (T&C Apply).
              Pick the one that matches your headcount and the way you work.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="pricing-cards-grid" ref={cardsRef}>
            {PLANS_DATA.map((plan, idx) => {
              const currentPrice = hasAnimatedRef.current ? displayPrices[idx] : plan.price;
              return (
                <article
                  key={plan.name}
                  className={`pricing-card ${plan.isPro ? 'pro' : ''}`}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {plan.isPro && <span className="pricing-badge">MOST POPULAR</span>}
                  <span className="card-glow" />

                  <div>
                    <div className="text-[1.1rem] font-semibold text-[#0F172A]">{plan.name}</div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="font-bold text-[clamp(2.4rem,4vw,3rem)] leading-none tracking-tight font-mono text-[#0F172A]">
                        {fmt(currentPrice)}
                      </span>
                      <span className="text-[0.8rem] font-semibold bg-indigo-50 border border-indigo-200 text-[#4F46E5] px-3 py-1 rounded-full">
                        one-time
                      </span>
                    </div>
                    <p className="text-[0.85rem] text-[#64748B] mt-1.5">
                      Plus GST. No recurring maintenance fee <span className="text-[11px] text-[#4F46E5] font-semibold">(T&C Apply)</span>.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-slate-100 rounded-[18px] text-[0.95rem] text-[#0F172A]">
                    <b className="text-[1.5rem] font-bold leading-none">{plan.capacity}</b>
                    <span>Up to {plan.capacity} employees</span>
                  </div>

                  <ul className="list-none m-0 p-0 grid gap-0.5 flex-1">
                    {plan.includedFrom && (
                      <li className="flex gap-2.5 py-2 px-2.5 -mx-2.5 text-[0.93rem] rounded-xl font-semibold leading-snug">
                        {CHECK_SVG}
                        <span>{plan.includedFrom}</span>
                      </li>
                    )}
                    {plan.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex gap-2.5 py-2 px-2.5 -mx-2.5 text-[0.93rem] rounded-xl hover:bg-[#FBF7F0] transition-colors leading-snug"
                      >
                        {CHECK_SVG}
                        <span>
                          {feat.text}
                          {feat.note && (
                            <span className="text-[#6B615A] text-[0.82rem] font-normal ml-1">
                              ({feat.note})
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`pricing-btn block ${plan.isPro ? '' : 'ghost'}`}
                    onClick={() => openInquiry(plan.name)}
                  >
                    {plan.cta} <span className="arr">→</span>
                  </button>
                </article>
              );
            })}
          </div>

          <p className="text-center text-[#6B615A] text-[0.9rem] mt-9">
            All prices are one-time and exclude GST. Hosting, storage, hardware and third-party costs
            are listed below.
          </p>
        </section>

        {/* Section 2: Plan Feature Comparison Table */}
        <section id="features" className="pb-16 sm:pb-24 pt-0" aria-labelledby="cmp-h">
          <div className="grid gap-3.5 mb-8 sm:mb-12 max-w-[720px]">
            <h2 id="cmp-h" className="text-[clamp(1.9rem,4vw,2.9rem)] font-semibold tracking-tight text-[#2A2320]">
              Compare every feature.
            </h2>
            <p className="text-[#6B615A] text-[1.1rem] max-w-[58ch]">
              Each plan builds on the one before it. Professional includes everything in Starter.
              Enterprise includes everything in Professional.
            </p>
          </div>

          <div
            className="pricing-tablebox"
            tabIndex={0}
            role="region"
            aria-label="Plan comparison table"
          >
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  {PLANS_DATA.map((p) => (
                    <th scope="col" key={p.name}>
                      {p.name}
                      <small>{fmt(p.price)} one-time</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((group) => (
                  <React.Fragment key={group.groupTitle}>
                    <tr className="grp">
                      <td colSpan={4}>{group.groupTitle}</td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.feature}>
                        <td>{row.feature}</td>
                        {/* Starter col */}
                        <td>
                          {typeof row.starter === 'string' ? (
                            row.starter
                          ) : row.starter ? (
                            <span className="inline-block w-5 h-5 text-[#4C7A5C]" role="img" aria-label="Included">
                              {CHECK_SVG}
                            </span>
                          ) : (
                            <span className="text-[#6B615A] opacity-50" aria-label="Not included">
                              —
                            </span>
                          )}
                        </td>
                        {/* Professional col (highlighted) */}
                        <td className="pcol">
                          {typeof row.professional === 'string' ? (
                            row.professional
                          ) : row.professional ? (
                            <span className="inline-block w-5 h-5 text-[#4C7A5C]" role="img" aria-label="Included">
                              {CHECK_SVG}
                            </span>
                          ) : (
                            <span className="text-[#6B615A] opacity-50" aria-label="Not included">
                              —
                            </span>
                          )}
                        </td>
                        {/* Enterprise col */}
                        <td>
                          {typeof row.enterprise === 'string' ? (
                            row.enterprise
                          ) : row.enterprise ? (
                            <span className="inline-block w-5 h-5 text-[#4C7A5C]" role="img" aria-label="Included">
                              {CHECK_SVG}
                            </span>
                          ) : (
                            <span className="text-[#6B615A] opacity-50" aria-label="Not included">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.82rem] text-[#6B615A] mt-3 md:hidden">
            Swipe sideways to see all plans.
          </p>
        </section>

        {/* Section 3: Included with every plan (Benefits) */}
        <section id="solutions" className="pb-16 sm:pb-24 pt-0" aria-labelledby="ben-h">
          <div className="grid gap-3.5 mb-8 sm:mb-12 max-w-[720px]">
            <h2 id="ben-h" className="text-[clamp(1.9rem,4vw,2.9rem)] font-semibold tracking-tight text-[#2A2320]">
              Included with every plan.
            </h2>
            <p className="text-[#6B615A] text-[1.1rem] max-w-[58ch]">
              Your data stays in your own database and your own Google Drive. FlowPeople does not
              charge recurring software maintenance fees on any plan (T&C Apply).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.key}
                className="p-6 bg-[#FFFFFF] rounded-[26px] shadow-[0_10px_40px_-16px_rgba(89,9,7,0.18)] transition-transform hover:-translate-y-1"
              >
                {b.icon}
                <h3 className="text-[1.15rem] font-semibold text-[#2A2320] mb-2">{b.title}</h3>
                <p className="text-[0.92rem] text-[#6B615A] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 py-5 px-7 bg-slate-100 font-semibold rounded-full flex gap-3.5 items-center justify-center text-center flex-wrap text-[#0F172A]">
            <span className="text-[1.5rem] font-bold text-[#4F46E5]">₹0</span>
            <span>recurring FlowPeople maintenance fee, on every plan <span className="text-xs text-[#4F46E5] font-bold">(T&C Apply)</span>.</span>
          </div>
        </section>

        {/* Section 4: Cost Transparency Breakdown */}
        <section className="pb-16 sm:pb-24 pt-0" aria-labelledby="cost-h">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-7 sm:gap-16 items-start bg-slate-100 rounded-[40px] p-7 sm:p-16">
            <div>
              <h2 id="cost-h" className="text-[clamp(1.9rem,4vw,2.9rem)] font-semibold tracking-tight text-[#0F172A]">
                One Investment. No Monthly Software Maintenance <span className="text-xs text-[#4F46E5] align-super font-semibold">(T&C Apply)</span>.
              </h2>
              <p className="text-[#64748B] text-[1.1rem] mt-5 leading-relaxed">
                You buy the license once. After that, FlowPeople does not bill you for the software.
                Some costs sit outside our license and go to the services you choose, so we list
                them here instead of hiding them.
              </p>
              <div className="font-bold text-[clamp(4.5rem,13vw,8rem)] leading-[0.9] text-[#4F46E5] tracking-tighter mt-9">
                ₹0
                <small className="block font-medium text-[0.95rem] text-[#64748B] mt-3 leading-snug tracking-normal">
                  recurring FlowPeople
                  <br />
                  maintenance fee
                  <span className="block text-[11px] text-[#4F46E5] font-semibold mt-0.5">(T&C Apply)</span>
                </small>
              </div>
            </div>

            <ul className="list-none m-0 p-0 grid gap-2.5">
              {COST_ROWS.map((row, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center gap-4 py-4 px-5 bg-[#FFFFFF] rounded-[18px] transition-transform hover:translate-x-1"
                >
                  <span className="text-[#0F172A] font-medium text-[0.95rem]">{row.item}</span>
                  <span
                    className={`font-semibold whitespace-nowrap text-right text-[0.95rem] ${row.isOk ? 'text-[#10B981]' : 'text-[#64748B]'
                      }`}
                  >
                    {row.cost}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 5: FAQ Accordion */}
        <section className="pb-16 sm:pb-24 pt-0" aria-labelledby="faq-h">
          <div className="grid gap-3.5 mb-8 sm:mb-12 max-w-[720px]">
            <h2 id="faq-h" className="text-[clamp(1.9rem,4vw,2.9rem)] font-semibold tracking-tight text-[#0F172A]">
              Questions, answered plainly.
            </h2>
          </div>

          <div className="pricing-faq max-w-[820px] grid gap-3">
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

        {/* Section 6: Final CTA with Tech Blue/Indigo */}
        <section id="contact" className="pb-16 sm:pb-28 pt-4" aria-labelledby="fin-h">
          <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E1B4B] text-white p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(79,70,229,0.35)] border-2 border-indigo-500/30">
            {/* Dynamic Blue Lightfall Canvas Background */}
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

            {/* Ambient Radial Glow Halos */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] rounded-full bg-gradient-to-b from-[#2563EB]/25 via-[#4F46E5]/10 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-10 w-[400px] h-[250px] rounded-full bg-[#4F46E5]/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-5">
              {/* Luminous Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-blue-400/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200 backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span>Simple Setup · Perpetual License</span>
              </div>

              {/* Headline */}
              <h2 id="fin-h" className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-2xl mx-auto drop-shadow-sm">
                Ready to Make HR Management <br className="hidden sm:inline" />
                <span className="font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  Simpler?
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal max-w-xl mx-auto leading-relaxed drop-shadow-sm">
                Tell us your team size and what you need. We will recommend a plan and walk you through setup.
              </p>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => openInquiry('General inquiry')}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#4F46E5] text-white px-8 sm:px-10 py-4 text-sm sm:text-base font-bold shadow-xl shadow-indigo-500/25 hover:bg-[#4338CA] hover:scale-[1.03] transition-all cursor-pointer"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <a
                  href="/contact?type=Book%20a%20Demo"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-7 py-4 text-sm sm:text-base font-semibold text-white shadow-md backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Book a Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Inquiry Modal / Dialog */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(42,35,32,0.4)] backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-[#FFFFFF] text-[#2A2320] w-[min(480px,calc(100vw-32px))] rounded-[28px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] p-7 grid gap-4 animate-[fpPop_0.35s_cubic-bezier(0.2,0.8,0.2,1)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dlg-t"
          >
            <h3 id="dlg-t" className="text-[1.5rem] font-semibold text-[#2A2320]">
              Talk to our team
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#0F172A]">
                Selected plan
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="p-3 bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-[14px] text-[1rem] outline-none focus:border-[#4F46E5]"
                >
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="General inquiry">General inquiry</option>
                  <option value="Contact Sales">Contact Sales</option>
                </select>
              </label>

              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#0F172A]">
                Your name
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  autoComplete="name"
                  placeholder="Your full name"
                  className="p-3 bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-[14px] text-[1rem] outline-none focus:border-[#4F46E5]"
                />
              </label>

              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#0F172A]">
                Work email
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="p-3 bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-[14px] text-[1rem] outline-none focus:border-[#4F46E5]"
                />
              </label>

              <label className="grid gap-1.5 text-[0.85rem] font-semibold text-[#0F172A]">
                Number of employees
                <input
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  value={inquirySize}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (Number(val) > 0 && !val.includes('-') && !val.includes('.'))) {
                      setInquirySize(val);
                    }
                  }}
                  placeholder="For example, 60"
                  className="p-3 bg-[#F8FAFC] text-[#0F172A] border border-slate-200 rounded-[14px] text-[1rem] outline-none focus:border-[#4F46E5]"
                />
              </label>

              <p className="text-[0.8rem] text-[#64748B]">
                Inquiries are transmitted directly to our solutions desk for plan setup and licensing.
              </p>

              {isSubmitted && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[0.92rem] rounded-[14px] font-medium space-y-1">
                  <div>Inquiry received! Our team will contact you shortly regarding the <b>{selectedPlan}</b> plan.</div>
                  <div className="text-xs text-[#0F172A]">
                    Need custom workflows or enterprise terms?{' '}
                    <button
                      type="button"
                      onClick={handleScheduleDemo}
                      className="underline text-[#4F46E5] hover:text-[#4338CA] font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded px-0.5 inline-flex items-center gap-0.5 transition"
                    >
                      Schedule a live demonstration &rarr;
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 flex-wrap mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="pricing-btn ghost flex-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Close
                </button>
                <button type="submit" disabled={isSubmitting} className="pricing-btn flex-1 disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500">
                  {isSubmitting ? 'Transmitting...' : 'Send inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

