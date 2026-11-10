import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // shortcut: short timeout instead of MutationObserver; sufficient for client-rendered pages
      const timer = setTimeout(() => {
        const element = document.getElementById(id) || document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Refresh ScrollTrigger calculations after DOM paint
    if (typeof ScrollTrigger !== 'undefined') {
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
      return () => clearTimeout(refreshTimer);
    }
  }, [pathname, hash]);

  return null;
}
