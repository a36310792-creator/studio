'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { type Movie } from '@/components/movie/MovieCard';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const movieRef = useMemo(() => {
    if (!db || !movieId) return null;
    return doc(db, 'movies', movieId as string);
  }, [db, movieId]);

  const { data: movie } = useDoc<Movie>(movieRef);

  // Render shell immediately, handle missing movie inside component
  return (
    <div className="min-h-screen bg-[#050505]">
      {movie ? (
        <MovieDetails movie={movie} onClose={() => router.back()} />
      ) : (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
           <p className="text-[10px] font-black text-primary/20 uppercase tracking-[5px] animate-pulse italic">Synchronizing Node...</p>
        </div>
      )}
    </div>
  );
}
