'use client';

import React from 'react';
import { ArrowLeft, Star, Download, PlayCircle, Info, Calendar, Globe, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from './MovieCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import Link from 'next/link';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

export const MovieDetails = ({ movie, onClose }: MovieDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[2000] overflow-y-auto pb-32 animate-in fade-in slide-in-from-right duration-500">
      <AdFloating hrefs={ROTATION_LINKS} side="right" />
      <AdFloating hrefs={ROTATION_LINKS} side="left" />
      
      <div className="absolute top-5 left-5 z-[2010]">
        <button 
          onClick={onClose}
          className="bg-black/50 border border-white/10 text-white w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center hover:bg-primary hover:text-black transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full h-[65vh] relative">
        <img 
          src={movie.posterUrl} 
          className="w-full h-full object-cover" 
          alt={movie.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent"></div>
      </div>

      <div className="px-6 -mt-32 relative z-[2005] max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-[32px] md:text-5xl font-black text-white mb-3 tracking-tight leading-tight uppercase italic">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-2.5 mb-6">
              <span className="bg-primary text-black px-3 py-1 rounded-md font-black text-[11px] uppercase shadow-lg shadow-primary/20">
                {movie.quality}
              </span>
              <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-md font-bold text-[11px] text-[#ffc107] flex items-center gap-1.5 border border-white/5">
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.rating.toFixed(1)} IMDb
              </span>
              <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-md font-bold text-[11px] text-[#8b95a5] flex items-center gap-1.5 border border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                {movie.releaseYear}
              </span>
              <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-md font-bold text-[11px] text-[#8b95a5] flex items-center gap-1.5 border border-white/5">
                <Globe className="w-3.5 h-3.5" />
                {movie.audio}
              </span>
            </div>

            <div className="mb-6">
              <AdBanner id="details-top-rot" hrefs={ROTATION_LINKS} className="w-full" />
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Description
              </h3>
              <p className="text-[#8b95a5] text-[15px] leading-relaxed">
                {movie.description}
              </p>
            </div>

            <div className="mb-8">
              <AdBanner id="details-desc-rot" hrefs={ROTATION_LINKS} className="w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {/* Both buttons now lead to the Secure Gateway (Page 3) */}
              <Link href={`/download/${movie.id}?mode=watch`}>
                <Button 
                  className="w-full h-16 bg-primary text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <MonitorPlay className="w-6 h-6" />
                  WATCH ONLINE HD
                </Button>
              </Link>
              
              <Link href={`/download/${movie.id}?mode=download`}>
                <Button 
                  variant="outline"
                  className="w-full h-16 bg-white/5 border-primary/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-6 h-6 text-primary" />
                  DIRECT DOWNLOAD LINKS
                </Button>
              </Link>
            </div>

            <div className="mb-6">
              <AdBanner id="details-above-btns-rot" hrefs={ROTATION_LINKS} className="w-full" />
            </div>

            <div className="pb-10">
              <AdBanner id="details-final-bottom-rot" hrefs={ROTATION_LINKS} className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[2020] bg-black/90 backdrop-blur-xl border-t border-primary/20 p-2 md:max-w-[420px] md:mx-auto">
        <AdBanner id="details-sticky-footer-rot" hrefs={ROTATION_LINKS} className="w-full" />
      </div>
    </div>
  );
};
