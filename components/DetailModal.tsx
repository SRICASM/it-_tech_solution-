import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { CaseStudy, Insight } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export type ModalContent =
  | { type: 'caseStudy'; data: CaseStudy }
  | { type: 'insight'; data: Insight }
  | null;

interface DetailModalProps {
  content: ModalContent;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ content, onClose }) => {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (content) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [content, handleKeyDown]);

  return (
    <AnimatePresence>
      {content && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <X size={18} />
            </button>

            {content.type === 'caseStudy' ? (
              <CaseStudyModal data={content.data} />
            ) : (
              <InsightModal data={content.data} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Case Study Modal Content ────────────────────────────────────────────────
const CaseStudyModal: React.FC<{ data: CaseStudy }> = ({ data }) => {
  const isTrading = data.id === 'trading-product';

  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-t-xl">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

        {/* Floating badge */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTrading ? 'bg-cyan' : 'bg-violet'} shadow-[0_0_8px_currentColor]`} />
          <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
            {isTrading ? 'PRODUCT' : 'CLIENT PROJECT'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 -mt-12 relative">
        <span className={`text-xs font-mono ${isTrading ? 'text-cyan' : 'text-violet'} tracking-widest uppercase flex items-center gap-2 mb-3`}>
          <span className={`w-3 h-[1px] ${isTrading ? 'bg-cyan' : 'bg-violet'}`} />
          {data.client}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{data.title}</h2>

        {/* Description */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
          <p className="text-silver/70 text-sm leading-relaxed">{data.description}</p>
        </div>

        {/* Detailed Body */}
        <div className="space-y-4 mb-8">
          {data.detail.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-silver/50 text-sm leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h4 className="text-[10px] font-mono text-white/30 tracking-widest uppercase mb-4">Technology Stack</h4>
          <div className="flex flex-wrap gap-2">
            {data.techStack.map((tech) => (
              <span
                key={tech}
                className={`text-xs font-mono border px-3 py-1.5 rounded ${
                  isTrading
                    ? 'border-cyan/20 text-cyan/70 bg-cyan/5'
                    : 'border-violet/20 text-violet/70 bg-violet/5'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {data.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 text-center"
            >
              <div className={`text-2xl font-mono font-bold ${isTrading ? 'text-cyan' : 'text-violet'} mb-1`}>
                {metric.value}
              </div>
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Insight Modal Content ───────────────────────────────────────────────────
const InsightModal: React.FC<{ data: Insight }> = ({ data }) => {
  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-t-xl">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-6 left-6">
          <span className="text-[10px] font-mono text-violet uppercase tracking-widest border border-violet/30 px-3 py-1 rounded bg-violet/10 backdrop-blur-sm">
            {data.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 -mt-12 relative">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-mono text-white/40 tracking-wider">{data.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[10px] font-mono text-white/40 tracking-wider">{data.readTime}</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{data.title}</h2>

        {/* Excerpt highlight */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
          <p className="text-silver/70 text-sm leading-relaxed italic">{data.excerpt}</p>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {data.body.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-silver/50 text-sm leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
