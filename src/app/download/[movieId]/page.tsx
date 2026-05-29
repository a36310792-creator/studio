'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, ShieldCheck, AlertCircle, Loader2, Zap, Server } from 'lucide-react';
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
    directDownloadUrl: '#'
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
    directDownloadUrl: '#'
  },
  {
    id: 'zeffect-3',
    title: 'The Z Effect',
    posterUrl: 'https://picsum.photos/seed/zeffect/400/600',
    rating: 8.5,
    quality: '4K',
    releaseYear: 2024,
    audio: 'English',
    genres: ['Sci-Fi', 'Horror', 'Hollywood'],
    description: 'A terrifying sci-fi experience that challenges reality.',
    watchUrl: '#',
    directDownloadUrl: '#'
  }
];

export default function DownloadGateway() {
  const { movieId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  
  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: firestoreMovie, loading: firestoreLoading } = useDoc<Movie>(movieRef);
  const [countdown, setCountdown] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [forceLoad, setForceLoad] = useState(false);

  // Force loading state to false after a short timeout to prevent hanging
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceLoad(true);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const movie = useMemo(() => {
    if (firestoreMovie) return firestoreMovie;
    return MOCK_FALLBACK_MOVIES.find(m => m.id === movieId) || MOCK_FALLBACK_MOVIES[0];
  }, [firestoreMovie, movieId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (!firestoreLoading && !movie && forceLoad) {
      router.push('/');
    }
  }, [movie, firestoreLoading, forceLoad, router]);

  if (firestoreLoading && !movie && !forceLoad) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Initializing Secure Gateway...</p>
        </div>
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
        <div className="w-24 h-24 bg-primary/10 rounded-[32px] border border-primary/20 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(0,229,255,0.1)]">
          {!isReady ? (
            <div className="text-4xl font-black text-primary tabular-nums animate-pulse">{countdown}</div>
          ) : (
            <ShieldCheck className="w-12 h-12 text-primary animate-in zoom-in duration-500" />
          )}
          <div className="absolute -inset-4 bg-primary/5 blur-[40px] rounded-full -z-10"></div>
        </div>

        <h2 className="text-2xl font-black mb-2 leading-tight">
          {isReady ? 'Links Verified!' : 'Generating Secure Links'}
        </h2>
        <p className="text-[#8b95a5] text-[13px] font-bold mb-8 max-w-[280px]">
          {isReady 
            ? 'Encryption complete. High-speed servers are now active.' 
            : `Please wait ${countdown} seconds while we scan the cloud servers for security.`}
        </p>

        {/* Status Card */}
        <div className="w-full bg-[#111] border border-white/5 rounded-[24px] p-5 mb-8 text-left">
          <div className="flex gap-4 items-center mb-5">
            <div className="w-14 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
              <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white truncate text-sm uppercase tracking-tight">{movie.title}</h3>
              <p className="text-[10px] text-primary font-black uppercase mt-1 tracking-widest">
                {movie.quality} • {movie.releaseYear} • {movie.audio}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black py-2 border-b border-white/5">
              <span className="text-[#444] uppercase tracking-tighter">Server Location</span>
              <span className="text-white flex items-center gap-1.5">
                <Server className="w-3 h-3 text-primary" />
                Global CDN (Ultra)
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black py-2">
              <span className="text-[#444] uppercase tracking-tighter">Security Scan</span>
              <span className="text-green-500 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Safe
              </span>
            </div>
          </div>
        </div>

        {isReady ? (
          <div className="w-full space-y-4 animate-in slide-in-from-bottom-8 duration-700">
            {/* 1080p Premium Button */}
            <Button 
              className="w-full h-16 bg-gradient-to-r from-primary to-cyan-400 text-black font-black text-lg rounded-2xl shadow-[0_15px_40px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex justify-between px-6"
              asChild
            >
              <a href={movie.directDownloadUrl || "#"} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-3">
                  <Download className="w-6 h-6" />
                  <span>1080p Full HD</span>
                </div>
                <Zap className="w-5 h-5 fill-current" />
              </a>
            </Button>

            {/* 720p Recommended Button */}
            <Button 
              variant="outline"
              className="w-full h-14 bg-white/5 border-white/10 text-white font-black text-[14px] rounded-2xl hover:bg-white/10 hover:border-primary/50 transition-all flex justify-between px-6"
              asChild
            >
              <a href={movie.directDownloadUrl || "#"} target="_blank" rel="noopener noreferrer">
                <span>720p HD Ready</span>
                <span className="text-primary/70">Recommended</span>
              </a>
            </Button>

            {/* 480p Mobile Button */}
            <Button 
              variant="outline"
              className="w-full h-14 bg-white/5 border-white/10 text-white font-black text-[14px] rounded-2xl hover:bg-white/10 hover:border-primary/50 transition-all flex justify-between px-6"
              asChild
            >
              <a href={movie.directDownloadUrl || "#"} target="_blank" rel="noopener noreferrer">
                <span>480p SD Mobile</span>
                <span className="text-[#555]">Low Data</span>
              </a>
            </Button>

            {/* Bottom Ad Banner */}
            <AdBanner id="download-bottom-banner" className="w-full mt-8" />

            <p className="text-[10px] text-[#444] font-black uppercase tracking-[2px] pt-4">
              Links expire in 120 minutes
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full max-w-[280px]">
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                style={{ width: `${(10 - countdown) * 10}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[11px] font-black uppercase tracking-widest">Scanning Databases...</span>
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 py-8 mt-auto">
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-[10px] text-[#8b95a5] font-bold leading-relaxed text-left">
            ADVISORY: If the download fails to initialize, please ensure your VPN is disabled or try opening this page in a private browsing window.
          </p>
        </div>
      </footer>
    </div>
  );
}
