'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Loader2, Sparkles, Zap, ExternalLink, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Movie } from '@/components/movie/MovieCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import Link from 'next/link';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { doc, collection, limit, query } from 'firebase/firestore';

const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

const SMART_LINK = "https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf";

export default function WatchOnline() {
  const { movieId } = useParams();
  const db = useFirestore();
  
  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const relatedQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'movies'), limit(4));
  }, [db]);

  const { data: movie, loading: movieLoading } = useDoc<Movie>(movieRef);
  const { data: relatedMovies } = useCollection<Movie>(relatedQuery);
  
  if (movieLoading && !movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[3px] text-primary/40">Initializing Tunnel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative overflow-x-hidden">
      <AdFloating hrefs={ROTATION_LINKS} side="left" />
      <AdFloating hrefs={ROTATION_LINKS} side="right" />

      <header className="p-5 flex items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-[10px] font-black uppercase tracking-[3px] text-[#555]">Fast Server Node: 04</h1>
          <span className="text-[12px] font-bold truncate max-w-[200px]">{movie?.title || 'Loading Media...'}</span>
        </div>
      </header>

      <main className="p-0">
        <div className="relative w-full aspect-video bg-black group overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.9)] border-y border-white/5 flex items-center justify-center">
          {movie?.posterUrl && (
            <div className="absolute inset-0">
              <img 
                src={movie.posterUrl} 
                className="w-full h-full object-cover opacity-40 grayscale-[0.3]" 
                alt="" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60"></div>
            </div>
          )}
          
          <div className="relative z-40 flex flex-col items-center p-6 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20">
              <MonitorPlay className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black italic uppercase text-white mb-2">High Speed Server Ready</h3>
            <p className="text-[10px] text-white/50 font-black uppercase tracking-[4px] mb-6">4K HDR STREAMING ACTIVATED</p>
            
            <Button 
              className="w-full bg-primary text-black font-black text-sm h-12 rounded-xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:scale-105 active:scale-95 transition-all"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                ACCESS STREAM MIRROR <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>

            <div className="flex items-center gap-2 mt-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-black text-white/70 uppercase tracking-tighter italic">Secured CDN Handshake</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-6">
          <AdBanner id="watch-player-bottom-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        <div className="px-5 space-y-5">
          <div className="bg-[#0a0a0a] rounded-[32px] p-6 border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-xl">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/5 blur-[80px]"></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-2xl font-black italic uppercase text-white leading-tight tracking-tighter truncate">
                  {movie?.title}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2.5">
                  <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">{movie?.quality}</span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/5">{movie?.releaseYear}</span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/5">{movie?.audio}</span>
                </div>
              </div>
              <div className="bg-primary text-black px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-[0_10px_20px_rgba(0,229,255,0.3)] shrink-0 animate-pulse">
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Ultra 4K</span>
              </div>
            </div>
            
            <p className="text-[13px] text-[#8b95a5] leading-relaxed relative z-10 font-medium">
              {movie?.description || 'Establishing metadata connection for high-speed streaming results...'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="h-16 bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-0.5 hover:bg-primary hover:text-black transition-all group shadow-lg active:scale-95"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                <span className="text-[11px] font-black uppercase tracking-wider group-hover:italic">Unlock High Speed Server</span>
                <span className="text-[9px] opacity-40 uppercase font-bold tracking-widest">Instant Mirror</span>
              </a>
            </Button>
            <Button 
              className="h-16 bg-white/5 border border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-0.5 hover:bg-white/10 hover:border-primary/50 transition-all group shadow-lg active:scale-95"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                <span className="text-[11px] font-black uppercase tracking-wider">Report Error</span>
                <span className="text-[9px] opacity-40 uppercase font-bold tracking-widest text-red-500/80">Buffer/Lag?</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 px-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-[16px] font-black uppercase tracking-[3px] italic">Premium Picks</h3>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            {relatedMovies?.map((m) => (
              <Link key={m.id} href={`/movie/${m.id}`} className="group relative">
                <div className="relative aspect-[2/3] rounded-[28px] overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all shadow-2xl">
                  <img src={m.posterUrl} className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 transition-opacity"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[11px] font-black text-white truncate block uppercase tracking-tight italic">{m.title}</span>
                    <span className="text-[9px] text-primary font-black mt-1.5 block tracking-widest">{m.quality} • {m.releaseYear}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 px-5 pb-24">
          <AdBanner id="watch-final-footer-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-3xl border-t border-primary/20 p-2 md:max-w-[420px] md:mx-auto">
        <AdBanner id="watch-sticky-footer-rot" hrefs={ROTATION_LINKS} className="w-full" />
      </footer>
    </div>
  );
}