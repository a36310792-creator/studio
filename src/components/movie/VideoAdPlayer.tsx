'use client';

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { MonitorOff, AlertTriangle, Play, Loader2 } from 'lucide-react';

/**
 * @fileOverview A realistic dummy video player that plays a VAST ad and then 
 * shows a maintenance message.
 */

declare global {
  interface Window {
    google: any;
    videojs: any;
  }
}

export const VideoAdPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [adFinished, setAdFinished] = useState(false);
  const [isImaLoaded, setIsImaLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Dynamically load Google IMA SDK
    const script = document.createElement('script');
    script.src = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
    script.async = true;
    script.onload = () => setIsImaLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      const existingScript = document.querySelector('script[src="//imasdk.googleapis.com/js/sdkloader/ima3.js"]');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const handlePlay = () => {
    if (!videoRef.current || !isImaLoaded || isInitializing) return;

    setIsInitializing(true);

    // Initialize Video.js and IMA strictly on client interaction
    try {
      // @ts-ignore - Required for videojs-ima to attach correctly
      window.videojs = videojs;
      require('videojs-contrib-ads');
      require('videojs-ima');

      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        sources: [{
          src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'video/mp4'
        }]
      });

      const options = {
        id: videoRef.current.id,
        adTagUrl: 'Https://elderlygoal.com/dOm.Fwz/d/GtN-vrZMGSUs/heXmf9pufZsUrlmkRPVTScxwGOrT/I/xFN/jBkMtGNgzFAH5IMHjlED3/MWwx'
      };

      // @ts-ignore
      player.ima(options);

      player.on('ads-ad-started', () => {
        setIsInitializing(false);
      });

      player.on('ads-allpods-completed', () => {
        setAdFinished(true);
      });

      player.on('aderror', () => {
        setAdFinished(true);
        setIsInitializing(false);
      });

      playerRef.current = player;
      
      // Request and play ad
      // @ts-ignore
      player.ima.initializeAdDisplayContainer();
      // @ts-ignore
      player.ima.requestAds();
      player.play();
    } catch (error) {
      console.error('Player Initialization Failed:', error);
      setAdFinished(true);
      setIsInitializing(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-8 group">
      {adFinished ? (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
           <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-glow">
              <MonitorOff className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2 mb-2">
             <AlertTriangle className="w-5 h-5 text-primary animate-pulse" />
             Streaming Server Busy
           </h3>
           <p className="text-[#8b95a5] text-[12px] font-bold uppercase tracking-tight leading-relaxed max-w-[280px]">
             High-speed streaming nodes are currently undergoing maintenance. Please utilize the Direct Download options below for instant access.
           </p>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video
            id="dummy-video-player"
            ref={videoRef}
            className="video-js vjs-big-play-centered w-full h-full"
            playsInline
          />
          {!playerRef.current && (
            <div 
              onClick={handlePlay}
              className="absolute inset-0 z-40 bg-black/70 backdrop-blur-[6px] flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/50 transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_50px_rgba(0,229,255,0.4)] transform transition-transform group-hover:scale-110 mb-4">
                {isInitializing ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : (
                  <Play className="w-10 h-10 fill-current ml-1" />
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-white uppercase tracking-[5px] italic">
                  Initialize Secure Node
                </span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">
                  Encrypted Player v4.2
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
