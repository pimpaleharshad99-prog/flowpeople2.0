import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FP_IMAGES } from '../assets/fpImages';
import BrandLogo from '../components/BrandLogo';
import Lightfall from '../components/Lightfall';
import {
  CheckCircle2,
  ScanFace,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles,
  Users,
  ChevronDown
} from 'lucide-react';

const STORY_SCENES = [
  {
    index: 0,
    eyebrow: 'Scene 01 · 0–20% Scroll',
    tag: 'Arrival',
    heading: 'Your Workday Starts Here.',
    subtext: 'Smart attendance begins the moment your team arrives.',
    caption: 'Rahul enters the modern glass reception lobby'
  },
  {
    index: 1,
    eyebrow: 'Scene 02 · 20–40% Scroll',
    tag: 'Check-in screen',
    heading: 'Meet Effortless Attendance.',
    subtext: 'No cards. No paperwork. Just a seamless check-in experience.',
    caption: 'Walking naturally toward the mounted reception terminal'
  },
  {
    index: 2,
    eyebrow: 'Scene 03 · 40–65% Scroll',
    tag: 'Quick look',
    heading: "Just Look. You're Checked In.",
    subtext: 'Intelligent face attendance makes check-in simple.',
    caption: 'Kiosk scans face from 0% to 100% as you scroll'
  },
  {
    index: 3,
    eyebrow: 'Scene 04 · 65–82% Scroll',
    tag: 'Welcome',
    heading: 'Recognized. Ready to Go.',
    subtext: 'Every check-in lands in your HR records automatically.',
    caption: 'Verified: Rahul Sharma · ID: FP-1024 · Marketing'
  },
  {
    index: 4,
    eyebrow: 'Scene 05 · 82–100% Scroll',
    tag: 'Checked in · 09:02 AM',
    heading: 'One Look. One Tap. Done.',
    subtext: 'FlowPeople makes workforce attendance smarter, faster, and simpler.',
    caption: 'Check-in recorded at 09:02 AM · Continuing into office'
  }
];

const BIO_MODES = [
  { imgKey: 'bio_entrance', tag: 'Scene 1 · Arrival', head: 'Your Workday Starts Here.', state: 'Ready for Check-in' },
  { imgKey: 'bio_entrance', tag: 'Scene 2 · Step Up', head: 'Meet Effortless Attendance.', state: 'Detecting Employee…' },
  { imgKey: 'bio_scan', tag: 'Scene 3 · Biometric Scan', head: "Just Look. You're Checked In.", state: 'Scanning Face · 100%' },
  { imgKey: 'bio_confirm', tag: 'Scene 4 · Confirmed', head: 'One Look. Done.', state: 'Biometric Verified ✓' }
];

