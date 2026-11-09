import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FP_IMAGES } from '../assets/fpImages';
import BrandLogo from '../components/BrandLogo';
import Lightfall from '../components/Lightfall';
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Navigation,
  Clock,
  Radio,
  FileText,
  CalendarCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const GPS_SCENES = [
  {
    imgKey: 'gps_office',
    tag: 'Scene 1 · Office Zone',
    head: 'Your Workplace. Your Attendance Zone.',
    zone: '100m GPS Zone Configured',
    loc: 'Main Office',
    state: 'Awaiting Arrival',
    btn: 'Outside Attendance Zone (Disabled)',
    canTap: false,
    distance: '145m from office · Approaching',
    pinX: 180,
    pinY: 110,
    island: 'Approaching Office',
    sub: 'HR defines a precise 100m geofence around your workplace. Employees on the approach are tracked automatically.'
  },
  {
    imgKey: 'gps_approach',
    tag: 'Scene 2 · Outside Geofence',
    head: 'Approaching the Office Perimeter.',
    zone: 'Outside Attendance Zone',
    loc: 'Approaching (115m)',
    state: 'Disabled',
    btn: 'Check-in Disabled (Outside 100m)',
    canTap: false,
    distance: '115m Away — Outside Zone',
    pinX: 160,
    pinY: 95,
    island: 'Outside Geofence',
    sub: 'To prevent remote check-in fraud, the mobile check-in action remains securely locked until the employee is physically within 100m.'
  },
  {
    imgKey: 'gps_map',
    tag: 'Scene 3 · Entering 100m Zone',
    head: 'Inside Permitted Boundary · Check-in Unlocked.',
    zone: "You're Within the Attendance Zone",
    loc: 'Location Verified (24m)',
    state: 'Unlocked',
    btn: 'Tap to Check in · Main Office',
    canTap: true,
    distance: 'Inside 100m Zone · 24m away',
    pinX: 140,
    pinY: 82,
    island: 'In 100m Zone',
    sub: 'Precision device GPS coordinates match your corporate premises. The button immediately turns luminous green, ready for a single tap.'
  },
  {
    imgKey: 'gps_iphone18',
    tag: 'Scene 4 · Check-in Enabled',
    head: 'Your Check-in. Ready When You Are.',
    zone: "You're Within the Attendance Zone",
    loc: 'Location Verified',
    state: 'Enabled',
    btn: 'Tap to Check In Now',
    canTap: true,
    distance: 'Inside 100m Zone · 18m away',
    pinX: 136,
    pinY: 80,
    island: 'Ready to Tap',
    sub: 'No queues. No touchscreens. A single tap on the employee’s personal smartphone securely authenticates their arrival.'
  },
  {
    imgKey: 'gps_confirm',
    tag: 'Scene 5 · Attendance Marked',
    head: 'Checked In. Synced with HR Live.',
    zone: 'Check-in Successful · 09:02 AM',
    loc: 'Rahul Sharma · Present',
    state: 'Synced to HR Dashboard',
    btn: '✓ Checked In · 09:02 AM · On Time',
    canTap: false,
    distance: 'At Desk · 0m',
    pinX: 144,
    pinY: 78,
    island: 'Checked In · 09:02 AM',
    sub: 'The check-in timestamp and geofence verification are recorded instantly to your company dashboard with zero human intervention.'
  }
];

