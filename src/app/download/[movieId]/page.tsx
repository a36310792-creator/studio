'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, ShieldCheck, AlertCircle, Loader2, Zap, Server, Lock, Unlock, ExternalLink, Sparkles } from 'lucide-react';
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
  const router = useRouter();
  const db = useFirestore();
  
  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: firestoreMovie, loading: firestoreLoading } = useDoc<Movie>(movieRef);
  const [countdown, setCountdown] = useState(8);
  const [step, setStep] = useState(0); // 0: scanning, 1: step 1, 2: step 2, 3: ready
  const [forceLoad, setForceLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceLoad(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const movie = useMemo(() => {
    if (firestoreMovie) return firestoreMovie;
    return MOCK_FALLBACK_MOVIES.find(m => m.id === movieId) || MOCK_FALLBACK_MOVIES[0];
  }, [firestoreMovie, movieId]);

  useEffect(() => {
    if (step === 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 0 && countdown === 0) {
      setStep(1);
    }
  }, [countdown, step]);

  const handleStepVerify = (nextStep: number) => {
    window.open(ADSTERRA_LINK, '_blank');
    setStep(nextStep);
  };

  if (firestoreLoading && !movie && !forceLoad) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl flex flex-col">
      <header className="p-5 flex items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <h1 className="text-sm font-black uppercase tracking-widest text-[#8b95a5]">Secure Gateway</h1>
      </header>

      <main className="flex-1 px-6 pt-8 flex flex-col items-center text-center">
        {/* Step Indicator */}
        <div className="w-full flex justify-between px-10 mb-8 items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-700" style={{ width: `${(step/3)*100}%` }}></div>
          
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full border-2 z-10 flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
              step >= s ? 'bg-primary border-primary text-black scale-110 shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-[#111] border-white/10 text-[#444]'
            }`}>
              {step > s ? <ShieldCheck className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>

        <div className="w-24 h-24 bg-primary/10 rounded-[32px] border border-primary/20 flex items-center justify-center mb-6 relative group overflow-hidden">
          {step === 0 && <div className="text-4xl font-black text-primary tabular-nums animate-pulse">{countdown}</div>}
          {step === 1 && <Lock className="w-10 h-10 text-primary animate-pulse" />}
          {step === 2 && <Lock className="w-10 h-10 text-primary animate-pulse" />}
          {step === 3 && <Unlock className="w-12 h-12 text-primary animate-in zoom-in duration-500" />}
          
          <div className={`absolute inset-0 bg-primary/20 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        </div>

        <h2 className="text-2xl font-black mb-2 leading-tight">
          {step === 0 && 'Security Scanning...'}
          {step === 1 && 'Step 1: Authorization'}
          {step === 2 && 'Step 2: Final Verify'}
          {step === 3 && 'Access Granted!'}
        </h2>
        
        <p className="text-[#8b95a5] text-[13px] font-bold mb-8 max-w-[280px]">
          {step === 0 && `Connecting to secure CDN servers (${countdown}s)`}
          {step === 1 && 'Unlock the download gateway by completing the first verification.'}
          {step === 2 && 'Almost there! One more step to generate high-speed links.'}
          {step === 3 && 'Cloud servers are ready. Choose your preferred quality below.'}
        </p>

        {/* Action Area */}
        <div className="w-full space-y-4">
          {step === 1 && (
            <Button 
              onClick={() => handleStepVerify(2)}
              className="w-full h-16 bg-white/5 border border-primary/30 text-primary font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-3 group animate-in slide-in-from-bottom-4"
            >
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
              VERIFY STEP 1
              <ExternalLink className="w-4 h-4 opacity-50" />
            </Button>
          )}

          {step === 2 && (
            <Button 
              onClick={() => handleStepVerify(3)}
              className="w-full h-16 bg-primary/10 border border-primary text-primary font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.2)] hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-3 group animate-in slide-in-from-bottom-4"
            >
              <Zap className="w-6 h-6 animate-pulse" />
              VERIFY STEP 2
              <ExternalLink className="w-4 h-4 opacity-50" />
            </Button>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700">
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

              <Button 
                variant="outline"
                className="w-full h-14 bg-white/5 border-white/10 text-white font-black text-[14px] rounded-2xl hover:border-primary/50 transition-all flex justify-between px-6"
                asChild
              >
                <a href={ADSTERRA_LINK} target="_blank" rel="noopener noreferrer">
                  <span>720p Recommended</span>
                  <span className="text-primary/70">900 MB</span>
                </a>
              </Button>

              <Button 
                variant="outline"
                className="w-full h-14 bg-white/5 border-white/10 text-white font-black text-[14px] rounded-2xl hover:border-primary/50 transition-all flex justify-between px-6"
                asChild
              >
                <a href={ADSTERRA_LINK} target="_blank" rel="noopener noreferrer">
                  <span>480p Low Data</span>
                  <span className="text-[#555]">350 MB</span>
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Movie Context Card */}
        <div className="w-full mt-10 bg-[#111] border border-white/5 rounded-[24px] p-5 text-left">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white truncate text-sm uppercase tracking-tight">{movie.title}</h3>
              <p className="text-[10px] text-primary font-black uppercase mt-1 tracking-widest">
                {movie.quality} • {movie.releaseYear} • {movie.audio}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-bold text-green-500/80 uppercase">Scanned & Secure</span>
              </div>
            </div>
          </div>
        </div>

        <AdBanner id="download-bottom-banner" className="w-full mt-8" />
      </main>

      <footer className="px-6 py-8 mt-auto">
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-[10px] text-[#8b95a5] font-bold leading-relaxed text-left">
            NOTE: You must complete both verification steps to access the cloud servers. If the process hangs, please refresh and disable any ad-blockers.
          </p>
        </div>
      </footer>
    </div>
  );
}
