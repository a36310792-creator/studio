'use client';

import React from 'react';
import { Star, Bookmark, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  imageUrl?: string; // Fallback field
  image?: string;     // Fallback field
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
  // Resolve image URL with fallbacks
  const resolvedPoster = movie.posterUrl || movie.imageUrl || movie.image || `https://picsum.photos/seed/${movie.id}/400/600`;

  return (
    <div 
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col bg-[#111] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:z-10 aspect-[2/3.2] cursor-pointer shadow-lg hover:shadow-primary/20"
    >
      <img
        src={resolvedPoster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        <span className={cn(
          "px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-[4px] text-white w-fit",
          movie.quality === '4K' ? "bg-primary text-black" : movie.quality === 'CAM' ? "bg-gray-600" : "bg-red-600"
        )}>
          {movie.quality}
        </span>
      </div>

      {/* Bookmark Button */}
      <button 
        onClick={(e) => onToggleBookmark?.(e, movie.id)}
        className={cn(
          "absolute top-2.5 right-2.5 z-30 p-2 rounded-xl backdrop-blur-md transition-all active:scale-90",
          isBookmarked ? "bg-primary text-black" : "bg-black/40 text-white hover:bg-black/60"
        )}
      >
        <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
      </button>

      {/* Hover Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40 backdrop-blur-[2px]">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-6 h-6 fill-current" />
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300">
        <div className="self-end bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-[6px] text-[#FFC107] text-[10px] font-bold flex items-center gap-1 mb-1.5">
          <Star className="w-2.5 h-2.5 fill-current" />
          {movie.rating?.toFixed(1) || '0.0'}
        </div>
        <h3 className="text-[13px] font-extrabold truncate text-white mb-0.5 group-hover:text-primary transition-colors">{movie.title}</h3>
        <div className="flex justify-between items-center text-[9px] text-[#8b95a5] font-bold uppercase">
          <span>{movie.audio}</span>
          <span>{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};