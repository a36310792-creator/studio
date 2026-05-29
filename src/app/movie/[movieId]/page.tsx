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
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-black mb-4">Movie Not Found</h1>
        <button onClick={() => router.back()} className="text-primary font-bold uppercase tracking-widest">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <MovieDetails movie={movie} onClose={() => router.back()} />
    </div>
  );
}
