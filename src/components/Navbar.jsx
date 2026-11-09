import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

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
    <header className="fixed top-2.5 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-6xl nav-glass rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between pointer-events-auto shadow-sm">
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
          className="nav-glass-dock hidden lg:flex items-center gap-1 rounded-full p-1 text-xs sm:text-sm font-medium"
        >
          <NavLink
            to="/"
            end
            onClick={handleNavigateHome}
            className={({ isActive }) =>
              `rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs border border-[#D4AF37]/40'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
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
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
              }`
            }
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#299D68] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#299D68]"></span>
            </span>
            <span>Biometric</span>
          </NavLink>

          <NavLink
            to="/gps-attendance"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
              }`
            }
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#590907] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#590907]"></span>
            </span>
            <span>GPS Attendance</span>
          </NavLink>

          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 transition ${
                isActive
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
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
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
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
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
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
                  ? 'bg-[#590907] text-[#F8F6F1] shadow-xs'
                  : 'text-[#242321] hover:text-[#590907] hover:bg-white/40'
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
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#590907] via-[#750C0A] to-[#590907] border border-[#D4AF37]/45 text-[#F8F6F1] px-5 py-2 text-xs sm:text-sm font-bold hover:brightness-110 transition shadow-sm cursor-pointer"
          >
            Book a Demo
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#242321] hover:bg-white/60 transition cursor-pointer"
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
          <div className="nav-glass rounded-2xl p-5 shadow-xl space-y-3 border border-[rgba(89,9,7,0.15)] bg-white/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Welcome Hub
              </NavLink>

              <NavLink
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                How It Works
              </NavLink>

              <NavLink
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Features
              </NavLink>

              <NavLink
                to="/biometric-attendance"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Biometric Attendance
              </NavLink>

              <NavLink
                to="/gps-attendance"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                GPS Attendance
              </NavLink>

              <NavLink
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Pricing Plans
              </NavLink>

              <NavLink
                to="/who-its-for"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Who It's For
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                About FlowPeople
              </NavLink>

              <NavLink
                to="/about-fluxora"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                About Fluxora
              </NavLink>

              <NavLink
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                FAQ
              </NavLink>

              <NavLink
                to="/announcements"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Announcements
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2.5 rounded-xl transition ${isActive ? 'bg-[#590907] text-white font-semibold' : 'text-[#242321] hover:bg-white/80'}`
                }
              >
                Contact Us
              </NavLink>
            </div>

            <div className="pt-2 border-t border-[rgba(89,9,7,0.1)]">
              <button
                type="button"
                onClick={handleBookDemo}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#590907] text-white py-3 text-xs font-semibold shadow-sm cursor-pointer"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
