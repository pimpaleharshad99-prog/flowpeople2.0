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
    <div id="view-hub" className="relative w-full overflow-hidden bg-[#F8F6F1]">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION WITH GOLDEN-INFUSED LIGHTFALL ANIMATION                */}
      {/* ===================================================================== */}
      <section
        id="welcome-hero"
        className="relative min-h-[96vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#450705] text-[#F8F6F1] pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6"
      >
        {/* React Bits <Lightfall /> Component with Gold & Champagne Palette */}
        <div className="absolute inset-0 pointer-events-auto z-0 overflow-hidden">
          <Lightfall
            colors={['#FFE4B8', '#D4AF37', '#FFF5E4', '#E8D2B5', '#F5D061']}
            backgroundColor="#3D0604"
            speed={0.35}
            streakCount={3}
            streakWidth={1.5}
            twinkle={0.4}
            backgroundGlow={0.2}
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

        {/* Golden Radial Ambient Halos */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-[#D4AF37]/20 via-[#FFE4B8]/10 to-transparent blur-3xl z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3D0604]/40 via-transparent to-[#1F0302]/85 z-10" />

        {/* Center Content Stage */}
        <div className="relative z-20 mx-auto max-w-4xl text-center my-auto flex flex-col items-center pointer-events-none pt-4">
          {/* 3D FlowPeople Lockup with Golden Halo */}
          <div className="pointer-events-auto relative">
            <div className="absolute -inset-4 rounded-full bg-[#D4AF37]/20 blur-xl pointer-events-none" />
            <BrandLogo variant="hero3d" />
          </div>

          {/* Opulent Luminous Tagline Pill */}
          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-white/15 to-[#D4AF37]/20 border border-[#FFE4B8]/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFE4B8] shadow-[0_4px_24px_rgba(212,175,55,0.2)] backdrop-blur-xl pointer-events-auto">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>A Smarter Way to Manage Every Workday</span>
          </div>

          {/* Hero Main Headline with Gold Gradient Accent */}
          <h1 className="serif-heading mt-5 text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-semibold tracking-tight text-white leading-[1.06] max-w-4xl drop-shadow-[0_6px_28px_rgba(0,0,0,0.7)]">
            Next-Gen Attendance. <br />
            <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
              Effortless from Every Angle.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg md:text-xl text-[#F8F6F1]/90 font-light leading-relaxed drop-shadow-sm">
            Welcome your team with contactless facial recognition at the reception desk, or let mobile staff check in instantly within a verified 100m GPS geofence.
          </p>

          {/* Sculpted Experience Deck with Curved Contours */}
          <div className="mt-8 w-full max-w-xl rounded-[32px] sm:rounded-[40px] bg-[#F8F6F1]/95 p-4 sm:p-6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5),0_0_36px_rgba(212,175,55,0.18)] backdrop-blur-2xl border border-[#FFE4B8]/80 pointer-events-auto">
            <div className="flex items-center justify-between mb-3.5 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#590907] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                Choose Your Experience
              </span>
              <span className="text-xs text-[#242321]/70 font-semibold flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5 text-[#590907]" />
                Interactive Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1 Button Card */}
              <button
                type="button"
                onClick={() => navigate('/biometric-attendance')}
                className="group relative flex flex-col items-start justify-between rounded-[24px] bg-[#590907] text-[#F8F6F1] p-4 sm:p-5 text-left transition-all duration-300 hover:bg-[#6E0B09] hover:shadow-[0_12px_32px_rgba(89,9,7,0.4)] hover:-translate-y-0.5 border border-[#FFE4B8]/40 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-white/10 border border-[#FFE4B8]/40 flex items-center justify-center">
                      <ScanFace className="h-4 w-4 text-[#FFE4B8]" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">01 · Biometric</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#FFE4B8] transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-xs text-[#FFE4B8] font-medium leading-snug">
                  Reception Kiosk · 2-Sec Face Scan
                </div>
              </button>

              {/* Option 2 Button Card */}
              <button
                type="button"
                onClick={() => navigate('/gps-attendance')}
                className="group relative flex flex-col items-start justify-between rounded-[24px] bg-[#242321] text-[#F8F6F1] p-4 sm:p-5 text-left transition-all duration-300 hover:bg-[#33312E] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 border border-[#D4AF37]/35 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#299D68]/30 to-white/10 border border-white/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-[#299D68]" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">02 · GPS Geofence</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#299D68] transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-xs text-[#E8D2B5] font-medium leading-snug">
                  100m Office Zone · Mobile Tap
                </div>
              </button>
            </div>

            {/* Interactive Lightfall Warp Tip */}
            <div className="mt-3 text-center">
              <span className="text-xs text-[#242321]/70 font-medium">
                Hold pointer anywhere on background to engage warp lightfall
              </span>
            </div>
          </div>
        </div>

        {/* 4 Hero Footer Telemetry Cards (Sculpted Curves + Gold Accents) */}
        <div className="relative z-20 mx-auto max-w-6xl w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10 pointer-events-auto">
          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-white/90 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#590907]">01 / Dual Check-In</span>
            <p className="mt-1.5 text-sm sm:text-base font-bold text-[#242321]">Kiosk & Mobile GPS</p>
            <span className="text-xs text-[#242321]/75 leading-tight block mt-0.5">Face scan & geofenced mobile</span>
          </div>

          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-white/90 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#590907]">02 / Speed</span>
            <p className="mt-1.5 text-sm sm:text-base font-bold text-[#242321]">2-Second Match</p>
            <span className="text-xs text-[#242321]/75 leading-tight block mt-0.5">Zero queues at reception</span>
          </div>

          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-white/90 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#590907]">03 / Precision</span>
            <p className="mt-1.5 text-sm sm:text-base font-bold text-[#242321]">100m Radius</p>
            <span className="text-xs text-[#242321]/75 leading-tight block mt-0.5">Strict boundary verification</span>
          </div>

          <div className="hero-footer-box rounded-[24px] p-4 sm:p-5 text-left border border-white/90 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#590907]">04 / Engine</span>
            <p id="lightfallTelemetryState" className="mt-1.5 text-sm sm:text-base font-bold text-[#299D68] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#299D68] animate-pulse" />
              Active · Ready
            </p>
            <span className="text-xs text-[#242321]/75 leading-tight block mt-0.5">Live sync to HR record</span>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. "ATTENDANCE, YOUR WAY" DUAL SHOWCASE SECTION                        */}
      {/* ===================================================================== */}
      <section id="choose-attendance" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Section Header with Golden Luxury Accents */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8D2B5] to-[#FFE4B8] border border-[#D4AF37]/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#590907] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#590907]" />
            <span>Attendance Suite · Two Seamless Ways</span>
          </div>
          <h2 className="serif-heading text-4xl sm:text-6xl md:text-7xl font-semibold text-[#242321] leading-[1.08]">
            Attendance, <span className="italic font-normal bg-gradient-to-r from-[#590907] to-[#981C14] bg-clip-text text-transparent">Your Way.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#242321]/75 font-light leading-relaxed max-w-2xl mx-auto">
            Every team operates differently. Whether your staff gathers in a central headquarters or works on-site across campuses, FlowPeople gives you the flexibility of mounted biometric kiosk screens and geofenced mobile check-ins.
          </p>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* OPTION 01: BIOMETRIC ATTENDANCE CARD (POSH CURVES)                  */}
        {/* ------------------------------------------------------------------- */}
        <div id="option-biometric" className="frosted-showcase-card rounded-[40px] sm:rounded-[52px] p-7 sm:p-12 lg:p-16 mb-16 shadow-[0_24px_70px_-20px_rgba(89,9,7,0.15)] border border-[#E8D2B5] bg-white/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Narrative & Interactive Step Pills */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8D2B5]/80 border border-[#D4AF37]/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#590907]">
                <span>Option 01</span>
                <span>·</span>
                <span>Reception Terminal</span>
              </div>

              <div>
                <h3 className="serif-heading text-3xl sm:text-5xl font-semibold text-[#242321] leading-tight">
                  Biometric Attendance
                </h3>
                <p className="text-lg sm:text-xl font-medium text-[#590907] mt-1.5">
                  Simple. Secure. Contactless.
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#242321]/80 leading-relaxed font-light">
                Employees simply walk up to the mounted reception kiosk. Our neural vision engine detects their presence, verifies their identity in 2 seconds, and confirms their attendance directly into HR.
              </p>

              {/* Step Navigation Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6E645D]">
                  <span>Walkthrough Stages</span>
                  <button
                    type="button"
                    onClick={() => setBioAutoPlay(!bioAutoPlay)}
                    className="text-[#590907] hover:text-[#981C14] hover:underline font-bold transition-colors cursor-pointer"
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
                          ? 'bg-[#590907] text-[#F8F6F1] shadow-lg shadow-[#590907]/25 border border-[#FFE4B8]/40 scale-[1.02]'
                          : 'bg-white/90 text-[#242321] hover:bg-[#E8D2B5]/40 border border-black/5'
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
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#590907] text-[#F8F6F1] px-7 py-3.5 text-sm font-semibold hover:bg-[#6E0B09] transition shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explore Biometric Attendance</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Visual Stage & HUD with Sculpted Curves */}
            <div className="lg:col-span-7">
              <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-[#1E1D1B] aspect-[16/10] shadow-2xl border-2 border-[#E8D2B5]/50">
                <img
                  src={FP_IMAGES[activeBio.imgKey]}
                  alt={activeBio.caption}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />

                {/* Laser scan line overlay during scanning */}
                {bioStep === 2 && (
                  <div className="biometric-laser-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#299D68] to-transparent shadow-[0_0_20px_#299D68]" />
                )}

                {/* Glass HUD Overlay with Rounded Capsule Design */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 fp-kiosk-glass rounded-[24px] sm:rounded-full px-5 py-3.5 flex items-center justify-between text-[#F8F6F1] backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm">
                      <img src={FP_IMAGES.rahul_avatar} alt="Employee Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{activeBio.title}</div>
                      <div className="text-xs text-[#FFE4B8] font-medium">{activeBio.sub}</div>
                    </div>
                  </div>
                  {activeBio.confirmed ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-[#299D68] text-white text-xs px-4 py-1.5 font-bold shadow-md">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs text-[#FFE4B8] tabular-nums font-mono bg-black/40 px-3 py-1 rounded-full border border-white/10">09:02 AM</span>
                  )}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-[#242321]/70 font-medium">{activeBio.caption}</p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* OPTION 02: GPS ATTENDANCE CARD (POSH CURVES)                        */}
        {/* ------------------------------------------------------------------- */}
        <div id="option-gps" className="frosted-showcase-card rounded-[40px] sm:rounded-[52px] p-7 sm:p-12 lg:p-16 shadow-[0_24px_70px_-20px_rgba(36,35,33,0.15)] border border-[#E8D2B5] bg-white/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left: Visual Stage with Interactive Smartphone HUD */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-[#1E1D1B] aspect-[16/10] shadow-2xl border-2 border-[#E8D2B5]/50">
                <img
                  src={FP_IMAGES[activeGps.imgKey]}
                  alt={activeGps.caption}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />

                {/* Live Distance & Zone Pill */}
                <div className="absolute top-5 left-5 rounded-full bg-black/80 px-4 py-1.5 text-xs font-semibold text-[#FFE4B8] backdrop-blur-md border border-[#D4AF37]/40 shadow-lg">
                  {activeGps.dist} · {activeGps.zoneBadge}
                </div>

                {/* Smartphone HUD Card */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 fp-kiosk-glass rounded-[24px] p-5 text-[#F8F6F1] backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white text-sm">{activeGps.bannerTitle}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${activeGps.canTap ? 'bg-[#299D68] text-white shadow-sm' : 'bg-white/20 text-[#FFE4B8]'}`}>
                      {activeGps.stateLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#FFE4B8] mb-3.5 font-medium">{activeGps.bannerSub}</p>

                  {/* Interactive Button */}
                  {activeGps.canTap ? (
                    <button
                      type="button"
                      onClick={() => {
                        setGpsStep(3); // jump to confirmed
                        setGpsAutoPlay(false);
                      }}
                      className="btn-tap-pulse w-full rounded-full bg-[#299D68] text-white py-3 text-xs font-bold hover:bg-[#238758] transition shadow-lg cursor-pointer"
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
              <p className="mt-3 text-center text-xs text-[#242321]/70 font-medium">{activeGps.caption}</p>
            </div>

            {/* Right: Narrative & Step Pills */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8D2B5]/80 border border-[#D4AF37]/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#590907]">
                <span>Option 02</span>
                <span>·</span>
                <span>Mobile Geofence</span>
              </div>

              <div>
                <h3 className="serif-heading text-3xl sm:text-5xl font-semibold text-[#242321] leading-tight">
                  GPS Attendance
                </h3>
                <p className="text-lg sm:text-xl font-medium text-[#590907] mt-1.5">
                  100m Zone. Instant Tap.
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#242321]/80 leading-relaxed font-light">
                Allow mobile employees to mark attendance straight from their smartphone. The app automatically verifies they are within your configured 100m office zone before unlocking the check-in button.
              </p>

              {/* Step Navigation Pills */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6E645D]">
                  <span>Walkthrough Stages</span>
                  <button
                    type="button"
                    onClick={() => setGpsAutoPlay(!gpsAutoPlay)}
                    className="text-[#590907] hover:text-[#981C14] hover:underline font-bold transition-colors cursor-pointer"
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
                          ? 'bg-[#242321] text-[#F8F6F1] shadow-lg shadow-black/25 border border-[#D4AF37]/50 scale-[1.02]'
                          : 'bg-white/90 text-[#242321] hover:bg-[#E8D2B5]/40 border border-black/5'
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
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#242321] text-[#F8F6F1] px-7 py-3.5 text-sm font-semibold hover:bg-[#590907] transition shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explore GPS Attendance</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* CLOSING CTA BAND — ULTRA POSH CURVED DESIGN WITH GOLDEN TOUCHES     */}
        {/* ------------------------------------------------------------------- */}
        <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#590907] via-[#430604] to-[#1C0202] text-[#F8F6F1] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(89,9,7,0.5)] border-2 border-[#D4AF37]/35 mt-20">
          {/* Subtle Golden Glow Element */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-[#FFE4B8]/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFE4B8] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Modernise Your Attendance Suite</span>
            </div>

            <h3 className="serif-heading text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1]">
              Ready to modernise your <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
                workplace attendance?
              </span>
            </h3>

            <p className="text-base sm:text-lg text-[#F8F6F1]/85 font-light max-w-xl mx-auto leading-relaxed">
              Start with the front-desk kiosk, enable GPS for your mobile workforce, or run both simultaneously with zero recurring software fees (T&C Apply).
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => navigate('/biometric-attendance')}
                className="rounded-full bg-white text-[#590907] px-6 py-3.5 text-xs sm:text-sm font-bold hover:bg-[#FFE4B8] transition-all shadow-md hover:scale-[1.02] cursor-pointer"
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
                className="rounded-full bg-gradient-to-r from-[#FFE4B8] via-[#E8D2B5] to-[#D4AF37] text-[#3A1B12] px-6 py-3.5 text-xs sm:text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] cursor-pointer"
              >
                View One-Time Pricing
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact?type=Book%20a%20Demo')}
                className="rounded-full bg-white/15 text-white border border-[#FFE4B8]/40 px-6 py-3.5 text-xs sm:text-sm font-bold hover:bg-white/25 transition-all backdrop-blur-md hover:scale-[1.02] cursor-pointer"
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
