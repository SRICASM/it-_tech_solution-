import React, { useState, useEffect } from 'react';
import { ConsultationStep } from '../types';
import { ArrowRight, Check, Loader2, Zap, Terminal, Cpu, Database, Cloud, Building2, User, Briefcase, Mail, Plus, X } from 'lucide-react';
import { generateArchitectureInsight } from '../services/gemini';
import { submitConsultation } from '../services/submission';

const PREDEFINED_STACK = ['React', 'Python', 'Go', 'AWS', 'Azure', 'Kubernetes', 'Terraform', 'Gemini API', 'PostgreSQL', 'Docker'];

const ConsultationForm: React.FC = () => {
  const [step, setStep] = useState<ConsultationStep>(ConsultationStep.OBJECTIVE);
  const [formData, setFormData] = useState({
    projectType: [] as string[],
    techStack: [] as string[],
    details: '',
    name: '',
    company: '',
    role: '',
    email: ''
  });

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customTechInput, setCustomTechInput] = useState('');

  // Navigation Safety Lock
  // Prevents rapid-fire clicks and race conditions during phase transitions
  const [isNavigating, setIsNavigating] = useState(false);

  // Constants for Transition Timing (ms) matches CSS animation (300ms)
  // Reduced to 0ms for instant responsiveness
  const TRANSITION_DURATION = 0;

  const handleNext = () => {
    // 1. Guard Clauses: Check boundaries
    if (step >= ConsultationStep.IDENTITY) return;

    // 2. Validation Logic
    if (step === ConsultationStep.OBJECTIVE && formData.projectType.length === 0) return;

    // 3. Atomic State Update with Clamping
    setStep((prev) => Math.min(prev + 1, ConsultationStep.IDENTITY));
  };

  const handleBack = () => {
    // 1. Guard Clauses
    if (step <= ConsultationStep.OBJECTIVE) return;

    // 2. Reset Logic (State Policy: Forgiving Exploration)
    // Clear selections when moving backward so the user always encounters a "fresh" state.
    if (step === ConsultationStep.CONTEXT) {
      // Going back to Step 1 (Objective) -> Clear Step 1 selections
      setFormData(prev => ({ ...prev, projectType: [] }));
      setAiInsight(null);
    } else if (step === ConsultationStep.IDENTITY) {
      // Going back to Step 2 (Context) -> Clear Step 2 selections
      setFormData(prev => ({ ...prev, techStack: [] }));
    }

    // 3. Atomic State Update with Clamping
    setStep((prev) => Math.max(prev - 1, ConsultationStep.OBJECTIVE));
  };

  const toggleProjectType = (type: string) => {
    setFormData(prev => {
      const isSelected = prev.projectType.includes(type);
      const updated = isSelected
        ? prev.projectType.filter(t => t !== type)
        : [...prev.projectType, type];

      return { ...prev, projectType: updated };
    });
  };

  const toggleStack = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleAddCustomTech = () => {
    const trimmed = customTechInput.trim();
    if (trimmed && !formData.techStack.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, trimmed]
      }));
      setCustomTechInput('');
    }
  };

  const handleCustomTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTech();
    }
  };

  // Effect to trigger AI analysis when project types change, with debounce
  useEffect(() => {
    if (formData.projectType.length === 0) {
      setAiInsight(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      const types = formData.projectType.join(' + ');
      // Providing immediate feedback before the API call finishes
      setAiInsight("Synthesizing requirements...");
      try {
        const insight = await generateArchitectureInsight(`Key strategic architectural considerations for a combined ${types} project. Focus on interoperability.`);
        setAiInsight(insight);
      } catch (e) {
        setAiInsight("Neural link unstable. Proceed with manual configuration.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [formData.projectType]);

  const renderStep = () => {
    switch (step) {
      case ConsultationStep.OBJECTIVE:
        return (
          <div className="space-y-8 animate-slideDown">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-white tracking-tight">System Objective</h3>
                <span className="text-[10px] font-mono text-cyan/70 uppercase tracking-widest">Multi-Select Enabled</span>
              </div>
              <p className="text-silver/50 text-sm font-mono">
                Select active vectors. Selections are non-binding; we refine scope during the deep audit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Cloud Infrastructure', icon: Cloud, desc: 'Migration & Scalability' },
                { label: 'AI Integration', icon: Cpu, desc: 'LLM & Neural Systems' },
                { label: 'SaaS Platform', icon: Terminal, desc: 'Full-Stack Engineering' },
                { label: 'Legacy Modernization', icon: Database, desc: 'Refactoring & Security' }
              ].map(({ label, icon: Icon, desc }) => {
                const isSelected = formData.projectType.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() => toggleProjectType(label)}
                    className={`relative group p-6 text-left border transition-all duration-300 overflow-hidden flex flex-col justify-between h-32 ${isSelected
                      ? 'border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                  >
                    {/* Active State Background Highlight */}
                    <div className={`absolute inset-0 bg-gradient-to-tr from-cyan/20 to-transparent transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="relative z-10 flex items-start justify-between w-full">
                      <Icon size={20} className={`transition-colors duration-300 ${isSelected ? 'text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'text-silver/50 group-hover:text-white'}`} />

                      {/* Custom Checkbox UI */}
                      <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-cyan bg-cyan text-black' : 'border-white/20 bg-transparent'}`}>
                        {isSelected && <Check size={12} strokeWidth={4} />}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <span className={`block font-bold text-sm mb-1 transition-colors ${isSelected ? 'text-white' : 'text-silver/80 group-hover:text-white'}`}>
                        {label}
                      </span>
                      <span className={`text-[10px] font-mono uppercase tracking-wide transition-colors ${isSelected ? 'text-cyan' : 'text-white/30'}`}>
                        {desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* AI Insight Terminal */}
            <div className={`mt-6 p-5 border-l-2 bg-black/40 backdrop-blur-md transition-all duration-500 overflow-hidden ${formData.projectType.length > 0 ? 'border-violet opacity-100' : 'border-transparent opacity-0 h-0 p-0'}`}>
              <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-violet tracking-widest uppercase">
                <Cpu size={12} className={isAnalyzing ? "animate-spin" : ""} />
                System Architect Analysis
              </div>
              <p className="text-xs md:text-sm font-mono text-silver/80 leading-relaxed min-h-[40px]">
                {aiInsight || <span className="animate-pulse">&gt;&gt; Awaiting Neural Link...</span>}
              </p>
            </div>
          </div>
        );

      case ConsultationStep.CONTEXT:
        // Combine predefined with any custom ones the user added
        const displayStack = Array.from(new Set([...PREDEFINED_STACK, ...formData.techStack]));

        return (
          <div className="space-y-8 animate-slideDown">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Technical Context</h3>
              <p className="text-silver/50 text-sm font-mono">Define the parameters of your environment.</p>
            </div>

            {/* Stack Selection - Improved Visuals */}
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-cyan uppercase tracking-widest">Current / Desired Stack</label>

              {/* Combined List */}
              <div className="flex flex-wrap gap-3">
                {displayStack.map((tech) => {
                  const isSelected = formData.techStack.includes(tech);
                  return (
                    <button
                      key={tech}
                      onClick={() => toggleStack(tech)}
                      className={`group relative px-5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all duration-300 ${isSelected
                        ? 'border-cyan bg-cyan/10 text-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'border-white/10 bg-white/5 text-silver/60 hover:border-white/40 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {tech}
                        {isSelected && !PREDEFINED_STACK.includes(tech) && (
                          <X size={10} className="hover:text-red-400 transition-colors" />
                        )}
                      </span>
                      {/* Subtle Glow on Hover for unselected */}
                      {!isSelected && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="relative group max-w-sm">
                <input
                  type="text"
                  value={customTechInput}
                  onChange={(e) => setCustomTechInput(e.target.value)}
                  onKeyDown={handleCustomTechKeyDown}
                  placeholder="ADD CUSTOM TECHNOLOGY..."
                  className="w-full bg-black/20 border border-white/10 text-white text-xs font-mono px-4 py-3 pr-10 focus:border-cyan focus:outline-none transition-all placeholder:text-white/20 rounded-none focus:bg-white/5 relative z-10"
                />
                <button
                  onClick={handleAddCustomTech}
                  disabled={!customTechInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-cyan disabled:opacity-0 transition-all z-20"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Details Textarea */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-cyan uppercase tracking-widest">Scope Brief</label>
              <textarea
                className="w-full bg-[#050505] border border-white/10 p-4 text-white text-sm focus:border-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] focus:outline-none transition-all duration-300 placeholder:text-white/10 resize-none min-h-[120px] relative z-10"
                placeholder="Describe your scalability challenges, performance goals, or timeline requirements..."
                value={formData.details}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, details: val }));
                }}
              />
            </div>
          </div>
        );

      case ConsultationStep.IDENTITY:
        return (
          <div className="space-y-8 animate-slideDown">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Access Credentials</h3>
              <p className="text-silver/50 text-sm font-mono">Where should we route the architecture brief?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-mono text-cyan uppercase tracking-widest">
                  <User size={12} /> Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-lg focus:border-cyan focus:outline-none transition-all placeholder:text-white/10 focus:bg-white/5 px-2 relative z-10"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, name: val }));
                  }}
                />
              </div>

              {/* Email */}
              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-mono text-cyan uppercase tracking-widest">
                  <Mail size={12} /> Work Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-lg focus:border-cyan focus:outline-none transition-all placeholder:text-white/10 focus:bg-white/5 px-2 relative z-10"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, email: val }));
                  }}
                />
              </div>

              {/* Company */}
              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-mono text-cyan uppercase tracking-widest">
                  <Building2 size={12} /> Company
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-lg focus:border-cyan focus:outline-none transition-all placeholder:text-white/10 focus:bg-white/5 px-2 relative z-10"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, company: val }));
                  }}
                />
              </div>

              {/* Role */}
              <div className="group space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-mono text-cyan uppercase tracking-widest">
                  <Briefcase size={12} /> Role
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white text-lg focus:border-cyan focus:outline-none transition-all placeholder:text-white/10 focus:bg-white/5 px-2 relative z-10"
                  placeholder="CTO / VP Eng"
                  value={formData.role}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, role: val }));
                  }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded text-xs text-silver/60 leading-relaxed font-mono">
              <span className="text-cyan">&gt;&gt; PROTOCOL:</span> By initializing this sequence, you agree to receive a preliminary architectural assessment via the provided secure channel.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl bg-[#0A0A0B]/80 border border-white/10 shadow-2xl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="absolute top-0 left-0 h-[2px] bg-white/5 w-full">
        <div className="h-full bg-gradient-to-r from-cyan to-violet shadow-[0_0_15px_#00F0FF] transition-all duration-700 ease-in-out" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      <div className="mb-12 flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan/10 flex items-center justify-center border border-cyan/20 text-cyan">
            <Terminal size={14} />
          </div>
          <span className="text-xs font-mono text-white tracking-[0.2em] uppercase">Inquiry Terminal v2.1</span>
        </div>
        <span className="text-xs font-mono text-white/30">PHASE 0{step + 1} / 03</span>
      </div>

      {renderStep()}

      <div className="mt-12 flex justify-between items-center">
        {step > ConsultationStep.OBJECTIVE ? (
          <button
            onClick={handleBack}
            disabled={false}
            className={`text-xs font-mono text-silver/50 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded hover:bg-white/5`}
          >
            [ RESET & BACK ]
          </button>
        ) : (
          <div></div> // Spacer for layout balance
        )}

        <div className="ml-auto">
          {step < ConsultationStep.IDENTITY ? (
            <button
              onClick={handleNext}
              disabled={(step === ConsultationStep.OBJECTIVE && formData.projectType.length === 0)}
              className="group relative overflow-hidden bg-white text-obsidian px-8 py-3 font-bold text-xs tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95"
            >
              <div className="relative z-10 flex items-center gap-3">
                PROCEED <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan/80 to-blue-600/80 border border-cyan/50 px-10 py-4 font-bold text-xs tracking-[0.2em] text-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.3)] w-full md:w-auto active:scale-95 disabled:opacity-70"
              onClick={async () => {
                if (!formData.email || !formData.name) return;
                setIsSubmitting(true);

                const result = await submitConsultation(formData);

                if (result.success) {
                  alert(`Transmission Complete. \nRef: ${result.ref}`);
                } else {
                  alert("Transmission Failed. Please try again.");
                }
                setIsSubmitting(false);
              }}
            >
              {/* Shine Effect */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:animate-shine"></div>

              <div className="relative z-10 flex items-center justify-center gap-3 text-obsidian font-extrabold">
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="fill-current" />}
                <span>TRANSMIT REQUEST</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;