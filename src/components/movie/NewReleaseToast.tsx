"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NewReleaseToastProps {
  movieName?: string;
  link?: string;
}

export const NewReleaseToast = ({ 
  movieName = "Avatar: The Way of Water", 
  link = "#" 
}: NewReleaseToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay (2.5 seconds)
    const showTimer = setTimeout(() => setIsVisible(true), 2500);
    
    // Auto-hide after 10 seconds
    const hideTimer = setTimeout(() => setIsVisible(false), 12500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div 
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[200] transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-[#151b2b]/95 backdrop-blur-xl border border-[#00e5ff] rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,229,255,0.25)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00e5ff]/10 flex items-center justify-center text-xl shrink-0">
            🔥
          </div>
          <div className="flex flex-col">
            <h4 className="text-[13px] font-black text-[#00e5ff] uppercase tracking-wider leading-none">New Release Live!</h4>
            <p className="text-[11px] text-white font-bold mt-1.5 line-clamp-1">{movieName}</p>
          </div>
        </div>
        <a 
          href={link} 
          className="bg-[#00e5ff] text-black text-[11px] font-black uppercase px-5 py-2.5 rounded-xl hover:brightness-110 hover:scale-105 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
        >
          Watch
        </a>
      </div>
    </div>
  );
};
