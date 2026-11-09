"use client";
import React, { useRef, useState, useEffect, createContext, useContext } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/**
 * Aceternity UI Resizable Navbar (Adapted for FlowPeople)
 * 
 * Features:
 * - Spring-physics scroll resizing (width, elevation, vertical padding, offset)
 * - Seamless desktop navbar contraction from wide (1152px) down to sleek pill (840px)
 * - Dual-layer scroll detection (Motion useScroll + native window scroll listener)
 * - Context-driven visibility distribution for bulletproof state reactivity
 * - Smooth layoutId hover capsule animations on desktop nav items
 * - Fully animated mobile drawer with AnimatePresence
 * - Tabler icons for accessible mobile toggle
 * - Enterprise Tech Blue & Indigo theme integration
 */

export const NavbarContext = createContext({ visible: false });
export const useNavbar = () => useContext(NavbarContext);

export const Navbar = ({
  children,
  className,
  scrollThreshold = 30,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // 1. Direct native window scroll listener for zero-lag reactivity
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            window.scrollY ||
            0;
          setVisible(scrollY > scrollThreshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  // 2. Motion scroll value listener for integrated Motion spring scheduling
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > scrollThreshold);
  });

  return (
    <NavbarContext.Provider value={{ visible }}>
      <header
        ref={ref}
        className={cn(
          "fixed top-2.5 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none transition-transform duration-200",
          className
        )}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { visible })
            : child
        )}
      </header>
    </NavbarContext.Provider>
  );
};

export const NavBody = ({
  children,
  className,
  visible: propVisible,
  contractedWidth = "840px",
  expandedWidth = "100%",
}) => {
  const context = useNavbar();
  const visible = propVisible !== undefined ? propVisible : context.visible;

  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(26px) saturate(190%)" : "blur(18px) saturate(180%)",
        WebkitBackdropFilter: visible ? "blur(26px) saturate(190%)" : "blur(18px) saturate(180%)",
        boxShadow: visible
          ? "0 20px 40px -12px rgba(79, 70, 229, 0.22), 0 4px 16px -4px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(79, 70, 229, 0.15)"
          : "0 10px 28px -12px rgba(79, 70, 229, 0.10), 0 2px 10px -4px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.08)",
        width: visible ? contractedWidth : expandedWidth,
        maxWidth: visible ? contractedWidth : "1152px",
        y: visible ? 8 : 0,
        paddingTop: visible ? "0.45rem" : "0.7rem",
        paddingBottom: visible ? "0.45rem" : "0.7rem",
        paddingLeft: visible ? "1.25rem" : "1.5rem",
        paddingRight: visible ? "1.25rem" : "1.5rem",
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 32,
        mass: 0.8,
      }}
      className={cn(
        "pointer-events-auto relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full py-2.5 lg:flex nav-glass",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({
  items = [],
  children,
  className,
  onItemClick,
}) => {
  const [hovered, setHovered] = useState(null);

  // If custom children are provided, render them wrapped in a hover-tracking container
  if (children) {
    return (
      <div
        className={cn(
          "relative hidden flex-1 flex-row items-center justify-center space-x-1 lg:flex",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative hidden flex-1 flex-row items-center justify-center gap-1 text-xs sm:text-sm font-medium text-slate-700 lg:flex nav-glass-dock rounded-full p-1",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={`nav-item-${idx}`}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3.5 py-1.5 rounded-full text-slate-700 hover:text-indigo-600 transition-colors"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered-capsule"
              className="absolute inset-0 h-full w-full rounded-full bg-white/70 shadow-xs border border-indigo-100/60"
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-20 flex items-center gap-1.5">
            {item.badge}
            {item.name}
          </span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({
  children,
  className,
  visible: propVisible,
}) => {
  const context = useNavbar();
  const visible = propVisible !== undefined ? propVisible : context.visible;

  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(26px) saturate(190%)" : "blur(18px) saturate(180%)",
        WebkitBackdropFilter: visible ? "blur(26px) saturate(190%)" : "blur(18px) saturate(180%)",
        boxShadow: visible
          ? "0 18px 36px -12px rgba(79, 70, 229, 0.22), 0 4px 16px -4px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(79, 70, 229, 0.15)"
          : "0 10px 24px -12px rgba(79, 70, 229, 0.10), 0 2px 10px -4px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.08)",
        width: visible ? "90%" : "100%",
        maxWidth: visible ? "90%" : "100%",
        y: visible ? 6 : 0,
        borderRadius: visible ? "1.25rem" : "1.5rem",
        paddingTop: visible ? "0.45rem" : "0.65rem",
        paddingBottom: visible ? "0.45rem" : "0.65rem",
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 32,
        mass: 0.8,
      }}
      className={cn(
        "pointer-events-auto relative z-50 mx-auto flex w-full max-w-6xl flex-col items-center justify-between rounded-2xl px-3.5 py-2 sm:px-5 lg:hidden nav-glass",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={cn(
            "pointer-events-auto mt-2 w-full flex flex-col gap-3 rounded-2xl p-4 sm:p-5 nav-glass bg-white/95 backdrop-blur-2xl shadow-xl border border-slate-200/90",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-white/60 transition cursor-pointer flex items-center justify-center",
        className
      )}
      aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <IconX className="h-5 w-5" />
      ) : (
        <IconMenu2 className="h-5 w-5" />
      )}
    </button>
  );
};

export const NavbarLogo = ({
  href = "/",
  children,
  className,
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "relative z-20 flex items-center gap-2 transition hover:opacity-90",
        className
      )}
    >
      {children || (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">FlowPeople</span>
        </div>
      )}
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "gradient",
  onClick,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95";

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 shadow-md",
    secondary:
      "bg-white/80 hover:bg-white text-slate-700 hover:text-indigo-600 border border-slate-200/80 shadow-xs",
    dark:
      "bg-[#0B0F19] hover:bg-[#1E1B4B] text-white shadow-md shadow-slate-900/20",
    gradient:
      "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white shadow-md shadow-indigo-500/25",
  };

  return (
    <Tag
      href={href || undefined}
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
  NavbarButton,
  useNavbar,
};
