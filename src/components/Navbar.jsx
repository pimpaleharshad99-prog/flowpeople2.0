import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from './BrandLogo';
import {
  Navbar as AceternityNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
  useNavbar,
} from './ui/resizable-navbar';

function NavbarContent({ visible: propVisible }) {
  const context = useNavbar();
  const visible = propVisible !== undefined ? propVisible : context.visible;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleNavigateHome = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    }, 50);
  };

  const handleBookDemo = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById('contact') || document.getElementById('choose-attendance');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact?type=Book%20a%20Demo');
    }
  };

  const navLinks = [
    { name: 'Welcome Hub', to: '/', end: true, badge: null },
    {
      name: 'Biometric',
      to: '/biometric-attendance',
      end: false,
      badge: (
        <span className="relative flex h-2 w-2 mr-1" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
        </span>
      ),
    },
    {
      name: 'GPS Attendance',
      to: '/gps-attendance',
      end: false,
      badge: (
        <span className="relative flex h-2 w-2 mr-1" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
        </span>
      ),
    },
    { name: 'Pricing', to: '/pricing', end: false, badge: null },
    { name: 'How It Works', to: '/how-it-works', end: false, badge: null },
    { name: 'Features', to: '/features', end: false, badge: null },
    { name: 'About', to: '/about', end: false, badge: null },
  ];

  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP RESIZABLE NAVBAR (Screen width >= lg)                   */}
      {/* Shrinks to sleek 720px pill; "Book Demo" only stays at top     */}
      {/* ============================================================== */}
      <NavBody
        contractedWidth="720px"
        expandedWidth="100%"
        visible={visible}
        className="border border-slate-200/80"
      >
        {/* Left: FlowPeople Brand Logo */}
        <Link
          to="/"
          onClick={handleNavigateHome}
          className="relative z-20 flex items-center gap-2 transition hover:opacity-90 flex-shrink-0"
          aria-label="FlowPeople by Fluxora Home"
        >
          <BrandLogo variant="navbar" />
        </Link>

        {/* Center Pill Dock with Aceternity Hover Capsule Animation */}
        <nav
          aria-label="Experience Navigation"
          onMouseLeave={() => setHoveredIdx(null)}
          className="nav-glass-dock relative flex items-center gap-1 rounded-full p-1 text-xs sm:text-sm font-medium border border-indigo-100/60"
        >
          {navLinks.map((item, idx) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={item.to === '/' ? handleNavigateHome : undefined}
              onMouseEnter={() => setHoveredIdx(idx)}
              className={({ isActive }) =>
                `relative rounded-full px-3 sm:px-3.5 py-1.5 transition flex items-center z-10 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:text-[#4F46E5]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Floating hover capsule across inactive items */}
                  {!isActive && hoveredIdx === idx && (
                    <motion.div
                      layoutId="hovered-nav-dock"
                      className="absolute inset-0 rounded-full bg-white/70 shadow-xs border border-indigo-100/60 -z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  {item.badge}
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA Action: ONLY stays at upper part; removed on scroll */}
        <AnimatePresence>
          {!visible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: 'auto' }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 flex-shrink-0 overflow-hidden"
            >
              <NavbarButton
                variant="gradient"
                onClick={handleBookDemo}
                className="shadow-md shadow-indigo-500/20 whitespace-nowrap"
              >
                Book Demo
              </NavbarButton>
            </motion.div>
          )}
        </AnimatePresence>
      </NavBody>

      {/* ============================================================== */}
      {/* MOBILE RESIZABLE NAVBAR (Screen width < lg)                     */}
      {/* Quick pill only stays at upper part; removed on scroll          */}
      {/* ============================================================== */}
      <MobileNav visible={visible} className="border border-slate-200/80">
        <MobileNavHeader>
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={handleNavigateHome}
            className="flex items-center gap-2 transition hover:opacity-90"
            aria-label="FlowPeople by Fluxora Home"
          >
            <BrandLogo variant="navbar" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Quick Mobile "Book Demo" pill: ONLY stays at upper part */}
            <AnimatePresence>
              {!visible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 'auto' }}
                  exit={{ opacity: 0, scale: 0.9, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden sm:inline-flex overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleBookDemo}
                    className="items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-4 py-1.5 text-xs font-semibold hover:from-[#1D4ED8] hover:to-[#4338CA] transition shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Book Demo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Animated Hamburger / Close Button */}
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        {/* Mobile Navigation Drawer with AnimatePresence */}
        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          {/* Full Grid of 12 Navigation Destinations */}
          <div className="grid grid-cols-2 gap-2 text-xs font-medium w-full">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Welcome Hub
            </NavLink>

            <NavLink
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              How It Works
            </NavLink>

            <NavLink
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Features
            </NavLink>

            <NavLink
              to="/biometric-attendance"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Biometric Attendance
            </NavLink>

            <NavLink
              to="/gps-attendance"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              GPS Attendance
            </NavLink>

            <NavLink
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Pricing Plans
            </NavLink>

            <NavLink
              to="/who-its-for"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Who It's For
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              About FlowPeople
            </NavLink>

            <NavLink
              to="/about-fluxora"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              About Fluxora
            </NavLink>

            <NavLink
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              FAQ
            </NavLink>

            <NavLink
              to="/announcements"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Announcements
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition ${
                  isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'
                }`
              }
            >
              Contact Us
            </NavLink>
          </div>

          {/* Full-width Book a Demo CTA in mobile drawer */}
          <div className="pt-2 border-t border-slate-200/80 w-full">
            <button
              type="button"
              onClick={handleBookDemo}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white py-3 text-xs font-semibold shadow-md shadow-indigo-500/20 hover:from-[#1D4ED8] hover:to-[#4338CA] transition cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </>
  );
}

export default function Navbar() {
  return (
    <AceternityNavbar scrollThreshold={30}>
      <NavbarContent />
    </AceternityNavbar>
  );
}
