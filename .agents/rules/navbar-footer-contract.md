---
description: Contract enforcing identical upper frosted-glass navbar and dark footer across all FlowPeople pages
globs: "src/**/*.{jsx,tsx}"
---

# FlowPeople Unified Navbar and Footer Contract

Whenever creating, modifying, or extending any page in the FlowPeople repository (`f:\flowpeople`):

1. **Header Consistency**:
   - The application uses the unified `<Navbar />` React component (`src/components/Navbar.jsx`).
   - The brand mark SVG gradient (`#fpGradHeader`), `Flowpeople BY FLUXORA` typography, and "Book Demo" CTA are integrated.
   - The central dock (`.nav-glass-dock`) reflects active routes via React Router `NavLink`:
     - Routes include: Welcome Hub (`/`), Biometric Attendance (`/biometric-attendance`), GPS Attendance (`/gps-attendance`), Pricing (`/pricing`), About (`/about`).
     - Active link: `rounded-full bg-[#590907] text-[#F8F6F1] px-3.5 sm:px-4 py-1.5 font-semibold shadow-xs transition`
     - Idle links: `rounded-full text-[#242321] hover:text-[#590907] hover:bg-white/40 px-3.5 sm:px-4 py-1.5 transition`

2. **Footer Consistency**:
   - The application uses the unified `<Footer />` React component (`src/components/Footer.jsx`).
   - Must include the `#fpGradFooter` SVG logo, 5-column navigation link grid, copyright section, and the `#fxWrap` / `#fxWord` radial spotlight stage with its interactive script.

