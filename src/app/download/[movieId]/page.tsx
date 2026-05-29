'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, ShieldCheck, Loader2, Zap, Lock, Unlock, Fingerprint, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Movie } from '@/components/movie/MovieCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdPopup } from '@/components/ads/AdPopup';
import { AdFloating } from '@/components/ads/AdFloating';
import Link from 'next/link';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

const SMART_LINK = "https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf";

export default function DownloadGateway() {
  const { movieId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  
  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie } = useDoc<Movie>(movieRef);
  
  // Reduced initial scanning for faster "instant" feel
  const [countdown, setCountdown] = useState(3);
  const [status, setStatus] = useState<'scanning' | 'locked' | 'unlocked'>('scanning');
  const [adClicks, setAdClicks] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === 'scanning') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStatus('locked');
      }
    }
  }, [countdown, status]);

  const handleUnlockClick = () => {
    if (isProcessing) return;

    window.open(SMART_LINK, '_blank');
    
    setIsProcessing(true);
    const nextClickCount = adClicks + 1;
    setAdClicks(nextClickCount);

    setTimeout(() => {
      setIsProcessing(false);
      // Faster unlock requirement
      if (nextClickCount >= 1) {
        setStatus('unlocked');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl flex flex-col relative overflow-hidden">
      <AdPopup hrefs={ROTATION_LINKS} />
      <AdFloating hrefs={ROTATION_LINKS} side="right" />
      
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>

      <header className="p-5 flex items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <button onClick={() => router.back()} className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[3px] text-[#555]">Secure Tunnel Access</h1>
      </header>

      <main className="flex-1 px-6 pt-10 flex flex-col items-center text-center animate-in fade-in duration-500">
        <div className="w-28 h-28 mb-8 relative group">
          <div className={`absolute inset-0 bg-primary/20 rounded-[40px] blur-[20px] transition-all duration-700 ${status === 'unlocked' ? 'opacity-100 scale-125' : 'opacity-0 scale-50'}`}></div>
          <div className={`w-full h-full bg-[#0a0a0a] rounded-[40px] border flex items-center justify-center transition-all duration-500 relative z-10 ${
            status === 'unlocked' ? 'border-primary shadow-[0_0_30px_rgba(0,229,255,0.2)]' : 'border-white/5'
          }`}>
            {status === 'scanning' && <Fingerprint className="w-12 h-12 text-primary animate-pulse" />}
            {status === 'locked' && <Lock className="w-12 h-12 text-[#333]" />}
            {status === 'unlocked' && <Unlock className="w-14 h-14 text-primary animate-in zoom-in duration-500" />}
            
            {status === 'scanning' && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-xs font-black text-primary tabular-nums">{countdown}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-black tracking-tight leading-none uppercase italic">
            {status === 'scanning' && 'Initializing CDN...'}
            {status === 'locked' && 'Links Restricted'}
            {status === 'unlocked' && 'Tunnel Verified'}
          </h2>
          <p className="text-[11px] text-[#8b95a5] font-black uppercase tracking-widest opacity-60">
            {status === 'scanning' && 'Establishing encrypted handshake'}
            {status === 'locked' && 'Verification required for premium links'}
            {status === 'unlocked' && 'Direct high-speed mirrors ready'}
          </p>
        </div>

        <div className="w-full mb-8">
          <AdBanner id="download-above-unlock-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        <div className="w-full relative z-10 min-h-[80px]">
          {status === 'locked' && (
            <Button 
              onClick={handleUnlockClick}
              disabled={isProcessing}
              className={`w-full h-16 rounded-2xl font-black text-lg transition-all duration-500 flex items-center justify-center gap-3 relative group overflow-hidden ${
                isProcessing 
                ? 'bg-white/5 text-primary border border-primary/20 cursor-wait' 
                : 'bg-primary text-black shadow-[0_10px_40px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-95'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>DECRYPTING 75%</span>
                </>
              ) : (
                <>
                  <Zap className={`w-6 h-6 ${adClicks > 0 ? 'animate-pulse' : ''}`} />
                  <span>UNLOCK CONTENT</span>
                </>
              )}
            </Button>
          )}

          {status === 'unlocked' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700 w-full">
              <Button 
                className="w-full h-16 bg-gradient-to-r from-primary to-cyan-400 text-black font-black text-lg rounded-2xl shadow-[0_15px_40px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex justify-between px-6"
                asChild
              >
                <Link href={`/watch/${movieId}`}>
                  <div className="flex items-center gap-3">
                    <MonitorPlay className="w-6 h-6" />
                    <span>Access Fast Server</span>
                  </div>
                  <Zap className="w-5 h-5 fill-current" />
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  className="h-14 bg-white/5 border-white/10 text-white font-black text-[12px] rounded-2xl hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-0.5"
                  asChild
                >
                  <a href={movie?.directDownloadUrl || SMART_LINK} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5 mb-1" />
                    <span>Direct Mirror 1</span>
                  </a>
                </Button>

                <Button 
                  variant="outline"
                  className="h-14 bg-white/5 border-white/10 text-white font-black text-[12px] rounded-2xl hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-0.5"
                  asChild
                >
                  <a href={SMART_LINK} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5 mb-1" />
                    <span>Direct Mirror 2</span>
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full mt-8">
          <AdBanner id="download-below-section-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        {movie && (
          <div className="w-full mt-10 bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 text-left group hover:border-primary/10 transition-all">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-22 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img src={movie.posterUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-white truncate text-sm uppercase tracking-tight italic">{movie.title}</h3>
                <p className="text-[10px] text-primary font-black uppercase mt-1 tracking-widest opacity-80">
                  {movie.quality} • {movie.releaseYear}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-[9px] font-black text-green-500/60 uppercase tracking-tighter">Verified Content Node</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="px-8 py-10 mt-auto bg-gradient-to-t from-black to-transparent">
        <div className="fixed bottom-0 left-0 right-0 z-[200] bg-black/95 border-t border-primary/20 p-2 md:max-w-[420px] md:mx-auto">
          <AdBanner id="download-sticky-footer-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </footer>
    </div>
  );
}
