'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { type Movie } from '@/components/movie/MovieCard';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Safety timeout to prevent infinite loading screens
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie, loading } = useDoc<Movie>(movieRef);

  // Show loader only if still loading AND we haven't hit the safety timeout
  if (loading && !isTimedOut) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
           <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
             <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
           </div>
           <p className="text-[10px] font-black text-primary uppercase tracking-[5px] italic animate-pulse">Accessing Metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {movie ? (
        <MovieDetails movie={movie} onClose={() => router.push('/')} />
      ) : (
        /* If movie is not found but loading finished or timed out, show fallback or redirect */
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-700">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <span className="text-3xl">📡</span>
           </div>
           <h2 className="text-white font-black text-xl uppercase italic mb-2">Node Sync Lost</h2>
           <p className="text-[#555] text-xs font-bold uppercase tracking-widest mb-8">Metadata node was closed or moved.</p>
           <button 
             onClick={() => router.push('/')} 
             className="bg-primary text-black font-black px-8 py-3 rounded-xl text-[10px] uppercase tracking-[2px] shadow-[0_10px_30px_rgba(0,229,255,0.2)] hover:scale-105 active:scale-95 transition-all"
           >
             Return to Main Hub
           </button>
        </div>
      )}
    </div>
  );
}
