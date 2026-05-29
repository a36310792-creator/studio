
'use client';

import React, { useMemo } from 'react';
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

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie, loading } = useDoc<Movie>(movieRef);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-8 h-8 text-primary animate-spin" />
           <p className="text-[10px] font-black text-primary/40 uppercase tracking-[5px] italic">Accessing Metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {movie ? (
        <MovieDetails movie={movie} onClose={() => router.push('/')} />
      ) : (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-10 text-center">
           <p className="text-white font-bold mb-4">Movie node not found or expired.</p>
           <button onClick={() => router.push('/')} className="text-primary font-black uppercase text-sm underline">Return Home</button>
        </div>
      )}
    </div>
  );
}
