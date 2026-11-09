import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Direct Page Imports for Instant, Zero-Latency Transitions (No Loading Spinners)
import LandingHubPage from './pages/LandingHubPage';
import GpsAttendancePage from './pages/GpsAttendancePage';
import BiometricAttendancePage from './pages/BiometricAttendancePage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import FaqPage from './pages/FaqPage';
import AboutFluxoraPage from './pages/AboutFluxoraPage';
import WhoItsForPage from './pages/WhoItsForPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#590907] selection:text-[#F8F6F1]">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Main Experience Routes */}
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

          {/* Secure Admin Operations Suite */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/login" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />

          {/* Legacy .html Aliases & Redirects to Prevent Any Broken Links */}
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/flowpeople_v8.html" element={<Navigate to="/biometric-attendance" replace />} />
          <Route path="/gps-attendance.html" element={<Navigate to="/gps-attendance" replace />} />
          <Route path="/biometric-attendance.html" element={<Navigate to="/biometric-attendance" replace />} />
          <Route path="/pricing.html" element={<Navigate to="/pricing" replace />} />
          <Route path="/about.html" element={<Navigate to="/about" replace />} />
          <Route path="/about-fluxora.html" element={<Navigate to="/about-fluxora" replace />} />
          <Route path="/how-it-works.html" element={<Navigate to="/how-it-works" replace />} />
          <Route path="/features.html" element={<Navigate to="/features" replace />} />
          <Route path="/announcements.html" element={<Navigate to="/announcements" replace />} />
          <Route path="/faq.html" element={<Navigate to="/faq" replace />} />
          <Route path="/who-its-for.html" element={<Navigate to="/who-its-for" replace />} />
          <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
          <Route path="/admin.html" element={<Navigate to="/admin" replace />} />
          <Route path="/privacy.html" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms.html" element={<Navigate to="/terms" replace />} />

          {/* Catch-all fallback redirect to hub */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
