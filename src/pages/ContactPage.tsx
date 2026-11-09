import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Mail,
  Building2,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { leadService } from '../services/leadService';

export default function ContactPage() {
  const [searchParams] = useSearchParams();

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [businessEmail, setBusinessEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<string>('');
  const [interestedPlan, setInterestedPlan] = useState<string>('Starter');
  const [inquiryType, setInquiryType] = useState<string>('Product Enquiry');
  const [message, setMessage] = useState<string>('');

  // Submission lifecycle states
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedPayload, setSubmittedPayload] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Preselect from URL query params (e.g. ?type=Book%20a%20Demo or ?plan=Professional)
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const planParam = searchParams.get('plan');

    if (typeParam) {
      if (['Product Enquiry', 'Pricing Enquiry', 'Book a Demo', 'Partnership', 'Technical Support', 'Other'].includes(typeParam)) {
        setInquiryType(typeParam);
      } else if (typeParam.toLowerCase().includes('demo')) {
        setInquiryType('Book a Demo');
      }
    }

    if (planParam) {
      if (['Starter', 'Professional', 'Enterprise', 'Not Sure Yet'].includes(planParam)) {
        setInterestedPlan(planParam);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field Validations
    if (!fullName.trim() || !businessEmail.trim() || !companyName.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail.trim())) {
      setErrorMessage('Please provide a valid corporate business email address.');
      return;
    }

    // Prevent duplicate submission if already submitted
    if (submittedPayload) {
      setErrorMessage('Your inquiry has already been submitted.');
      return;
    }

    setLoading(true);

    try {
      const res = await leadService.submitLead({
        full_name: fullName.trim(),
        business_email: businessEmail.trim(),
        company_name: companyName.trim(),
        phone_number: phoneNumber.trim() || undefined,
        employee_count: employeeCount.trim() || undefined,
        interested_plan: interestedPlan,
        inquiry_type: inquiryType,
        message: message.trim() || undefined,
        source: 'website_contact_form'
      });

      setLoading(false);
      if (res.success) {
        setSubmittedPayload({
          fullName,
          businessEmail,
          companyName,
          phoneNumber: phoneNumber || 'Not provided',
          employeeCount: employeeCount || 'Not specified',
          interestedPlan,
          inquiryType,
          message: message || 'No additional notes provided.',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        setErrorMessage(res.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmittedPayload(null);
    setFullName('');
    setBusinessEmail('');
    setCompanyName('');
    setPhoneNumber('');
    setEmployeeCount('');
    setMessage('');
    setErrorMessage('');
  };

  return (
    <div className="contact-page min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-24 pb-20">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F3EBDD]/60 via-[#FBF7F0] to-[#FBF7F0] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4F46E5]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#4F46E5] uppercase mb-6">
            <Mail className="h-3.5 w-3.5 text-[#4F46E5]" />
            <span>GET IN TOUCH</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#0F172A] font-serif max-w-5xl mx-auto leading-[1.06]">
            Let's Talk About <span className="text-[#4F46E5]">Your Business.</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-[#0F172A] font-medium leading-relaxed">
            Have questions about FlowPeople, pricing, or implementation? Our team would be happy
            to walk you through our platform and recommend the right setup for your organization.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. TWO-COLUMN CONTACT & INQUIRY LAYOUT                                 */}
      {/* ===================================================================== */}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT SIDE: CONTACT INFORMATION & CHANNELS */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-xs space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                DIRECT COMMUNICATION
              </span>

              <h2 className="text-2xl font-bold font-serif text-[#0F172A]">
                General &amp; Product Inquiries
              </h2>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Connect directly with our solutions and product engineering team. We typically respond
                within 24 hours on business days.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="mailto:hqfluxora@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-[#4F46E5] transition text-xs sm:text-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5] text-white shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A]">Email Us Directly</div>
                    <div className="text-[#4F46E5] font-semibold">hqfluxora@gmail.com</div>
                  </div>
                </a>
              </div>

              <div className="border-t border-slate-200 pt-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Inquiry Channels We Support:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B]">
                  <div>· Product Demonstrations</div>
                  <div>· Pricing &amp; Commercials</div>
                  <div>· Architecture Reviews</div>
                  <div>· Hardware Compatibility</div>
                  <div>· Technology Partnerships</div>
                  <div>· Custom Scopes</div>
                </div>
              </div>
            </div>

            {/* Quick Demo Selector Card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-100/70 p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4F46E5] uppercase">
                <Calendar className="h-4 w-4" />
                <span>BOOK A DEMONSTRATION</span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Want to see FlowPeople in action?</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Select "Book a Demo" on the inquiry form to schedule a tailored live walkthrough of the biometric kiosk and mobile GPS geofencing.
              </p>
              <button
                type="button"
                onClick={() => setInquiryType('Book a Demo')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer pt-1"
              >
                <span>Click to preselect Book a Demo on form</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: BUSINESS INQUIRY FORM */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm">
              <div className="border-b border-slate-200 pb-5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
                  TRANSPARENT COMMERCIAL CONSULTATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F172A] mt-1">
                  Business Inquiry Form
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Share your team size and operational requirements for a direct recommendation.
                </p>
              </div>

              {submittedPayload ? (
                /* Success Confirmation State */
                <div className="space-y-5 py-4">
                  <div className="p-5 rounded-2xl bg-[#299D68]/10 border border-[#299D68]/30 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#299D68]">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Inquiry Captured Successfully</span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Thank you, <b>{submittedPayload.fullName}</b>! Your inquiry has been recorded and transmitted directly
                      to our solutions desk at <b>hqfluxora@gmail.com</b>. An enterprise specialist will reach out shortly.
                    </p>
                  </div>

                  {/* Payload Summary Box */}
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-[#0F172A] border-b border-slate-200 pb-1.5">
                      Submission Payload Details:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[#64748B]">
                      <div><b>Company:</b> {submittedPayload.companyName}</div>
                      <div><b>Email:</b> {submittedPayload.businessEmail}</div>
                      <div><b>Inquiry Type:</b> {submittedPayload.inquiryType}</div>
                      <div><b>Target Plan:</b> {submittedPayload.interestedPlan}</div>
                      <div><b>Team Size:</b> {submittedPayload.employeeCount}</div>
                      <div><b>Phone:</b> {submittedPayload.phoneNumber}</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full bg-[#4F46E5] text-[#F8F6F1] px-6 py-2.5 text-xs font-semibold hover:bg-[#4F46E5]/90 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Fields */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Full Name *
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Anand Mahindra"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      />
                    </label>

                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Business Email *
                      <input
                        type="email"
                        required
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Company Name *
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company or Organization"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      />
                    </label>

                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Phone Number
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Inquiry Type
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      >
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Pricing Enquiry">Pricing Enquiry</option>
                        <option value="Book a Demo">Book a Demo</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Interested Plan
                      <select
                        value={interestedPlan}
                        onChange={(e) => setInterestedPlan(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      >
                        <option value="Starter">Starter (30 emp)</option>
                        <option value="Professional">Professional (75 emp)</option>
                        <option value="Enterprise">Enterprise (200 emp)</option>
                        <option value="Not Sure Yet">Not Sure Yet</option>
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Approx. Team Size
                      <input
                        type="text"
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(e.target.value)}
                        placeholder="e.g. 45"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5]"
                      />
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-[#0F172A]">
                    Message or Questions
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your team setup, preferred attendance modes, or specific workflows..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs sm:text-sm text-[#0F172A] outline-none focus:border-[#4F46E5] resize-y"
                    />
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-8 py-3.5 text-xs sm:text-sm font-semibold text-[#F8F6F1] shadow-xs transition hover:bg-[#4F46E5]/90 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span>Validating Submission...</span>
                      ) : (
                        <>
                          <span>Submit Business Inquiry</span>
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-[#A5A79B] leading-relaxed pt-2">
                    * Submissions are recorded directly in the FlowPeople lead queue and validated against enterprise security protocols.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

