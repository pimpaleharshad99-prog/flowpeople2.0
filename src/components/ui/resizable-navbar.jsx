import React, { useEffect, useState } from 'react';

/**
 * ResizableNavbar
 * A lightweight React/Tailwind adaptation of Aceternity UI's resizable navbar
 * behaviour. It contracts its content container after the page is scrolled.
 *
 * Kept dependency-free so FlowPeople can retain its existing Tailwind v3,
 * JSX and lucide-react setup without a framework or styling migration.
 */
export default function ResizableNavbar({
  children,
  className = '',
  containerClassName = '',
  compactContainerClassName = '',
  scrollThreshold = 24,
}) {
  const [isScrolled, setIsScrolled] = useState(
    typeof window !== 'undefined' && window.scrollY > scrollThreshold
  );

  useEffect(() => {
    let frame = null;

    const updateScrollState = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > scrollThreshold);
      });
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [scrollThreshold]);

  return (
    <header className={className} data-resizable-navbar data-scrolled={isScrolled ? 'true' : 'false'}>
      <div
        className={[
          containerClassName,
          isScrolled ? compactContainerClassName : '',
        ].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </header>
  );
}
