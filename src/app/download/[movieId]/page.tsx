
'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Calendar, 
  Globe, 
  MonitorPlay, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdFloating } from '@/components/ads/AdFloating';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Movie } from '@/components/movie/MovieCard';

const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
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
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-32 shadow-2xl relative font-body overflow-x-hidden">
      <AdFloating hrefs={ROTATION_LINKS} side="right" />
      <AdFloating hrefs={ROTATION_LINKS} side="left" />
      
      {/* Header with Fixed Back Button */}
      <div className="absolute top-5 left-5 z-[2010]">
        <button 
          onClick={() => router.push('/')}
          className="bg-black/50 border border-white/10 text-white w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center hover:bg-primary hover:text-black transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full h-[60vh] relative">
        {movie?.posterUrl && (
          <img 
            src={movie.posterUrl} 
            className="w-full h-full object-cover" 
            alt={movie.title} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent"></div>
      </div>

      <main className="px-6 -mt-24 relative z-[2005]">
        <h1 className="text-[32px] font-black text-white mb-3 tracking-tight leading-tight uppercase italic">
          {movie?.title || (loading ? 'Loading Details...' : 'Media Entry')}
        </h1>
        
        <div className="flex flex-wrap gap-2.5 mb-6">
          <span className="bg-primary text-black px-3 py-1 rounded-md font-black text-[11px] uppercase shadow-lg shadow-primary/20">
            {movie?.quality || '4K'}
          </span>
          <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-md font-bold text-[11px] text-[#ffc107] flex items-center gap-1.5 border border-white/5">
            <Star className="w-3.5 h-3.5 fill-current" />
            {movie?.rating?.toFixed(1) || '8.5'} IMDb
          </span>
          <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-md font-bold text-[11px] text-[#8b95a5] flex items-center gap-1.5 border border-white/5">
            <Calendar className="w-3.5 h-3.5" />
            {movie?.releaseYear || '2024'}
          </span>
        </div>

        <div className="mb-6">
          <AdBanner id="details-top" hrefs={ROTATION_LINKS} className="w-full" />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Button 
            onClick={handleWatch}
            className="w-full h-16 bg-primary text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
          >
            <MonitorPlay className="w-6 h-6" />
            WATCH ONLINE HD
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full h-16 bg-white/5 border-primary/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6 text-primary" />
            DIRECT DOWNLOAD LINKS
          </Button>
        </div>

        <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">Encrypted Server Status</span>
          </div>
          <p className="text-[#8b95a5] text-[14px] leading-relaxed italic">
            {movie?.description || 'Enjoy premium high-speed streaming and direct downloads with our secure, end-to-end encrypted tunneling technology.'}
          </p>
        </div>

        <div className="pb-10">
          <AdBanner id="details-bottom" hrefs={ROTATION_LINKS} className="w-full" />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[2020] bg-black/90 backdrop-blur-xl border-t border-primary/20 p-2 max-w-[420px] mx-auto">
        <AdBanner id="details-sticky" hrefs={ROTATION_LINKS} className="w-full" />
      </div>
    </div>
  );
}
