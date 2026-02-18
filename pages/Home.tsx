import React, { useState, useCallback } from 'react';
import ThreeScene from '../components/ThreeScene';
import Navigation from '../components/Navigation';
import ConsultationForm from '../components/ConsultationForm';
import CaseStudyScene from '../components/CaseStudyScene';
import DetailModal from '../components/DetailModal';
import { SERVICES, CASE_STUDIES, PROCESS_STEPS, INSIGHTS } from '../constants';
import { CaseStudy, Insight } from '../types';
import { ArrowUpRight, ChevronRight, ArrowRight, Activity } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

type ModalContent =
  | { type: 'caseStudy'; data: CaseStudy }
  | { type: 'insight'; data: Insight }
  | null;

const Home: React.FC = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [modalContent, setModalContent] = useState<ModalContent>(null);

  const openCaseStudy = useCallback((study: CaseStudy) => {
    setModalContent({ type: 'caseStudy', data: study });
  }, []);

  const openInsight = useCallback((insight: Insight) => {
    setModalContent({ type: 'insight', data: insight });
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);
  
  // Interpolate background color from Hero (Obsidian) to Footer (Deep Blue-Black)
  // Transitions starts at 40% scroll and completes by 90% to match the 3D scene
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.9],
    ["#0A0A0B", "#0A0A0B", "#070A14"]
  );

  // Fade out scroll indicator
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 150], [0.5, 0]);

  return (
    <motion.div 
      style={{ backgroundColor }}
      className="relative min-h-screen selection:bg-cyan selection:text-obsidian overflow-x-hidden"
    >
      
      {/* Global Fixed Background */}
      <ThreeScene />

      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden isolate">
        {/* Hero Content - High z-index to ensure perfect stability above 3D elements */}
        <div className="relative z-40 max-w-7xl mx-auto px-6 text-center pointer-events-none">
          <div className="pointer-events-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-cyan font-mono text-xs md:text-sm tracking-[0.3em] mb-6 border border-cyan/20 inline-block px-4 py-1 rounded-full bg-cyan/5 backdrop-blur-md"
            >
              SYSTEM ARCHITECTURE & ENGINEERING
            </motion.h2>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-tight drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            >
              BUILD THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                UNIMAGINABLE
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="max-w-2xl mx-auto text-silver text-lg md:text-xl font-light mb-12 leading-relaxed drop-shadow-md"
            >
              We architect scalable digital ecosystems using rigorous engineering principles and future-proof technologies.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6"
            >
              {/* Primary Hero Button */}
              <motion.button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} 
                className="relative group overflow-hidden bg-cyan text-obsidian px-8 py-4 rounded font-bold tracking-wider w-full md:w-auto"
                initial={{ boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)" }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 50px rgba(0, 240, 255, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                 <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:animate-shine"></div>
                 <span className="relative z-10 flex items-center justify-center gap-2">
                    START CONSULTATION <ChevronRight size={16} />
                 </span>
              </motion.button>
              
              {/* Secondary Hero Button */}
              <motion.button 
                onClick={() => document.getElementById('work')?.scrollIntoView({behavior:'smooth'})}
                className="relative group overflow-hidden px-8 py-4 rounded font-bold tracking-wider w-full md:w-auto bg-black/30 backdrop-blur-md border border-white/10 text-white"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: "#00F0FF",
                  boxShadow: "0 0 30px rgba(0, 240, 255, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-cyan transition-colors">
                  VIEW WORK <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan to-transparent animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] text-cyan/70 uppercase">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* Solutions Grid */}
      <section id="solutions" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">Our Services</h2>
                    <p className="text-silver font-mono">Built for performance, security, and scale.</p>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-cyan font-mono">01 / SERVICES</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SERVICES.map((service) => (
                    <div key={service.id} className="group glass-panel p-8 rounded-xl border border-white/5 hover:border-cyan/50 transition-all duration-300 hover:-translate-y-2 bg-white/5 backdrop-blur-sm relative overflow-hidden">
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10 text-cyan mb-6 group-hover:scale-110 transition-transform origin-left drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                            <service.icon size={24} />
                        </div>
                        <h3 className="relative z-10 text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="relative z-10 text-silver/60 text-sm leading-relaxed mb-6">
                            {service.description}
                        </p>
                        <div className="relative z-10 flex flex-wrap gap-2">
                            {service.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-white/50 group-hover:border-cyan/30 group-hover:text-cyan/80 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Capabilities / Process */}
      <section id="capabilities" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">Our Approach</h2>
                    <p className="text-silver font-mono">The strategic methodology behind every solution we deliver.</p>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-white/50 font-mono">02 / APPROACH</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, index) => (
                <div key={step.id} className="group glass-panel p-8 rounded-xl border border-white/5 hover:border-cyan/50 transition-all duration-300 hover:-translate-y-2 bg-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                    
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Architectural ID Watermark */}
                    <div className="absolute -top-4 -right-4 text-[6rem] font-bold text-white/[0.02] font-mono select-none group-hover:text-white/[0.04] transition-colors pointer-events-none">
                        {step.id}
                    </div>

                    <div>
                        {/* Header */}
                        <div className="relative z-10 mb-6 flex items-start justify-between">
                            <div className="p-3 rounded-lg border border-white/10 bg-white/5 text-cyan group-hover:border-cyan/50 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300">
                                <step.icon size={24} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">{step.title}</h3>
                            <p className="text-sm text-silver/60 leading-relaxed mb-8 border-b border-white/10 pb-6 group-hover:border-cyan/20 transition-colors">
                                {step.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="relative z-10 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-silver/50 group-hover:text-cyan transition-colors">
                            <Activity size={12} className={index === 1 || index === 3 ? "animate-pulse" : ""} />
                            <span>Status: Active</span>
                         </div>
                         {/* Subtle Tech Marker */}
                         <div className="w-1.5 h-1.5 rounded-sm bg-white/10 group-hover:bg-cyan transition-colors"></div>
                    </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="work" className="py-32 relative z-10 overflow-hidden">
        {/* Added gradient mask to prevent harsh cut-off of the grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">Selected Work</h2>
                    <p className="text-silver font-mono">Enterprise solutions and specialized products we've delivered.</p>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-violet font-mono">03 / WORK</span>
                </div>
            </div>

            <div className="space-y-20">
                {CASE_STUDIES.map((study, index) => (
                    <div key={study.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                        {/* 3D Model Visualization Container */}
                        <div className="w-full md:w-1/2 h-[450px] relative group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm shadow-2xl transition-all duration-500 hover:border-white/20">
                            <CaseStudyScene caseStudy={study} />
                        </div>
                        
                        <div className="w-full md:w-1/2 space-y-6">
                            <span className="text-cyan font-mono text-xs tracking-widest uppercase flex items-center gap-2">
                                <span className="w-2 h-[1px] bg-cyan"></span>
                                {study.client}
                            </span>
                            <h3 className="text-3xl md:text-5xl font-bold text-white">{study.title}</h3>
                            <div className="py-6 border-t border-b border-white/10 backdrop-blur-md bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors duration-300">
                                <p className="text-silver/60 text-sm leading-relaxed">
                                    {study.description}
                                </p>
                            </div>
                            <button
                              onClick={() => openCaseStudy(study)}
                              className="flex items-center gap-2 text-white hover:text-cyan transition-colors group text-sm font-bold tracking-wide"
                            >
                                VIEW PROJECT DETAILS <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Insights */}
      <section id="insights" className="py-32 relative z-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">Insights & Resources</h2>
                    <p className="text-silver font-mono">Technology intelligence and industry perspectives.</p>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-violet font-mono">04 / RESOURCES</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {INSIGHTS.map((insight) => (
                  <div
                    key={insight.id}
                    onClick={() => openInsight(insight)}
                    className="group relative bg-[#0C0C10] border border-white/10 hover:border-violet/50 p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-violet transition-colors"></div>

                      <div>
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[10px] font-mono text-violet uppercase tracking-widest border border-violet/20 px-2 py-1 rounded bg-violet/5">{insight.category}</span>
                           <span className="text-[10px] text-white/30 font-mono">{insight.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">{insight.title}</h3>
                        <p className="text-sm text-silver/60 mb-6 leading-relaxed line-clamp-3">{insight.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 uppercase tracking-widest group-hover:text-white transition-colors">
                         <span>{insight.readTime}</span>
                         <span className="w-4 h-[1px] bg-white/20 group-hover:bg-cyan transition-colors"></span>
                         <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA / Consultation */}
      <section id="contact" className="py-32 relative overflow-hidden z-10">
        {/* Combined Violet/Cyan Glow for smoother transition to footer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-violet/10 via-transparent to-cyan/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Ready to Scale with Intelligent Technology?</h2>
                <p className="text-silver text-lg max-w-2xl mx-auto leading-relaxed">
                    Book a free strategy consultation today. Let's build scalable, secure systems that drive measurable growth.
                </p>
            </div>
            
            <ConsultationForm />
        </div>
      </section>

      {/* Footer - Architectural, Integrated, Calm */}
      {/* Background updated to violet-black gradient for seamless integration */}
      <footer className="relative z-20 pt-24 pb-12 bg-[#070A14]">
        
        {/* Subtle gradient overlay to introduce the violet-black tone */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A14] via-[#0B0B12] to-[#050508]"></div>
        
        {/* Top integrated soft border - Low opacity for minimal disruption */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet/10 to-transparent"></div>
        
        {/* Ambient Violet Haze - "Floor" glow to ground the section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-violet/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            {/* Brand */}
            <div className="flex items-center gap-3">
                {/* Softened border and shadow for a 'settled' look */}
                <div className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center font-bold text-cyan text-sm border border-white/5 shadow-none">N</div>
                <div className="flex flex-col">
                    <span className="text-white text-sm tracking-[0.2em] font-bold">NEURALINK</span>
                    <span className="text-[10px] text-white/30 tracking-widest">INFOTECH</span>
                </div>
            </div>

            {/* Links - Muted colors for calmness */}
            <div className="flex gap-10">
                {['Services', 'About', 'Trading Solutions', 'Contact'].map(link => (
                    <a key={link} href="#" className="text-silver/50 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors duration-300 relative group">
                        {link}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan transition-all duration-300 group-hover:w-full opacity-50"></span>
                    </a>
                ))}
            </div>

            {/* Copyright */}
            <div className="text-white/30 text-[10px] font-mono tracking-wider">
                © {new Date().getFullYear()} NEURALINK INFOTECH. ALL RIGHTS RESERVED.
            </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <DetailModal content={modalContent} onClose={closeModal} />
    </motion.div>
  );
};

export default Home;