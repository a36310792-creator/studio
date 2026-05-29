'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, MonitorPlay, ShieldCheck, Loader2, Sparkles, Film, Zap, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Movie } from '@/components/movie/MovieCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdPopup } from '@/components/ads/AdPopup';
import { AdFloating } from '@/components/ads/AdFloating';
import Link from 'next/link';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { doc, collection, limit, query } from 'firebase/firestore';

const SMART_LINK = "https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf";
const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

export default function WatchOnline() {
  const { movieId } = useParams();
  const db = useFirestore();
  const router = useRouter();
  
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
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdOpening, setIsAdOpening] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlayClick = () => {
    setIsAdOpening(true);
    // Open smartlink in new tab
    window.open(SMART_LINK, '_blank');
    
    // Simulate player loading
    setTimeout(() => {
      setIsAdOpening(false);
      setIsPlaying(true);
      setShowPlayer(true);
    }, 1500);
  };

  if (movieLoading && !movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative overflow-x-hidden">
      {/* 1. Popup Ad before video starts/on entry */}
      <AdPopup hrefs={[SMART_LINK, ...ROTATION_LINKS]} />
      
      {/* 2 & 3. Side Floating Ads */}
      <AdFloating hrefs={ROTATION_LINKS} side="left" />
      <AdFloating hrefs={ROTATION_LINKS} side="right" />

      <header className="p-5 flex items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-[10px] font-black uppercase tracking-[3px] text-[#555]">Streaming Server 01</h1>
          <span className="text-[12px] font-bold truncate max-w-[200px]">{movie?.title}</span>
        </div>
      </header>

      <main className="p-0">
        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-black group overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {!showPlayer ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img 
                src={movie?.posterUrl} 
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40" 
                alt="" 
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              <button 
                onClick={handlePlayClick}
                disabled={isAdOpening}
                className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:scale-110 active:scale-95 transition-all group"
              >
                {isAdOpening ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : (
                  <Play className="w-10 h-10 fill-current ml-1" />
                )}
                <div className="absolute -inset-2 border border-primary/30 rounded-full animate-ping opacity-20"></div>
              </button>
              
              <p className="relative z-10 mt-6 text-[10px] font-black text-primary uppercase tracking-[4px] animate-pulse">
                Click to Start Stream
              </p>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <video 
                className="w-full h-full object-contain" 
                controls 
                autoPlay
                poster={movie?.posterUrl}
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-md text-[9px] font-black text-primary border border-primary/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                SECURE 1080P
              </div>
            </div>
          )}
        </div>

        {/* 4. Floating bottom ad below player */}
        <div className="px-5 py-4">
          <AdBanner id="watch-below-player" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        <div className="px-5 space-y-4">
          <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-black italic uppercase text-white leading-tight">
                  {movie?.title}
                </h2>
                <div className="flex gap-2.5 mt-2">
                  <span className="text-[10px] font-black text-primary uppercase">{movie?.quality}</span>
                  <span className="text-[10px] font-black text-[#555] uppercase">{movie?.releaseYear}</span>
                  <span className="text-[10px] font-black text-[#555] uppercase">{movie?.audio}</span>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Fast Server</span>
              </div>
            </div>
            
            <p className="text-[12px] text-[#8b95a5] leading-relaxed">
              {movie?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="h-14 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-0.5 hover:bg-primary hover:text-black transition-all"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                <span className="text-[11px] font-black uppercase">Switch Server</span>
                <span className="text-[8px] opacity-60 uppercase">Mirror 02</span>
              </a>
            </Button>
            <Button 
              className="h-14 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-0.5 hover:bg-primary hover:text-black transition-all"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                <span className="text-[11px] font-black uppercase">Report Issue</span>
                <span className="text-[8px] opacity-60 uppercase">Broken Link?</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Related Movies Section */}
        <div className="mt-10 px-5">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="text-[14px] font-black uppercase tracking-wider italic">Recommended For You</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {relatedMovies?.map((m) => (
              <Link key={m.id} href={`/watch/${m.id}`} className="group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all">
                  <img src={m.posterUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <span className="text-[10px] font-black text-white truncate">{m.title}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Ad below related movies section */}
        <div className="mt-10 px-5">
          <AdBanner id="watch-below-related" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      {/* 6. Sticky bottom ad */}
      <footer className="fixed bottom-0 left-0 right-0 z-[1000] bg-black/95 border-t border-primary/20 p-2 md:max-w-[420px] md:mx-auto">
        <AdBanner id="watch-sticky-footer" hrefs={ROTATION_LINKS} className="w-full" />
      </footer>
    </div>
  );
}