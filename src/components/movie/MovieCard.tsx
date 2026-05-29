import React from 'react';
import Image from 'next/image';
import { Star, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    <div className="group relative flex flex-col bg-card rounded-2xl overflow-hidden transition-all hover:-translate-y-1">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            variant="destructive" 
            className={cn(
              "px-2 py-0.5 text-[10px] font-bold uppercase border-none",
              movie.quality === '4K' ? "bg-primary text-primary-foreground" : "bg-red-600 text-white"
            )}
          >
            {movie.quality}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[#FFC107] text-xs font-bold">
          <Star className="w-3 h-3 fill-current" />
          {movie.rating.toFixed(1)}
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onToggleBookmark?.(movie.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-primary transition-colors"
        >
          <Bookmark className={cn("w-4 h-4", movie.isBookmarked && "fill-primary text-primary")} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold truncate leading-tight mb-1">{movie.title}</h3>
        <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-semibold">
          <span>{movie.audio}</span>
          <span>{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};