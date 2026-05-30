'use client';

import React, { useMemo, useState } from 'react';
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
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';

export default function MovieGateway() {
  const { movieId } = useParams();
  const db = useFirestore();
  const router = useRouter();

  const [firstClickAdTriggered, setFirstClickAdTriggered] = useState(false);

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie } = useDoc<Movie>(movieRef);

  const handleDownloadAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Open Ad (Monetization Layer)
    window.open('https://bold-consequence.com/kYQwC9', '_blank');
    
    // 2. Direct Download (Simultaneous Trigger)
    if (movie?.directDownloadUrl) {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = movie.directDownloadUrl!;
        link.target = '_blank';
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 100);
    }
  };

  const handleAdOnlyAction = (e: React.MouseEvent) => {
    // Stop Event Bubbling
    e.stopPropagation();
    e.preventDefault();

    // Just trigger the ad popup
    window.open('https://bold-consequence.com/kYQwC9', '_blank');
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate specifically back to Page 2 (Movie Details view)
    router.push(`/download/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl relative overflow-x-hidden font-body">
      {/* First-Click Invisible Ad Overlay */}
      {!firstClickAdTriggered && (
        <div 
          className="fixed inset-0 z-[9999] bg-transparent cursor-default"
          onClick={() => {
            window.open('https://bold-consequence.com/kYQwC9', '_blank');
            setFirstClickAdTriggered(true);
          }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl p-5 border-b border-white/5 flex items-center justify-between">
        <button 
          onClick={handleBack} 
          className="text-[#8b95a5] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          aria-label="Go back"
        >
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

            {/* 1. SELECTED MEDIA Box - Ad Only Impression Point */}
            <div 
              onClick={handleAdOnlyAction}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6 cursor-pointer hover:bg-white/10 transition-all group"
            >
              <div className="flex justify-between items-center text-[10px] font-black text-[#555] uppercase mb-2">
                <span>Selected Media</span>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">SECURE ACCESS</span>
              </div>
              <h3 className="text-lg font-black truncate italic uppercase">
                {movie?.title || 'Syncing Metadata...'}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Element 2: UNLOCK HIGH SPEED SERVER - Ad Only Impression Point */}
              <Button 
                onClick={handleAdOnlyAction}
                className="w-full h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,229,255,0.25)] hover:scale-[1.01] transition-all"
              >
                <Zap className="w-5 h-5 fill-current" />
                UNLOCK HIGH SPEED SERVER
              </Button>
              
              {/* Element 3: MAIN DOWNLOADING LINK - Dual Action Logic */}
              <Button 
                onClick={handleDownloadAction}
                variant="outline"
                className="w-full h-14 bg-white/5 border-primary/20 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
              >
                <Download className="w-5 h-5 text-primary" />
                MAIN DOWNLOADING LINK
              </Button>
            </div>
          </div>
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
                onClick={handleAdOnlyAction}
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