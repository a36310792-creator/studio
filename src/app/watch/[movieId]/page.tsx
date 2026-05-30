'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SponsoredAd } from '@/components/ads/SponsoredAd';

export default function MaintenancePage() {
  const router = useRouter();

  const handleAction = () => {
    // Click-intercept ad pop-under
    setTimeout(() => { 
      window.open('https://bold-consequence.com/kYQwC9', '_blank'); 
    }, 50);
    router.push('/');
  };

  const handleFakePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open('https://elderlygoal.com/dOm.Fwz/d/GtN-vrZMGSUs/heXmf9pufZsUrlmkRPVTScxwGOrT/I/xFN/jBkMtGNgzFAH5IMHjlED3/MWwx', '_blank');
  };

  // Variations for the ad wall
  const topAdTypes: ('ribbon' | 'glow' | 'alert')[] = ['glow', 'ribbon'];
  const bottomAdTypes: ('ribbon' | 'glow' | 'alert')[] = ['ribbon', 'alert', 'glow', 'ribbon'];

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative overflow-x-hidden font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-2xl p-6 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="text-[#8b95a5] hover:text-white transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="text-xl font-black italic tracking-tighter uppercase cyan-glow-text">
            <span className="text-white">SECURE</span>
            <span className="text-primary">NODE</span>
          </div>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="p-5 flex flex-col gap-4">
        {/* Top Ad Stack */}
        <div className="flex flex-col gap-3">
          {topAdTypes.map((type, idx) => (
            <SponsoredAd key={`top-ad-${idx}`} type={type} />
          ))}
        </div>

        {/* Fake Play Banner - Clickable Monetization Prompt */}
        <div 
          className="w-full aspect-video bg-gradient-to-r from-gray-900 to-black border border-red-600 rounded-xl p-8 my-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all group"
          onClick={handleFakePlayClick}
        >
          <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.6)]">
            <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h3 className="text-white font-extrabold text-xl tracking-wider text-center drop-shadow-md">
            ▶ CLICK TO PLAY IN 4K ULTRA HD
          </h3>
        </div>

        {/* Bottom Ad Grid */}
        <div className="grid grid-cols-1 gap-3">
          {bottomAdTypes.map((type, idx) => (
            <div key={`bottom-ad-${idx}`} className="w-full">
              <SponsoredAd type={type} />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6 px-2">
          <Button 
            onClick={handleAction}
            className="w-full h-16 bg-primary text-black font-black rounded-2xl shadow-[0_12px_35px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all uppercase italic text-lg"
          >
            <Home className="w-5 h-5 mr-3" />
            RETURN TO HOME
          </Button>
          
          <p className="text-[9px] text-[#444] font-black text-center uppercase tracking-[4px] mt-8 italic">
            SECURE TUNNEL PROTOCOL AES-256 ACTIVE
          </p>
        </div>
      </main>

      <footer className="p-10 text-center opacity-20">
        <div className="text-[8px] text-white font-black uppercase tracking-[5px]">
          SERVER NODE REVISION 4.5.0
        </div>
      </footer>
    </div>
  );
}
