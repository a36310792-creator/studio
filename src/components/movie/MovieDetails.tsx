"use client";

import React from 'react';
import { ArrowLeft, Star, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from './MovieCard';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieDetails = ({ movie, onClose }: MovieDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[2000] overflow-y-auto pb-32 animate-in fade-in slide-in-from-right duration-500">
      {/* Back Button */}
      <div className="absolute top-5 left-5 z-[2010]">
        <button 
          onClick={onClose}
          className="bg-black/50 border border-white/20 text-white w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Poster */}
      <div className="w-full h-[60vh] relative">
        <img 
          src={movie.posterUrl} 
          className="w-full h-full object-cover" 
          alt={movie.title} 
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050505] to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative z-[2005]">
        <h1 className="text-[28px] font-black text-white mb-2.5 leading-tight">{movie.title}</h1>
        
        <div className="flex gap-2.5 mb-6">
          <span className="bg-primary text-black px-2.5 py-1 rounded-md font-black text-[11px] uppercase">
            {movie.quality}
          </span>
          <span className="bg-[#1a1a1a] px-2.5 py-1 rounded-md font-bold text-[11px] text-[#ffc107] flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {movie.rating.toFixed(1)}
          </span>
          <span className="bg-[#1a1a1a] px-2.5 py-1 rounded-md font-bold text-[11px] text-[#8b95a5]">
            {movie.releaseYear}
          </span>
        </div>

        <p className="text-[#8b95a5] text-[14px] leading-relaxed mb-8">
          Experience "{movie.title}" in stunning {movie.quality} quality. LuminaStream brings you the latest cinematic masterpieces directly to your device with {movie.audio} support and optimized streaming speeds.
        </p>

        <a 
          href="#" 
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#0077ff] to-[#00e5ff] text-white py-4 rounded-full font-black text-[16px] shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <PlayCircle className="w-6 h-6" />
          GET DOWNLOAD LINKS
        </a>
      </div>
    </div>
  );
};
