# FlowPeople by Fluxora — Project Rules & Architecture Memory

## 1. Global Shell Contract (Navbar & Footer Uniformity)
Every single HTML page created or modified in this repository (`f:\flowpeople`) **MUST** use the exact same upper frosted-glass navigation bar and footer layout as established on the landing page (`index.html`).

### Top Navigation Bar Contract:
- **Container Structure**:
  ```html
  <header class="fixed top-2.5 left-3 right-3 sm:top-3.5 sm:left-6 sm:right-6 z-50">
    <div class="nav-glass max-w-7xl mx-auto rounded-2xl sm:rounded-full flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
      <!-- Brand Logo + Gradient Mark + Typography -->
      <a href="index.html" class="flex items-center gap-3 group">
        <span class="transition-transform group-hover:scale-105">
          <svg class="h-9 w-9 rounded-[10px] shrink-0 shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="fpGradHeader" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#590907" />
                <stop offset="52%" stop-color="#981C14" />
                <stop offset="100%" stop-color="#E0AF84" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="26" fill="url(#fpGradHeader)" />
            <rect x="1.5" y="1.5" width="97" height="97" rx="24.5" stroke="#FFF5E4" stroke-opacity="0.35" stroke-width="2" />
            <path d="M 31.5 31.2 A 6.0 6.0 0 0 1 37.7 25.2 C 50.5 25.2 62.0 28.2 67.8 33.8 C 70.4 36.3 68.4 40.5 64.4 39.2 C 58.5 37.2 51.5 36.2 43.4 36.2 A 1.5 1.5 0 0 0 41.9 37.7 L 41.9 46.2 A 1.5 1.5 0 0 0 43.4 47.7 L 54.4 47.7 A 4.9 4.9 0 0 1 54.4 57.5 L 43.4 57.5 A 1.5 1.5 0 0 0 41.9 59.0 L 41.9 68.0 A 5.2 5.2 0 0 1 31.5 68.0 Z" fill="#FFFDF9" />
            <circle cx="70.6" cy="52.6" r="5.35" fill="#FFFDF9" />
          </svg>
        </span>
        <span class="flex flex-col leading-none">
          <span class="text-[17px] font-bold tracking-tight">
            <span class="text-[#242321]">Flow</span><span class="text-[#590907]">people</span>
          </span>
          <span class="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#590907]/75">BY FLUXORA</span>
        </span>
      </a>

      <!-- Center Experience Switcher Dock -->
      <nav aria-label="Experience Switcher" class="nav-glass-dock flex items-center gap-1 rounded-full p-1 text-xs sm:text-sm font-medium">
        <a href="index.html" id="navBtnHub" class="rounded-full px-3.5 py-1.5 transition ...">Overview</a>
        <a href="flowpeople_v8.html" id="navBtnBio" class="rounded-full px-3.5 py-1.5 transition ...">Biometric Attendance</a>
        <a href="gps-attendance.html" id="navBtnGps" class="rounded-full px-3.5 py-1.5 transition ...">GPS Attendance</a>
        <a href="pricing.html" id="navBtnPricing" class="rounded-full px-3.5 py-1.5 transition ...">Pricing</a>
        <a href="about.html" id="navBtnAbout" class="rounded-full px-3.5 py-1.5 transition ...">About</a>
      </nav>

      <!-- Right Action CTA -->
      <div class="flex items-center gap-2">
        <a href="index.html#choose-attendance" id="headerPrimaryCta" class="rounded-full bg-[#590907] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-sm transition hover:bg-[#590907]/90">
          Explore Experiences
        </a>
      </div>
    </div>
  </header>
  ```
- **Experience Switcher Dock Rules**:
  - The active page must carry: `rounded-full bg-[#590907] text-[#F8F6F1] px-3.5 py-1.5 font-semibold shadow-xs transition`
  - Inactive pages must carry: `rounded-full text-[#242321]/85 hover:bg-white/70 hover:text-[#590907] px-3.5 py-1.5 transition`
  - When a new page is added to the project, its pill should be represented in the dock or linked through the standard navigation.
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

