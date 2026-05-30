'use client';

import React, { useState, useEffect } from 'react';
import { Zap, ExternalLink, ShieldCheck } from 'lucide-react';

const VARIATIONS = [
  { text: 'Unlock Premium Stream', subText: 'Instant 4K Access Enabled', accentColor: '#00e5ff' },
  { text: 'Recommended Content', subText: 'Hand-picked Elite Collection', accentColor: '#b535ff' },
  { text: 'High-Speed Server Node', subText: '1.2 GB/s Dedicated Tunneling', accentColor: '#39ff14' },
  { text: 'Sponsored: Watch in 4K', subText: 'Ultra HD Cinematic Experience', accentColor: '#ffd700' }
];

export const SponsoredAd = () => {
  const [variation, setVariation] = useState<typeof VARIATIONS[0] | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * VARIATIONS.length);
    setVariation(VARIATIONS[randomIndex]);
  }, []);

  if (!variation) return null;

  const handleClick = () => {
    window.open('https://bold-consequence.com/kYQwC9', '_blank');
  };

  return (
    <div className="w-full">
      <div 
        onClick={handleClick}
        className="cursor-pointer group relative block w-full overflow-hidden rounded-[24px] bg-gradient-to-r from-black via-[#0a0a0a] to-black p-5 transition-all active:scale-[0.98] animate-in fade-in duration-500"
        style={{ 
          border: `1px solid ${variation.accentColor}33`,
          boxShadow: `0 0 20px ${variation.accentColor}10`
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ backgroundColor: variation.accentColor }}
        ></div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110"
              style={{ 
                backgroundColor: `${variation.accentColor}15`,
                borderColor: `${variation.accentColor}40`,
                color: variation.accentColor
              }}
            >
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-black text-white uppercase tracking-tight italic">
                {variation.text}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-black text-[#555] uppercase tracking-tighter">
                  {variation.subText}
                </span>
              </div>
            </div>
          </div>
          
          <div 
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider text-black"
            style={{ backgroundColor: variation.accentColor }}
          >
            <span>Access</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
