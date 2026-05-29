'use client';

import React from 'react';
import { Star, Bookmark, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  imageUrl?: string;
  image?: string;
  rating: number;
  quality: 'HD' | '4K' | 'CAM';
  releaseYear: number;
  audio: string;
  genres: string[];
  description: string;
  watchUrl?: string;
  directDownloadUrl?: string;
  isBookmarked?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onToggleBookmark?: (e: React.MouseEvent, id: string) => void;
  isBookmarked?: boolean;
}

export const MovieCard = ({ movie, onSelect, onToggleBookmark, isBookmarked }: MovieCardProps) => {
  const resolvedPoster = movie.posterUrl || movie.imageUrl || movie.image || `https://picsum.photos/seed/${movie.id}/400/600`;

  return (
    <div 
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col bg-[#0a0a0a] rounded-[24px] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:z-10 aspect-[2/3.2] cursor-pointer shadow-2xl border border-white/5 hover:border-primary/40 hover:shadow-primary/10"
    >
      <img
        src={resolvedPoster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1">
        <span className={cn(
          "px-2 py-1 text-[9px] font-black uppercase rounded-lg text-white w-fit shadow-xl backdrop-blur-md",
          movie.quality === '4K' ? "bg-primary text-black" : movie.quality === 'CAM' ? "bg-gray-800" : "bg-red-600"
        )}>
          {movie.quality}
        </span>
      </div>

      {/* Bookmark Button */}
      <button 
        onClick={(e) => onToggleBookmark?.(e, movie.id)}
        className={cn(
          "absolute top-3 right-3 z-30 p-2.5 rounded-xl backdrop-blur-xl transition-all active:scale-90 shadow-xl border border-white/10",
          isBookmarked ? "bg-primary text-black" : "bg-black/40 text-white hover:bg-black/60 hover:scale-110"
        )}
      >
        <Bookmark className={cn("w-4.5 h-4.5", isBookmarked && "fill-current")} />
      </button>

      {/* Hover Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 bg-black/60 backdrop-blur-[1px]">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,229,255,0.4)] transform scale-50 group-hover:scale-100 transition-transform duration-500">
          <Play className="w-7 h-7 fill-current" />
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-4 transition-all duration-500">
        <div className="self-end bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[#FFC107] text-[10px] font-black flex items-center gap-1.5 mb-2 border border-white/5 shadow-xl">
          <Star className="w-3 h-3 fill-current" />
          {movie.rating?.toFixed(1) || '0.0'}
        </div>
        <h3 className="text-[14px] font-black truncate text-white mb-1 group-hover:text-primary transition-colors italic tracking-tight">{movie.title.toUpperCase()}</h3>
        <div className="flex justify-between items-center text-[9px] text-[#666] font-black uppercase tracking-wider">
          <span>{movie.audio}</span>
          <span>{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};