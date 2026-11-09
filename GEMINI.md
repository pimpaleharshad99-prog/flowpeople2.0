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
        <button onClick={handleBookDemo} className="rounded-full bg-[#590907] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-sm transition hover:bg-[#590907]/90">
          Book Demo
        </button>
      </div>
    </div>
  </header>
  ```
- **Experience Switcher Dock Rules**:
  - The active page must carry: `rounded-full bg-[#590907] text-[#F8F6F1] px-3.5 sm:px-4 py-1.5 font-semibold shadow-xs transition`
  - Inactive pages must carry: `rounded-full text-[#242321] hover:text-[#590907] hover:bg-white/40 px-3.5 sm:px-4 py-1.5 transition`
  - When a new page is added to the project, its pill should be represented in the dock or linked through the standard React Router navigation.
- **Required Stylesheet Classes**:
  ```css
  .nav-glass {
    background: linear-gradient(135deg, rgba(255, 253, 249, 0.78) 0%, rgba(246, 238, 226, 0.68) 100%);
    backdrop-filter: blur(26px) saturate(190%);
    -webkit-backdrop-filter: blur(26px) saturate(190%);
    border: 1px solid rgba(89, 9, 7, 0.12);
    box-shadow: 0 16px 36px -12px rgba(89, 9, 7, 0.14), 0 4px 16px -4px rgba(36, 35, 33, 0.08);
  }
  .nav-glass-dock {
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(89, 9, 7, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  ```

### Footer Contract:
- **Container Structure**:
  `<footer class="relative z-30 overflow-hidden bg-[#1c1b19] text-[#F8F6F1]">`
- **Columns**: 5-column responsive grid (Brand intro, Experiences, Platform, Get in touch, Copyright).
- **Interactive Stage**: Mouse-tracking radial spotlight `FLUXORA.hq` wordmark (`#fxWrap` / `#fxWord`) with vanilla JavaScript event handler.

## 2. Design System Tokens
- **Burgundy Accent**: `#590907`
- **Gradient Secondary**: `#981C14` to `#E0AF84`
- **Warm Cream Background / Pill**: `#E8D2B5` / `#F8F6F1`
- **Charcoal Text**: `#242321`
- **Footer Dark**: `#1c1b19`

