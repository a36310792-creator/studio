'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home,
  MonitorOff,
  Activity,
  AlertTriangle
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

  // Variations for the ad wall
  const topAdTypes: ('ribbon' | 'glow' | 'alert')[] = ['glow', 'ribbon', 'alert', 'glow'];
  const bottomAdTypes: ('ribbon' | 'glow' | 'alert')[] = ['ribbon', 'alert', 'glow', 'ribbon', 'alert', 'glow', 'ribbon', 'alert'];

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
        {/* Top Ad Stack (4 Ads) */}
        <div className="flex flex-col gap-3">
          {topAdTypes.map((type, idx) => (
            <SponsoredAd key={`top-ad-${idx}`} type={type} />
          ))}
        </div>

        {/* Premium Maintenance Container */}
        <div className="bg-[#15171e] rounded-[32px] border border-primary/30 p-8 text-center relative overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.15)] animate-in fade-in zoom-in duration-700">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-6 shadow-glow">
            <MonitorOff className="w-8 h-8" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
             <AlertTriangle className="w-4 h-4 text-primary animate-pulse" />
             <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
               ⚠️ ONLINE SERVER NOTICE
             </h1>
          </div>

          <p className="text-[#8b95a5] text-[12px] font-bold uppercase tracking-tight leading-relaxed">
            High-speed streaming nodes are currently undergoing maintenance. 
            Online watching is temporarily inactive. Please utilize the Direct Download options.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-primary animate-ping"></div>
              <span className="text-[8px] font-black text-primary uppercase tracking-widest">Optimizing Node 4</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-2.5 h-2.5 text-[#555]" />
              <span className="text-[8px] font-black text-[#555] uppercase tracking-widest">98.2% Sync</span>
            </div>
          </div>
        </div>

        {/* Bottom Ad Grid (8 Ads) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          SERVER NODE MAINTENANCE REVISION 4.2.0
        </div>
      </footer>
    </div>
  );
}