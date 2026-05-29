
'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Bookmark, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
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
}

export const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  return (
    <div 
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col bg-[#111] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:z-10 aspect-[2/3.2] cursor-pointer shadow-lg hover:shadow-primary/20"
    >
      <Image
        src={movie.posterUrl}
        alt={movie.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex gap-1">
        <span className={cn(
          "px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-[4px] text-white",
          movie.quality === '4K' ? "bg-primary text-black" : movie.quality === 'CAM' ? "bg-gray-600" : "bg-red-600"
        )}>
          {movie.quality}
        </span>
      </div>

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
          {movie.rating.toFixed(1)}
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
