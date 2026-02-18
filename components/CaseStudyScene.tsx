import React, { useState } from 'react';
import { CaseStudy } from '../types';
import { ArrowUpRight, BarChart3, Server } from 'lucide-react';

const CaseStudyScene: React.FC<{ caseStudy: CaseStudy }> = ({ caseStudy }) => {
  const [hovered, setHovered] = useState(false);
  const isTrading = caseStudy.id === 'trading-product';

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-obsidian/50"
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${isTrading ? 'from-cyan/10 via-transparent to-violet/5' : 'from-violet/10 via-transparent to-cyan/5'}`} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Floating accent shapes */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out ${hovered ? 'scale-110' : 'scale-100'}`}>
        {/* Large ring */}
        <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border ${isTrading ? 'border-cyan/20' : 'border-violet/20'} transition-all duration-700 ${hovered ? 'border-opacity-50 scale-105' : ''}`} />
        {/* Inner ring */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-44 md:h-44 rounded-full border ${isTrading ? 'border-cyan/10' : 'border-violet/10'} transition-all duration-500 ${hovered ? 'scale-110' : ''}`} />
        {/* Center icon */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-500 ${isTrading ? 'bg-cyan/10 border border-cyan/20' : 'bg-violet/10 border border-violet/20'} ${hovered ? 'scale-110 shadow-[0_0_40px_rgba(0,240,255,0.2)]' : ''}`}>
          {isTrading ? (
            <BarChart3 size={32} className="text-cyan" />
          ) : (
            <Server size={32} className="text-violet" />
          )}
        </div>
      </div>

      {/* Corner accents */}
      <div className={`absolute top-6 left-6 w-12 h-12 border-t border-l ${isTrading ? 'border-cyan/15' : 'border-violet/15'} transition-all duration-500 ${hovered ? 'w-16 h-16' : ''}`} />
      <div className={`absolute bottom-6 right-6 w-12 h-12 border-b border-r ${isTrading ? 'border-cyan/15' : 'border-violet/15'} transition-all duration-500 ${hovered ? 'w-16 h-16' : ''}`} />

      {/* Metrics display on hover */}
      <div className={`absolute bottom-6 left-6 right-6 flex justify-between transition-all duration-500 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {caseStudy.metrics.map((metric) => (
          <div key={metric.label} className="bg-obsidian/80 backdrop-blur-sm border border-white/10 px-4 py-3 rounded">
            <div className={`text-lg font-mono font-bold ${isTrading ? 'text-cyan' : 'text-violet'}`}>{metric.value}</div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isTrading ? 'bg-cyan' : 'bg-violet'} shadow-[0_0_6px_currentColor]`} />
        <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
          {isTrading ? 'PRODUCT' : 'CLIENT PROJECT'}
        </span>
      </div>
    </div>
  );
};

export default CaseStudyScene;
