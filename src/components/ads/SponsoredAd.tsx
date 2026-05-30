'use client';

import React from 'react';
import { Zap, ExternalLink, ShieldCheck, Info, Sparkles, MonitorPlay } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SponsoredAdProps {
  type?: 'ribbon' | 'glow' | 'alert' | 'cinematic';
}

export const SponsoredAd = ({ type = 'glow' }: SponsoredAdProps) => {
  const handleClick = () => {
    setTimeout(() => {
      window.open('https://bold-consequence.com/kYQwC9', '_blank');
    }, 50);
  };

  if (type === 'ribbon') {
    return (
      <div 
        onClick={handleClick}
        className="w-full h-12 bg-[#111319] border border-white/5 rounded-xl px-4 flex items-center justify-between cursor-pointer group hover:border-primary/30 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-3.5 h-3.5 text-primary fill-current" />
          <span className="text-[10px] font-black text-[#8b95a5] uppercase tracking-[2px] italic">
            ⚡ HIGH SPEED STREAMING PARTNER
          </span>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
          Connect
        </div>
      </div>
    );
  }

  if (type === 'alert') {
    return (
      <div 
        onClick={handleClick}
        className="w-full bg-[#0a0a0a] border-l-4 border-l-[#39ff14] border-y border-r border-white/5 p-4 flex items-center gap-4 cursor-pointer group hover:bg-[#111] transition-all active:scale-[0.99]"
      >
        <div className="w-10 h-10 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14]">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-[11px] font-black text-white uppercase italic">NOTICE: Dynamic CDN route optimized</h4>
          <p className="text-[9px] font-bold text-[#444] uppercase tracking-tighter mt-0.5">Click to accelerate download links</p>
        </div>
        <ExternalLink className="w-4 h-4 text-[#222] group-hover:text-[#39ff14] transition-colors" />
      </div>
    );
  }

  if (type === 'cinematic') {
    return (
      <div 
        onClick={handleClick}
        className="w-full h-8 bg-[#0d0e12] border-x border-white/5 flex items-center justify-center cursor-pointer group hover:bg-primary/5 transition-all"
      >
        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-black text-[#444] group-hover:text-primary uppercase tracking-[4px] italic">
            ADVERTISEMENT: SPONSORED GATEWAY
          </span>
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    );
  }

  // Default type: glow
  return (
    <div 
      onClick={handleClick}
      className="w-full relative group cursor-pointer active:scale-[0.98] transition-all"
    >
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      <div className="relative z-10 bg-[#1a1d26] border border-primary/20 rounded-[24px] p-5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-[13px] font-black text-white uppercase tracking-tight italic">⭐ UNLOCK ULTRA HD 4K</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-[9px] font-black text-[#555] uppercase tracking-tighter">
                Click to activate premium server route
              </span>
            </div>
          </div>
        </div>
        <div className="bg-primary text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-[0_5px_15px_rgba(0,229,255,0.3)]">
          Access
        </div>
      </div>
    </div>
  );
};
