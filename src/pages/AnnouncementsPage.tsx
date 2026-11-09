import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Tag,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Product Updates' | 'New Features' | 'Improvements' | 'Important Notices';
  badge: string;
  summary: string;
  content: string[];
  version?: string;
  isDevSample?: boolean;
}

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'FlowPeople v1.2 Release: Contactless Kiosk Mode & Anti-Spoofing',
    date: 'November 2026',
    category: 'Product Updates',
    badge: 'MAJOR RELEASE',
    version: 'v1.2.0',
    summary: 'Introducing Kiosk Mode v8 with instant contactless face attendance verification, depth perception checks, and sub-second recognition.',
    content: [
      'The vision engine now verifies facial landmarks using irreversible vector hashes without streaming permanent video.',
      'Active liveness detection prevents spoofing attempts via printed photos or digital smartphone screens.',
      'Shift-based automatic waking on employee approach reduces terminal idle power.'
    ],
    isDevSample: true
  },
  {
    id: 'ann-2',
    title: 'Precision 100m Mobile GPS Geofencing Module',
    date: 'October 2026',
    category: 'New Features',
    badge: 'NEW CAPABILITY',
    version: 'v1.1.4',
    summary: 'Employees can now check in with a single tap from their smartphone when situated within a verified corporate workplace perimeter.',
    content: [
      'Configurable 100-meter circular geofence around your verified office premises.',
      'Coordinates are captured strictly at the instant of check-in tap, preserving employee privacy outside working hours.',
      'Instant dashboard synchronization with manager notifications.'
    ],
    isDevSample: true
  },
  {
    id: 'ann-3',
    title: 'Automated Multi-Tier Leave Approval Engine',
    date: 'September 2026',
    category: 'Improvements',
    badge: 'WORKFLOW ENHANCEMENT',
    version: 'v1.1.0',
    summary: 'Custom approval hierarchies now support line managers, department heads, and HR operations in an automated escalation pipeline.',
    content: [
      'Real-time leave balance validation against custom company entitlement rules.',
      'Calendar conflict detection flags overlapping department leaves before approval.',
      'Direct email and in-app status notifications.'
    ],
    isDevSample: true
  },
  {
    id: 'ann-4',
    title: 'Digital Personal Data Protection Act (DPDPA 2023) Alignment',
    date: 'August 2026',
    category: 'Important Notices',
    badge: 'COMPLIANCE NOTICE',
    summary: 'FlowPeople architecture has been fully audited to ensure compliance with India’s Digital Personal Data Protection Act, 2023.',
    content: [
      'Clear statutory separation of Customer Organizations as Data Fiduciaries and Fluxora as Data Processor.',
      'Mandatory employee consent verification prompts prior to biometric enrollment.',
      'Dedicated statutory Grievance Officer channels and 30-day resolution procedures.'
    ],
    isDevSample: true
  },
  {
    id: 'ann-5',
    title: 'Google Drive Backup Integration & One-Click PDF Exports',
    date: 'July 2026',
    category: 'Improvements',
    badge: 'DATA SOVEREIGNTY',
    version: 'v1.0.8',
    summary: 'Monthly database backups now cycle with 3 months of rolling retention directly into client-owned Google Drive storage.',
    content: [
      'Automated monthly snapshot creation with zero administrative intervention.',
      'Structured CSV and audit-ready PDF workforce rosters.',
      '100% client data sovereignty with zero vendor lock-in.'
    ],
    isDevSample: true
  }
];

const CATEGORIES = [
  'All',
  'Product Updates',
  'New Features',
  'Improvements',
  'Important Notices'
] as const;

export default function AnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = useMemo(() => {
    return SAMPLE_ANNOUNCEMENTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="announcements-page min-h-screen bg-[#FBF7F0] text-[#242321] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[rgba(89,9,7,0.08)] bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#590907]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#590907] uppercase mb-6">
            <Bell className="h-3.5 w-3.5 text-[#590907]" />
            <span>ANNOUNCEMENT CENTER</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#242321] font-serif max-w-3xl mx-auto leading-[1.1]">
            What's New at <span className="text-[#590907]">FlowPeople.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-[#6B615A] leading-relaxed">
            Discover product updates, improvements, announcements and important information from the
            FlowPeople engineering and product team.
          </p>

          {/* Search Bar & Dev Sample Banner */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-[#6B615A]" />
              <input
                type="text"
                placeholder="Search releases, features, updates..."
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
      <div className="mx-auto max-w-6xl px-4 sm:px-8 pt-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
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
      {/* 3. ANNOUNCEMENTS LIST / EMPTY STATE                                  */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-10">
        {filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[rgba(89,9,7,0.1)] bg-white p-7 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="rounded-full bg-[#590907]/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-[#590907]">
                      {item.badge}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#6B615A] font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-[#242321] font-serif leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm text-[#6B615A] leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(89,9,7,0.06)] flex items-center justify-between">
                  <span className="text-[11px] text-[#A5A79B] font-mono">
                    {item.version ? `Release ${item.version}` : 'Announcement'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedAnnouncement(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#590907] hover:underline cursor-pointer"
                  >
                    <span>Read Release Notes</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Attractive Empty State */
          <div className="rounded-3xl border border-[rgba(89,9,7,0.1)] bg-white p-12 text-center max-w-md mx-auto space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EBDD] text-[#590907] mx-auto">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#242321]">No Announcements Found</h3>
            <p className="text-xs text-[#6B615A]">
              There are currently no updates matching your selected filter "{selectedCategory}" or search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#590907] px-4 py-2 text-xs font-semibold text-[#F8F6F1] shadow-xs hover:bg-[#590907]/90"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. DETAIL MODAL                                                       */}
      {/* ===================================================================== */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(42,35,32,0.4)] backdrop-blur-sm"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white text-[#242321] w-[min(580px,calc(100vw-32px))] rounded-[28px] shadow-2xl p-7 max-h-[85vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[rgba(89,9,7,0.08)] pb-3">
              <span className="text-xs font-bold text-[#590907] uppercase">
                {selectedAnnouncement.badge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="text-[#6B615A] hover:text-[#590907]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <div className="text-xs text-[#6B615A] font-mono">{selectedAnnouncement.date}</div>
              <h3 className="text-2xl font-bold text-[#242321] font-serif mt-1">
                {selectedAnnouncement.title}
              </h3>
            </div>

            <p className="text-sm text-[#4A423D] leading-relaxed">
              {selectedAnnouncement.summary}
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#242321]">
                Release Highlights:
              </div>
              {selectedAnnouncement.content.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A423D]">
                  <CheckCircle2 className="h-4 w-4 text-[#299D68] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[rgba(89,9,7,0.08)] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-full bg-[#590907] text-[#F8F6F1] px-5 py-2 text-xs font-semibold hover:bg-[#590907]/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

