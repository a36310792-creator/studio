
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, ShieldCheck, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Movie } from '@/components/movie/MovieCard';
import Link from 'next/link';

export default function DownloadGateway() {
  const { movieId } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lumina_movies');
    if (stored) {
      const allMovies: Movie[] = JSON.parse(stored);
      const found = allMovies.find(m => m.id === movieId);
      if (found) {
        setMovie(found);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [movieId, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl flex flex-col">
      <header className="p-5 flex items-center gap-4">
        <Link href="/" className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <h1 className="text-lg font-black uppercase tracking-tight truncate">Generating Link...</h1>
      </header>

      <main className="flex-1 px-6 pt-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center mb-8 relative">
          {!isReady ? (
            <div className="text-4xl font-black text-primary animate-pulse">{countdown}</div>
          ) : (
            <ShieldCheck className="w-12 h-12 text-primary animate-in zoom-in duration-500" />
          )}
          <div className="absolute -inset-4 bg-primary/5 blur-[40px] rounded-full"></div>
        </div>

        <h2 className="text-2xl font-black mb-2 leading-tight">
          {isReady ? 'Your link is ready!' : 'Preparing secure link...'}
        </h2>
        <p className="text-[#8b95a5] text-sm font-bold mb-10 max-w-[280px]">
          {isReady 
            ? 'High-speed encrypted download link has been generated.' 
            : `Please wait ${countdown} seconds while we scan the servers.`}
        </p>

        <div className="w-full bg-[#111] border border-white/5 rounded-3xl p-6 mb-8 text-left">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-16 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
              <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate text-sm">{movie.title}</h3>
              <p className="text-[10px] text-[#555] font-black uppercase mt-1 tracking-widest">
                {movie.quality} • {movie.releaseYear} • {movie.audio}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[11px] font-bold py-2 border-b border-white/5">
              <span className="text-[#555]">SERVER STATUS</span>
              <span className="text-green-500 flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Ultra Fast (Online)
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold py-2 border-b border-white/5">
              <span className="text-[#555]">SECURITY SCAN</span>
              <span className="text-primary uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Safe
              </span>
            </div>
          </div>
        </div>

        {isReady ? (
          <div className="w-full space-y-4 animate-in slide-in-from-bottom-6 duration-700">
            <Button 
              className="w-full h-16 bg-primary text-black font-black text-lg rounded-2xl shadow-[0_15px_40px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-all"
              asChild
            >
              <a href={movie.directDownloadUrl || "#"} target="_blank" rel="noopener noreferrer">
                <Download className="w-6 h-6 mr-3" />
                DOWNLOAD NOW
              </a>
            </Button>
            <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest">
              Direct Link expires in 2 hours
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-[200px]">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${(5 - countdown) * 20}%` }}
              ></div>
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 py-8">
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-[10px] text-[#8b95a5] font-bold leading-relaxed">
            If download doesn&apos;t start, disable your AdBlocker or try opening the link in a new incognito window.
          </p>
        </div>
      </footer>
    </div>
  );
}
