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
import Script from 'next/script';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-ads';
import 'videojs-ima';
import 'videojs-ima/dist/videojs.ima.css';

const VAST_TAG = "https://youradexchange.com/video/select.php?r=11371326";
const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

const FALLBACK_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function WatchPage() {
  const { movieId } = useParams();
  const db = useFirestore();
  const router = useRouter();
  const playerRef = useRef<any>(null);
  const videoNode = useRef<HTMLVideoElement | null>(null);
  
  const [imaLoaded, setImaLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie } = useDoc<Movie>(movieRef);

  // FAIL-SAFE: Force remove loader after 2 seconds regardless of ad status
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!videoNode.current || !movie) return;

    // Dispose existing player if it exists to avoid conflicts on data change
    if (playerRef.current) {
      playerRef.current.dispose();
    }

    const videoUrl = movie.watchUrl?.trim() || FALLBACK_VIDEO;

    const player = videojs(videoNode.current, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [{
        src: videoUrl,
        type: videoUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
      }]
    });

    playerRef.current = player;

    // Handle Media Errors
    player.on('error', () => {
      const error = player.error();
      console.error('Video.js Error:', error);
      setPlayerError(error?.message || "The media could not be loaded, either because the server or network failed or because the format is not supported.");
      setShowLoader(false);
    });

    // IMA Ad Logic
    if (imaLoaded && (player as any).ima) {
      const imaOptions = {
        adTagUrl: VAST_TAG,
        showCountdown: true,
        debug: false
      };

      try {
        (player as any).ima(imaOptions);

        const handleAdFail = () => {
          player.play().catch(() => {});
        };

        player.on('adserror', handleAdFail);
        player.on('adtimeout', handleAdFail);
        
        player.on('readyforpreroll', () => {
          (player as any).ima.initializeAdDisplayContainer();
          (player as any).ima.requestAds();
        });
      } catch (e) {
        console.warn('IMA Initialization failed', e);
        player.play().catch(() => {});
      }
    }

    player.on('ready', () => {
      setShowLoader(false);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [movie, imaLoaded]);

  const handleAction = () => {
    window.open(ROTATION_LINKS[0], '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-24 shadow-2xl relative overflow-x-hidden font-body">
      <Script 
        src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" 
        strategy="afterInteractive"
        onLoad={() => setImaLoaded(true)}
        onError={() => setImaLoaded(false)}
      />
      
      <AdFloating hrefs={ROTATION_LINKS} side="right" />
      <AdFloating hrefs={ROTATION_LINKS} side="left" />

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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 transition-opacity duration-300">
              <Activity className="w-8 h-8 text-primary animate-spin mb-3" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[2px]">Initializing Secure Player...</span>
            </div>
          )}
          
          {playerError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-30 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-sm font-black uppercase text-white mb-2">Streaming Error</h3>
              <p className="text-[10px] text-[#555] font-bold leading-relaxed mb-4">{playerError}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="h-9 px-6 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-black">
                RETRY CONNECTION
              </Button>
            </div>
          )}

          <div data-vjs-player>
            <video
              ref={videoNode}
              className="video-js vjs-big-play-centered vjs-theme-city"
              poster={movie?.posterUrl}
              playsInline
            />
          </div>
        </div>

        <div className="mb-8">
          <AdBanner id="watch-main-banner" hrefs={ROTATION_LINKS} className="w-full" />
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
            <div className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">
              <span className="text-[9px] font-black text-primary">SECURE</span>
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
      </main>

      <footer className="p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Copyright Protection Active</span>
        </div>
        <p className="text-[9px] text-[#222] font-black uppercase tracking-widest leading-relaxed">
          Tunnel protocol active. AES-256 server-side encryption enabled for all active streams.
        </p>
      </footer>
    </div>
  );
}