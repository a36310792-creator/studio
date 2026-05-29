'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MonitorPlay,
  Zap,
  Wifi,
  Server,
  Lock,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const WATCH_AD_LINK = "https://commendtwisted.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed";
const FALLBACK_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function isIframeUrl(url: string): boolean {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase();
  const videoExtensions = ['.mp4', '.m3u8', '.webm', '.mkv', '.mov', '.avi'];
  const hasVideoExtension = videoExtensions.some(ext => lowercaseUrl.split('?')[0].endsWith(ext));
  if (hasVideoExtension) return false;
  const knownEmbedPatterns = [
    'youtube.com', 'drive.google.com', 'vimeo.com', 'dailymotion.com',
    'ok.ru', 'facebook.com', 'embed', '/e/', '/v/', 'vidsrc', 'streamtape',
    'mixdrop', 'upstream', 'fembed', 'dood', 'html', 'php'
  ];
  if (knownEmbedPatterns.some(pattern => lowercaseUrl.includes(pattern))) return true;
  return lowercaseUrl.startsWith('http');
}

export default function WatchPage() {
  const { movieId } = useParams();
  const db = useFirestore();
  const router = useRouter();
  const playerRef = useRef<any>(null);
  const videoNode = useRef<HTMLVideoElement | null>(null);
  
  const [showLoader, setShowLoader] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie, loading: docLoading } = useDoc<Movie>(movieRef);

  const rawUrl = movie?.watchUrl?.trim();
  const watchUrl = rawUrl || (docLoading ? '' : FALLBACK_VIDEO);
  const useIframe = isIframeUrl(watchUrl);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPlayerError(null);
    if (useIframe || !watchUrl || !videoNode.current) {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      return;
    }

    try {
      const player = videojs(videoNode.current, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        sources: [{
          src: watchUrl,
          type: watchUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
        }]
      });
      playerRef.current = player;
      player.on('error', () => {
        setPlayerError("Streaming node unresponsive. Handshake failed.");
        setShowLoader(false);
      });
      player.on('loadeddata', () => setShowLoader(false));
    } catch (e) {
      setPlayerError("Decoder initialization failed.");
      setShowLoader(false);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [watchUrl, useIframe]);

  const handleAction = () => {
    window.open(WATCH_AD_LINK, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative overflow-x-hidden font-body">
      <AdFloating hrefs={[WATCH_AD_LINK]} side="right" />
      <AdFloating hrefs={[WATCH_AD_LINK]} side="left" />

      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-2xl p-6 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-[#8b95a5] hover:text-white transition-all hover:scale-110 active:scale-90">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="text-xl font-black italic tracking-tighter uppercase cyan-glow-text">
            <span className="text-white">STREAMING</span>
            <span className="text-primary">HUB</span>
          </div>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="p-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="mb-8 rounded-[32px] overflow-hidden border border-primary/20 bg-black shadow-[0_0_50px_rgba(0,229,255,0.15)] relative aspect-video group">
          {(showLoader || docLoading) && !playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-20">
              <Skeleton className="absolute inset-0 shimmer" />
              <div className="relative z-30 flex flex-col items-center">
                <Activity className="w-10 h-10 text-primary animate-pulse mb-4" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[4px] cyan-glow-text">Syncing Server...</span>
              </div>
            </div>
          )}
          
          {playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-30 p-8 text-center backdrop-blur-xl">
              <AlertCircle className="w-14 h-14 text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
              <div role="heading" aria-level={3} className="text-lg font-black uppercase mb-2 italic">Node Disconnected</div>
              <p className="text-[11px] text-[#555] font-bold mb-6 leading-relaxed max-w-[240px]">{playerError}</p>
              <Button onClick={() => window.location.reload()} className="h-12 px-10 rounded-2xl bg-primary text-black font-black uppercase shadow-lg shadow-primary/20">
                RETRY HANDSHAKE
              </Button>
            </div>
          )}

          {useIframe ? (
            <iframe 
              src={watchUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              onLoad={() => setShowLoader(false)}
            />
          ) : (
            <div data-vjs-player className="w-full h-full">
              <video
                ref={videoNode}
                className="video-js vjs-big-play-centered"
                poster={movie?.posterUrl}
                playsInline
              />
            </div>
          )}
        </div>

        <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 p-7 mb-10 shadow-inner">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
                <MonitorPlay className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div role="heading" aria-level={2} className="text-sm font-black uppercase tracking-tight text-white truncate italic">
                  {movie?.title || <Skeleton className="h-5 w-40 shimmer" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Quantum Encryption Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <Button 
                onClick={handleAction}
                className="w-full h-15 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_12px_35px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all uppercase italic"
              >
                <Zap className="w-5 h-5 fill-current" />
                UNLOCK ELITE SERVER
              </Button>
          </div>
        </div>

        <div className="space-y-5">
          <div role="heading" aria-level={3} className="text-[10px] font-black text-[#444] uppercase tracking-[4px] ml-1">Elite Node Grid</div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: 'US-PREMIUM (AD-FREE)', speed: '2.4 GB/s', icon: <Wifi className="w-5 h-5 text-primary" /> },
              { name: 'ASIA-VIP DIRECT', speed: '1.8 GB/s', icon: <Server className="w-5 h-5" /> },
              { name: 'EURO-FAST STREAM', speed: '2.1 GB/s', icon: <Lock className="w-5 h-5" /> }
            ].map((node, i) => (
              <button 
                key={i}
                onClick={handleAction}
                className="flex items-center justify-between p-5 rounded-[28px] bg-[#0a0a0a] border border-white/5 hover:border-primary/40 hover:bg-[#111] transition-all group active:scale-98"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#333] group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    {node.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-black text-white group-hover:text-primary transition-colors italic uppercase tracking-tight">{node.name}</p>
                    <p className="text-[10px] font-bold text-[#444] mt-1 uppercase">{node.speed}</p>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-[#151515] group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 mb-10">
          <AdBanner id="watch-bottom-banner" hrefs={[WATCH_AD_LINK]} className="w-full" />
        </div>
      </main>

      <footer className="p-10 text-center opacity-30">
        <p className="text-[9px] text-white font-black uppercase tracking-[3px] leading-relaxed">
          Tunnel protocol active. AES-256 server-side encryption enabled for all active streams.
        </p>
      </footer>
    </div>
  );
}
