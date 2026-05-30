'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MonitorOff, AlertTriangle, Play, Loader2 } from 'lucide-react';

/**
 * @fileOverview A realistic YouTube-styled dummy video player using Fluid Player to play a VAST ad 
 * and then show a server limit message.
 */

declare global {
  interface Window {
    fluidPlayer: any;
  }
}

export const VideoAdPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerInitRef = useRef<boolean>(false);
  const [adFinished, setAdFinished] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (playerInitRef.current) return;

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
      if (link.parentNode) document.head.removeChild(link);
      const existingScript = document.querySelector('script[src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"]');
      if (existingScript && existingScript.parentNode) document.head.removeChild(existingScript);
    };
  }, []);

  const handlePlay = () => {
    if (!videoRef.current || !scriptLoaded || isInitializing || !window.fluidPlayer || playerInitRef.current) return;

    setIsInitializing(true);

    try {
      playerInitRef.current = true;
      const myPlayer = window.fluidPlayer(videoRef.current.id, {
        layoutControls: {
          fillToContainer: true,
          autoPlay: true,
          mute: false,
          allowDownload: false,
          playButtonShowing: false,
          primaryColor: '#ff0000', // YouTube Red
          posterImage: 'https://picsum.photos/seed/cinema/1200/675',
          controlBar: {
            autoHide: true,
            autoHideTimeout: 3,
            animated: true
          }
        },
        vastOptions: {
          adList: [{
            roll: 'preRoll',
            vastTag: 'https://elderlygoal.com/dOm.Fwz/d/GtN-vrZMGSUs/heXmf9pufZsUrlmkRPVTScxwGOrT/I/xFN/jBkMtGNgzFAH5IMHjlED3/MWwx'
          }]
        }
      });

      // State transitions based on ad/video lifecycle
      // We rely on 'ended' of the main (dummy) video which plays after the pre-roll
      myPlayer.on('ended', () => {
        setAdFinished(true);
      });

      setIsInitializing(false);
    } catch (error) {
      console.error('Fluid Player Initialization Failed:', error);
      setAdFinished(true);
      setIsInitializing(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 shadow-2xl mb-8 group">
      {adFinished ? (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
           <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-glow">
              <MonitorOff className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2 mb-2">
             <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
             High-Speed Streaming Server Limit Reached
           </h3>
           <p className="text-[#8b95a5] text-[12px] font-bold uppercase tracking-tight leading-relaxed max-w-[280px]">
             We have reached our daily streaming capacity. Please use the Direct Download links below for instant, high-speed access.
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
          
          {!playerInitRef.current && (
            <div 
              onClick={handlePlay}
              className="absolute inset-0 z-40 bg-black/70 backdrop-blur-[4px] flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/50 transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(220,38,38,0.4)] transform transition-transform group-hover:scale-110 mb-4">
                {isInitializing ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : (
                  <Play className="w-10 h-10 fill-current ml-1" />
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-white uppercase tracking-[5px] italic">
                  Initialize Secure Stream
                </span>
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">
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