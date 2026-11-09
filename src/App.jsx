import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Priority Entry Route (Immediate Load)
import LandingHubPage from './pages/LandingHubPage';

// On-Demand Code-Split Routes (Asynchronous Chunks)
const GpsAttendancePage = lazy(() => import('./pages/GpsAttendancePage'));
const BiometricAttendancePage = lazy(() => import('./pages/BiometricAttendancePage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Product & Company Expansion Routes
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const AboutFluxoraPage = lazy(() => import('./pages/AboutFluxoraPage'));
const WhoItsForPage = lazy(() => import('./pages/WhoItsForPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Admin Leads & Operations Suite (Direct URL Only)
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Elegant Minimalist Skeleton Loader
function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="h-7 w-7 rounded-full border-2 border-[#D4AF37]/30 border-t-[#590907] animate-spin" />
      <span className="text-[11px] font-semibold tracking-widest uppercase text-[#590907]/60">Loading Experience...</span>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#590907] selection:text-[#F8F6F1]">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingHubPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gps-attendance" element={<GpsAttendancePage />} />
            <Route path="/biometric-attendance" element={<BiometricAttendancePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />

            {/* Product & Company Expansion Routes */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/about-fluxora" element={<AboutFluxoraPage />} />
            <Route path="/who-its-for" element={<WhoItsForPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Secure Admin Lead & Operations Routes (Direct URL Only) */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminPage />} />
            <Route path="/admin/dashboard" element={<AdminPage />} />

            {/* Catch-all fallback redirect to hub */}
            <Route path="*" element={<LandingHubPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
