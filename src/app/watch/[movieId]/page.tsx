'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home,
  Play,
  Zap,
  ShieldCheck,
  MonitorPlay
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

  const handleAdOnlyAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.open('https://bold-consequence.com/kYQwC9', '_blank');
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

        {/* 2. Replacement for Video Player & Error Box: Fake Play Banner */}
        <div 
          onClick={handleAdOnlyAction}
          className="relative w-full aspect-video bg-[#0a0a0a] rounded-3xl overflow-hidden border border-primary/20 cursor-pointer shadow-[0_0_30px_rgba(0,229,255,0.15)] group transition-all active:scale-[0.98] mb-4"
        >
          {/* Background visuals (no video tag to prevent crashes) */}
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/cinema/800/450')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          {/* Center Play UI */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
             <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_50px_rgba(0,229,255,0.4)] transform transition-transform group-hover:scale-110">
                <Play className="w-10 h-10 fill-current ml-1" />
             </div>
             <div className="flex flex-col items-center text-center px-6">
                <span className="text-sm font-black italic uppercase tracking-[4px] text-white drop-shadow-md">
                   Activate 4K Stream
                </span>
                <div className="flex items-center gap-2 mt-2">
                   <Zap className="w-3 h-3 text-primary fill-current animate-pulse" />
                   <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                      Ultra-Fast CDN Node Online
                   </span>
                </div>
             </div>
          </div>

          {/* Fake Control Bar UI decoration */}
          <div className="absolute bottom-0 left-0 w-full p-4 flex items-center gap-4 bg-black/60 backdrop-blur-md border-t border-white/5">
             <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[40%] bg-primary"></div>
             </div>
             <ShieldCheck className="w-4 h-4 text-green-500" />
          </div>
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
          SERVER NODE REVISION 4.2.0
        </div>
      </footer>
    </div>
  );
}
