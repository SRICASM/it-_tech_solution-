import React, { useRef, useState, useCallback } from 'react';
import { Check, Loader2, Terminal, User, Briefcase, Mail, Building2, Send } from 'lucide-react';
import { submitConsultation } from '../services/submission';

// ─── Main Form ──────────────────────────────────────────────────────────────
const ConsultationForm: React.FC = React.memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  // Refs for input fields — zero re-renders on keystroke
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const name = nameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    const company = companyRef.current?.value.trim() || '';
    const role = roleRef.current?.value.trim() || '';

    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      const result = await submitConsultation({
        projectType: [],
        name,
        email,
        company,
        role,
      });

      if (result.success) {
        setSubmitted(result.ref || 'REQ_' + Date.now().toString().slice(-6));
        // Auto-reset form 5 seconds after successful submission
        setTimeout(() => {
          setSubmitted(null);
          setIsSubmitting(false);
          if (nameRef.current) nameRef.current.value = '';
          if (emailRef.current) emailRef.current.value = '';
          if (companyRef.current) companyRef.current.value = '';
          if (roleRef.current) roleRef.current.value = '';
        }, 5000);
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  // ─── Success State ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="w-full max-w-2xl mx-auto bg-[#0A0A0B] border border-white/10 p-12 md:p-16 text-center"
        style={{ contain: 'content' }}
      >
        <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-cyan" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Request Received</h3>
        <p className="text-white/50 font-mono text-sm mb-6">
          Your consultation request has been received. Our team will get back to you within 24 hours.
        </p>
        <div className="inline-block border border-white/10 bg-white/5 px-6 py-3 font-mono text-xs text-cyan tracking-widest mb-6">
          REF: {submitted}
        </div>
        <p className="text-[10px] font-mono text-white/20">Resetting in 5 seconds...</p>
      </div>
    );
  }

  // ─── Form Layout ────────────────────────────────────────────────────
  return (
    <div
      className="w-full max-w-2xl mx-auto bg-[#0A0A0B] border border-white/10 relative overflow-hidden"
      style={{ contain: 'content', willChange: 'transform' }}
    >
      {/* ── Header Bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-cyan/10 flex items-center justify-center border border-cyan/20 text-cyan">
            <Terminal size={12} />
          </div>
          <span className="text-[11px] font-mono text-white/60 tracking-[0.15em] uppercase">
            Consultation Request
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan/60"></div>
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Online</span>
        </div>
      </div>

      {/* ── Form: wraps fields + submit to avoid focus/blur click race ── */}
      <form onSubmit={handleSubmit}>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight mb-1">Let's Build Together</h3>
          <p className="text-[11px] font-mono text-white/30 tracking-wide">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-mono text-cyan/70 uppercase tracking-widest mb-2">
              <User size={10} /> Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              required
              placeholder="John Doe"
              className="w-full bg-transparent border-b border-white/10 py-2.5 text-white text-sm focus:border-cyan focus:outline-none transition-[border-color] duration-150 placeholder:text-white/10 px-1"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-mono text-cyan/70 uppercase tracking-widest mb-2">
              <Mail size={10} /> Work Email <span className="text-red-400">*</span>
            </label>
            <input
              ref={emailRef}
              type="email"
              required
              placeholder="john@company.com"
              className="w-full bg-transparent border-b border-white/10 py-2.5 text-white text-sm focus:border-cyan focus:outline-none transition-[border-color] duration-150 placeholder:text-white/10 px-1"
            />
          </div>

          {/* Company */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
              <Building2 size={10} /> Company
            </label>
            <input
              ref={companyRef}
              type="text"
              placeholder="Acme Corp"
              className="w-full bg-transparent border-b border-white/10 py-2.5 text-white text-sm focus:border-cyan focus:outline-none transition-[border-color] duration-150 placeholder:text-white/10 px-1"
            />
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
              <Briefcase size={10} /> Service Required
            </label>
            <input
              ref={roleRef}
              type="text"
              placeholder="IT Consulting / Trading Tech"
              className="w-full bg-transparent border-b border-white/10 py-2.5 text-white text-sm focus:border-cyan focus:outline-none transition-[border-color] duration-150 placeholder:text-white/10 px-1"
            />
          </div>
        </div>
      </div>

      {/* ── Footer: Submit Bar ─────────────────────────────────────── */}
      <div className="px-6 md:px-8 py-5 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-mono text-white/20 leading-relaxed max-w-md">
          <span className="text-cyan/50">&gt;&gt;</span> By submitting, you agree to receive a free strategy consultation from Neuralink Infotech.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative overflow-hidden bg-gradient-to-r from-cyan to-blue-500 px-8 py-3.5 font-bold text-xs tracking-[0.2em] text-black transition-opacity duration-150 hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <div className="flex items-center gap-3">
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Send size={14} />
            )}
            <span>{isSubmitting ? 'SUBMITTING...' : 'REQUEST CONSULTATION'}</span>
          </div>
        </button>
      </div>
      </form>
    </div>
  );
});

export default ConsultationForm;
