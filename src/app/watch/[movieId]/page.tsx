'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  AlertCircle,
  Home,
  MonitorOff,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SponsoredAd } from '@/components/ads/SponsoredAd';

export default function MaintenancePage() {
  const router = useRouter();

  const handleAction = () => {
    setTimeout(() => { 
      window.open('https://bold-consequence.com/kYQwC9', '_blank'); 
    }, 50);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative overflow-x-hidden font-body">
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-2xl p-6 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="text-[#8b95a5] hover:text-white transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="text-xl font-black italic tracking-tighter uppercase cyan-glow-text">
            <span className="text-white">SYSTEM</span>
            <span className="text-primary">UPDATE</span>
          </div>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in duration-700">
        
        <div className="w-24 h-24 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 animate-pulse shadow-[0_0_50px_rgba(0,229,255,0.1)]">
          <MonitorOff className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4 leading-tight">
          Streaming Node <br /> <span className="text-primary">OFFLINE</span>
        </h1>

        <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 mb-10 w-full">
          <div className="flex items-center justify-center gap-3 mb-4 text-primary">
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[3px]">Maintenance Active</span>
          </div>
          <p className="text-[#8b95a5] text-sm font-bold uppercase tracking-tight leading-relaxed">
            We are currently optimizing our high-speed streaming protocols. Online playback is temporarily disabled for all media.
          </p>
        </div>

        <div className="w-full space-y-4">
          <SponsoredAd type="alert" />
          
          <Button 
            onClick={handleAction}
            className="w-full h-16 bg-primary text-black font-black rounded-2xl shadow-[0_12px_35px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all uppercase italic text-lg"
          >
            <Home className="w-5 h-5 mr-3" />
            RETURN TO HOME
          </Button>
          
          <p className="text-[9px] text-[#444] font-black uppercase tracking-[4px] mt-6">
            Please use direct download options from the movie page.
          </p>
        </div>
      </main>

      <footer className="p-10 text-center opacity-30 mt-auto">
        <p className="text-[9px] text-white font-black uppercase tracking-[3px] leading-relaxed">
          Tunnel protocol active. AES-256 encryption enabled for secure node transfers.
        </p>
      </footer>
    </div>
  );
}
