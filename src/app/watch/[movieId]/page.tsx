'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, MonitorPlay, ShieldCheck, Loader2, Sparkles, Film, Zap, Maximize2, SkipForward, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Movie } from '@/components/movie/MovieCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import Link from 'next/link';
import Script from 'next/script';
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
  const playerRef = useRef<any>(null);
  const videoNodeRef = useRef<HTMLVideoElement>(null);
  
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
  
  const [playbackState, setPlaybackState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [scriptsLoaded, setScriptsLoaded] = useState({
    videojs: false
  });

  const handlePlayClick = () => {
    setPlaybackState('loading');
    // Ad redirect removed to ensure smooth, ad-free player experience
    setTimeout(() => {
      setPlaybackState('playing');
    }, 1200);
  };

  useEffect(() => {
    if (playbackState === 'playing' && scriptsLoaded.videojs && videoNodeRef.current) {
      const vjs = (window as any).videojs;
      if (!vjs) return;

      const player = vjs(videoNodeRef.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        poster: movie?.posterUrl,
        sources: [{
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
          type: 'video/mp4'
        }]
      });

      playerRef.current = player;

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [playbackState, scriptsLoaded, movie]);

  if (movieLoading && !movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative overflow-x-hidden">
      {/* External CSS for Video.js */}
      <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
      
      <Script 
        src="https://vjs.zencdn.net/8.10.0/video.min.js" 
        strategy="lazyOnload" 
        onLoad={() => setScriptsLoaded(prev => ({...prev, videojs: true}))} 
      />

      {/* Page-level ads (Outside the player area) */}
      <AdFloating hrefs={ROTATION_LINKS} side="left" />
      <AdFloating hrefs={ROTATION_LINKS} side="right" />

      <header className="p-5 flex items-center gap-4 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-all">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-[10px] font-black uppercase tracking-[3px] text-[#555]">Server Status: Online</h1>
          <span className="text-[12px] font-bold truncate max-w-[200px]">{movie?.title || 'Loading Media...'}</span>
        </div>
      </header>

      <main className="p-0">
        {/* Video Player Area - Optimized for smooth playback without ads */}
        <div className="relative w-full aspect-video bg-black group overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-y border-white/5">
          {playbackState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img 
                src={movie?.posterUrl || 'https://picsum.photos/seed/movie/800/450'} 
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-30" 
                alt="" 
              />
              <div className="absolute inset-0 bg-black/60"></div>
              
              <button 
                onClick={handlePlayClick}
                className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:scale-110 active:scale-95 transition-all group"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
                <div className="absolute -inset-2 border border-primary/30 rounded-full animate-ping opacity-20"></div>
              </button>
              
              <div className="relative z-10 mt-6 flex flex-col items-center">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[4px]">
                  Start High-Speed Stream
                </p>
                <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-tighter">Verified Secure Tunnel</span>
                </div>
              </div>
            </div>
          )}

          {playbackState === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-20">
              <div className="relative">
                <Loader2 className="w-14 h-14 text-primary animate-spin" />
                <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
              </div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[5px] mt-6">Connecting to Mirror...</p>
            </div>
          )}

          {playbackState === 'playing' && (
            <div className="w-full h-full relative animate-in zoom-in-95 duration-1000">
               <div data-vjs-player>
                <video 
                  ref={videoNodeRef} 
                  className="video-js vjs-big-play-centered vjs-theme-city"
                  playsInline
                ></video>
              </div>
            </div>
          )}
        </div>

        {/* Website Content Ads (Outside the player) */}
        <div className="px-5 py-6">
          <AdBanner id="watch-player-bottom-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        <div className="px-5 space-y-5">
          <div className="bg-[#0a0a0a] rounded-[32px] p-6 border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/5 blur-[80px]"></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div>
                <h2 className="text-2xl font-black italic uppercase text-white leading-tight tracking-tighter">
                  {movie?.title}
                </h2>
                <div className="flex gap-3 mt-2">
                  <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">{movie?.quality}</span>
                  <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">{movie?.releaseYear}</span>
                  <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">{movie?.audio}</span>
                </div>
              </div>
              <div className="bg-primary text-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-[0_5px_15px_rgba(0,229,255,0.2)]">
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-tighter">High Res</span>
              </div>
            </div>
            
            <p className="text-[13px] text-[#8b95a5] leading-relaxed relative z-10 font-medium">
              {movie?.description || 'No plot summary available for this title.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="h-16 bg-white/5 border border-white/10 rounded-[24px] flex flex-col items-center justify-center gap-0.5 hover:bg-primary hover:text-black transition-all group"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                <span className="text-[11px] font-black uppercase tracking-wider group-hover:italic transition-all">VIP Server</span>
                <span className="text-[9px] opacity-40 uppercase font-bold">Fast Mirror</span>
              </a>
            </Button>
            <Button 
              className="h-16 bg-white/5 border border-white/10 rounded-[24px] flex flex-col items-center justify-center gap-0.5 hover:bg-red-500/20 hover:border-red-500/50 transition-all group"
              asChild
            >
              <a href={SMART_LINK} target="_blank">
                <span className="text-[11px] font-black uppercase tracking-wider text-red-500/80 group-hover:text-red-500">Report</span>
                <span className="text-[9px] opacity-40 uppercase font-bold">Broken?</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 px-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-primary" />
              <h3 className="text-[16px] font-black uppercase tracking-[2px] italic">You May Also Like</h3>
            </div>
            <div className="h-px flex-1 bg-white/5 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            {relatedMovies?.map((m) => (
              <Link key={m.id} href={`/watch/${m.id}`} className="group relative">
                <div className="relative aspect-[2/3] rounded-[24px] overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                  <img src={m.posterUrl} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[11px] font-black text-white truncate block uppercase tracking-tight">{m.title}</span>
                    <span className="text-[9px] text-primary font-black mt-1 block">{m.quality} • {m.releaseYear}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 px-5 pb-20">
          <AdBanner id="watch-final-footer-rot" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      {/* Sticky Bottom Ad */}
      <footer className="fixed bottom-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-2xl border-t border-primary/20 p-2 md:max-w-[420px] md:mx-auto">
        <AdBanner id="watch-sticky-footer-rot" hrefs={ROTATION_LINKS} className="w-full" />
      </footer>
    </div>
  );
}