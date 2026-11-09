import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lightfall from '../components/Lightfall';
import BrandLogo from '../components/BrandLogo';
import { FP_IMAGES } from '../assets/fpImages';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ScanFace,
  Sparkles,
  MousePointerClick,
  Compass,
  Award,
  Clock,
  Layers
} from 'lucide-react';

const BIO_STEPS = [
  {
    imgKey: 'bio_entrance',
    title: 'Ready at Entrance',
    sub: 'Modern Office Reception Kiosk',
    caption: '01 · Sunlit Executive Entrance & Kiosk Wake',
    confirmed: false,
    label: '01 · Approach'
  },
  {
    imgKey: 'bio_entrance',
    title: 'Employee Approaching',
    sub: 'Proximity detection in 0.5s',
    caption: '02 · Contactless Wake on Proximity',
    confirmed: false,
    label: '02 · Detect'
  },
  {
    imgKey: 'bio_scan',
    title: 'Neural Vision Match · 99.4%',
    sub: 'Sub-second biometric match',
    caption: '03 · Instant Neural Face Verification',
    confirmed: false,
    label: '03 · Verify'
  },
  {
    imgKey: 'bio_confirm',
    title: 'Attendance Recorded',
    sub: 'Rahul Sharma · 09:02 AM',
    caption: '04 · Live Sync to Enterprise HR Records',
    confirmed: true,
    label: '04 · Confirmed'
  }
];

const GPS_STEPS = [
  {
    imgKey: 'gps_approach',
    dist: '140m away',
    pinX: 24,
    pinY: 68,
    zoneBadge: 'Outside Zone',
    island: 'Approaching',
    bannerTitle: 'Outside Workplace Boundary',
    bannerSub: 'Step within your office 100m geofence',
    stateLabel: 'Gated',
    btnText: 'Check-in Gated (Outside Zone)',
    canTap: false,
    caption: '01 · Approaching Workplace Perimeter'
  },
  {
    imgKey: 'gps_map',
    dist: '32m inside',
    pinX: 66,
    pinY: 48,
    zoneBadge: 'Verified 100m Zone',
    island: 'Inside Boundary',
    bannerTitle: "You're Within Attendance Zone",
    bannerSub: 'Satellite & Wi-Fi Location Confirmed',
    stateLabel: 'Unlocked',
    btnText: 'Tap to Check In',
    canTap: true,
    caption: '02 · Location Verified · Instant Unlock'
  },
  {
    imgKey: 'gps_iphone18',
    dist: '18m inside',
    pinX: 72,
    pinY: 45,
    zoneBadge: 'Ready to Mark',
    island: 'One-Tap Ready',
    bannerTitle: "Ready for Daily Check-In",
    bannerSub: 'Single tap confirms time & location',
    stateLabel: 'Ready',
    btnText: 'Tap to Record Attendance',
    canTap: true,
    caption: '03 · Native Smartphone Fluid Tap'
  },
  {
    imgKey: 'gps_confirm',
    dist: 'At Desk (0m)',
    pinX: 75,
    pinY: 42,
    zoneBadge: 'Recorded Live',
    island: 'Checked In',
    bannerTitle: 'Attendance Confirmed · 09:02 AM',
    bannerSub: 'Synced instantly to HR dashboard',
    stateLabel: 'Recorded',
    btnText: '✓ Recorded · 09:02 AM',
    canTap: false,
    caption: '04 · Instant Sync & Audit Log Generated'
  }
];