export default function GpsAttendancePage() {
  const navigate = useNavigate();
  const [sceneIdx, setSceneIdx] = useState(3); // Stage 4: Check-in Enabled by default
  const [autoPlay, setAutoPlay] = useState(false);

  // Status Card Try-A-Checkin interactive state
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusCheckedIn, setStatusCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:02 AM');

  // Hero slide toggle (Biometric vs GPS)
  const [activeMode, setActiveMode] = useState('gps');

  const curScene = GPS_SCENES[sceneIdx];

  // Auto-play for the 5-stage showroom
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % GPS_SCENES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const handleTryCheckIn = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setStatusCheckedIn(false);

    setTimeout(() => {
      setIsVerifying(false);
      setStatusCheckedIn(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
      setSceneIdx(4); // Advance to confirmed stage
    }, 1800);
  };

  // 3D Card tilt effect handler
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* ===================================================================== */}
      {/* 1. DARK GLASS SHOWROOM: 5-STAGE GPS SIMULATOR (#view-gps)             */}
      {/* ===================================================================== */}
      <section className="relative min-h-[92vh] sm:min-h-screen w-full bg-[#0B0F19] overflow-hidden flex items-center pt-28 sm:pt-36 pb-16 px-4 sm:px-8 text-[#F8F6F1]">
        {/* Background Ambient Cinema Plate */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          <img
            src={FP_IMAGES[curScene.imgKey]}
            alt={curScene.tag}
            className="w-full h-full object-cover blur-sm scale-105 transition-all duration-700"
          />
        </div>

        {/* Gradient vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(24,23,21,0.92) 0%, rgba(24,23,21,0.52) 55%, rgba(24,23,21,0.78) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Narrative & 5-Stage Step Controls */}
          <div className="max-w-2xl lg:max-w-2xl text-[#F8F6F1] space-y-6">
            {/* Zone Status Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-400/40 bg-white/10 px-4 py-1.5 backdrop-blur-xl shadow-md">
              <MapPin className="h-4 w-4 text-[#299D68]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200">
                Main Office · 100m Precision Geofence
              </span>
            </div>

            {/* Live GPS Coordinates Badge */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#299D68] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#299D68]"></span>
              </span>
              <span className="text-xs font-mono font-medium text-blue-300">
                19.0760° N · 72.8777° E · 100m Geofence Active
              </span>
            </div>

            {/* Dynamic Headline & Narrative */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2.5">
                {curScene.tag} · {curScene.distance}
              </div>
              <h1 className="serif-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white drop-shadow-md">
                {curScene.head}
              </h1>
              <p className="mt-5 text-base sm:text-lg md:text-xl text-[#F8F6F1] font-normal leading-relaxed drop-shadow-sm">
                {curScene.sub}
              </p>
            </div>

            {/* 5-Scene Interactive Pills */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-[#A5A79B] mb-2.5">
                <span>Interactive Geofence Stages</span>
                <button
                  type="button"
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="text-blue-200 hover:underline font-semibold"
                >
                  {autoPlay ? 'Pause Auto-Play' : 'Auto-Play Stages'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {GPS_SCENES.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSceneIdx(idx);
                      setAutoPlay(false);
                    }}
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                      sceneIdx === idx
                        ? 'bg-[#4F46E5] text-[#F8FAFC] shadow-lg border border-indigo-400/50 scale-105'
                        : 'bg-white/10 text-[#F8F6F1] hover:bg-white/20'
                    }`}
                  >
                    Stage {idx + 1}: {sc.tag.split('·')[1]?.trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation CTA Buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full bg-[#F8FAFC] px-6 py-3 text-xs sm:text-sm font-semibold text-[#4F46E5] shadow-md hover:bg-white transition"
              >
                ← Back to Main Hub
              </Link>
              <Link
                to="/biometric-attendance"
                className="rounded-full border border-white/35 px-6 py-3 text-xs sm:text-sm font-semibold text-[#F8F6F1] hover:bg-white/10 transition"
              >
                Switch to Biometric Attendance →
              </Link>
            </div>
          </div>

          {/* Right: Ultra-Bezel-less Desert Titanium iPhone 18 Pro Max Chassis */}
          <div className="relative w-full max-w-sm rounded-[54px] p-3.5 bg-gradient-to-b from-[#bfa286] via-[#8c745d] to-[#45372b] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_3px_rgba(255,255,255,0.4)] border border-[#dfc2a6]/50">
            <div className="rounded-[44px] overflow-hidden bg-[#F8FAFC] text-[#0F172A] p-4 pt-3 flex flex-col justify-between aspect-[9/19.5] shadow-inner relative">
              {/* Top Dynamic Island */}
              <div>
                <div className="flex items-center justify-between px-3 pt-0.5">
                  <span className="text-xs font-bold tabular-nums font-mono">9:02</span>
                  <div className="flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 shadow-md">
                    <span className="h-2 w-2 rounded-full bg-[#299D68] animate-pulse"></span>
                    <span className="text-[10px] font-semibold text-blue-200">{curScene.island}</span>
                  </div>
                  <span className="text-[10px] font-bold">5G</span>
                </div>

                {/* FlowPeople App Header */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <BrandLogo variant="navbar" />
                  <span className="rounded-full bg-[#EEF2FF]/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#4F46E5]">
                    Office Geofence
                  </span>
                </div>
              </div>

              {/* Live Map with 100m Geofence Ring and Pulsing Employee Pin */}
              <div className="relative my-3 h-52 w-full overflow-hidden rounded-2xl bg-[#0B0F19] shadow-inner">
                <img
                  src={FP_IMAGES.gps_map}
                  alt="GPS Zone Map"
                  className="h-full w-full object-cover opacity-85"
                />

                {/* SVG 100m Geofence Circle & Pin */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 165" fill="none">
                  {/* 100m Geofence Perimeter */}
                  <circle
                    cx="144"
                    cy="78"
                    r="44"
                    fill="#299D68"
                    fillOpacity="0.18"
                    stroke="#299D68"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-pulse-ring"
                  />
                  {/* Office Center Core */}
                  <circle cx="144" cy="78" r="8" fill="#4F46E5" stroke="#38BDF8" strokeWidth="2" />

                  {/* Employee Live Position Pin */}
                  <circle
                    cx={curScene.pinX}
                    cy={curScene.pinY}
                    r="6.5"
                    fill="#299D68"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-all duration-700 shadow-lg"
                  />
                </svg>

                {/* Live Distance overlay pill */}
                <div className="absolute top-2 left-2 rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-semibold text-blue-200 backdrop-blur-md">
                  {curScene.distance}
                </div>
              </div>

              {/* Interactive Status Card inside Smartphone */}
              <div className="space-y-2.5 rounded-2xl bg-white p-3.5 shadow-md border border-slate-200">
                <div className="rounded-xl bg-[#EEF2FF]/50 px-3 py-1.5 text-center text-xs font-semibold text-[#4F46E5]">
                  {curScene.zone}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#A5A79B]">Location</span>
                    <span className="font-semibold text-[#4F46E5]">{curScene.loc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A5A79B]">Office Zone</span>
                    <span className="font-semibold text-[#0F172A]">HQ · 100m Radius</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A5A79B]">Engine State</span>
                    <span className="font-semibold text-[#299D68]">{curScene.state}</span>
                  </div>
                </div>

                {/* Interactive Check-in Button */}
                {curScene.canTap ? (
                  <button
                    type="button"
                    onClick={() => setSceneIdx(4)}
                    className="btn-tap-pulse w-full rounded-xl bg-[#299D68] py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#299D68]/90 cursor-pointer"
                  >
                    {curScene.btn}
                  </button>
                ) : (
                  <div className={`w-full rounded-xl py-3 text-xs font-semibold text-center transition ${
                    sceneIdx === 4
                      ? 'bg-[#299D68] text-white shadow-md'
                      : 'bg-[#D8D9D0]/60 text-[#A5A79B] cursor-not-allowed'
                  }`}>
                    {curScene.btn}
                  </div>
                )}
              </div>

              {/* Bottom Home Indicator */}
              <div className="mt-2 flex justify-center">
                <div className="h-1 w-28 rounded-full bg-[#242321]/30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. INTERACTIVE CHECK-IN WIDGET & 3D TILT CARDS (FROM FILE 2)          */}
      {/* ===================================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Mode Switcher Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4F46E5] mb-3">
            <Radio className="h-3.5 w-3.5" />
            <span>Interactive Live Simulation</span>
          </div>
          <h2 className="serif-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-[#0F172A] leading-[1.08]">
            Right Place. <span className="italic text-[#4F46E5]">Right Time.</span>
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-[#0F172A] font-medium max-w-3xl mx-auto leading-relaxed">
            Test how FlowPeople verifies your location in real time. Click the status card below to simulate an instant check-in.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="mt-6 inline-flex rounded-full bg-white p-1.5 shadow-sm border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveMode('gps')}
              className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                activeMode === 'gps'
                  ? 'bg-[#4F46E5] text-[#F8FAFC] shadow-sm'
                  : 'text-[#0F172A] hover:text-[#4F46E5]'
              }`}
            >
              GPS Office Zone (Active)
            </button>
            <button
              type="button"
              onClick={() => navigate('/biometric-attendance')}
              className="rounded-full px-5 py-2 text-xs font-semibold text-[#0F172A] hover:text-[#4F46E5] transition"
            >
              Biometric Kiosk →
            </button>
          </div>
        </div>

        {/* Interactive Try-A-Checkin Live Status Card */}
        <div className="max-w-xl mx-auto mb-20">
          <div
            id="status"
            role="button"
            tabIndex={0}
            onClick={handleTryCheckIn}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTryCheckIn();
              }
            }}
            className="group cursor-pointer rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 transition-all hover:shadow-2xl hover:border-[#4F46E5]/40 relative overflow-hidden"
          >
            {/* Luminous Glow when verifying */}
            {isVerifying && (
              <div className="absolute inset-0 bg-[#EEF2FF]/30 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${isVerifying ? 'bg-amber-500 animate-ping' : 'bg-[#299D68]'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  {isVerifying ? 'Verifying GPS Coordinates…' : 'Office 100m Zone Active'}
                </span>
              </div>
              <span className="text-xs text-[#A5A79B] font-mono">GPS · 5G</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-[#0F172A]">
                {isVerifying ? 'Checking your location…' : 'Inside the office zone'}
              </h3>
              <p className="text-sm text-[#299D68] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                {isVerifying ? 'Please hold on…' : `✓ Checked in · ${checkInTime} · Inside 100m Zone`}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-[#A5A79B]">
              <span className="font-medium text-[#4F46E5] group-hover:underline">
                {isVerifying ? 'Verifying…' : 'Tap to test another check-in →'}
              </span>
              <span>Coordinates: 19.0760° N, 72.8777° E</span>
            </div>
          </div>
        </div>

        {/* 3D Mouse-Tilt Feature Cards */}
        <div id="services" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A]">100m Geofence Precision</h4>
            <p className="mt-2 text-sm text-[#0F172A]/75 leading-relaxed">
              Define the boundary of your office building. Check-ins are strictly allowed only when within the verified circle.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-4">
              <Smartphone className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A]">Zero Hardware Required</h4>
            <p className="mt-2 text-sm text-[#0F172A]/75 leading-relaxed">
              No badge readers or fingerprint scanners. Employees mark attendance directly on their iOS or Android smartphones.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A]">Real-Time Sync</h4>
            <p className="mt-2 text-sm text-[#0F172A]/75 leading-relaxed">
              Timestamps hit the manager dashboard the second they are verified, with zero latency or manual data entry.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-4">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A]">Leaves & Requests</h4>
            <p className="mt-2 text-sm text-[#0F172A]/75 leading-relaxed">
              Apply for sick days or PTO directly in the flow. Managers approve in one click without leaving their chat or email.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A]">Exportable Reports</h4>
            <p className="mt-2 text-sm text-[#0F172A]/75 leading-relaxed">
              Generate payroll-ready CSV and PDF attendance summaries with one click at the end of each billing cycle.
            </p>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="tilt-card rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200"
          >
            <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A]">Anti-Spoof Security</h4>
            <p className="mt-2 text-sm text-[#0F172A]/75 leading-relaxed">
              Hardware-backed location telemetry detects VPNs and mock location apps, guaranteeing true physical presence.
            </p>
          </div>
        </div>

        {/* Demo Booking Band with Opulent Golden Touch */}
        <div id="contact" className="mt-20 rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E1B4B] text-[#F8F6F1] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(89,9,7,0.5),0_0_40px_rgba(212,175,55,0.18)] border-2 border-indigo-500/30 max-w-5xl mx-auto">
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

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 via-white/15 to-indigo-500/20 border border-blue-400/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200 shadow-[0_4px_24px_rgba(79,70,229,0.2)] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>100m Precision Geofencing</span>
            </div>

            <h3 className="serif-heading text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1] max-w-2xl mx-auto drop-shadow-sm">
              See FlowPeople GPS in{' '}
              <span className="italic font-normal bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                action.
              </span>
            </h3>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-[#F8F6F1]/90 font-light leading-relaxed drop-shadow-sm">
              Set up your office 100m geofence in under 5 minutes. Try it free with your team today with zero recurring software fees (T&amp;C Apply).
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact?type=Book%20a%20Demo"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-8 sm:px-10 py-4 text-sm sm:text-base font-bold shadow-xl shadow-indigo-500/25 hover:shadow-[0_12px_36px_rgba(212,175,55,0.45)] hover:scale-[1.03] transition-all border border-[#FFFDF9]/60 cursor-pointer"
              >
                <span>Book a Live Demo</span>
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