export default function BiometricAttendancePage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // Story Track state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [kioskState, setKioskState] = useState('READY');
  const [scanPct, setScanPct] = useState(0);
  const [plateWeights, setPlateWeights] = useState([1, 0, 0, 0, 0]);

  // Dedicated Biometric Terminal Simulator (#view-biometric from File 1)
  const [termSceneIdx, setTermSceneIdx] = useState(0);

  // Interactive Leave Approval Preview State
  const [leaveRows, setLeaveRows] = useState([
    { id: 1, name: 'Priya Nair', initial: 'PN', detail: 'Casual leave · 12–13 Nov · 2 days', status: null },
    { id: 2, name: 'Rohan Iyer', initial: 'RI', detail: 'Sick leave · 14 Nov · 1 day', status: null },
    { id: 3, name: 'Aarav Mehta', initial: 'AM', detail: 'Earned leave · 20–24 Nov · 5 days', status: null }
  ]);

  const handleLeaveAction = (id, result) => {
    setLeaveRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: result } : r))
    );
  };

  // Setup GSAP ScrollTrigger Pinned 5-Scene Storytelling Track
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }
    function smoothstep(edge0, edge1, x) {
      const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    }

    const updateExperience = (p) => {
      const clampedP = clamp(p, 0, 1);
      setScrollProgress(clampedP);

      let scIdx = 0;
      if (clampedP < 0.20) scIdx = 0;
      else if (clampedP < 0.40) scIdx = 1;
      else if (clampedP < 0.65) scIdx = 2;
      else if (clampedP < 0.82) scIdx = 3;
      else scIdx = 4;
      setActiveSceneIdx(scIdx);

      // Kiosk state & scan percentage
      if (clampedP < 0.26) {
        setKioskState('READY');
        setScanPct(0);
      } else if (clampedP < 0.40) {
        setKioskState('DETECTING');
        setScanPct(0);
      } else if (clampedP < 0.65) {
        setKioskState('SCANNING');
        const pct = Math.round(clamp(((clampedP - 0.40) / 0.25) * 100, 0, 100));
        setScanPct(pct);
      } else if (clampedP < 0.82) {
        setKioskState('VERIFIED');
        setScanPct(100);
      } else {
        setKioskState('SUCCESS');
        setScanPct(100);
      }

      // Smooth cross-fade weights for the 5 cinema plates
      const weights = [0, 0, 0, 0, 0];
      if (clampedP < 0.20) {
        const fade1 = smoothstep(0.15, 0.20, clampedP);
        weights[0] = 1 - fade1;
        weights[1] = fade1;
      } else if (clampedP < 0.40) {
        const fade2 = smoothstep(0.35, 0.40, clampedP);
        weights[1] = 1 - fade2;
        weights[2] = fade2;
      } else if (clampedP < 0.65) {
        const fade3 = smoothstep(0.60, 0.65, clampedP);
        weights[2] = 1 - fade3;
        weights[3] = fade3;
      } else if (clampedP < 0.82) {
        const fade4 = smoothstep(0.77, 0.82, clampedP);
        weights[3] = 1 - fade4;
        weights[4] = fade4;
      } else {
        weights[4] = 1;
      }
      setPlateWeights(weights);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.45,
        onUpdate: (self) => {
          updateExperience(self.progress);
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const jumpToSceneProgress = (targetP) => {
    if (!trackRef.current) return;
    const maxScroll = trackRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * targetP,
      behavior: 'smooth'
    });
  };

  const currentScene = STORY_SCENES[activeSceneIdx];
  const activeTerm = BIO_MODES[termSceneIdx];

  // Progress segment fill percentage
  const getSegFill = (i) => {
    const ranges = [
      [0.0, 0.20],
      [0.20, 0.40],
      [0.40, 0.65],
      [0.65, 0.82],
      [0.82, 1.0]
    ];
    const r0 = ranges[i][0];
    const r1 = ranges[i][1];
    if (scrollProgress <= r0) return 0;
    if (scrollProgress >= r1) return 100;
    return ((scrollProgress - r0) / (r1 - r0)) * 100;
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#F8F6F1] text-[#242321]">
      {/* ===================================================================== */}
      {/* 1. 560vh GSAP SCROLLTRIGGER PINNED 5-SCENE STORYTELLING TRACK         */}
      {/* ===================================================================== */}
      <div
        ref={trackRef}
        id="attendance-story-scroll-track"
        className="relative h-[560vh] w-full"
      >
        <div
          id="attendance-story-sticky-stage"
          className="sticky top-0 h-screen w-full overflow-hidden bg-[#1E1D1B]"
        >
          {/* Layer 1: Photorealistic Nano Banana Cinema Stage Plates */}
          <div id="photoreal-cinema-stage" className="absolute inset-0 h-full w-full">
            <img
              id="cinemaPlate0"
              src={FP_IMAGES.cinemaPlate0}
              alt="Scene 1: Rahul Sharma entering modern office"
              className="cinema-plate"
              style={{ opacity: plateWeights[0] }}
            />
            <img
              id="cinemaPlate1"
              src={FP_IMAGES.cinemaPlate1}
              alt="Scene 2: Approaching mounted tablet attendance kiosk"
              className="cinema-plate"
              style={{ opacity: plateWeights[1] }}
            />
            <img
              id="cinemaPlate2"
              src={FP_IMAGES.cinemaPlate2}
              alt="Scene 3: Face scan at reception kiosk"
              className="cinema-plate"
              style={{ opacity: plateWeights[2] }}
            />
            <img
              id="cinemaPlate3"
              src={FP_IMAGES.cinemaPlate3}
              alt="Scene 4: Kiosk recognizing Rahul Sharma with green ring"
              className="cinema-plate"
              style={{ opacity: plateWeights[3] }}
            />
            <img
              id="cinemaPlate4"
              src={FP_IMAGES.cinemaPlate4}
              alt="Scene 5: Check-in successful · walking into office"
              className="cinema-plate"
              style={{ opacity: plateWeights[4] }}
            />

            {/* FLUXORA.hq Wall Sign */}
            <div
              id="fluxoraSign"
              className="pointer-events-none absolute top-20 right-6 sm:top-24 sm:right-12 z-20 hidden md:block rounded-xl border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md shadow-md text-right"
            >
              <span className="text-[10px] font-bold tracking-[0.26em] uppercase text-white/90">
                FLUXORA<span className="text-[#FFE4B8]">.hq</span>
              </span>
              <div className="text-[8px] text-white/60 tracking-wider">RECEPTION SUITE</div>
            </div>

            {/* Gradient Overlays for Readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 z-10" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-transparent z-10" />
          </div>

          {/* Layer 2: Left Editorial Overlay & Right Reception Kiosk HUD */}
          <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 flex flex-col justify-between">
            {/* Top Bar: Scene Indicator & Progress % */}
            <div className="flex items-center justify-between text-white pt-4">
              <div className="flex items-center gap-3">
                <span
                  id="sceneDot"
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    activeSceneIdx === 4 ? 'bg-[#299D68]' : 'bg-[#590907]'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-widest text-[#FFE4B8]">
                  Scene 0{activeSceneIdx + 1} / 05 · {currentScene.tag}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-8 sm:w-12 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                      onClick={() => jumpToSceneProgress(i * 0.22)}
                    >
                      <div
                        className="h-full bg-[#FFE4B8] transition-all duration-150"
                        style={{ width: `${getSegFill(i)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-white/70">
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>
            </div>

            {/* Center Area: Left Editorial Headline & Right Kiosk HUD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
              {/* Left Column Editorial */}
              <div className="lg:col-span-7 text-white space-y-5 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#FFE4B8] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>{currentScene.eyebrow}</span>
                </div>

                <h1 className="serif-heading text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.04] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  {currentScene.heading}
                </h1>

                <p className="text-lg sm:text-2xl text-white font-medium leading-relaxed drop-shadow-md">
                  {currentScene.subtext}
                </p>

                {/* Caption Tag */}
                <p className="text-xs text-[#E8D2B5] font-medium italic pt-2">
                  {currentScene.caption}
                </p>

                {/* Final Scene CTA buttons */}
                {activeSceneIdx === 4 && (
                  <div className="pt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('about');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="rounded-full bg-[#FFE4B8] text-[#590907] px-6 py-2.5 text-xs sm:text-sm font-bold shadow-lg hover:bg-white transition"
                    >
                      Explore FlowPeople Suite ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="rounded-full border border-white/40 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-white/10 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Replay Story
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Reception Kiosk HUD Panel */}
              <div className="lg:col-span-5 flex justify-end">
                <div
                  id="kioskHudPanel"
                  className="w-full max-w-sm rounded-[32px] p-5 fp-kiosk-glass border border-white/25 text-white shadow-2xl relative"
                >
                  {/* Kiosk Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/15 text-xs">
                    <BrandLogo variant="kiosk" />
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#299D68] animate-pulse"></span>
                      <span className="text-[10px] text-[#A5A79B] font-mono">09:02 AM</span>
                    </div>
                  </div>

                  {/* Dynamic Kiosk State Content */}
                  <div className="my-5 relative rounded-2xl overflow-hidden bg-black/40 aspect-[4/3] flex flex-col items-center justify-center p-4 border border-white/15">
                    {kioskState === 'READY' && (
                      <div className="text-center space-y-2">
                        <ScanFace className="h-12 w-12 text-[#FFE4B8] mx-auto opacity-75" />
                        <div className="text-xs font-semibold text-white">Stand Before Kiosk</div>
                        <div className="text-[10px] text-[#A5A79B]">Contactless face scan wakes automatically</div>
                      </div>
                    )}

                    {kioskState === 'DETECTING' && (
                      <div className="text-center space-y-2">
                        <div className="relative h-16 w-16 mx-auto rounded-full overflow-hidden border-2 border-[#FFE4B8] animate-pulse">
                          <img src={FP_IMAGES.rahul_avatar} alt="Detecting Face" className="h-full w-full object-cover blur-[1px]" />
                        </div>
                        <div className="text-xs font-semibold text-white">Employee Approaching…</div>
                        <div className="text-[10px] text-[#E8D2B5]">Acquiring facial landmarks</div>
                      </div>
                    )}

                    {kioskState === 'SCANNING' && (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-[#299D68] shadow-[0_0_20px_rgba(41,157,104,0.4)]">
                          <img src={FP_IMAGES.rahul_avatar} alt="Scanning Face" className="h-full w-full object-cover" />
                          <div className="biometric-laser-line absolute inset-x-0 h-1 bg-[#299D68] shadow-[0_0_10px_#299D68]" />
                        </div>
                        <div className="mt-2 text-xs font-bold text-[#FFE4B8] font-mono">
                          Scanning: {scanPct}%
                        </div>
                        <div className="w-32 h-1 rounded-full bg-white/20 mt-1 overflow-hidden">
                          <div className="h-full bg-[#299D68] transition-all" style={{ width: `${scanPct}%` }} />
                        </div>
                      </div>
                    )}

                    {kioskState === 'VERIFIED' && (
                      <div className="text-center space-y-2">
                        <div className="relative h-16 w-16 mx-auto rounded-full overflow-hidden border-2 border-[#299D68] shadow-md ring-4 ring-[#299D68]/30">
                          <img src={FP_IMAGES.rahul_avatar} alt="Rahul Sharma" className="h-full w-full object-cover" />
                        </div>
                        <div className="text-sm font-bold text-white">Rahul Sharma</div>
                        <div className="text-[10px] text-[#299D68] font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          EMP-204 · Marketing · Face Match 99.8%
                        </div>
                      </div>
                    )}

                    {kioskState === 'SUCCESS' && (
                      <div className="text-center space-y-2">
                        <div className="h-14 w-14 rounded-full bg-[#299D68] flex items-center justify-center mx-auto text-white shadow-lg">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <div className="text-sm font-bold text-white">Check-in Confirmed!</div>
                        <div className="text-[11px] text-[#FFE4B8]">09:02 AM · On Time · Synced to HR</div>
                      </div>
                    )}
                  </div>

                  {/* Kiosk State Footer */}
                  <div className="pt-2 flex items-center justify-between text-xs text-[#A5A79B]">
                    <span>Kiosk Mode: Biometric v8</span>
                    <span className="font-semibold text-[#FFE4B8] uppercase text-[10px]">
                      {kioskState}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Scroll Cue */}
            <div className="flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-4">
              <span>Scroll down to advance story through scenes 01–05</span>
              <div className="flex items-center gap-2">
                <span>Jump:</span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpToSceneProgress(i * 0.22)}
                    className="hover:text-white transition font-mono px-1"
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DEDICATED BIOMETRIC TERMINAL SIMULATOR (#view-biometric from F1)   */}
      {/* ===================================================================== */}
      <section className="relative z-30 bg-[#1E1D1B] py-16 px-4 sm:px-8 border-b border-[#E8D2B5]/20 text-[#F8F6F1]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#FFE4B8]">
              <ScanFace className="h-4 w-4" />
              <span>Interactive Terminal Walkthrough</span>
            </div>
            <h2 className="serif-heading text-3xl sm:text-5xl font-semibold text-white">
              {activeTerm.head}
            </h2>
            <p className="text-sm sm:text-base text-white/80">
              Step through each phase of the facial scan terminal or jump directly to test GPS geofencing.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {BIO_MODES.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTermSceneIdx(idx)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    termSceneIdx === idx
                      ? 'bg-[#590907] text-[#F8F6F1] shadow-md border border-[#FFE4B8]/50'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {sc.tag}
                </button>
              ))}
            </div>

            <div className="pt-3 flex gap-3">
              <Link
                to="/gps-attendance"
                className="rounded-full bg-[#FFE4B8] text-[#590907] px-5 py-2.5 text-xs font-bold hover:bg-white transition shadow-sm"
              >
                Switch to GPS Attendance →
              </Link>
            </div>
          </div>

          {/* Interactive Screen Preview */}
          <div className="w-full max-w-md rounded-3xl overflow-hidden bg-black/60 border border-white/20 shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 text-xs text-[#A5A79B] border-b border-white/10">
              <span className="font-semibold text-white">Kiosk Terminal Preview</span>
              <span className="text-[#299D68] font-bold">{activeTerm.state}</span>
            </div>
            <div className="relative mt-3 rounded-2xl overflow-hidden aspect-[16/10]">
              <img
                src={FP_IMAGES[activeTerm.imgKey]}
                alt={activeTerm.tag}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. ALL 11 COMPLETE PRODUCT SECTIONS FROM FLOWPEOPLE_V8.HTML           */}
      {/* ===================================================================== */}

      {/* #about */}
      <section id="about" className="relative z-30 overflow-hidden bg-[#F8F6F1] py-24 sm:py-32 px-4 sm:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#E8D2B5]/50 blur-3xl"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold tracking-wide text-[#590907] uppercase">What is FlowPeople?</p>
          <h2 className="serif-heading mt-3 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#242321]">
            Start every day on time, in two seconds.
          </h2>
          <p className="mt-5 text-base sm:text-xl leading-relaxed text-[#242321]/75">
            FlowPeople is the smart, quiet attendance system built for modern teams. A tablet mounted at your entrance recognizes faces the moment people arrive. Attendance is logged instantly, leaves are approved in taps, and records stay tidy.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-white/70 p-4 text-center backdrop-blur-sm sm:p-6 shadow-sm">
              <div className="serif-heading text-3xl sm:text-5xl font-semibold text-[#590907]">2 sec</div>
              <div className="mt-1 text-xs text-[#242321]/60">Average check-in time</div>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-white/70 p-4 text-center backdrop-blur-sm sm:p-6 shadow-sm">
              <div className="serif-heading text-3xl sm:text-5xl font-semibold text-[#590907]">99.8%</div>
              <div className="mt-1 text-xs text-[#242321]/60">Recognition accuracy</div>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-white/70 p-4 text-center backdrop-blur-sm sm:p-6 shadow-sm">
              <div className="serif-heading text-3xl sm:text-5xl font-semibold text-[#590907]">0</div>
              <div className="mt-1 text-xs text-[#242321]/60">Cards, tags or paper</div>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-white/70 p-4 text-center backdrop-blur-sm sm:p-6 shadow-sm">
              <div className="serif-heading text-3xl sm:text-5xl font-semibold text-[#590907]">100%</div>
              <div className="mt-1 text-xs text-[#242321]/60">Cloud-synced in real time</div>
            </div>
          </div>
        </div>
      </section>

      {/* #how-it-works */}
      <section id="how-it-works" className="relative z-30 bg-white py-24 sm:py-32 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#590907]">How it works</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-[#242321]">
              Check-in in five easy steps.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#242321]/70">No passwords to remember. No fumbling for keycards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-4 text-left shadow-sm">
              <div className="h-32 rounded-xl overflow-hidden mb-3">
                <img src={FP_IMAGES.cinemaPlate0} alt="Arrive" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold text-[#590907]">Step 01</span>
              <h4 className="font-bold text-sm text-[#242321] mt-1">Arrive</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Walk in through the office doors as usual.</p>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-4 text-left shadow-sm">
              <div className="h-32 rounded-xl overflow-hidden mb-3">
                <img src={FP_IMAGES.cinemaPlate1} alt="Step up" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold text-[#590907]">Step 02</span>
              <h4 className="font-bold text-sm text-[#242321] mt-1">Step up</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Pause at the mounted tablet screen at reception.</p>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-4 text-left shadow-sm">
              <div className="h-32 rounded-xl overflow-hidden mb-3">
                <img src={FP_IMAGES.cinemaPlate2} alt="Look" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold text-[#590907]">Step 03</span>
              <h4 className="font-bold text-sm text-[#242321] mt-1">Look</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Look at the screen for a two-second contactless scan.</p>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-4 text-left shadow-sm">
              <div className="h-32 rounded-xl overflow-hidden mb-3">
                <img src={FP_IMAGES.cinemaPlate3} alt="Recognised" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold text-[#590907]">Step 04</span>
              <h4 className="font-bold text-sm text-[#242321] mt-1">Recognised</h4>
              <p className="text-xs text-[#242321]/70 mt-1">The screen confirms your name and check-in time.</p>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-4 text-left shadow-sm">
              <div className="h-32 rounded-xl overflow-hidden mb-3">
                <img src={FP_IMAGES.cinemaPlate4} alt="Done" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold text-[#590907]">Step 05</span>
              <h4 className="font-bold text-sm text-[#242321] mt-1">Done</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Walk to your desk. Your records are already updated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* #features */}
      <section id="features" className="relative z-30 bg-[#F8F6F1] py-24 sm:py-32 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-[#590907]">Features</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-[#242321]">
              Everything attendance needs.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#242321]/70">Built to be useful on day one, not overwhelming.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 shadow-sm">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-bold text-lg text-[#242321]">Contactless check-in</h3>
              <p className="mt-2 text-sm text-[#242321]/70 leading-relaxed">
                Walk up, look, done. No touching screens or surfaces, keeping things clean and fast.
              </p>
            </div>
            <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 shadow-sm">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-bold text-lg text-[#242321]">Live attendance</h3>
              <p className="mt-2 text-sm text-[#242321]/70 leading-relaxed">
                See who is in the office, who is working remotely, and who is on leave in real time.
              </p>
            </div>
            <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 shadow-sm">
              <div className="text-2xl mb-3">🌴</div>
              <h3 className="font-bold text-lg text-[#242321]">Leave & shifts</h3>
              <p className="mt-2 text-sm text-[#242321]/70 leading-relaxed">
                Apply for leave in seconds, approve with one tap, and manage shift timings smoothly.
              </p>
            </div>
            <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 shadow-sm">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold text-lg text-[#242321]">Payroll ready</h3>
              <p className="mt-2 text-sm text-[#242321]/70 leading-relaxed">
                Export clean, formatted monthly summaries ready for your accountant or payroll tool.
              </p>
            </div>
            <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 shadow-sm">
              <div className="text-2xl mb-3">📄</div>
              <h3 className="font-bold text-lg text-[#242321]">Simple reports</h3>
              <p className="mt-2 text-sm text-[#242321]/70 leading-relaxed">
                Download PDF or CSV reports with one click: monthly summaries, late arrivals, and trends.
              </p>
            </div>
            <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 shadow-sm">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-bold text-lg text-[#242321]">Private & secure</h3>
              <p className="mt-2 text-sm text-[#242321]/70 leading-relaxed">
                Face data is converted to encrypted math tokens. Photos are never stored or shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* #leave (INTERACTIVE LEAVE APPROVAL PREVIEW) */}
      <section id="leave" className="relative z-30 overflow-hidden bg-white py-24 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="lg:order-2">
            <p className="text-sm font-semibold text-[#590907]">Leave management</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-[#242321]">
              Leave, sorted in a few taps.
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#242321]/70">
              Employees apply from their phone. Managers approve in one tap. Balances and calendars update on their own.
            </p>
            <ul className="mt-6 space-y-3 text-sm sm:text-base text-[#242321]/80">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#299D68] shrink-0" />
                <span>Casual, sick, earned and custom leave types</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#299D68] shrink-0" />
                <span>Instant approvals with clear balances</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#299D68] shrink-0" />
                <span>Team calendar to avoid clashes</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#299D68] shrink-0" />
                <span>Holidays and weekends handled automatically</span>
              </li>
            </ul>
          </div>

          {/* Interactive Leave Request Card */}
          <div className="lg:order-1 rounded-3xl border border-[#A5A79B]/30 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#A5A79B]/20">
              <div className="text-base font-semibold text-[#242321]">Leave requests</div>
              <span className="text-xs text-[#590907] font-semibold">Live interactive demo</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#F8F6F1] p-3 text-center">
                <div className="text-2xl font-bold text-[#590907]">8</div>
                <div className="text-[11px] text-[#242321]/60">Casual · of 12</div>
              </div>
              <div className="rounded-xl bg-[#F8F6F1] p-3 text-center">
                <div className="text-2xl font-bold text-[#590907]">5</div>
                <div className="text-[11px] text-[#242321]/60">Sick · of 8</div>
              </div>
              <div className="rounded-xl bg-[#F8F6F1] p-3 text-center">
                <div className="text-2xl font-bold text-[#590907]">12</div>
                <div className="text-[11px] text-[#242321]/60">Earned · of 18</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#F8F6F1] px-4 divide-y divide-[#A5A79B]/20">
              {leaveRows.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3.5 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8D2B5] text-xs font-bold text-[#590907]">
                      {r.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[#242321]">{r.name}</div>
                      <div className="truncate text-xs text-[#242321]/60">{r.detail}</div>
                    </div>
                  </div>

                  {r.status ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                        r.status === 'Approved' ? 'bg-[#299D68]' : 'bg-[#590907]'
                      }`}
                    >
                      {r.status}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLeaveAction(r.id, 'Approved')}
                        className="rounded-full bg-[#299D68] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLeaveAction(r.id, 'Declined')}
                        className="rounded-full border border-[#A5A79B]/60 px-3 py-1.5 text-xs font-semibold text-[#242321]/70 hover:bg-white transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* #dashboard */}
      <section id="dashboard" className="relative z-30 bg-[#F8F6F1] py-24 sm:py-32 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-[#590907]">HR Live Overview</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-[#242321]">
              Know who's in, the moment they arrive.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#242321]/70">
              Live headcount, late arrivals, on-leave employees, and department breakdowns in one clear screen.
            </p>
          </div>

          <div className="rounded-3xl border border-[#A5A79B]/30 bg-white p-6 sm:p-10 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl bg-[#F8F6F1] p-4 text-center">
                <span className="text-xs text-[#242321]/60 font-medium">Present Today</span>
                <div className="text-3xl font-bold text-[#299D68] mt-1">42 / 45</div>
              </div>
              <div className="rounded-2xl bg-[#F8F6F1] p-4 text-center">
                <span className="text-xs text-[#242321]/60 font-medium">On Time</span>
                <div className="text-3xl font-bold text-[#242321] mt-1">93%</div>
              </div>
              <div className="rounded-2xl bg-[#F8F6F1] p-4 text-center">
                <span className="text-xs text-[#242321]/60 font-medium">On Leave</span>
                <div className="text-3xl font-bold text-[#590907] mt-1">3</div>
              </div>
              <div className="rounded-2xl bg-[#F8F6F1] p-4 text-center">
                <span className="text-xs text-[#242321]/60 font-medium">Average Arrival</span>
                <div className="text-3xl font-bold text-[#242321] mt-1">09:04 AM</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F8F6F1] p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#242321]">Recent Front-Desk Arrivals</span>
                <span className="text-xs text-[#299D68] font-semibold">● Live Syncing</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm bg-white p-3 rounded-xl shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={FP_IMAGES.rahul_avatar} alt="Rahul Sharma" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-[#242321]">Rahul Sharma</span>
                      <span className="text-xs text-[#A5A79B] ml-2">Marketing</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#299D68]">09:02 AM · On Time</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm bg-white p-3 rounded-xl shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#E8D2B5] text-[#590907] font-bold flex items-center justify-center text-xs">AK</div>
                    <div>
                      <span className="font-bold text-[#242321]">Ananya Kapoor</span>
                      <span className="text-xs text-[#A5A79B] ml-2">Product Design</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#299D68]">09:05 AM · On Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #reports */}
      <section id="reports" className="relative z-30 bg-white py-24 sm:py-32 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-[#590907]">Exportable Reports</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-[#242321]">
              Reports that are ready when you are.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#242321]/70 leading-relaxed">
              No manual calculations at the end of the month. Export clean, formatted monthly summaries directly to PDF or CSV for your payroll processing.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                className="rounded-full bg-[#590907] text-[#F8F6F1] px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md hover:bg-[#590907]/90 transition"
              >
                Download Sample CSV
              </button>
              <button
                type="button"
                className="rounded-full border border-[#242321]/30 px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#242321] hover:bg-[#F8F6F1] transition"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-6 shadow-md">
            <div className="text-xs font-bold text-[#590907] uppercase mb-2">Monthly Payroll Summary Preview</div>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-xs font-mono space-y-2 text-[#242321]">
              <div className="flex justify-between border-b pb-2 text-[#A5A79B]">
                <span>Employee</span>
                <span>Days Present</span>
                <span>Late Count</span>
                <span>Net Hours</span>
              </div>
              <div className="flex justify-between py-1 font-sans">
                <span className="font-semibold">Rahul Sharma</span>
                <span>22 / 22</span>
                <span className="text-[#299D68]">0</span>
                <span>176.5 hrs</span>
              </div>
              <div className="flex justify-between py-1 font-sans">
                <span className="font-semibold">Priya Nair</span>
                <span>20 / 22</span>
                <span className="text-amber-600">1</span>
                <span>160.0 hrs</span>
              </div>
              <div className="flex justify-between py-1 font-sans">
                <span className="font-semibold">Aarav Mehta</span>
                <span>21 / 22</span>
                <span className="text-[#299D68]">0</span>
                <span>168.0 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #announcements */}
      <section id="announcements" className="relative z-30 bg-[#F8F6F1] py-24 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl text-center max-w-2xl mb-12">
          <p className="text-sm font-semibold text-[#590907]">Announcements</p>
          <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold text-[#242321]">
            Everyone hears it first.
          </h2>
          <p className="mt-3 text-base text-[#242321]/70">
            Broadcast celebrations, office closures, and policy updates directly to the reception screen and mobile apps.
          </p>
        </div>
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white p-6 border border-[#A5A79B]/30 shadow-sm">
            <span className="text-xs font-bold text-[#590907] uppercase">Company Broadcast</span>
            <h4 className="text-lg font-bold text-[#242321] mt-1">Town Hall this Thursday at 4 PM</h4>
            <p className="text-xs text-[#242321]/70 mt-2">Join us in the main cafeteria or on the virtual stream for Q3 updates.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 border border-[#A5A79B]/30 shadow-sm">
            <span className="text-xs font-bold text-[#299D68] uppercase">Office Celebration</span>
            <h4 className="text-lg font-bold text-[#242321] mt-1">Happy Work Anniversary to Priya!</h4>
            <p className="text-xs text-[#242321]/70 mt-2">Celebrating 3 wonderful years on the Product Design team.</p>
          </div>
        </div>
      </section>

      {/* #day (A Typical Day timeline from 9:00 AM to 6:00 PM) */}
      <section id="day" className="relative z-30 bg-white py-24 sm:py-32 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-[#590907]">Timeline</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold text-[#242321]">
              From first arrival to payroll.
            </h2>
            <p className="mt-3 text-base text-[#242321]/70">How FlowPeople powers a seamless workday.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-5 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#590907]">09:00 AM</span>
              <h4 className="text-base font-bold text-[#242321] mt-1">Morning Arrival</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Contactless 2-second check-in at reception or via GPS geofence.</p>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-5 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#590907]">01:30 PM</span>
              <h4 className="text-base font-bold text-[#242321] mt-1">Leave Approvals</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Managers review and approve leave requests in a single tap.</p>
            </div>
            <div className="rounded-2xl border border-[#A5A79B]/30 bg-[#F8F6F1] p-5 shadow-sm">
              <span className="text-xs font-mono font-bold text-[#590907]">06:00 PM</span>
              <h4 className="text-base font-bold text-[#242321] mt-1">Evening Wrap-Up</h4>
              <p className="text-xs text-[#242321]/70 mt-1">Daily records auto-sync to reports without manual spreadsheet work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* #why (Opulent Golden Touch Comparison Band) */}
      <section id="why" className="relative z-30 bg-gradient-to-br from-[#590907] via-[#430604] to-[#1C0202] text-[#F8F6F1] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden border-y-2 border-[#D4AF37]/35 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)]">
        {/* Dynamic Golden Lightfall Canvas Background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-60">
          <Lightfall
            colors={['#FFE4B8', '#D4AF37', '#FFF5E4', '#E8D2B5', '#F5D061']}
            backgroundColor="#3D0604"
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
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] rounded-full bg-gradient-to-b from-[#D4AF37]/25 via-[#FFE4B8]/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 w-[400px] h-[250px] rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-6">
          {/* Opulent Luminous Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-white/15 to-[#D4AF37]/20 border border-[#FFE4B8]/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFE4B8] shadow-[0_4px_24px_rgba(212,175,55,0.2)] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>The FlowPeople Difference</span>
          </div>

          {/* Serif Headline with Gold Shimmer Accent */}
          <h2 className="serif-heading text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto drop-shadow-sm">
            Why teams choose{' '}
            <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
              FlowPeople.
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-[#F8F6F1]/90 font-light leading-relaxed drop-shadow-sm">
            Traditional card readers break, fingerprint sensors jam, and manual registers get forged. FlowPeople solves attendance with elegant computer vision and reliable geofencing.
          </p>

          {/* 3 Opulent Gold Feature Badges */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-[#FFE4B8]/30 bg-white/5 backdrop-blur-md p-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFE4B8]">Sub-2s Match</span>
              <p className="text-xs text-white/80 mt-1 font-light">Zero queues at the reception desk</p>
            </div>
            <div className="rounded-2xl border border-[#FFE4B8]/30 bg-white/5 backdrop-blur-md p-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFE4B8]">Dual Check-In</span>
              <p className="text-xs text-white/80 mt-1 font-light">Front-desk kiosk &amp; 100m GPS zone</p>
            </div>
            <div className="rounded-2xl border border-[#FFE4B8]/30 bg-white/5 backdrop-blur-md p-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FFE4B8]">Perpetual License</span>
              <p className="text-xs text-white/80 mt-1 font-light">₹0 Recurring Maintenance (T&amp;C Apply)</p>
            </div>
          </div>
        </div>
      </section>

      {/* #teams (Built for Every Role) */}
      <section id="teams" className="relative z-30 bg-[#F8F6F1] py-24 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-[#590907]">Built for Everyone</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold text-[#242321]">
              One simple way to check in, wherever you work.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl bg-white p-6 border border-[#A5A79B]/30 shadow-sm">
              <h4 className="font-bold text-base text-[#242321]">Offices</h4>
              <p className="text-xs text-[#242321]/70 mt-2">Mounted front-desk tablets for fast, queue-free arrivals.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 border border-[#A5A79B]/30 shadow-sm">
              <h4 className="font-bold text-base text-[#242321]">Retail & Stores</h4>
              <p className="text-xs text-[#242321]/70 mt-2">Shift-based clock-in with zero physical surface contact.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 border border-[#A5A79B]/30 shadow-sm">
              <h4 className="font-bold text-base text-[#242321]">Factories & Sites</h4>
              <p className="text-xs text-[#242321]/70 mt-2">Durable kiosks withstand heavy throughput during shift changes.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 border border-[#A5A79B]/30 shadow-sm">
              <h4 className="font-bold text-base text-[#242321]">Remote & Hybrid</h4>
              <p className="text-xs text-[#242321]/70 mt-2">GPS geofence verify location boundaries instantly on mobile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* #faq (Accordion FAQ) */}
      <section id="faq" className="relative z-30 bg-white py-24 px-4 sm:px-8 border-t border-[#A5A79B]/20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#590907]">FAQ</p>
            <h2 className="serif-heading mt-3 text-3xl sm:text-5xl font-semibold text-[#242321]">
              Questions, answered.
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group rounded-2xl bg-[#F8F6F1] p-5 [&_summary::-webkit-details-marker]:hidden border border-[#A5A79B]/20 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-sm sm:text-base text-[#242321]">
                <span>How does the facial recognition keep employee photos private?</span>
                <ChevronDown className="h-4 w-4 text-[#590907] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-[#242321]/75 leading-relaxed">
                Photos are never stored on device or in the cloud. The vision engine computes an irreversible mathematical hash of facial geometry. Even in the unlikely event of data extraction, images cannot be reconstructed.
              </p>
            </details>

            <details className="group rounded-2xl bg-[#F8F6F1] p-5 [&_summary::-webkit-details-marker]:hidden border border-[#A5A79B]/20 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-sm sm:text-base text-[#242321]">
                <span>Can an employee check in using a photo or video of another person?</span>
                <ChevronDown className="h-4 w-4 text-[#590907] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-[#242321]/75 leading-relaxed">
                No. FlowPeople includes active liveness detection that checks for micro-depth, eye movement, and 3D surface curvature to prevent spoofing via prints or smartphone screens.
              </p>
            </details>

            <details className="group rounded-2xl bg-[#F8F6F1] p-5 [&_summary::-webkit-details-marker]:hidden border border-[#A5A79B]/20 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-sm sm:text-base text-[#242321]">
                <span>Can we use both the Biometric Kiosk and Mobile GPS Geofencing?</span>
                <ChevronDown className="h-4 w-4 text-[#590907] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-[#242321]/75 leading-relaxed">
                Yes! Many organizations install a kiosk at headquarters while enabling the 100m GPS geofence for field reps, hybrid workers, or secondary branch offices.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* #contact (Book a Demo CTA with Golden Touch) */}
      <section id="contact" className="relative z-30 bg-[#160202] py-20 px-4 sm:px-8">
        <div className="rounded-[40px] sm:rounded-[52px] bg-gradient-to-br from-[#590907] via-[#430604] to-[#1C0202] text-[#F8F6F1] p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(89,9,7,0.5),0_0_40px_rgba(212,175,55,0.18)] border-2 border-[#D4AF37]/40 max-w-5xl mx-auto">
          {/* Dynamic Golden Lightfall Canvas Background */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-60">
            <Lightfall
              colors={['#FFE4B8', '#D4AF37', '#FFF5E4', '#E8D2B5', '#F5D061']}
              backgroundColor="#3D0604"
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

          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] rounded-full bg-gradient-to-b from-[#D4AF37]/25 via-[#FFE4B8]/10 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 w-[400px] h-[250px] rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-white/15 to-[#D4AF37]/20 border border-[#FFE4B8]/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#FFE4B8] shadow-[0_4px_24px_rgba(212,175,55,0.2)] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Ready in 15 Minutes</span>
            </div>

            <h2 className="serif-heading text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1] max-w-2xl mx-auto drop-shadow-sm">
              Ready to simplify{' '}
              <span className="italic font-normal bg-gradient-to-r from-[#FFFDF9] via-[#FFE4B8] to-[#D4AF37] bg-clip-text text-transparent">
                attendance?
              </span>
            </h2>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-[#F8F6F1]/90 font-light leading-relaxed drop-shadow-sm">
              Set up FlowPeople in under 15 minutes. Try it free with your team today with zero recurring software fees (T&amp;C Apply).
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact?type=Book%20a%20Demo"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FFE4B8] via-[#E8D2B5] to-[#D4AF37] text-[#3A1B12] px-8 sm:px-10 py-4 text-sm sm:text-base font-bold shadow-xl shadow-[#D4AF37]/25 hover:shadow-[0_12px_36px_rgba(212,175,55,0.45)] hover:scale-[1.03] transition-all border border-[#FFFDF9]/60 cursor-pointer"
              >
                <span>Book a Live Demo</span>
                <ArrowRight className="h-4 w-4 text-[#3A1B12] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-7 py-4 text-sm sm:text-base font-semibold text-white shadow-md backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>View One-Time Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

