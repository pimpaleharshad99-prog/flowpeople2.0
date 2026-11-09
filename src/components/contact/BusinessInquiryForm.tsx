import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Send,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { motion } from "motion/react";
import { leadService } from "../../services/leadService";

export type InquiryFormData = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: string;
  plan: string;
  teamSize: string;
  message: string;
};

const INITIAL_FORM: InquiryFormData = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  inquiryType: "Book a Demo",
  plan: "Starter (30 employees)",
  teamSize: "",
  message: "",
};

export const INQUIRY_TYPES = [
  "Book a Demo",
  "Pricing Inquiry",
  "Product Information",
  "Technical Consultation",
  "Partnership",
  "Other",
] as const;

export const INQUIRY_PLANS = [
  "Starter (30 employees)",
  "Growth",
  "Business",
  "Enterprise",
  "Not Sure Yet",
] as const;

interface BusinessInquiryFormProps {
  className?: string;
  selectedInquiryType?: string;
  onInquiryTypeChange?: (type: string) => void;
}

export default function BusinessInquiryForm({
  className = "",
  selectedInquiryType,
  onInquiryTypeChange,
}: BusinessInquiryFormProps) {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<InquiryFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState<InquiryFormData | null>(null);

  // Sync from URL search params on mount or when searchParams change
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const planParam = searchParams.get("plan");

    if (typeParam) {
      const matchedType = INQUIRY_TYPES.find(
        (t) => t.toLowerCase() === typeParam.toLowerCase() ||
               (typeParam.toLowerCase().includes("demo") && t === "Book a Demo") ||
               (typeParam.toLowerCase().includes("pricing") && t === "Pricing Inquiry")
      );
      if (matchedType) {
        setForm((prev) => ({ ...prev, inquiryType: matchedType }));
      }
    }

    if (planParam) {
      const matchedPlan = INQUIRY_PLANS.find(
        (p) => p.toLowerCase().includes(planParam.toLowerCase()) ||
               (planParam.toLowerCase() === "starter" && p.startsWith("Starter"))
      );
      if (matchedPlan) {
        setForm((prev) => ({ ...prev, plan: matchedPlan }));
      }
    }
  }, [searchParams]);

  // Sync external prop if provided
  useEffect(() => {
    if (selectedInquiryType && INQUIRY_TYPES.includes(selectedInquiryType as any)) {
      setForm((prev) => ({ ...prev, inquiryType: selectedInquiryType }));
    }
  }, [selectedInquiryType]);

  const updateField = (field: keyof InquiryFormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    if (field === "inquiryType" && onInquiryTypeChange) {
      onInquiryTypeChange(value);
    }
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // 1. Required field validation
    if (!form.fullName.trim() || !form.email.trim() || !form.company.trim()) {
      setError("Please complete all required fields (Full Name, Business Email, and Company Name).");
      return;
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please provide a valid corporate business email address (e.g. name@company.com).");
      return;
    }

    // 3. Team size validation (cannot be negative)
    if (form.teamSize.trim()) {
      const sizeNum = parseInt(form.teamSize.trim(), 10);
      if (isNaN(sizeNum) || sizeNum < 1) {
        setError("Approximate team size must be a positive number.");
        return;
      }
    }

    setLoading(true);

    try {
      // Connect to FlowPeople live lead submission service (backed by MongoDB Atlas + offline cache)
      const res = await leadService.submitLead({
        full_name: form.fullName.trim(),
        business_email: form.email.trim(),
        company_name: form.company.trim(),
        phone_number: form.phone.trim() || undefined,
        employee_count: form.teamSize.trim() ? `${form.teamSize.trim()} employees` : undefined,
        interested_plan: form.plan,
        inquiry_type: form.inquiryType,
        message: form.message.trim() || undefined,
        source: "website_business_inquiry_form",
      });

      if (res.success) {
        setSubmittedData({ ...form });
        setSuccess(true);
      } else {
        setError(res.error || "Unable to submit your inquiry to our system. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your inquiry. Please try again or reach out to hqfluxora@gmail.com directly."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setSubmittedData(null);
    setSuccess(false);
    setError("");
  };

  const inputClass =
    "w-full min-h-[50px] rounded-xl border border-slate-200/90 " +
    "bg-slate-50/70 px-4 text-[14px] sm:text-[15px] font-medium text-slate-900 " +
    "placeholder:text-slate-400 outline-none transition-all duration-200 " +
    "hover:border-indigo-200 focus:border-indigo-500 " +
    "focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  const labelClass = "mb-2 block text-xs sm:text-sm font-semibold text-slate-800 tracking-tight";

  return (
    <section
      id="business-inquiry"
      className={`relative w-full rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_50px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10 ${className}`}
    >
      {/* Header Eyebrow, Title & Subtitle */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
          Transparent Commercial Consultation
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
          Business Inquiry Form
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-500">
          Share your team size and operational requirements for a direct recommendation.
        </p>
      </div>

      {success && submittedData ? (
        /* Confirmed Success State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-2"
        >
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 p-5 text-sm font-medium text-emerald-800 shadow-xs"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900">
                Inquiry Submitted Successfully
              </p>
              <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                Thank you, <strong>{submittedData.fullName}</strong>. Your inquiry has been
                transmitted to our enterprise solutions desk at <strong>hqfluxora@gmail.com</strong>.
                A solutions engineer will review your requirements and reach out within 24 business hours.
              </p>
            </div>
          </div>

          {/* Submission Details Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-slate-900 border-b border-slate-200/80 pb-2 flex items-center justify-between">
              <span>Submitted Inquiry Summary</span>
              <span className="text-[11px] font-normal text-slate-400">
                Recorded via Secure Gateway
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Company
                </span>
                <span className="font-semibold text-slate-800">{submittedData.company}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Business Email
                </span>
                <span className="font-semibold text-slate-800">{submittedData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Inquiry Type
                </span>
                <span className="font-semibold text-indigo-600">{submittedData.inquiryType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Interested Plan
                </span>
                <span className="font-semibold text-slate-800">{submittedData.plan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Team Size
                </span>
                <span className="font-semibold text-slate-800">
                  {submittedData.teamSize ? `${submittedData.teamSize} employees` : "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Phone Number
                </span>
                <span className="font-semibold text-slate-800">
                  {submittedData.phone || "Not provided"}
                </span>
              </div>
            </div>
            {submittedData.message && (
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                  Notes / Questions
                </span>
                <p className="mt-1 text-slate-700 text-xs italic bg-white p-3 rounded-xl border border-slate-200/60">
                  "{submittedData.message}"
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer shadow-sm active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Submit Another Inquiry</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Form Inputs */
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl bg-red-50/90 border border-red-200/80 p-4 text-xs sm:text-sm font-medium text-red-700 shadow-xs"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Full Name & Business Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="e.g. Anand Mahindra"
                className={inputClass}
                autoComplete="name"
              />
            </div>

            <div>
              <label className={labelClass}>Business Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="name@company.com"
                className={inputClass}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Row 2: Company Name & Phone Number */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Company Name *</label>
              <input
                required
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Company or Organization"
                className={inputClass}
                autoComplete="organization"
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Row 3: Inquiry Type, Interested Plan & Approx. Team Size */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className={labelClass}>Inquiry Type</label>
              <select
                value={form.inquiryType}
                onChange={(e) => updateField("inquiryType", e.target.value)}
                className={inputClass}
              >
                {INQUIRY_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Interested Plan</label>
              <select
                value={form.plan}
                onChange={(e) => updateField("plan", e.target.value)}
                className={inputClass}
              >
                {INQUIRY_PLANS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Approx. Team Size</label>
              <input
                type="number"
                min="1"
                value={form.teamSize}
                onChange={(e) => updateField("teamSize", e.target.value)}
                placeholder="e.g. 45"
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 4: Message or Questions (Full Width) */}
          <div>
            <label className={labelClass}>Message or Questions</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Tell us about your team setup, preferred attendance modes, or specific workflows..."
              className={`${inputClass} min-h-[130px] resize-y py-3.5`}
            />
          </div>

          {/* Full-Width Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex min-h-[54px] sm:min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 text-sm sm:text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Submitting Business Inquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Business Inquiry</span>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Security & Privacy Reassurance */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Your business information is secure and will only be used to respond to your inquiry.</span>
          </div>
        </form>
      )}
    </section>
  );
}

