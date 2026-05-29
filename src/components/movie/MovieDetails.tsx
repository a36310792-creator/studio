
'use client';

import React from 'react';
import { ArrowLeft, Star, Download, PlayCircle, Info, Calendar, Globe, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from './MovieCard';
import Link from 'next/link';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieDetails = ({ movie, onClose }: MovieDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[2000] overflow-y-auto pb-32 animate-in fade-in slide-in-from-right duration-500">
      {/* Glass Back Button */}
      <div className="absolute top-5 left-5 z-[2010]">
        <button 
          onClick={onClose}
          className="bg-black/50 border border-white/10 text-white w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center hover:bg-primary hover:text-black transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Poster Backdrop */}
      <div className="w-full h-[65vh] relative">
        <img 
          src={movie.posterUrl} 
          className="w-full h-full object-cover" 
          alt={movie.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="px-6 -mt-32 relative z-[2005] max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Info */}
          <div className="flex-1">
            <h1 className="text-[32px] md:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
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

            <div className="space-y-4 mb-6">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Description
              </h3>
              <p className="text-[#8b95a5] text-[15px] leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Prominent Action Button - Routes to Gateway Page */}
            <div className="mb-10">
              <Link href={`/download/${movie.id}`}>
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-primary to-cyan-500 text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:brightness-110 active:scale-95 transition-all"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  FINAL DOWNLOAD / WATCH NOW
                </Button>
              </Link>
            </div>

            {/* Download Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-black text-white uppercase tracking-wider">Download Links</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Link href={`/download/${movie.id}`}>
                  <Button 
                    className="w-full h-14 bg-white/10 hover:bg-primary hover:text-black border border-white/10 rounded-2xl flex justify-between px-6 font-black group transition-all text-left"
                  >
                    <span className="text-[14px]">480p SD - Low Size</span>
                    <span className="text-[12px] opacity-60 group-hover:opacity-100 uppercase">350 MB</span>
                  </Button>
                </Link>
                
                <Link href={`/download/${movie.id}`}>
                  <Button 
                    className="w-full h-14 bg-white/10 hover:bg-primary hover:text-black border border-white/10 rounded-2xl flex justify-between px-6 font-black group transition-all text-left"
                  >
                    <span className="text-[14px]">720p HD - Recommended</span>
                    <span className="text-[12px] opacity-60 group-hover:opacity-100 uppercase">900 MB</span>
                  </Button>
                </Link>
                
                <Link href={`/download/${movie.id}`}>
                  <Button 
                    className="w-full h-14 bg-gradient-to-r from-primary to-cyan-400 text-black hover:brightness-110 rounded-2xl flex justify-between px-6 font-black group transition-all shadow-[0_10px_30px_rgba(0,229,255,0.3)] text-left"
                  >
                    <span className="text-[14px]">1080p Full HD - Ultra</span>
                    <span className="text-[12px] text-black/60 uppercase">2.4 GB</span>
                  </Button>
                </Link>
              </div>
              
              <p className="text-[11px] text-center text-[#555] font-bold italic">
                Note: All links are verified and scanned for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
