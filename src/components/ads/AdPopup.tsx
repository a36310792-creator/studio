'use client';

import { useState, useEffect } from 'react';
import { X, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdPopupProps {
  href: string;
  delay?: number;
}

/**
 * AdPopup Component
 * Shows a high-conversion modal ad after a short delay.
 */
export const AdPopup = ({ href, delay = 1500 }: AdPopupProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after delay
    const timer = setTimeout(() => {
      const hasShown = sessionStorage.getItem('popup_shown');
      if (!hasShown) {
        setShow(true);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('popup_shown', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-[#121212] border border-primary/30 rounded-[32px] p-8 max-w-[340px] w-full relative shadow-[0_0_50px_rgba(0,229,255,0.2)] animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose} 
          className="absolute top-5 right-5 text-[#444] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
          <Zap className="w-8 h-8 fill-current" />
        </div>
        
        <h3 className="text-xl font-black text-white text-center mb-2 uppercase italic tracking-tight">Access Restricted</h3>
        <p className="text-[11px] text-[#8b95a5] text-center mb-8 font-bold uppercase tracking-[2px] leading-relaxed">
          Unlock high-speed premium server and remove all download restrictions instantly.
        </p>
        
        <Button className="w-full h-14 bg-primary text-black font-black text-[13px] rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-all" asChild>
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClose}>
            CONTINUE TO SERVER <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        
        <p className="mt-6 text-[9px] text-[#333] font-bold text-center uppercase tracking-widest">
          Secure Tunneling Active
        </p>
      </div>
    </div>
  );
};
