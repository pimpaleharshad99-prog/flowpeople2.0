import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const fxWrapRef = useRef(null);
  const fxWordRef = useRef(null);

  useEffect(() => {
    const wrap = fxWrapRef.current;
    const word = fxWordRef.current;
    if (!wrap || !word) return;

    let animId;
    let isOn = false;
    let op = 0;
    const t0 = performance.now();
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fit = () => {
      if (!wrap || !word) return;
      word.style.fontSize = '100px';
      const cs = getComputedStyle(wrap);
      const av = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const rg = document.createRange();
      rg.selectNodeContents(word);
      const wWidth = rg.getBoundingClientRect().width || av;
      word.style.fontSize = Math.max(24, Math.floor(100 * av / wWidth * 0.98)) + 'px';
    };

    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    }

    const handleMouseMove = (e) => {
      const r = word.getBoundingClientRect();
      word.style.setProperty('--mx', `${e.clientX - r.left}px`);
      word.style.setProperty('--my', `${e.clientY - r.top}px`);
      isOn = true;
    };

    const handleMouseLeave = () => {
      isOn = false;
    };

    word.addEventListener('mousemove', handleMouseMove);
    word.addEventListener('mouseleave', handleMouseLeave);

    const loop = (t) => {
      op += ((isOn ? 1 : (prefersReducedMotion ? 0 : 0.45)) - op) * 0.12;
      word.style.setProperty('--o', op.toFixed(3));
      if (!isOn && !prefersReducedMotion) {
        const r = word.getBoundingClientRect();
        word.style.setProperty('--mx', `${r.width * (((t - t0) / 6000) % 1)}px`);
        word.style.setProperty('--my', `${r.height * 0.5}px`);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', fit);
      word.removeEventListener('mousemove', handleMouseMove);
      word.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <footer className="relative z-30 overflow-hidden bg-[#1c1b19] text-[#F8F6F1]">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block transition hover:opacity-90">
              <BrandLogo variant="footer" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#F8F6F1]/75">
              Simple, friendly attendance and HR for modern teams. By Fluxora.
            </p>
            <div className="mt-5 space-y-1.5 text-xs text-[#F8F6F1]/65">
              <div>
                <a href="mailto:hqfluxora@gmail.com" className="hover:text-white transition font-medium text-[#E8D2B5]">
                  hqfluxora@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#F8F6F1]/65">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/features#leave-management" className="hover:text-white transition">
                  Leave Management
                </Link>
              </li>
              <li>
                <Link to="/features#reports-analytics" className="hover:text-white transition">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/biometric-attendance" className="hover:text-white transition">
                  Biometric Attendance
                </Link>
              </li>
              <li>
                <Link to="/gps-attendance" className="hover:text-white transition">
                  GPS Attendance
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-white transition">
                  Announcements
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#F8F6F1]/65">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About FlowPeople
                </Link>
              </li>
              <li>
                <Link to="/about-fluxora" className="hover:text-white transition">
                  About Fluxora
                </Link>
              </li>
              <li>
                <Link to="/who-its-for" className="hover:text-white transition">
                  Who It's For
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch Column */}
          <div>
            <h4 className="text-sm font-semibold text-white">Get in touch</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F8F6F1]/65">
              <li>
                <a href="mailto:hqfluxora@gmail.com" className="hover:text-white transition font-medium">
                  hqfluxora@gmail.com
                </a>
              </li>
              <li>
                <Link
                  to="/contact?type=Book%20a%20Demo"
                  className="hover:text-white transition inline-flex items-center gap-1.5 text-xs text-[#E8D2B5] font-semibold hover:underline"
                >
                  <span>Book a Demo</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-xs text-[#A5A79B] block">Response within 24 business hours</span>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="text-sm font-semibold text-white">Legal &amp; Trust</h4>
            <ul className="mt-4 space-y-2 text-sm text-[#F8F6F1]/65">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  License Terms
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  Security &amp; FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#F8F6F1]/50 sm:flex-row">
          <span>© 2026 Fluxora. All rights reserved.</span>
          <span className="flex gap-5">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link>
          </span>
        </div>
      </div>

      {/* Interactive Giant Radial Spotlight Wordmark */}
      <div ref={fxWrapRef} id="fxWrap" className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-10 sm:px-8">
        <div
          ref={fxWordRef}
          id="fxWord"
          aria-hidden="true"
          className="select-none whitespace-nowrap text-center font-semibold leading-none"
          style={{
            '--mx': '50%',
            '--my': '50%',
            '--o': '0',
            fontSize: '100px',
            letterSpacing: '0.04em',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundImage:
              'radial-gradient(circle 240px at var(--mx) var(--my), rgba(255,236,205,calc(0.95*var(--o))) 0%, rgba(232,210,181,calc(0.55*var(--o))) 40%, rgba(255,255,255,0) 100%), linear-gradient(100deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.07) 100%)',
            transition: '--o .3s',
          }}
        >
          FLUXORA<span className="text-[#A5A79B]/80">.hq</span>
        </div>
      </div>
    </footer>
  );
}

