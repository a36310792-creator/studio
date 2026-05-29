import React from 'react';
import Image from 'next/image';
import { Star, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  quality: 'HD' | '4K' | 'CAM';
  releaseYear: number;
  audio: string;
  isBookmarked?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark?: (id: string) => void;
}

export const MovieCard = ({ movie, onToggleBookmark }: MovieCardProps) => {
  return (
    <div className="group relative flex flex-col bg-[#111] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] aspect-[2/3.2]">
      <Image
        src={movie.posterUrl}
        alt={movie.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className={cn(
          "px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-[6px] text-white",
          movie.quality === '4K' ? "bg-primary text-black" : movie.quality === 'CAM' ? "bg-gray-600" : "bg-red-600"
        )}>
          {movie.quality}
        </span>
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          onToggleBookmark?.(movie.id);
        }}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-primary transition-colors"
      >
        <Bookmark className={cn("w-3.5 h-3.5", movie.isBookmarked && "fill-primary text-primary")} />
      </button>

      {/* Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3">
        <div className="self-end bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-[6px] text-[#FFC107] text-[10px] font-bold flex items-center gap-1 mb-1.5">
          <Star className="w-2.5 h-2.5 fill-current" />
          {movie.rating.toFixed(1)}
        </div>
        <h3 className="text-[13px] font-extrabold truncate text-white mb-0.5">{movie.title}</h3>
        <div className="flex justify-between items-center text-[9px] text-[#8b95a5] font-bold uppercase">
          <span>{movie.audio}</span>
          <span>{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};