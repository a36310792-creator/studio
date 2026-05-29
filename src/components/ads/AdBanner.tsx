'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Zap, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  id: string;
  html?: string;
  href?: string;
  className?: string;
}

/**
 * AdBanner Component
 * Supports both HTML/Script injection and direct Clickable Banners.
 */
export const AdBanner = ({ id, html, href, className }: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && containerRef.current && html) {
      try {
        const range = document.createRange();
        range.selectNode(containerRef.current);
        const fragment = range.createContextualFragment(html);
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(fragment);
      } catch (error) {
        console.error('Failed to inject ad script:', error);
      }
    }
  }, [isMounted, html]);

  if (!isMounted) {
    return <div className={className} style={{ minHeight: '90px' }} />;
  }

  // If a direct link is provided, render a high-quality clickable banner
  if (href) {
    return (
      <div className={className}>
        <div className="text-[9px] text-center text-[#444] font-black uppercase tracking-[3px] mb-2">
          Sponsored Premium Content
        </div>
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative block w-full overflow-hidden rounded-[24px] border border-primary/20 bg-gradient-to-r from-black via-[#0a0a0a] to-black p-5 shadow-[0_0_20px_rgba(0,229,255,0.05)] transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] active:scale-[0.98]"
        >
          {/* Animated Glow Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[13px] font-black text-white uppercase tracking-tight italic">Unlock High Speed Server</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span className="text-[9px] font-black text-green-500/80 uppercase">Verified Secure Link</span>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider">
              <span>Access Now</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-[9px] text-center text-[#444] font-black uppercase tracking-[3px] mb-1.5">
        Advertisement
      </div>
      <div 
        ref={containerRef} 
        id={id} 
        className="min-h-[90px] w-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 overflow-hidden transition-all hover:bg-white/[0.07]"
      >
        {!html && (
          <div className="flex flex-col items-center gap-1 opacity-20">
            <span className="text-[10px] font-black italic tracking-tighter">AD_SLOT_ACTIVE</span>
            <div className="w-12 h-0.5 bg-primary/30 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
