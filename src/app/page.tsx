
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { CineSuggest } from '@/components/movie/CineSuggest';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { TrendingUp, Film, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DEFAULT_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Hathras Season 1',
    posterUrl: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 8.5,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'Hindi Dubbed',
    genres: ['Action', 'Thriller'],
    description: 'A deep investigative journey into the mysteries of Hathras, following a team of journalists uncovering hidden truths in the heart of rural India.',
    watchUrl: '#'
  },
  {
    id: '2',
    title: 'Karuppu: Echoes',
    posterUrl: 'https://images.unsplash.com/photo-1505506874110-6a7a4c9891ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 7.2,
    quality: '4K',
    releaseYear: 2026,
    audio: 'Multi Audio',
    genres: ['Horror', 'Mystery'],
    description: 'An ancient spirit awakens in the dark forests of southern India. When a group of hikers goes missing, only the locals know what truly haunts the trees.',
    watchUrl: '#'
  },
  {
    id: '3',
    title: 'Krishnavatara',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 6.8,
    quality: 'CAM',
    releaseYear: 2026,
    audio: 'Dual Audio',
    genres: ['Anime', 'Fantasy'],
    description: 'A modern retelling of the legends, blending traditional storytelling with cutting-edge futuristic animation in a world where gods and machines coexist.',
    watchUrl: '#'
  },
  {
    id: '4',
    title: 'The Z Effect',
    posterUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 9.1,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'English Sub',
    genres: ['Sci-Fi', 'Action'],
    description: 'In the year 2099, a biological breakthrough turns into a global catastrophe. One soldier must navigate the wasteland to deliver the only known cure.',
    watchUrl: '#'
  }
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lumina_movies');
    if (stored) {
      setMovies(JSON.parse(stored));
    } else {
      setMovies(DEFAULT_MOVIES);
      localStorage.setItem('lumina_movies', JSON.stringify(DEFAULT_MOVIES));
    }
  }, []);

  const tabs = ['All', 'Action', 'Horror', 'Anime', 'Sci-Fi', 'Thriller'];

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesTab = activeTab === 'All' || movie.genres.includes(activeTab);
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, movies]);

  return (
    <div className="relative min-h-screen bg-[#050505] pb-32 max-w-[420px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      <Header />
      
      <NewReleaseToast movieName="The Z Effect - 4K Release Live!" />

      <main>
        <div className="px-5 mb-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search movies, series..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121212] border-white/5 h-12 rounded-2xl pl-11 text-white placeholder:text-[#555] focus-visible:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2.5 px-5 mb-6 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-[12px] font-black whitespace-nowrap transition-all border ${
                activeTab === tab 
                  ? "bg-primary text-black border-primary shadow-[0_5px_15px_rgba(0,229,255,0.2)]" 
                  : "bg-[#121212] text-[#8b95a5] border-white/5 hover:border-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <CineSuggest />

        <section className="px-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[18px] font-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {activeTab === 'All' ? 'Trending Content' : `${activeTab} Highlights`}
            </h3>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-[15px]">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onSelect={setSelectedMovie} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-10">
              <Film className="w-16 h-16 text-[#222] mb-4" />
              <h4 className="text-white font-bold text-lg mb-1">No results found</h4>
            </div>
          )}
        </section>
      </main>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      <BottomNav />
    </div>
  );
}
