import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Mail,
  Calendar,
  ArrowRight,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import BusinessInquiryForm from "../components/contact/BusinessInquiryForm";

const INQUIRY_CHANNELS = [
  "Product Demonstrations",
  "Pricing & Commercials",
  "Architecture Reviews",
  "Hardware Compatibility",
  "Technology Partnerships",
  "Custom Scopes",
];

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [selectedInquiryType, setSelectedInquiryType] = useState<string>("Book a Demo");

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      if (typeParam.toLowerCase().includes("demo")) {
        setSelectedInquiryType("Book a Demo");
      } else if (typeParam.toLowerCase().includes("pricing")) {
        setSelectedInquiryType("Pricing Inquiry");
      }
    }
  }, [searchParams]);

  const handlePreselectDemo = () => {
    setSelectedInquiryType("Book a Demo");
    const el = document.getElementById("business-inquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="contact-page min-h-screen bg-[#F8FAFC] text-slate-900 pt-24 pb-20">
      {/* Target anchor for links referencing #contact */}
      <div id="contact" className="sr-only" />

      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-100/70 via-white to-slate-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100/80 px-4 py-1.5 text-xs font-bold tracking-wider text-indigo-600 uppercase mb-6 shadow-xs"
          >
            <Mail className="h-3.5 w-3.5 text-indigo-600" />
            <span>GET IN TOUCH</span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 font-serif max-w-5xl mx-auto leading-[1.08]"
          >
            Let's Talk About <span className="text-indigo-600">Your Business.</span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed"
          >
            Have questions about FlowPeople, pricing, or implementation? Connect with our team to
            explore our biometric kiosk and GPS attendance platform for your organization.
          </motion.p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. TWO-COLUMN CONTACT & BUSINESS INQUIRY SECTION                       */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: CONTACT INFORMATION & DEMO CARD (~40%)               */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 space-y-6 sm:space-y-8"
          >
            {/* Card 1: Direct Communication Information */}
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-7 sm:p-8 shadow-[0_12px_50px_rgba(15,23,42,0.04)] space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                  DIRECT COMMUNICATION
                </p>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                  General &amp; Product Inquiries
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Connect directly with our solutions and product engineering team. We typically respond
                  within 24 hours on business days.
                </p>
              </div>

              {/* Email Contact Card */}
              <a
                href="mailto:hqfluxora@gmail.com"
                className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200 text-xs sm:text-sm shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Email Us Directly
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      hqfluxora@gmail.com
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Inquiry Channels We Support */}
              <div className="border-t border-slate-100 pt-6 space-y-3.5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-900">
                  INQUIRY CHANNELS WE SUPPORT
                </p>
                <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600 font-medium">
                  {INQUIRY_CHANNELS.map((channel) => (
                    <div key={channel} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="truncate">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Demo Card */}
            <div className="rounded-[28px] border border-indigo-100/90 bg-gradient-to-br from-indigo-50/60 via-slate-50/40 to-white p-6 sm:p-7 shadow-xs space-y-3.5 hover:shadow-md hover:border-indigo-200 transition-all duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-[0.12em]">
                <div className="h-6 w-6 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <span>BOOK A DEMONSTRATION</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Want to see FlowPeople in action?
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Select "Book a Demo" on the inquiry form to request a tailored product walkthrough.
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handlePreselectDemo}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white border border-indigo-200/80 px-4 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Select Book a Demo on Form</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: BUSINESS INQUIRY FORM (~60%)                        */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-7"
          >
            <BusinessInquiryForm
              selectedInquiryType={selectedInquiryType}
              onInquiryTypeChange={setSelectedInquiryType}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