export default function LandingHubPage() {
  const navigate = useNavigate();

  // Biometric Option State
  const [bioStep, setBioStep] = useState(0);
  const [bioAutoPlay, setBioAutoPlay] = useState(true);

  // GPS Option State
  const [gpsStep, setGpsStep] = useState(0);
  const [gpsAutoPlay, setGpsAutoPlay] = useState(true);

  // Auto-cycle for Biometric preview
  useEffect(() => {
    if (!bioAutoPlay) return;
    const timer = setInterval(() => {
      setBioStep((prev) => (prev + 1) % BIO_STEPS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [bioAutoPlay]);

  // Auto-cycle for GPS preview
  useEffect(() => {
    if (!gpsAutoPlay) return;
    if (gpsStep === 2) return; // pause at tap step for user trial
    const timer = setInterval(() => {
      setGpsStep((prev) => (prev + 1) % GPS_STEPS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [gpsAutoPlay, gpsStep]);

  const activeBio = BIO_STEPS[bioStep];
  const activeGps = GPS_STEPS[gpsStep];

  return (
    <div id="view-hub" className="relative w-full overflow-hidden bg-[#F8FAFC]">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION WITH LIGHTFALL ANIMATION (TECH BLUE & INDIGO)        */}
      {/* ===================================================================== */}
      <section
        id="welcome-hero"
        className="relative min-h-[96vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#0B0F19] text-[#F8FAFC] pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6"
      >
        {/* React Bits <Lightfall /> Component with Blue & Cyan Electric Palette */}
        <div className="absolute inset-0 pointer-events-auto z-0 overflow-hidden">
          <Lightfall
            colors={['#60A5FA', '#818CF8', '#38BDF8', '#C7D2FE', '#FFFFFF']}
            backgroundColor="#0B0F19"
            speed={0.35}
            streakCount={3}
            streakWidth={1.5}
            twinkle={0.4}
            backgroundGlow={0.25}
            headGlow={0.75}
            bloom={0.45}
            mouseInteraction={true}
            holdToWarp={true}
            intro={true}
            streakLength={1.6}
            density={0.75}
            className="w-full h-full"
          />
        </div>

        {/* Indigo & Blue Radial Ambient Halos */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-[#2563EB]/25 via-[#4F46E5]/15 to-transparent blur-3xl z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/40 via-transparent to-[#0B0F19]/90 z-10" />

        {/* Center Content Stage */}
        <div className="relative z-20 mx-auto max-w-4xl text-center my-auto flex flex-col items-center pointer-events-none pt-4">
          {/* 3D FlowPeople Lockup with Halo */}
          <div className="pointer-events-auto relative">
            <div className="absolute -inset-4 rounded-full bg-[#4F46E5]/25 blur-xl pointer-events-none" />
            <BrandLogo variant="hero3d" />
          </div>

          {/* Luminous Tagline Pill */}
          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 border border-blue-400/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200 shadow-[0_4px_24px_rgba(37,99,235,0.2)] backdrop-blur-xl pointer-events-auto">
            <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>A Smarter Way to Manage Every Workday</span>
          </div>

          {/* Hero Main Headline with Cyan/Blue Accent */}
          <h1 className="mt-6 text-5xl sm:text-7xl md:text-8xl lg:text-[84px] font-extrabold tracking-tight text-white leading-[1.04] max-w-5xl drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
            Next-Gen Attendance. <br />
            <span className="font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Effortless from Every Angle.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg sm:text-xl md:text-2xl text-slate-200 font-normal leading-relaxed drop-shadow-md">
            Welcome your team with contactless facial recognition at the reception desk, or let mobile staff check in instantly within a verified 100m GPS geofence.
          </p>

          {/* Sculpted Experience Deck with Modern Enterprise Styling */}
          <div className="mt-8 w-full max-w-xl rounded-[32px] sm:rounded-[40px] bg-white/95 p-4 sm:p-6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5),0_0_36px_rgba(79,70,229,0.18)] backdrop-blur-2xl border border-indigo-100 pointer-events-auto">
            <div className="flex items-center justify-between mb-3.5 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
                Choose Your Experience
              </span>
              <span className="text-xs text-[#64748B] font-semibold flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5 text-[#4F46E5]" />
                Interactive Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1 Button Card */}
              <button
                type="button"
                onClick={() => navigate('/biometric-attendance')}
                className="group relative flex flex-col items-start justify-between rounded-[24px] bg-[#4F46E5] text-white p-4 sm:p-5 text-left transition-all duration-300 hover:bg-[#4338CA] hover:shadow-[0_12px_32px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 border border-indigo-300/40 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400/30 to-white/10 border border-indigo-200/40 flex items-center justify-center">
                      <ScanFace className="h-4 w-4 text-blue-200" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">01 · Biometric</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-xs text-indigo-100 font-medium leading-snug">
                  Reception Kiosk · 2-Sec Face Scan
                </div>
              </button>

              {/* Option 2 Button Card */}
              <button
                type="button"
                onClick={() => navigate('/gps-attendance')}
                className="group relative flex flex-col items-start justify-between rounded-[24px] bg-[#0F172A] text-white p-4 sm:p-5 text-left transition-all duration-300 hover:bg-[#1E293B] hover:shadow-[0_12px_32px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 border border-blue-400/30 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-white/10 border border-white/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-[#38BDF8]" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">02 · GPS Geofence</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#38BDF8] transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-xs text-blue-200 font-medium leading-snug">
                  100m Office Zone · Mobile Tap
                </div>
              </button>
            </div>

            {/* Interactive Lightfall Warp Tip */}
            <div className="mt-3 text-center">
              <span className="text-xs text-[#64748B] font-medium">
                Hold pointer anywhere on background to engage warp lightfall
              </span>
            </div>
          </div>
        </div>

        {/* 4 Hero Footer Telemetry Cards */}
        <div className="relative z-20 mx-auto max-w-6xl w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 pointer-events-auto">
          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-slate-200/80 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">01 / Dual Check-In</span>
            <p className="mt-1.5 text-sm sm:text-base font-bold text-[#0F172A]">Kiosk & Mobile GPS</p>
            <span className="text-xs text-[#64748B] leading-tight block mt-0.5">Face scan & geofenced mobile</span>
          </div>

          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-slate-200/80 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">02 / Speed</span>
            <p className="mt-1.5 text-sm sm:text-base font-bold text-[#0F172A]">2-Second Match</p>
            <span className="text-xs text-[#64748B] leading-tight block mt-0.5">Zero queues at reception</span>
          </div>

          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-slate-200/80 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">03 / Precision</span>
            <p className="mt-1.5 text-sm sm:text-base font-bold text-[#0F172A]">100m Radius</p>
            <span className="text-xs text-[#64748B] leading-tight block mt-0.5">Strict boundary verification</span>
          </div>

          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-slate-200/80 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">04 / Engine</span>
            <p id="lightfallTelemetryState" className="mt-1.5 text-sm sm:text-base font-bold text-[#10B981] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              Active · Ready
            </p>
            <span className="text-xs text-[#64748B] leading-tight block mt-0.5">Live sync to HR record</span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. "ATTENDANCE, YOUR WAY" DUAL SHOWCASE SECTION                        */}
      {/* ===================================================================== */}
      <section id="choose-attendance" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Section Header with Tech Blue/Indigo Accents */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4F46E5] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
            <span>Attendance Suite · Two Seamless Ways</span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#0F172A] leading-[1.08] tracking-tight">
            Attendance, <span className="font-extrabold bg-gradient-to-r from-[#2563EB] to-[#4F46E5] bg-clip-text text-transparent">Your Way.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Every team operates differently. Whether your staff gathers in a central headquarters or works on-site across campuses, FlowPeople gives you the flexibility of mounted biometric kiosk screens and geofenced mobile check-ins.
          </p>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* OPTION 01: BIOMETRIC ATTENDANCE CARD (POSH CURVES)                  */}
        {/* ------------------------------------------------------------------- */}
        <div id="option-biometric" className="frosted-showcase-card rounded-[40px] sm:rounded-[52px] p-7 sm:p-12 lg:p-16 mb-16 shadow-[0_24px_70px_-20px_rgba(79,70,229,0.12)] border border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Narrative & Interactive Step Pills */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                <span>Option 01</span>
                <span>·</span>
                <span>Reception Terminal</span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                  Biometric Attendance
                </h3>
                <p className="text-lg sm:text-xl font-semibold text-[#4F46E5] mt-1.5">
                  Simple. Secure. Contactless.
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal">
                Employees simply walk up to the mounted reception kiosk. Our neural vision engine detects their presence, verifies their identity in 2 seconds, and confirms their attendance directly into HR.
              </p>

              {/* Step Navigation Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                  <span>Walkthrough Stages</span>
                  <button
                    type="button"
                    onClick={() => setBioAutoPlay(!bioAutoPlay)}
                    className="text-[#4F46E5] hover:text-[#4338CA] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    {bioAutoPlay ? 'Pause Auto-Cycle' : 'Resume Auto-Cycle'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {BIO_STEPS.map((st, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBioStep(idx);
                        setBioAutoPlay(false);
                      }}
                      className={`rounded-[20px] px-3.5 py-3 text-left text-xs transition-all font-medium cursor-pointer ${
                        bioStep === idx
                          ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/25 border border-indigo-300/40 scale-[1.02]'
                          : 'bg-slate-50 text-[#0F172A] hover:bg-indigo-50/50 border border-slate-200'
                      }`}
                    >
                      <div className="font-bold">{st.label}</div>
                      <div className="text-xs opacity-85 truncate mt-0.5">{st.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/biometric-attendance')}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#4F46E5] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#4338CA] transition shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explore Biometric Attendance</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Visual Stage & HUD with Sculpted Curves */}
            <div className="lg:col-span-7">
              <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-slate-900 aspect-[16/10] shadow-2xl border-2 border-slate-700/60">
                <img
                  src={FP_IMAGES[activeBio.imgKey]}
                  alt={activeBio.caption}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />

                {/* Laser scan line overlay during scanning */}
                {bioStep === 2 && (
                  <div className="biometric-laser-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent shadow-[0_0_20px_#10B981]" />
                )}

                {/* Glass HUD Overlay with Rounded Capsule Design */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 fp-kiosk-glass rounded-[24px] sm:rounded-full px-5 py-3.5 flex items-center justify-between text-white backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[#38BDF8] shadow-sm">
                      <img src={FP_IMAGES.rahul_avatar} alt="Employee Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{activeBio.title}</div>
                      <div className="text-xs text-blue-200 font-medium">{activeBio.sub}</div>
                    </div>
                  </div>
                  {activeBio.confirmed ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-[#10B981] text-white text-xs px-4 py-1.5 font-bold shadow-md">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs text-blue-200 tabular-nums font-mono bg-black/40 px-3 py-1 rounded-full border border-white/10">09:02 AM</span>
                  )}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-[#64748B] font-medium">{activeBio.caption}</p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* OPTION 02: GPS ATTENDANCE CARD (POSH CURVES)                        */}
        {/* ------------------------------------------------------------------- */}
        <div id="option-gps" className="frosted-showcase-card rounded-[40px] sm:rounded-[52px] p-7 sm:p-12 lg:p-16 shadow-[0_24px_70px_-20px_rgba(37,99,235,0.12)] border border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Visual Stage with Interactive Smartphone HUD */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-slate-900 aspect-[16/10] shadow-2xl border-2 border-slate-700/60">
                <img
                  src={FP_IMAGES[activeGps.imgKey]}
                  alt={activeGps.caption}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />

                {/* Live Distance & Zone Pill */}
                <div className="absolute top-5 left-5 rounded-full bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-md border border-blue-400/30 shadow-lg">
                  {activeGps.dist} · {activeGps.zoneBadge}
                </div>

                {/* Smartphone HUD Card */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 fp-kiosk-glass rounded-[24px] p-5 text-white backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white text-sm">{activeGps.bannerTitle}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${activeGps.canTap ? 'bg-[#10B981] text-white shadow-sm' : 'bg-white/20 text-blue-200'}`}>
                      {activeGps.stateLabel}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mb-3.5 font-medium">{activeGps.bannerSub}</p>

                  {/* Interactive Button */}
                  {activeGps.canTap ? (
                    <button
                      type="button"
                      onClick={() => {
                        setGpsStep(3); // jump to confirmed
                        setGpsAutoPlay(false);
                      }}
                      className="btn-tap-pulse w-full rounded-full bg-[#10B981] text-white py-3 text-xs font-bold hover:bg-[#059669] transition shadow-lg cursor-pointer"
                    >
                      {activeGps.btnText}
                    </button>
                  ) : (
                    <div className="w-full rounded-full bg-white/10 text-white/50 py-3 text-xs font-semibold text-center border border-white/5">
                      {activeGps.btnText}
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-[#64748B] font-medium">{activeGps.caption}</p>
            </div>

            {/* Right: Narrative & Step Pills */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                <span>Option 02</span>
                <span>·</span>
                <span>Mobile Geofence</span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                  GPS Attendance
                </h3>
                <p className="text-lg sm:text-xl font-semibold text-[#2563EB] mt-1.5">
                  100m Zone. Instant Tap.
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal">
                Allow mobile employees to mark attendance straight from their smartphone. The app automatically verifies they are within your configured 100m office zone before unlocking the check-in button.
              </p>

              {/* Step Navigation Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                  <span>Walkthrough Stages</span>
                  <button
                    type="button"
                    onClick={() => setGpsAutoPlay(!gpsAutoPlay)}
                    className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    {gpsAutoPlay ? 'Pause Auto-Cycle' : 'Resume Auto-Cycle'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {GPS_STEPS.map((st, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setGpsStep(idx);
                        setGpsAutoPlay(false);
                      }}
                      className={`rounded-[20px] px-3.5 py-3 text-left text-xs transition-all font-medium cursor-pointer ${
                        gpsStep === idx
                          ? 'bg-[#0F172A] text-white shadow-lg shadow-slate-900/25 border border-blue-400/50 scale-[1.02]'
                          : 'bg-slate-50 text-[#0F172A] hover:bg-blue-50/50 border border-slate-200'
                      }`}
                    >
                      <div className="font-bold">Stage {idx + 1}</div>
                      <div className="text-xs opacity-85 truncate mt-0.5">{st.island}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/gps-attendance')}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#0F172A] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#1E293B] transition shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explore GPS Attendance</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* CLOSING CTA BAND — ENTERPRISE TECH BLUE & INDIGO                    */}
        {/* ------------------------------------------------------------------- */}
        <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E1B4B] text-white p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(79,70,229,0.35)] border-2 border-indigo-500/30 mt-20">
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

          {/* Subtle Blue Glow Element */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-blue-400/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Modernise Your Attendance Suite</span>
            </div>

            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Ready to modernise your <br className="hidden sm:inline" />
              <span className="font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                workplace attendance?
              </span>
            </h3>

            <p className="text-base sm:text-lg text-slate-200 font-normal max-w-xl mx-auto leading-relaxed">
              Start with the front-desk kiosk, enable GPS for your mobile workforce, or run both simultaneously with zero recurring software fees (T&C Apply).
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => navigate('/biometric-attendance')}
                className="rounded-full bg-[#4F46E5] text-white px-6 py-3.5 text-xs sm:text-sm font-bold hover:bg-[#4338CA] transition-all shadow-md hover:scale-[1.02] cursor-pointer"
              >
                Explore Biometric Kiosk
              </button>
              <button
                type="button"
                onClick={() => navigate('/gps-attendance')}
                className="rounded-full bg-transparent border-2 border-white/80 text-white px-6 py-3.5 text-xs sm:text-sm font-bold hover:bg-white/15 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Explore GPS Attendance
              </button>
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="rounded-full bg-white text-[#0F172A] px-6 py-3.5 text-xs sm:text-sm font-bold hover:bg-blue-50 transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                View One-Time Pricing
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact?type=Book%20a%20Demo')}
                className="rounded-full bg-white/15 text-white border border-blue-400/40 px-6 py-3.5 text-xs sm:text-sm font-bold hover:bg-white/25 transition-all backdrop-blur-md hover:scale-[1.02] cursor-pointer"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
