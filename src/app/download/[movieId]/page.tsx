'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, ShieldCheck, AlertCircle, Loader2, Zap, Lock, Unlock, ExternalLink, Sparkles, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Movie } from '@/components/movie/MovieCard';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

const MOCK_FALLBACK_MOVIES: Movie[] = [
  {
    id: 'hathras-1',
    title: 'Hathras',
    posterUrl: 'https://picsum.photos/seed/hathras/400/600',
    rating: 8.2,
    quality: 'HD',
    releaseYear: 2024,
    audio: 'Hindi',
    genres: ['Thriller', 'Drama', 'Bollywood'],
    description: 'A gripping investigative thriller based on true events.',
    watchUrl: '#',
    directDownloadUrl: 'https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf'
  },
  {
    id: 'karuppu-2',
    title: 'Karuppu',
    posterUrl: 'https://picsum.photos/seed/karuppu/400/600',
    rating: 7.9,
    quality: '4K',
    releaseYear: 2024,
    audio: 'Tamil',
    genres: ['Action', 'Thriller', 'South'],
    description: 'An intense action drama from the heart of South India.',
    watchUrl: '#',
    directDownloadUrl: 'https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf'
  }
];

const ADSTERRA_LINK = "https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf";

export default function DownloadGateway() {
  const { movieId } = useParams();
  const db = useFirestore();
  
  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: firestoreMovie, loading: firestoreLoading } = useDoc<Movie>(movieRef);
  
  const [countdown, setCountdown] = useState(6);
  const [status, setStatus] = useState<'scanning' | 'locked' | 'verifying' | 'unlocked'>('scanning');
  const [adClicks, setAdClicks] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const movie = useMemo(() => {
    if (firestoreMovie) return firestoreMovie;
    return MOCK_FALLBACK_MOVIES.find(m => m.id === movieId) || MOCK_FALLBACK_MOVIES[0];
  }, [firestoreMovie, movieId]);

  // Initial Security Scan Countdown
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

    // Open Ad Link
    window.open(ADSTERRA_LINK, '_blank');
    
    setIsProcessing(true);
    const nextClickCount = adClicks + 1;
    setAdClicks(nextClickCount);

    // Simulate verification delay
    setTimeout(() => {
      setIsProcessing(false);
      if (nextClickCount >= 2) {
        setStatus('unlocked');
      }
    }, 2500);
  };

  if (firestoreLoading && !movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl flex flex-col relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>

      <header className="p-5 flex items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <h1 className="text-[10px] font-black uppercase tracking-[3px] text-[#555]">Secure Server Access</h1>
      </header>

      <main className="flex-1 px-6 pt-10 flex flex-col items-center text-center">
        {/* Status Icon */}
        <div className="w-28 h-28 mb-8 relative group">
          <div className={`absolute inset-0 bg-primary/20 rounded-[40px] blur-[20px] transition-all duration-700 ${status === 'unlocked' ? 'opacity-100 scale-125' : 'opacity-0 scale-50'}`}></div>
          <div className={`w-full h-full bg-[#0a0a0a] rounded-[40px] border flex items-center justify-center transition-all duration-500 relative z-10 ${
            status === 'unlocked' ? 'border-primary shadow-[0_0_30px_rgba(0,229,255,0.2)]' : 'border-white/5'
          }`}>
            {status === 'scanning' && <Fingerprint className="w-12 h-12 text-primary animate-pulse" />}
            {status === 'locked' && <Lock className="w-12 h-12 text-[#333]" />}
            {status === 'verifying' && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
            {status === 'unlocked' && <Unlock className="w-14 h-14 text-primary animate-in zoom-in duration-500" />}
            
            {status === 'scanning' && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-xs font-black text-primary tabular-nums">{countdown}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-10">
          <h2 className="text-2xl font-black tracking-tight leading-none uppercase italic">
            {status === 'scanning' && 'Initializing Tunnel...'}
            {status === 'locked' && 'Links Encrypted'}
            {status === 'unlocked' && 'Access Granted'}
          </h2>
          <p className="text-[11px] text-[#8b95a5] font-black uppercase tracking-widest opacity-60">
            {status === 'scanning' && 'Performing deep security scan'}
            {status === 'locked' && adClicks === 0 && 'Verification required to view links'}
            {status === 'locked' && adClicks === 1 && 'Final verification in progress...'}
            {status === 'unlocked' && 'Direct high-speed links generated'}
          </p>
        </div>

        {/* Action Area */}
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
                  <span>VERIFYING {adClicks === 1 ? '50%' : '90%'}</span>
                </>
              ) : (
                <>
                  <Zap className={`w-6 h-6 ${adClicks > 0 ? 'animate-pulse' : ''}`} />
                  <span>{adClicks === 0 ? 'UNLOCK DOWNLOAD' : 'CONTINUE UNLOCK'}</span>
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
                <a href={ADSTERRA_LINK} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6" />
                    <span>1080p Ultra HD</span>
                  </div>
                  <Zap className="w-5 h-5 fill-current" />
                </a>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  className="h-14 bg-white/5 border-white/10 text-white font-black text-[12px] rounded-2xl hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-0.5"
                  asChild
                >
                  <a href={ADSTERRA_LINK} target="_blank" rel="noopener noreferrer">
                    <span>720p HD</span>
                    <span className="text-[9px] text-primary/70 uppercase">900 MB</span>
                  </a>
                </Button>

                <Button 
                  variant="outline"
                  className="h-14 bg-white/5 border-white/10 text-white font-black text-[12px] rounded-2xl hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-0.5"
                  asChild
                >
                  <a href={ADSTERRA_LINK} target="_blank" rel="noopener noreferrer">
                    <span>480p SD</span>
                    <span className="text-[9px] text-[#555] uppercase">350 MB</span>
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Movie Context */}
        <div className="w-full mt-12 bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 text-left group hover:border-primary/10 transition-all">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-22 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img src={movie.posterUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white truncate text-sm uppercase tracking-tight italic">{movie.title}</h3>
              <p className="text-[10px] text-primary font-black uppercase mt-1 tracking-widest opacity-80">
                {movie.quality} • {movie.releaseYear} • {movie.audio}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[9px] font-black text-green-500/60 uppercase tracking-tighter">Verified CDN Server</span>
              </div>
            </div>
          </div>
        </div>

        <AdBanner id="download-mid-banner" className="w-full mt-10" />
      </main>

      <footer className="px-8 py-10 mt-auto bg-gradient-to-t from-black to-transparent">
        <div className="bg-primary/5 border border-primary/10 rounded-[24px] p-5 flex gap-4">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <p className="text-[10px] text-[#8b95a5] font-bold leading-relaxed text-left">
            Complete the verification sequence by interacting with the unlock button. This ensures link stability and high-speed delivery.
          </p>
        </div>
      </footer>
    </div>
  );
}
