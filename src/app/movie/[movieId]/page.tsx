'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Download, 
  ExternalLink, 
  Server, 
  Activity, 
  Wifi, 
  Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';

const SMART_LINK = "https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf";
const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

export default function MovieGateway() {
  const { movieId } = useParams();
  const db = useFirestore();
  const router = useRouter();

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie } = useDoc<Movie>(movieRef);

  const handleAction = () => {
    window.open(SMART_LINK, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl relative overflow-x-hidden font-body">
      <AdFloating hrefs={ROTATION_LINKS} side="right" />
      <AdFloating hrefs={ROTATION_LINKS} side="left" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl p-5 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-[#8b95a5] hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            <span className="text-white">SECURE</span>
            <span className="text-primary">GATEWAY</span>
          </h1>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="p-5">
        {/* Status Card */}
        <div className="bg-[#0a0a0a] rounded-[32px] border border-primary/20 p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[13px] font-black uppercase tracking-wider text-white">Encryption Layer Active</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Connection Stable</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6">
              <div className="flex justify-between items-center text-[10px] font-black text-[#555] uppercase mb-2">
                <span>Selected Media</span>
                <span className="text-primary">4K STREAMING</span>
              </div>
              <h3 className="text-lg font-black truncate italic uppercase">
                {movie?.title || 'Loading Metadata...'}
              </h3>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleAction}
                className="w-full h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,229,255,0.2)] hover:scale-[1.01] transition-all"
              >
                <Zap className="w-5 h-5 fill-current" />
                UNLOCK HIGH SPEED SERVER
              </Button>
              
              <Button 
                onClick={handleAction}
                variant="outline"
                className="w-full h-14 bg-white/5 border-primary/20 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              >
                <Download className="w-5 h-5 text-primary" />
                MAIN DOWNLOADING LINK
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <AdBanner id="gateway-mid" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        {/* Server Nodes */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#444] uppercase tracking-[3px] ml-1">Alternative Nodes</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'US-CENTRAL PREMIUM', speed: '980 MB/s', icon: <Wifi className="w-4 h-4" /> },
              { name: 'ASIA-PACIFIC DIRECT', speed: '1.2 GB/s', icon: <Server className="w-4 h-4" /> },
              { name: 'EUROPE FAST NODE', speed: '850 MB/s', icon: <Lock className="w-4 h-4" /> }
            ].map((node, i) => (
              <button 
                key={i}
                onClick={handleAction}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#121212] border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#555] group-hover:text-primary transition-colors">
                    {node.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-white group-hover:text-primary transition-colors">{node.name}</p>
                    <p className="text-[9px] font-bold text-[#444] mt-0.5">{node.speed}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#222] group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <AdBanner id="gateway-bottom" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 text-center">
        <p className="text-[9px] text-[#222] font-black uppercase tracking-widest leading-relaxed">
          High-performance tunnel protocol active. All connections are secured via AES-256 encryption.
        </p>
      </footer>
    </div>
  );
}
