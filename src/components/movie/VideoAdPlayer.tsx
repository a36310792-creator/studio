'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MonitorOff, AlertTriangle, Play, Loader2 } from 'lucide-react';

/**
 * @fileOverview A realistic dummy video player using Fluid Player to play a VAST ad 
 * and then show a maintenance message.
 */

declare global {
  interface Window {
    fluidPlayer: any;
  }
}

export const VideoAdPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const [adFinished, setAdFinished] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Fluid Player CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.fluidplayer.com/v3/current/fluidplayer.min.css';
    document.head.appendChild(link);

    // Load Fluid Player JS
    const script = document.createElement('script');
    script.src = 'https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {}
      }
      document.head.removeChild(link);
      const existingScript = document.querySelector('script[src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"]');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  const handlePlay = () => {
    if (!videoRef.current || !scriptLoaded || isInitializing || !window.fluidPlayer) return;

    setIsInitializing(true);

    try {
      const myPlayer = window.fluidPlayer(videoRef.current.id, {
        layoutControls: {
          fillToContainer: true,
          autoPlay: true,
          mute: false,
          allowDownload: false,
          playButtonShowing: false,
        },
        vastOptions: {
          adList: [{
            roll: 'preRoll',
            vastTag: 'https://elderlygoal.com/dOm.Fwz/d/GtN-vrZMGSUs/heXmf9pufZsUrlmkRPVTScxwGOrT/I/xFN/jBkMtGNgzFAH5IMHjlED3/MWwx'
          }]
        }
      });

      // State transitions based on ad lifecycle
      myPlayer.on('ended', () => setAdFinished(true));
      myPlayer.on('error', () => setAdFinished(true));
      myPlayer.on('adError', () => setAdFinished(true));
      myPlayer.on('adFinished', () => setAdFinished(true));

      playerInstanceRef.current = myPlayer;
      setIsInitializing(false);
    } catch (error) {
      console.error('Fluid Player Initialization Failed:', error);
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
            id="vast-dummy-player"
            ref={videoRef}
            className="w-full h-full"
            playsInline
          >
             <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
          
          {!playerInstanceRef.current && (
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
