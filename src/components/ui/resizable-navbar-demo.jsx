"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
  NavbarButton,
} from "./resizable-navbar";

export default function ResizableNavbarDemo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const demoItems = [
    { name: "Welcome Hub", link: "/" },
    { name: "Biometric", link: "/biometric-attendance" },
    { name: "GPS Attendance", link: "/gps-attendance" },
    { name: "Pricing", link: "/pricing" },
    { name: "How It Works", link: "/how-it-works" },
    { name: "Features", link: "/features" },
    { name: "About", link: "/about" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-50 text-slate-900">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] via-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                F.
              </div>
              <span className="font-bold tracking-tight text-slate-900 text-sm">
                FlowPeople
              </span>
            </div>
          </NavbarLogo>

          <NavItems items={demoItems} />

          <div className="flex items-center gap-2">
            <NavbarButton variant="gradient" onClick={() => alert("Book Demo Clicked")}>
              Book Demo
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo href="/">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#38BDF8] via-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  F.
                </div>
                <span className="font-bold tracking-tight text-slate-900 text-sm">
                  FlowPeople
                </span>
              </div>
            </NavbarLogo>

            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          >
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {demoItems.map((item, idx) => (
                <a
                  key={`demo-mobile-${idx}`}
                  href={item.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-slate-700 hover:bg-indigo-50/70 transition"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <NavbarButton
              variant="gradient"
              className="w-full mt-2"
              onClick={() => {
                setMobileMenuOpen(false);
                alert("Book Demo Clicked");
              }}
            >
              Book a Demo
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <div className="max-w-4xl mx-auto px-6 pt-36 pb-20 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Aceternity UI Resizable Navbar Preview
        </h1>
        <p className="text-slate-600">
          Scroll down this preview page to experience the smooth Aceternity spring-physics navbar resizing.
        </p>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
            >
              <h3 className="text-lg font-semibold text-slate-800">
                Content Section {i}
              </h3>
              <p className="text-slate-500 mt-1 text-sm">
                As you scroll past 50px, notice the navbar container smoothly contracts, vertical padding narrows, elevation increases with a refined soft shadow, and the floating spring animation engages seamlessly.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

