'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Calendar, 
  MonitorPlay, 
  ShieldCheck,
  Globe,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';

const DETAILS_AD_LINK = "https://commendtwisted.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie, loading } = useDoc<Movie>(movieRef);

  const handleWatch = () => {
    router.push(`/watch/${movieId}`);
  };

  const handleDownload = () => {
    window.open(DETAILS_AD_LINK, '_blank');
    router.push(`/movie/${movieId}`);
  };

  const resolvedPoster = movie?.posterUrl || movie?.imageUrl || movie?.image || `https://picsum.photos/seed/${movieId}/1200/800`;

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-48 shadow-2xl relative font-body overflow-x-hidden">
      <AdFloating hrefs={[DETAILS_AD_LINK]} side="right" />
      <AdFloating hrefs={[DETAILS_AD_LINK]} side="left" />
      
      {/* Header with Fixed Back Button */}
      <div className="absolute top-6 left-6 z-[2010]">
        <button 
          onClick={() => router.push('/')}
          className="bg-black/60 border border-white/10 text-white w-12 h-12 rounded-2xl backdrop-blur-2xl flex items-center justify-center hover:bg-primary hover:text-black transition-all shadow-2xl active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Poster Section */}
      <div className="w-full h-[60vh] relative">
        {loading ? (
          <Skeleton className="w-full h-full shimmer" />
        ) : (
          <img 
            src={resolvedPoster} 
            className="w-full h-full object-cover animate-in fade-in duration-1000" 
            alt={movie?.title || 'Movie Poster'} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent"></div>
      </div>

      {/* Structured Content Area */}
      <main className="px-6 -mt-20 relative z-[2005] flex flex-col gap-8 animate-in slide-in-from-bottom-10 duration-700">
        <div className="space-y-4">
          <div role="heading" aria-level={1} className="text-[34px] font-black text-white leading-[1.1] uppercase italic tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {movie?.title || (loading ? <Skeleton className="h-10 w-64 shimmer" /> : 'MEDIA ENTRY')}
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            <span className="bg-primary text-black px-4 py-1.5 rounded-xl font-black text-[11px] uppercase shadow-glow">
              {movie?.quality || 'SYNCING'}
            </span>
            <span className="bg-[#111] border border-white/5 px-3.5 py-1.5 rounded-xl font-black text-[11px] text-[#ffc107] flex items-center gap-2 backdrop-blur-xl">
              <Star className="w-3.5 h-3.5 fill-current" />
              {movie?.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="bg-[#111] border border-white/5 px-3.5 py-1.5 rounded-xl font-black text-[11px] text-[#666] flex items-center gap-2 backdrop-blur-xl">
              <Calendar className="w-3.5 h-3.5" />
              {movie?.releaseYear || '----'}
            </span>
            {movie?.audio && (
              <span className="bg-[#111] border border-white/5 px-3.5 py-1.5 rounded-xl font-black text-[11px] text-[#666] flex items-center gap-2 backdrop-blur-xl">
                <Globe className="w-3.5 h-3.5" />
                {movie.audio.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Action Funnel */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleWatch}
            className="w-full h-16 py-4 bg-primary text-black font-black rounded-2xl shadow-[0_12px_40px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg italic uppercase"
          >
            <MonitorPlay className="w-6 h-6" />
            WATCH ONLINE HD
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full h-16 py-4 bg-[#0a0a0a] border-primary/20 text-white font-black rounded-2xl hover:bg-[#111] hover:border-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg italic uppercase"
          >
            <Download className="w-6 h-6 text-primary" />
            DIRECT DOWNLOAD
          </Button>
        </div>

        {/* Information Security Context */}
        <div className="bg-[#0a0a0a] rounded-[32px] p-7 border border-white/5 shadow-inner">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck className="w-4.5 h-4.5 text-primary" />
            <span className="text-[10px] font-black text-[#444] uppercase tracking-[3px]">Secure Protocol Active</span>
          </div>
          <div className="text-[#8b95a5] text-[14.5px] leading-relaxed italic font-medium opacity-90">
            {movie?.description || (loading ? <Skeleton className="h-20 w-full shimmer" /> : 'Awaiting data synchronization from master server node.')}
          </div>
        </div>

        <div className="w-full mt-2">
          <AdBanner id="details-bottom-fixed" hrefs={[DETAILS_AD_LINK]} className="w-full" />
        </div>
      </main>

      {/* Global Sticky Footer Monetization */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[2020] bg-black/95 backdrop-blur-3xl border-t border-primary/10 p-3 max-w-[420px] shadow-[0_-15px_60px_rgba(0,0,0,1)]">
        <AdBanner id="details-sticky-footer" hrefs={[DETAILS_AD_LINK]} className="w-full" />
      </div>
    </div>
  );
}
