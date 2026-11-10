// src/components/contact/InquiryForm.tsx
import React, { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Building2,
  Phone,
  Users,
  Send,
  Loader2,
  CheckCircle2,
  Lock,
  Clock,
  ShieldCheck,
  CalendarCheck,
  BadgeDollarSign,
  Network,
  Cpu,
  Handshake,
  Wrench,
  AlertCircle,
  Sparkles,
  Quote,
} from "lucide-react";
import { leadService } from "../../services/leadService";

export type InquiryType =
  | "demo"
  | "pricing"
  | "architecture"
  | "hardware"
  | "partnership"
  | "custom";

export type Plan = "starter" | "professional" | "enterprise" | "unsure";

export interface FormData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: InquiryType;
  plan: Plan;
  teamSize: string;
  message: string;
  honeypot?: string; // Bot protection
}

type Errors = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "sending" | "success" | "error";

export const INQUIRY_TYPES: { id: InquiryType; label: string; icon: ReactNode }[] = [
  { id: "demo", label: "Book a Demo", icon: <CalendarCheck size={16} /> },
  { id: "pricing", label: "Pricing & Commercials", icon: <BadgeDollarSign size={16} /> },
  { id: "architecture", label: "Architecture Review", icon: <Network size={16} /> },
  { id: "hardware", label: "Hardware Compatibility", icon: <Cpu size={16} /> },
  { id: "partnership", label: "Technology Partnership", icon: <Handshake size={16} /> },
  { id: "custom", label: "Custom Scope", icon: <Wrench size={16} /> },
];

export const PLANS: { id: Plan; name: string; hint: string; recommendedTeam: string }[] = [
  { id: "starter", name: "Starter", hint: "Up to 30 emp", recommendedTeam: "30" },
  { id: "professional", name: "Professional", hint: "Growing teams (31-150 emp)", recommendedTeam: "75" },
  { id: "enterprise", name: "Enterprise", hint: "Custom scale (150+ emp)", recommendedTeam: "200" },
];

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  inquiryType: "demo",
  plan: "starter",
  teamSize: "",
  message: "",
  honeypot: "",
};

const DRAFT_STORAGE_KEY = "flowpeople_inquiry_draft_v1";
const MAX_MESSAGE = 500;

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (!d.fullName.trim()) {
    e.fullName = "Please enter your full name.";
  }
  if (!d.email.trim()) {
    e.email = "Please enter your business email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) {
    e.email = "This email does not look right (e.g. name@company.com).";
  }
  if (!d.company.trim()) {
    e.company = "Please enter your company or organization name.";
  }
  if (d.phone && !/^[+\d][\d\s-]{6,}$/.test(d.phone.trim())) {
    e.phone = "Please enter a valid phone number.";
  }
  if (d.teamSize && (!/^\d+$/.test(d.teamSize.trim()) || Number(d.teamSize.trim()) < 1)) {
    e.teamSize = "Approximate team size must be a positive number.";
  }
  return e;
}

interface FieldProps {
  id: keyof FormData;
  label: string;
  required?: boolean;
  icon: ReactNode;
  error?: string;
  valid?: boolean;
  children: ReactNode;
}

