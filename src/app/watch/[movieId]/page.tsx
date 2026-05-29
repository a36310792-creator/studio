'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, MonitorPlay, ShieldCheck, Loader2, Sparkles, Film, Zap, Maximize2, SkipForward, ExternalLink, Volume2, VolumeX } from 'lucide-react';
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

// High quality stock video ad placeholder
const AD_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-interface-31853-large.mp4";

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
  
  // State for playback states
  const [playbackState, setPlaybackState] = useState<'idle' | 'loading' | 'ad' | 'playing'>('idle');
  const [adCountdown, setAdCountdown] = useState(15);
  const [skipAvailable, setSkipAvailable] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Skip ad timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playbackState === 'ad') {
      if (adCountdown > 0) {
        timer = setTimeout(() => {
          setAdCountdown(prev => prev - 1);
          if (adCountdown <= 11) setSkipAvailable(true); // Skip after 5 seconds (15 - 11 = 4 elapsed, show at 5)
        }, 1000);
      } else {
        handleAdFinish();
      }
    }
    return () => clearTimeout(timer);
  }, [playbackState, adCountdown]);

  const handlePlayClick = () => {
    setPlaybackState('loading');
    // Open smartlink in new tab (monetization)
    window.open(SMART_LINK, '_blank');
    
    // Artificial loading for "buffering ad" feel
    setTimeout(() => {
      setPlaybackState('ad');
      setAdCountdown(15);
      setSkipAvailable(false);
    }, 1500);
  };

  const handleAdFinish = () => {
    setPlaybackState('playing');
  };

  const handleAdClick = () => {
    window.open(SMART_LINK, '_blank');
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
      {/* Monetization Overlays */}
      <AdPopup hrefs={[SMART_LINK, ...ROTATION_LINKS]} />
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
          {/* 1. IDLE STATE: Thumbnail & Initial Play */}
          {playbackState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img 
                src={movie?.posterUrl} 
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40" 
                alt="" 
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              <button 
                onClick={handlePlayClick}
                className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:scale-110 active:scale-95 transition-all group"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
                <div className="absolute -inset-2 border border-primary/30 rounded-full animate-ping opacity-20"></div>
              </button>
              
              <p className="relative z-10 mt-6 text-[10px] font-black text-primary uppercase tracking-[4px] animate-pulse">
                Click to Start Stream
              </p>
            </div>
          )}

          {/* 2. LOADING STATE: Ad Buffering */}
          {playbackState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[3px]">Bypassing CDN...</p>
            </div>
          )}

          {/* 3. AD STATE: Pre-roll Video Ad */}
          {playbackState === 'ad' && (
            <div className="absolute inset-0 z-30 bg-black animate-in fade-in duration-500">
              <video 
                className="w-full h-full object-cover cursor-pointer"
                autoPlay 
                muted={isMuted}
                playsInline
                onEnded={handleAdFinish}
                onClick={handleAdClick}
              >
                <source src={AD_VIDEO_URL} type="video/mp4" />
              </video>
              
              {/* Ad UI Overlays */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">Ad</span>
                    <span className="text-[10px] font-bold text-white">Unlock Fast Playback</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="pointer-events-auto bg-black/60 p-2 rounded-full border border-white/10 text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end items-end gap-3 pointer-events-auto">
                  <div className="bg-black/80 backdrop-blur-xl border border-primary/20 p-3 rounded-xl flex flex-col items-end min-w-[120px]">
                    <div className="text-[9px] font-black text-[#555] uppercase mb-1">Video Ad Ends In</div>
                    <div className="text-xl font-black text-primary tabular-nums leading-none">{adCountdown}s</div>
                  </div>

                  {skipAvailable ? (
                    <button 
                      onClick={handleAdFinish}
                      className="h-12 bg-primary text-black px-6 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] animate-in slide-in-from-right-10 duration-500"
                    >
                      Skip Ad <SkipForward className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <div className="h-12 bg-black/60 border border-white/10 text-white/50 px-6 rounded-xl font-black text-[10px] uppercase flex items-center gap-2">
                      Skip Ad in {adCountdown - 10}s
                    </div>
                  )}
                </div>
              </div>

              {/* Click-through Trigger */}
              <div 
                className="absolute inset-0 pointer-events-auto" 
                onClick={handleAdClick}
              ></div>
            </div>
          )}

          {/* 4. PLAYING STATE: Main Content */}
          {playbackState === 'playing' && (
            <div className="w-full h-full relative animate-in zoom-in-95 duration-700">
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

        {/* Post-Player Banners */}
        <div className="px-5 py-4">
          <AdBanner id="watch-below-player" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        <div className="px-5 space-y-4">
          <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-white/5 relative overflow-hidden">
             {/* Glowing accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
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
            
            <p className="text-[12px] text-[#8b95a5] leading-relaxed relative z-10">
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

        {/* Related Content */}
        <div className="mt-10 px-5">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="text-[14px] font-black uppercase tracking-wider italic">Recommended For You</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {relatedMovies?.map((m) => (
              <Link key={m.id} href={`/watch/${m.id}`} className="group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all shadow-xl">
                  <img src={m.posterUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <span className="text-[10px] font-black text-white truncate">{m.title}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Final Monetization Banners */}
        <div className="mt-10 px-5 pb-10">
          <AdBanner id="watch-below-related" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      {/* Persistent Footer Ad */}
      <footer className="fixed bottom-0 left-0 right-0 z-[1000] bg-black/95 border-t border-primary/20 p-2 md:max-w-[420px] md:mx-auto">
        <AdBanner id="watch-sticky-footer" hrefs={ROTATION_LINKS} className="w-full" />
      </footer>
    </div>
  );
}
