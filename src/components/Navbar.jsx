// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const NAV_ITEMS = [
  { id: "welcome", label: "Welcome Hub", path: "/" },
  { id: "biometric", label: "Biometric", path: "/biometric-attendance", dot: "green" },
  { id: "gps", label: "GPS Attendance", path: "/gps-attendance", dot: "blue" },
  { id: "pricing", label: "Pricing", path: "/pricing" },
  { id: "how-it-works", label: "How It Works", path: "/how-it-works" },
  { id: "features", label: "Features", path: "/features" },
];

const DOT_COLOR = {
  green: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  blue: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
};

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center transition hover:opacity-95" aria-label="FlowPeople home">
      <BrandLogo variant="navbar" theme="dark" />
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("welcome");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth throttled scroll listener: switches cleanly between top & scrolled states without jank
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Mark section in view as active using IntersectionObserver
  useEffect(() => {
    // If not on home page, match active item based on current pathname
    if (location.pathname !== "/") {
      const matched = NAV_ITEMS.find((item) => item.path === location.pathname);
      if (matched) {
        setActive(matched.id);
      }
      return;
    }

    const sectionElements = NAV_ITEMS.map((item) => {
      if (item.id === "welcome") {
        return document.getElementById("welcome") || document.getElementById("welcome-hero");
      }
      if (item.id === "biometric") {
        return document.getElementById("biometric") || document.getElementById("option-biometric") || document.getElementById("biometric-section");
      }
      if (item.id === "gps") {
        return document.getElementById("gps") || document.getElementById("option-gps") || document.getElementById("gps-section");
      }
      return document.getElementById(item.id);
    }).filter((el) => el instanceof Element);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const rawId = e.target.id;
            if (rawId === "welcome-hero" || rawId === "welcome") setActive("welcome");
            else if (rawId.includes("biometric")) setActive("biometric");
            else if (rawId.includes("gps")) setActive("gps");
            else if (rawId.includes("pricing")) setActive("pricing");
            else if (rawId.includes("how-it-works")) setActive("how-it-works");
            else if (rawId.includes("features")) setActive("features");
            else setActive(rawId);
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );

    sectionElements.forEach((s) => {
      if (s instanceof Element) {
        observer.observe(s);
      }
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  // 2. Close mobile menu on Escape key press
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 3. Navigation handler (smooth in-page scroll if section exists, or route navigation)
  const go = (item) => {
    setOpen(false);

    const targetElement =
      document.getElementById(item.id) ||
      (item.id === "welcome" && (document.getElementById("welcome-hero") || document.getElementById("view-hub"))) ||
      (item.id === "biometric" && document.getElementById("option-biometric")) ||
      (item.id === "gps" && document.getElementById("option-gps"));

    if (targetElement && location.pathname === "/") {
      setActive(item.id);
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      setActive(item.id);
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookDemo = () => {
    setOpen(false);
    const contactSection =
      document.getElementById("business-inquiry") ||
      document.getElementById("contact") ||
      document.getElementById("choose-attendance");

    if (contactSection && (location.pathname === "/contact" || location.pathname === "/")) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact?type=Book%20a%20Demo");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 pointer-events-none">
      {/* ============================================================== */}
      {/* SINGLE CONTAINER PILL (NO SECOND PILL BEHIND LINKS)            */}
      {/* When at top (scrolled up): NO blur, crystal clear hero         */}
      {/* When scrolled down: Sleek dark surface with subtle depth       */}
      {/* ============================================================== */}
      <nav
        aria-label="Main"
        style={{ WebkitFontSmoothing: "antialiased", transform: "translateZ(0)" }}
        className={`pointer-events-auto relative mx-auto w-full max-w-6xl rounded-full border px-3.5 py-2.5 sm:px-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ease-out ${
          scrolled
            ? "border-white/15 bg-slate-900/85 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
            : "border-white/10 bg-slate-900/40 backdrop-blur-none shadow-none"
        }`}
      >
        {/* Subtle hairline gradient top highlight line */}
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex items-center justify-between gap-4">
          {/* 1. Left: Brand Logo (Crisp & Readable) */}
          <Logo />

          {/* 2. Middle: Desktop Links (Single container, NO extra nested pill background) */}
          <ul className="hidden min-w-0 items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(item)}
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "relative inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                      isActive
                        ? "bg-white/10 text-white font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/5",
                    ].join(" ")}
                  >
                    {item.dot && (
                      <span className={`h-2 w-2 rounded-full ${DOT_COLOR[item.dot]}`} />
                    )}
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 3. Right: CTA Button & Mobile Hamburger Toggle */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleBookDemo}
              className="group hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-indigo-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 cursor-pointer sm:inline-flex"
            >
              <span>Book a Demo</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

            {/* Accessible Hamburger Toggle for < lg */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE MENU DROPDOWN PANEL                                     */}
        {/* ============================================================== */}
        {open && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full mt-3 rounded-3xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item)}
                    className={`flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                      active === item.id
                        ? "bg-white/10 text-white font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.dot && (
                      <span className={`h-2 w-2 rounded-full ${DOT_COLOR[item.dot]}`} />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/about");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span>About FlowPeople</span>
                </button>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleBookDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-violet-500 cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