function Field({ id, label, required, icon, error, valid, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-800 tracking-tight">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        {children}
        {valid && !error && (
          <CheckCircle2 size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
          <AlertCircle size={12} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  [
    "h-12 w-full rounded-xl border bg-slate-50/70 pl-10 pr-10 text-sm font-medium text-slate-900",
    "placeholder:text-slate-400 outline-none transition-all duration-200",
    "hover:bg-white focus:bg-white focus:ring-4",
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100",
  ].join(" ");

interface InquiryFormProps {
  className?: string;
  selectedInquiryType?: string;
  onInquiryTypeChange?: (type: string) => void;
}

export default function InquiryForm({
  className = "",
  selectedInquiryType,
  onInquiryTypeChange,
}: InquiryFormProps) {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusErrorMessage, setStatusErrorMessage] = useState<string>("");

  // 1. Restore local draft if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // 2. Synchronize URL query params (?type=demo, ?plan=enterprise)
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const planParam = searchParams.get("plan");

    if (typeParam) {
      const lower = typeParam.toLowerCase();
      if (lower.includes("demo")) setData((prev) => ({ ...prev, inquiryType: "demo" }));
      else if (lower.includes("pricing")) setData((prev) => ({ ...prev, inquiryType: "pricing" }));
      else if (lower.includes("arch")) setData((prev) => ({ ...prev, inquiryType: "architecture" }));
      else if (lower.includes("hard")) setData((prev) => ({ ...prev, inquiryType: "hardware" }));
      else if (lower.includes("partner")) setData((prev) => ({ ...prev, inquiryType: "partnership" }));
      else if (lower.includes("custom")) setData((prev) => ({ ...prev, inquiryType: "custom" }));
    }

    if (planParam) {
      const lower = planParam.toLowerCase();
      if (lower.includes("start")) setData((prev) => ({ ...prev, plan: "starter" }));
      else if (lower.includes("prof") || lower.includes("growth")) setData((prev) => ({ ...prev, plan: "professional" }));
      else if (lower.includes("enter") || lower.includes("busi")) setData((prev) => ({ ...prev, plan: "enterprise" }));
      else if (lower.includes("unsure") || lower.includes("not")) setData((prev) => ({ ...prev, plan: "unsure" }));
    }
  }, [searchParams]);

  // 3. Synchronize external prop
  useEffect(() => {
    if (selectedInquiryType) {
      const lower = selectedInquiryType.toLowerCase();
      if (lower.includes("demo")) setData((prev) => ({ ...prev, inquiryType: "demo" }));
      else if (lower.includes("pricing")) setData((prev) => ({ ...prev, inquiryType: "pricing" }));
      else if (lower.includes("arch")) setData((prev) => ({ ...prev, inquiryType: "architecture" }));
      else if (lower.includes("hard")) setData((prev) => ({ ...prev, inquiryType: "hardware" }));
      else if (lower.includes("partner")) setData((prev) => ({ ...prev, inquiryType: "partnership" }));
      else if (lower.includes("custom")) setData((prev) => ({ ...prev, inquiryType: "custom" }));
    }
  }, [selectedInquiryType]);

  // 4. Save draft on field changes
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    const next = { ...data, [key]: value };
    setData(next);

    // Save draft in localStorage
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }

    if (touched[key]) {
      setErrors(validate(next));
    }

    if (key === "inquiryType" && onInquiryTypeChange) {
      const match = INQUIRY_TYPES.find((t) => t.id === value);
      if (match) onInquiryTypeChange(match.label);
    }
  };

  const handlePlanSelect = (p: Plan) => {
    set("plan", p);
    // Extra idea: Suggest team size if empty
    if (!data.teamSize) {
      const planMeta = PLANS.find((item) => item.id === p);
      if (planMeta && planMeta.recommendedTeam) {
        set("teamSize", planMeta.recommendedTeam);
      }
    }
  };

  const blur = (key: keyof FormData) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(data));
  };

  const isValid = (key: keyof FormData) =>
    !!data[key]?.toString().trim() && !validate(data)[key];

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    // Spam honeypot check: if filled, quietly drop without alerting bot
    if (data.honeypot) {
      setStatus("success");
      return;
    }

    const found = validate(data);
    setErrors(found);
    setTouched({
      fullName: true,
      email: true,
      company: true,
      phone: true,
      teamSize: true,
    });

    if (Object.keys(found).length) {
      // Scroll to first invalid field on mobile if needed
      return;
    }

    setStatus("sending");
    setStatusErrorMessage("");

    try {
      const inquiryLabel = INQUIRY_TYPES.find((t) => t.id === data.inquiryType)?.label || "Book a Demo";
      const planName = data.plan === "unsure" ? "Not sure yet" : PLANS.find((p) => p.id === data.plan)?.name || "Starter";

      // 1. Submit through FlowPeople live lead service (Supabase PostgreSQL + local cache)
      const res = await leadService.submitLead({
        full_name: data.fullName.trim(),
        business_email: data.email.trim(),
        company_name: data.company.trim(),
        phone_number: data.phone.trim() || undefined,
        employee_count: data.teamSize.trim() ? `${data.teamSize.trim()} employees` : undefined,
        interested_plan: planName,
        inquiry_type: inquiryLabel,
        message: data.message.trim() || undefined,
        source: "website_inquiry_form",
      });

      if (res.success) {
        setStatus("success");
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
          // Ignore
        }
      } else {
        throw new Error(res.error || "Unable to submit your inquiry.");
      }
    } catch (err: unknown) {
      setStatus("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or email us directly at hqfluxora@gmail.com.";
      setStatusErrorMessage(msg);
    }
  };

  const reset = () => {
    setData(INITIAL_FORM);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setStatusErrorMessage("");
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  /* ---------- Success State ---------- */
  if (status === "success") {
    return (
      <section
        id="business-inquiry"
        className={`rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_20px_60px_-15px_rgba(79,70,229,0.18)] sm:p-10 md:p-12 transition-all ${className}`}
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60 shadow-xs">
          <CheckCircle2 size={40} className="text-emerald-500 animate-in zoom-in-75 duration-300" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
          Thank you, {data.fullName.trim().split(" ")[0] || "there"}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
          We received your business inquiry. Our solutions team will review your specifications and reply to{" "}
          <strong className="text-slate-800 font-semibold">{data.email}</strong> within 24 hours on business days.
        </p>

        {/* 3 Step Next Actions Walkthrough */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-left shadow-xs">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            What happens next:
          </p>
          <ol className="space-y-3.5 text-xs sm:text-sm text-slate-600">
            {[
              "Our engineering team reads your team size and operational workflows.",
              "A product specialist prepares tailored recommendations and architecture notes.",
              "We email you directly with a clear walkthrough, pricing, and next steps.",
            ].map((text, idx) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 hover:shadow-xs active:scale-95 cursor-pointer"
        >
          Send another inquiry
        </button>
      </section>
    );
  }

  /* ---------- Form State ---------- */
  return (
    <section
      id="business-inquiry"
      className={`relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.18)] sm:p-8 md:p-10 ${className}`}
    >
      {/* Soft gradient glow at the top */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200/50 via-violet-200/40 to-indigo-200/50 blur-3xl" />

      {/* Hidden honeypot field for spam prevention */}
      <input
        type="text"
        name="website_hp"
        tabIndex={-1}
        autoComplete="off"
        value={data.honeypot}
        onChange={(e) => set("honeypot", e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Header Block */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
              Transparent commercial consultation
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Business Inquiry Form
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Share your team size and operational needs. Get a direct recommendation, zero sales pressure.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Reply within 24 hours
          </span>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
          {/* Row 1 & 2: Contact Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Full Name"
              required
              icon={<User size={16} />}
              error={errors.fullName}
              valid={isValid("fullName")}
            >
              <input
                id="fullName"
                value={data.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                onBlur={() => blur("fullName")}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                placeholder="e.g. Anand Mahindra"
                className={inputClass(!!errors.fullName)}
                autoComplete="name"
              />
            </Field>

            <Field
              id="email"
              label="Business Email"
              required
              icon={<Mail size={16} />}
              error={errors.email}
              valid={isValid("email")}
            >
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => blur("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="name@company.com"
                className={inputClass(!!errors.email)}
                autoComplete="email"
              />
            </Field>

            <Field
              id="company"
              label="Company Name"
              required
              icon={<Building2 size={16} />}
              error={errors.company}
              valid={isValid("company")}
            >
              <input
                id="company"
                value={data.company}
                onChange={(e) => set("company", e.target.value)}
                onBlur={() => blur("company")}
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? "company-error" : undefined}
                placeholder="Company or Organization"
                className={inputClass(!!errors.company)}
                autoComplete="organization"
              />
            </Field>

            <Field
              id="phone"
              label="Phone Number"
              icon={<Phone size={16} />}
              error={errors.phone}
              valid={isValid("phone")}
            >
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
                onBlur={() => blur("phone")}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                placeholder="+91 98765 43210"
                className={inputClass(!!errors.phone)}
                autoComplete="tel"
              />
            </Field>
          </div>

          {/* Row 3: Inquiry Type as Clickable Chips (role="radiogroup") */}
          <div>
            <p className="mb-2.5 text-xs font-semibold text-slate-800 tracking-tight">
              What do you need?
            </p>
            <div role="radiogroup" aria-label="Inquiry type" className="flex flex-wrap gap-2">
              {INQUIRY_TYPES.map((t) => {
                const active = data.inquiryType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => set("inquiryType", t.id)}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 select-none",
                      active
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className={active ? "text-white" : "text-indigo-500"}>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Plan as 3 Selectable Cards + Not Sure Yet */}
          <div>
            <p className="mb-2.5 text-xs font-semibold text-slate-800 tracking-tight">
              Interested Plan
            </p>
            <div role="radiogroup" aria-label="Interested plan" className="grid gap-3 sm:grid-cols-3">
              {PLANS.map((p) => {
                const active = data.plan === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handlePlanSelect(p.id)}
                    className={[
                      "rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100",
                      active
                        ? "border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/25 shadow-xs"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                      {active ? (
                        <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 font-normal">{p.hint}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => handlePlanSelect("unsure")}
              className={`mt-2 text-xs font-medium transition cursor-pointer inline-flex items-center gap-1.5 ${
                data.plan === "unsure" ? "text-indigo-600 font-semibold" : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              <span>{data.plan === "unsure" ? "✓" : "•"}</span>
              <span>Not sure yet? We will help you choose the best fit for your team.</span>
            </button>
          </div>

          {/* Row 5: Approx. Team Size */}
          <div className="max-w-xs">
            <Field
              id="teamSize"
              label="Approx. Team Size"
              icon={<Users size={16} />}
              error={errors.teamSize}
              valid={isValid("teamSize")}
            >
              <input
                id="teamSize"
                inputMode="numeric"
                type="number"
                min="1"
                value={data.teamSize}
                onChange={(e) => set("teamSize", e.target.value)}
                onBlur={() => blur("teamSize")}
                aria-invalid={!!errors.teamSize}
                aria-describedby={errors.teamSize ? "teamSize-error" : undefined}
                placeholder="e.g. 45"
                className={inputClass(!!errors.teamSize)}
              />
            </Field>
          </div>

          {/* Row 6: Message Box with Character Counter */}
          <div>
            <label htmlFor="message" className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-800 tracking-tight">
              <span>Message or Questions</span>
              <span className={`font-normal ${data.message.length >= MAX_MESSAGE ? "text-rose-500 font-semibold" : "text-slate-400"}`}>
                {data.message.length}/{MAX_MESSAGE}
              </span>
            </label>
            <textarea
              id="message"
              rows={4}
              maxLength={MAX_MESSAGE}
              value={data.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Tell us about your team setup, preferred attendance modes, or specific workflows..."
              className="w-full resize-y min-h-[120px] rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:bg-white focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Testimonial / Social Proof Snippet */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <Quote size={16} className="text-indigo-500 shrink-0" />
            <p className="italic">
              "FlowPeople streamlined our 120-employee biometric and GPS rollout in under 48 hours."
              <span className="not-italic font-semibold text-slate-700 ml-1.5">— HR Director, Retail Enterprise</span>
            </p>
          </div>

          {/* Error Banner */}
          {status === "error" && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-700 shadow-xs">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-800">Submission Error</p>
                <p className="mt-0.5">{statusErrorMessage || "Something went wrong. Please try again, or email us at hqfluxora@gmail.com."}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex h-14 w-full sm:w-auto min-w-[240px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-600/40 active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
          >
            {status === "sending" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting Inquiry...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Submit Business Inquiry</span>
                <Send size={16} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>

          {/* Trust Row */}
          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
            <li className="flex items-center gap-1.5 font-medium">
              <Lock size={14} className="text-indigo-500 shrink-0" />
              <span>Your details are private</span>
            </li>
            <li className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-indigo-500 shrink-0" />
              <span>Reply in 24 hours</span>
            </li>
            <li className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-indigo-500 shrink-0" />
              <span>No spam, ever</span>
            </li>
          </ul>
        </form>
      </div>
    </section>
  );
}

