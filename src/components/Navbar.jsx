import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import ResizableNavbar from './ui/resizable-navbar';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/contact?type=Book%20a%20Demo');
  };

  return (
    <ResizableNavbar
      className="fixed top-2.5 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none"
      containerClassName="mx-auto w-full max-w-6xl transition-all duration-500 ease-out"
      compactContainerClassName="max-w-5xl translate-y-1"
    >
      <div className="w-full nav-glass rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between pointer-events-auto shadow-sm border border-slate-200/80">
        {/* Left: Brand Logo */}
        <Link
          to="/"
          onClick={handleNavigateHome}
          className="flex items-center gap-2 transition hover:opacity-90"
          aria-label="FlowPeople by Fluxora Home"
        >
          <BrandLogo variant="navbar" />
        </Link>

        {/* Center Pill Dock (Visible on Desktop / Large Tablets) */}
        <nav
          aria-label="Experience Navigation"
          className="nav-glass-dock hidden lg:flex items-center gap-1 rounded-full p-1 text-xs sm:text-sm font-medium border border-indigo-100/60"
        >
          <NavLink
            to="/"
            end
            onClick={handleNavigateHome}
            className={({ isActive }) =>
              `rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            Welcome Hub
          </NavLink>

          <NavLink
            to="/biometric-attendance"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span>Biometric</span>
          </NavLink>

          <NavLink
            to="/gps-attendance"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
            </span>
            <span>GPS Attendance</span>
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            <span>Pricing</span>
          </NavLink>

          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            <span>How It Works</span>
          </NavLink>

          <NavLink
            to="/features"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            <span>Features</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs font-semibold'
                  : 'text-[#334155] hover:text-[#4F46E5] hover:bg-white/60'
              }`
            }
          >
            <span>About</span>
          </NavLink>
        </nav>

        {/* Right CTA & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBookDemo}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-5 py-2 text-xs sm:text-sm font-semibold hover:from-[#1D4ED8] hover:to-[#4338CA] transition shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            Book Demo
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#334155] hover:bg-white/60 transition cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-auto max-w-6xl pointer-events-auto">
          <div className="nav-glass rounded-2xl p-5 shadow-xl space-y-3 border border-slate-200/80 bg-white/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Welcome Hub
              </NavLink>

              <NavLink
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                How It Works
              </NavLink>

              <NavLink
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Features
              </NavLink>

              <NavLink
                to="/biometric-attendance"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Biometric Attendance
              </NavLink>

              <NavLink
                to="/gps-attendance"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                GPS Attendance
              </NavLink>

              <NavLink
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Pricing Plans
              </NavLink>

              <NavLink
                to="/who-its-for"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Who It's For
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                About FlowPeople
              </NavLink>

              <NavLink
                to="/about-fluxora"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                About Fluxora
              </NavLink>

              <NavLink
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                FAQ
              </NavLink>

              <NavLink
                to="/announcements"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Announcements
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#334155] hover:bg-indigo-50/70'}`
                }
              >
                Contact Us
              </NavLink>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={handleBookDemo}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white py-3 text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </ResizableNavbar>
  );
}
