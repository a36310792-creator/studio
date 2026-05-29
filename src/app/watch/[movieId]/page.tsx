
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
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Updated specific ad link for Watch Page
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
    }, 2000); // 2 second fail-safe timeout
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
        setPlayerError("Streaming error: The media could not be loaded.");
        setShowLoader(false);
      });
      player.on('loadeddata', () => setShowLoader(false));
    } catch (e) {
      setPlayerError("Initialization failed.");
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
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-24 shadow-2xl relative overflow-x-hidden font-body">
      <AdFloating hrefs={[WATCH_AD_LINK]} side="right" />
      <AdFloating hrefs={[WATCH_AD_LINK]} side="left" />

      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl p-5 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-[#8b95a5] hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            <span className="text-white">STREAMING</span>
            <span className="text-primary">HUB</span>
          </h1>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="p-5">
        <div className="mb-6 rounded-[24px] overflow-hidden border border-primary/20 bg-black shadow-[0_0_30px_rgba(0,229,255,0.1)] relative aspect-video">
          {showLoader && !playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
              <Activity className="w-8 h-8 text-primary animate-spin mb-3" />
              <span className="text-[10px] font-black text-primary uppercase">Initializing...</span>
            </div>
          )}
          
          {playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-30 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-sm font-black uppercase mb-2">Streaming Error</h3>
              <p className="text-[10px] text-[#555] font-bold mb-4">{playerError}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="h-9 px-6 rounded-xl border-primary/20 text-primary">
                RETRY
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

        <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[12px] font-black uppercase tracking-widest text-white">{movie?.title || 'SYNCING...'}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-green-500 uppercase">Premium Encryption Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <Button 
                onClick={handleAction}
                className="w-full h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,229,255,0.2)] hover:scale-[1.01] transition-all"
              >
                <Zap className="w-5 h-5 fill-current" />
                UNLOCK HIGH SPEED DOWNLOAD
              </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#444] uppercase tracking-[3px] ml-1">Optimized Server Nodes</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'US-PREMIUM (AD-FREE)', speed: '1.4 GB/s', icon: <Wifi className="w-4 h-4 text-primary" /> },
              { name: 'ASIA-VIP DIRECT', speed: '980 MB/s', icon: <Server className="w-4 h-4" /> },
              { name: 'EURO-FAST STREAM', speed: '1.1 GB/s', icon: <Lock className="w-4 h-4" /> }
            ].map((node, i) => (
              <button 
                key={i}
                onClick={handleAction}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#121212] border border-white/5 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#333] group-hover:text-primary transition-all">
                    {node.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-black text-white group-hover:text-primary transition-colors italic uppercase">{node.name}</p>
                    <p className="text-[9px] font-bold text-[#444] mt-0.5">{node.speed}</p>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-[#222] group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <AdBanner id="watch-bottom-banner" hrefs={[WATCH_AD_LINK]} className="w-full" />
        </div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-[9px] text-[#222] font-black uppercase tracking-widest leading-relaxed">
          Tunnel protocol active. AES-256 server-side encryption enabled for all active streams.
        </p>
      </footer>
    </div>
  );
}
