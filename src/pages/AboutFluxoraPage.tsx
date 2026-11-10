import React from 'react';
import { Link } from 'react-router-dom';
import Lightfall from '../components/Lightfall';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Compass,
  Lightbulb,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Cpu,
  Boxes,
  HeartHandshake
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function AboutFluxoraPage() {
  return (
    <div className="about-fluxora-page min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#4F46E5] uppercase mb-6">
            <Building2 className="h-3.5 w-3.5 text-[#4F46E5]" />
            <span>THE COMPANY BEHIND THE SOFTWARE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#0F172A] font-serif max-w-5xl mx-auto leading-[1.06]">
            Building Technology That <span className="text-[#4F46E5]">Moves Businesses Forward.</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-[#0F172A] font-medium leading-relaxed">
            Fluxora is focused on creating practical, thoughtfully designed digital products that simplify
            everyday business challenges.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5] px-6 py-3 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#4F46E5]/90"
            >
              <span>Contact Fluxora</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-xs sm:text-sm font-semibold text-[#0F172A] shadow-xs backdrop-blur-md transition hover:bg-white hover:text-[#4F46E5]"
            >
              <span>Explore FlowPeople</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. SECTION A: OUR STORY                                               */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 shadow-sm space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              <span>OUR STORY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0F172A]">
              A Focus on Practical Technology
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
              <p>
                Fluxora is an independent technology house dedicated to building practical, reliable digital
                products that solve real operational friction for modern organizations.
              </p>
              <p>
                As the team and brand behind FlowPeople, our goal is to challenge the assumption that enterprise
                software must be expensive, bloated, and leased back to customers through endless monthly subscriptions.
              </p>
              <p>
                We believe that software should be an enduring corporate asset: licensed transparently, deployed
                on dedicated customer databases, and engineered with the utmost respect for organizational privacy
                and simplicity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. SECTION B: OUR PHILOSOPHY                                          */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-slate-100/50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              GUIDING PRINCIPLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0F172A]">
              Our Philosophy
            </h2>
            <p className="text-sm text-[#64748B]">
              Three unwavering commitments embedded in every product we architect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#4F46E5]">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Innovation with Purpose</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                We avoid technological novelty for its own sake. Every feature—from biometric verification to
                geofencing—must directly reduce administrative friction for human workers.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#4F46E5]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Simplicity in Every Experience</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                True elegance lies in clarity. Our user interfaces prioritize natural, frictionless workflows
                over cluttered settings panels, making adoption effortless for non-technical staff.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#4F46E5]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">Technology That Creates Real Value</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                We build products that respect customer budgets. By offering one-time perpetual licensing with
                ₹0 recurring maintenance fees (T&C Apply), we align our success with our customers' long-term prosperity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. SECTION C: OUR APPROACH                                            */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              PRODUCT METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#0F172A]">
              How We Build at Fluxora
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#4F46E5]">PHASE 01</div>
              <h3 className="text-lg font-bold text-[#0F172A]">Understand Real Problems</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We spend time with real business managers, HR coordinators, and staff to uncover actual operational bottlenecks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#4F46E5]">PHASE 02</div>
              <h3 className="text-lg font-bold text-[#0F172A]">Design Practical Solutions</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We create minimal, intuitive interfaces that eliminate unnecessary steps and prioritize daily human speed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#4F46E5]">PHASE 03</div>
              <h3 className="text-lg font-bold text-[#0F172A]">Build Useful Digital Experiences</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We engineer on robust foundations (React, Supabase PostgreSQL, Node.js, Google Cloud) prioritizing uptime and data privacy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#4F46E5]">PHASE 04</div>
              <h3 className="text-lg font-bold text-[#0F172A]">Continuously Improve Products</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We deploy measured maintenance enhancements and listen closely to operational feedback from our customer community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. SECTION D: OUR PRODUCTS                                            */}
      {/* ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#0B0F19] text-[#F8F6F1]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              PRODUCT PORTFOLIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Software Crafted for Modern Work
            </h2>
            <p className="text-xs sm:text-sm text-white/70">
              Our flagship platforms designed to empower enterprise productivity.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12 backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono text-blue-300 uppercase tracking-wider">
                  FLAGSHIP PLATFORM
                </span>
                <h3 className="text-3xl font-bold text-white mt-1">FlowPeople</h3>
                <p className="text-xs text-white/60 mt-0.5">Human Resource Management System (HRMS)</p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-5 py-2 text-xs font-semibold text-white hover:bg-white transition"
              >
                <span>Visit FlowPeople Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
              An intelligent, modern HRMS that streamlines employee profiles, shift tracking, contactless
              biometric entrance kiosks, mobile 100m GPS geofencing, leave workflows, and compliance reporting
              under a predictable one-time perpetual license.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs text-white/70">
              <div>· Dedicated Database</div>
              <div>· Google Drive Sync</div>
              <div>· Contactless Kiosk</div>
              <div>· ₹0 Maintenance <span className="text-[10px] text-blue-200 opacity-80">(T&C Apply)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. SECTION E: OUR VISION & FINAL CTA WITH LUXURY GOLDEN TOUCH         */}
      {/* ===================================================================== */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E1B4B] text-[#F8F6F1] text-center overflow-hidden border-t-2 border-indigo-500/30 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)]">
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

        {/* Ambient Golden Radial Glow Halos */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] rounded-full bg-gradient-to-b from-[#2563EB]/25 via-[#4F46E5]/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 w-[400px] h-[250px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 space-y-6">
          {/* Opulent Luminous Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 via-white/15 to-indigo-500/20 border border-blue-400/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200 shadow-[0_4px_24px_rgba(79,70,229,0.2)] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>Our Vision · FLUXORA Technologies</span>
          </div>

          {/* Serif Headline with Gold Shimmer Accent */}
          <h2 className="serif-heading text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto drop-shadow-sm">
            Less Complexity.{' '}
            <span className="italic font-normal bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              More Possibility.
            </span>
          </h2>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F8F6F1]/90 font-light leading-relaxed drop-shadow-sm">
            We believe technology should make work simpler, businesses more capable and digital experiences
            more meaningful.
          </p>

          <div className="pt-6 sm:pt-8 space-y-5">
            <h3 className="serif-heading text-2xl sm:text-3xl font-semibold text-white tracking-wide">
              Have an Idea? Let's Build Something Meaningful.
            </h3>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-8 sm:px-10 py-4 text-sm sm:text-base font-bold shadow-xl shadow-indigo-500/25 hover:shadow-[0_12px_36px_rgba(212,175,55,0.45)] hover:scale-[1.03] transition-all border border-[#FFFDF9]/60 cursor-pointer"
              >
                <span>Contact Fluxora</span>
                <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-7 py-4 text-sm sm:text-base font-semibold text-white shadow-md backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Explore Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

