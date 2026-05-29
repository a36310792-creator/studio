
'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Play, 
  ExternalLink, 
  Server, 
  Activity, 
  Wifi, 
  Lock,
  MonitorPlay,
  Zap,
  Globe
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

export default function WatchPage() {
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
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-24 shadow-2xl relative overflow-x-hidden font-body">
      <AdFloating hrefs={ROTATION_LINKS} side="right" />
      <AdFloating hrefs={ROTATION_LINKS} side="left" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl p-5 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-[#8b95a5] hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            <span className="text-white">WATCH</span>
            <span className="text-primary">ONLINE</span>
          </h1>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="p-5">
        {/* Premium Streaming Hub */}
        <div className="bg-[#0a0a0a] rounded-[32px] border border-primary/20 p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-white/70">PREMIUM HUB</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">4K STREAMING READY</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">
                <span className="text-[10px] font-black text-primary">ENCRYPTED</span>
              </div>
            </div>

            {/* Movie Info Box */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8">
               <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-[#555] uppercase tracking-widest">
                 <Zap className="w-3 h-3 text-primary" />
                 <span>Server Connection Established</span>
               </div>
               <h3 className="text-xl font-black italic uppercase text-white truncate">
                 {movie?.title || 'SYNCING MEDIA...'}
               </h3>
               <div className="flex gap-3 mt-3">
                 <span className="text-[10px] font-bold text-[#8b95a5] flex items-center gap-1">
                   <Globe className="w-3 h-3" /> {movie?.audio || 'Multi-Audio'}
                 </span>
                 <span className="text-[10px] font-bold text-[#8b95a5] flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3 text-primary" /> Ver: {movie?.quality || '4K'}
                 </span>
               </div>
            </div>

            {/* Play Options */}
            <div className="space-y-4">
              <Button 
                onClick={handleAction}
                className="w-full h-16 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(0,229,255,0.25)] hover:scale-[1.02] transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                PLAY ON PREMIUM SERVER
              </Button>
              
              <Button 
                onClick={handleAction}
                variant="outline"
                className="w-full h-16 bg-white/5 border-primary/30 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              >
                <Zap className="w-5 h-5 text-primary" />
                AUTO-SELECT FASTEST NODE
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <AdBanner id="watch-mid-banner" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        {/* Streaming Nodes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-[#444] uppercase tracking-[3px]">Alternative Nodes</h3>
            <span className="text-[9px] font-bold text-primary/40 uppercase">Low Latency</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'US-PREMIUM (AD-FREE)', speed: '1.4 GB/s', icon: <Wifi className="w-5 h-5 text-primary" /> },
              { name: 'ASIA-VIP DIRECT', speed: '980 MB/s', icon: <Server className="w-5 h-5" /> },
              { name: 'EURO-FAST STREAM', speed: '1.1 GB/s', icon: <Lock className="w-5 h-5" /> }
            ].map((node, i) => (
              <button 
                key={i}
                onClick={handleAction}
                className="flex items-center justify-between p-5 rounded-2xl bg-[#121212] border border-white/5 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#333] group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    {node.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-black text-white group-hover:text-primary transition-colors italic uppercase">{node.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <p className="text-[9px] font-bold text-[#444]">{node.speed}</p>
                    </div>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                   <ExternalLink className="w-4 h-4 text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <AdBanner id="watch-bottom-banner" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 text-center">
        <p className="text-[9px] text-[#222] font-black uppercase tracking-widest leading-relaxed">
          Tunnel protocol active. All connections are secured via premium AES-256 encryption.
        </p>
      </footer>
    </div>
  );
}
