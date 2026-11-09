# FlowPeople by Fluxora — Project Rules & Architecture Memory

## 1. Global Shell Contract (Navbar & Footer Uniformity)
Every single page or route in this repository (`f:\flowpeople`) **MUST** use the exact same upper frosted-glass navigation bar and footer layout as established by the global React components (`src/components/Navbar.jsx` and `src/components/Footer.jsx`).

### Top Navigation Bar Contract:
- **Container Structure**:
  ```jsx
  <header className="fixed top-2.5 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
    <div className="mx-auto max-w-6xl nav-glass rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between pointer-events-auto shadow-sm">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 transition hover:opacity-90">
        <BrandLogo variant="navbar" />
      </Link>

      {/* Center Experience Switcher Dock */}
      <nav aria-label="Experience Navigation" className="nav-glass-dock hidden lg:flex items-center gap-1 rounded-full p-1 text-xs sm:text-sm font-medium">
        <NavLink to="/" end className="...">Welcome Hub</NavLink>
        <NavLink to="/biometric-attendance" className="...">Biometric</NavLink>
        <NavLink to="/gps-attendance" className="...">GPS Attendance</NavLink>
        <NavLink to="/pricing" className="...">Pricing</NavLink>
        <NavLink to="/about" className="...">About</NavLink>
      </nav>

      {/* Right Action CTA */}
      <div className="flex items-center gap-2">
        <button onClick={handleBookDemo} className="rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
          Book Demo
        </button>
      </div>
    </div>
  </header>
  ```
- **Experience Switcher Dock Rules**:
  - The active page must carry: `rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white px-3.5 sm:px-4 py-1.5 font-semibold shadow-xs transition`
  - Inactive pages must carry: `rounded-full text-[#334155] hover:text-[#4F46E5] hover:bg-white/40 px-3.5 sm:px-4 py-1.5 transition`
  - When a new page is added to the project, its pill should be represented in the dock or linked through the standard React Router navigation.
- **Required Stylesheet Classes**:
  ```css
  .nav-glass {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(241, 245, 249, 0.78) 100%);
    backdrop-filter: blur(26px) saturate(190%);
    -webkit-backdrop-filter: blur(26px) saturate(190%);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 16px 36px -12px rgba(79, 70, 229, 0.12), 0 4px 16px -4px rgba(15, 23, 42, 0.06);
  }
  .nav-glass-dock {
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  ```

### Footer Contract:
- **Container Structure**:
  `<footer class="relative z-30 overflow-hidden bg-[#0B0F19] text-[#F8FAFC] border-t border-slate-800/80">`
- **Columns**: 5-column responsive grid (Brand intro, Experiences, Platform, Get in touch, Copyright).
- **Interactive Stage**: Mouse-tracking radial spotlight `FLUXORA.hq` wordmark (`#fxWrap` / `#fxWord`) with vanilla JavaScript event handler.

## 2. Design System Tokens (Enterprise Tech Blue & Indigo)
- **Primary Brand Accent**: Royal Indigo `#4F46E5` & Electric Blue `#2563EB`
- **Cyan / Sky Highlight**: `#38BDF8` / `#60A5FA`
- **Brand Squircle Emblem**: Gradient `from-[#38BDF8] via-[#2563EB] to-[#4F46E5]` with white `F.` emblem
- **Light Surfaces / Body**: Clean Modern Slate `#F8FAFC`
- **Soft Tint / Pill Surfaces**: Ethereal Blue/Indigo `#EEF2FF` & Border `#E0E7FF` / `#E2E8F0`
- **Dark Deep Text**: Charcoal Slate `#0F172A`
- **Muted Subtext**: Slate Gray `#64748B`
- **Dark Showrooms & Stages**: Midnight Obsidian `#0B0F19` to `#1E1B4B`
- **Success Accent**: Emerald Green `#10B981`

