---
description: Contract enforcing identical upper frosted-glass navbar and dark footer across all FlowPeople pages
globs: "*.html"
---

# FlowPeople Unified Navbar and Footer Contract

Whenever creating, modifying, or extending any page in the FlowPeople repository (`f:\flowpeople`):

1. **Header Consistency**:
   - Every page must contain the canonical frosted-glass `<header class="fixed top-2.5 left-3 right-3 sm:top-3.5 sm:left-6 sm:right-6 z-50">`.
   - The brand mark SVG gradient (`#fpGradHeader`), `Flowpeople BY FLUXORA` typography, and "Explore Experiences" CTA must be present.
   - The central dock (`.nav-glass-dock`) must reflect the active route:
     - Includes: Overview (`index.html`), Biometric Attendance (`biometric-attendance.html`), GPS Attendance (`gps-attendance.html`), Pricing (`pricing.html` / `/pricing`), About (`about.html` / `/about`).
     - Active link: `rounded-full bg-[#590907] text-[#F8F6F1] px-3.5 py-1.5 font-semibold shadow-xs transition`
     - Idle links: `rounded-full text-[#242321]/85 hover:bg-white/70 hover:text-[#590907] px-3.5 py-1.5 transition`
   - Include `.nav-glass` and `.nav-glass-dock` in the page `<style>` block.

2. **Footer Consistency**:
   - Every page must terminate with the canonical `<footer class="relative z-30 overflow-hidden bg-[#1c1b19] text-[#F8F6F1]">`.
   - Must include the `#fpGradFooter` SVG logo, 5-column navigation link grid, copyright section, and the `#fxWrap` / `#fxWord` radial spotlight stage with its interactive script.

