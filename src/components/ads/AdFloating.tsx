'use client';

import { Zap, ExternalLink } from 'lucide-react';

interface AdFloatingProps {
  href: string;
  side?: 'left' | 'right';
}

/**
 * AdFloating Component
 * A persistent corner floating ad button.
 */
export const AdFloating = ({ href, side = 'right' }: AdFloatingProps) => {
  return (
    <div className={`fixed bottom-28 ${side === 'right' ? 'right-5' : 'left-5'} z-[100] animate-bounce hover:animate-none transition-all`}>
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2.5 bg-primary text-black px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase shadow-[0_15px_40px_rgba(0,229,255,0.4)] hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="bg-black/10 p-1 rounded-md">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="leading-none">PRO ACCESS</span>
          <span className="text-[8px] opacity-60 mt-0.5">UNLOCKED</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
      </a>
    </div>
  );
};
