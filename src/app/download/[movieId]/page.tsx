
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
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';

// Updated ad link for Movie Details Page
const DETAILS_AD_LINK = "https://commendtwisted.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995";
const ROTATION_LINKS = [
  DETAILS_AD_LINK,
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed"
];

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
    // Trigger ad link in new tab
    window.open(DETAILS_AD_LINK, '_blank');
    // Proceed to Gateway Page
    router.push(`/movie/${movieId}`);
  };

  const resolvedPoster = movie?.posterUrl || movie?.imageUrl || movie?.image || `https://picsum.photos/seed/${movieId}/1200/800`;

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-44 shadow-2xl relative font-body overflow-x-hidden">
      <AdFloating hrefs={[DETAILS_AD_LINK]} side="right" />
      <AdFloating hrefs={[DETAILS_AD_LINK]} side="left" />
      
      {/* Header with Fixed Back Button */}
      <div className="absolute top-5 left-5 z-[2010]">
        <button 
          onClick={() => router.push('/')}
          className="bg-black/50 border border-white/10 text-white w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center hover:bg-primary hover:text-black transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Poster Section */}
      <div className="w-full h-[55vh] relative">
        <img 
          src={resolvedPoster} 
          className="w-full h-full object-cover" 
          alt={movie?.title || 'Movie Poster'} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-transparent"></div>
      </div>

      {/* Structured Content Area */}
      <main className="px-6 -mt-16 relative z-[2005] flex flex-col gap-7">
        <div className="space-y-3">
          <h1 className="text-[30px] font-black text-white leading-tight uppercase italic drop-shadow-2xl">
            {movie?.title || (loading ? 'SYNCING DATA...' : 'MEDIA ENTRY')}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary text-black px-3 py-1 rounded-md font-black text-[10px] uppercase shadow-lg shadow-primary/10">
              {movie?.quality || '4K'}
            </span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md font-bold text-[10px] text-[#ffc107] flex items-center gap-1.5 backdrop-blur-md">
              <Star className="w-3 h-3 fill-current" />
              {movie?.rating?.toFixed(1) || '8.5'}
            </span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md font-bold text-[10px] text-[#8b95a5] flex items-center gap-1.5 backdrop-blur-md">
              <Calendar className="w-3 h-3" />
              {movie?.releaseYear || '2024'}
            </span>
            {movie?.audio && (
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md font-bold text-[10px] text-[#8b95a5] flex items-center gap-1.5 backdrop-blur-md">
                <Globe className="w-3 h-3" />
                {movie.audio}
              </span>
            )}
          </div>
        </div>

        {/* Action Funnel */}
        <div className="flex flex-col gap-3.5">
          <Button 
            onClick={handleWatch}
            className="w-full h-15 py-4 bg-primary text-black font-black rounded-2xl shadow-[0_8px_30px_rgba(0,229,255,0.25)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base italic uppercase"
          >
            <MonitorPlay className="w-5 h-5" />
            WATCH ONLINE HD
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full h-15 py-4 bg-white/5 border-primary/20 text-white font-black rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base italic uppercase"
          >
            <Download className="w-5 h-5 text-primary" />
            DIRECT DOWNLOAD LINKS
          </Button>
        </div>

        {/* Information Security Context */}
        <div className="bg-[#0a0a0a] rounded-[24px] p-5 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[2.5px]">Security Layer: Active</span>
          </div>
          <p className="text-[#8b95a5] text-[13.5px] leading-relaxed italic opacity-90 font-medium">
            {movie?.description || 'Experience ultra-fast edge delivery through our encrypted server nodes. No bandwidth limits applied to your current session.'}
          </p>
        </div>

        <div className="w-full">
          <AdBanner id="details-bottom-fixed" hrefs={[DETAILS_AD_LINK]} className="w-full" />
        </div>
      </main>

      {/* Global Sticky Footer Monetization */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[2020] bg-black/95 backdrop-blur-3xl border-t border-primary/20 p-2.5 max-w-[420px] shadow-[0_-15px_50px_rgba(0,0,0,0.9)]">
        <AdBanner id="details-sticky-footer" hrefs={[DETAILS_AD_LINK]} className="w-full" />
      </div>
    </div>
  );
}
