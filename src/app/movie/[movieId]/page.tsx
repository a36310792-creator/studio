'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  Lock,
  X,
  MessageCircle,
  Loader2
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
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showFloatingAd, setShowFloatingAd] = useState(true);

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie } = useDoc<Movie>(movieRef);

  // Countdown Logic for Main Download
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCountingDown && countdown === 0) {
      // Trigger actual download after countdown
      if (movie?.directDownloadUrl) {
        const link = document.createElement('a');
        link.href = movie.directDownloadUrl;
        link.target = '_blank';
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIsCountingDown(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCountingDown, movie?.directDownloadUrl]);

  const handleDownloadAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Open Ad (Monetization Layer - Immediate)
    window.open('https://bold-consequence.com/kYQwC9', '_blank');
    
    // 2. Start Countdown
    if (!isCountingDown) {
      setIsCountingDown(true);
      setCountdown(5);
    }
  };

  const handleAdOnlyAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.open('https://bold-consequence.com/kYQwC9', '_blank');
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/download/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl relative overflow-x-hidden font-body">
      
      {/* 1. Sticky Top Banner Ad */}
      <div 
        onClick={handleAdOnlyAction}
        className="fixed top-0 left-0 w-full h-14 bg-[#0a0b0f] border-b border-primary/20 z-[9998] flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
      >
        <span className="text-primary text-[11px] font-black uppercase tracking-[2px] animate-pulse italic">
          🔥 Click Here to Watch in Ultra HD 4K 🔥
        </span>
      </div>

      {/* 2. Floating Corner Message Ad */}
      {showFloatingAd && (
        <div 
          onClick={handleAdOnlyAction}
          className="fixed bottom-4 right-4 w-64 h-32 bg-black border border-primary/50 rounded-2xl z-[9998] shadow-[0_0_30px_rgba(0,229,255,0.25)] flex flex-col justify-center items-center cursor-pointer p-4 group animate-in slide-in-from-right-10 duration-500"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAdOnlyAction(e); // Clicking close also triggers ad
              setShowFloatingAd(false);
            }}
            className="absolute top-3 right-3 text-[#444] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 shadow-glow">
             <MessageCircle className="w-6 h-6 animate-bounce" />
          </div>
          <span className="text-white text-[11px] font-black uppercase tracking-tighter">🎁 You have 1 Unread Message</span>
          <span className="text-primary text-[9px] font-black mt-1 opacity-70 group-hover:opacity-100 transition-opacity">CLICK TO OPEN SECURELY</span>
        </div>
      )}

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

      {/* Content wrapper with top margin for banner */}
      <div className="pt-14">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl p-5 border-b border-white/5 flex items-center justify-between">
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
                <Button 
                  onClick={handleAdOnlyAction}
                  className="w-full h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,229,255,0.25)] hover:scale-[1.01] transition-all"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  UNLOCK HIGH SPEED SERVER
                </Button>
                
                {/* 3. MAIN DOWNLOADING LINK - Dual Action Logic with Timer */}
                <Button 
                  onClick={handleDownloadAction}
                  variant="outline"
                  disabled={isCountingDown}
                  className="w-full h-14 bg-white/5 border-primary/20 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  {isCountingDown ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>GENERATING LINK... {countdown}s</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-5 h-5 text-primary" />
                      <span>MAIN DOWNLOADING LINK</span>
                    </>
                  )}
                  {isCountingDown && (
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000"
                      style={{ width: `${(5 - countdown) * 20}%` }}
                    />
                  )}
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

        <footer className="p-8 text-center">
          <p className="text-[9px] text-[#222] font-black uppercase tracking-widest leading-relaxed">
            High-performance tunnel protocol active. All connections are secured via AES-256 encryption.
          </p>
        </footer>
      </div>
    </div>
  );
}
