import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Continuous scroll animations for a fluid "Cyber-Physical" feel
  // Increased max opacity to 0.9 for better contrast against scrolling content
  const backgroundColor = useTransform(scrollY, [0, 50], ["rgba(10, 10, 11, 0)", "rgba(10, 10, 11, 0.9)"]);
  const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  // Increased border opacity slightly for definition
  const borderColor = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]);
  const paddingY = useTransform(scrollY, [0, 50], [24, 16]); // 24px (py-6) -> 16px (py-4)
  const boxShadow = useTransform(scrollY, [0, 50], ["0 0 0 rgba(0,0,0,0)", "0 8px 32px rgba(0,0,0,0.5)"]);

  // Smooth Scroll Handler
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Offset for fixed header (approx 80px)
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        borderBottomWidth: '1px',
        borderBottomColor: borderColor,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        boxShadow
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded bg-white/5 border border-white/10 group-hover:border-cyan/50 transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="font-bold text-cyan text-sm transform group-hover:rotate-180 transition-transform duration-700 ease-out">
              N
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan group-hover:to-violet transition-all duration-300">
              NEURAL
            </span>
            <span className="text-[10px] text-silver/50 tracking-widest group-hover:text-cyan/60 transition-colors">
              SYSTEMS
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              // Increased text contrast from silver/60 to silver/80
              className="text-xs font-medium text-silver/80 hover:text-white transition-colors tracking-widest uppercase relative group py-1"
            >
              {item.label}
              {/* Elegant Underline Animation */}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan to-violet origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
              
              {/* Subtle Background Glow */}
              <span className="absolute inset-0 bg-cyan/5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none"></span>
            </a>
          ))}

          {/* Reactor Core Button */}
          <button 
            onClick={(e) => handleNavClick(e, '#contact')}
            className="relative group overflow-hidden bg-white/10 border border-white/20 px-6 py-2.5 rounded text-xs font-bold tracking-widest text-white transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:bg-white/15"
          >
            {/* Background Gradient Reveal */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan via-blue-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
            
            {/* Shine Effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-[shine_1s_ease-in-out]"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2 group-hover:text-obsidian transition-colors duration-300">
              <Zap size={14} className="group-hover:fill-current" />
              <span>START PROJECT</span>
            </div>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0A0B]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-slideDown">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-bold tracking-widest text-silver hover:text-cyan py-4 border-b border-white/5 last:border-0 flex items-center justify-between group"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </a>
          ))}
          <button 
            className="mt-4 w-full bg-gradient-to-r from-cyan to-violet text-white py-4 rounded font-bold tracking-widest flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            START PROJECT
          </button>
        </div>
      )}
    </motion.nav>
  );
};

export default Navigation;