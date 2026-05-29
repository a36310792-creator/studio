
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { TrendingUp, Film, Search, Sparkles, Bookmark as BookmarkIcon } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [navTab, setNavTab] = useState('home');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('lumina_movies');
    if (stored) {
      setMovies(JSON.parse(stored));
    } else {
      setMovies(DEFAULT_MOVIES);
      localStorage.setItem('lumina_movies', JSON.stringify(DEFAULT_MOVIES));
    }

    const saved = localStorage.getItem('lumina_bookmarks');
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newBookmarks = bookmarkedIds.includes(id) 
      ? bookmarkedIds.filter(bid => bid !== id)
      : [...bookmarkedIds, id];
    
    setBookmarkedIds(newBookmarks);
    localStorage.setItem('lumina_bookmarks', JSON.stringify(newBookmarks));
  };

  useEffect(() => {
    if (navTab === 'discover') {
      const shuffled = [...movies].sort(() => 0.5 - Math.random());
      setDiscoverMovies(shuffled.slice(0, 6));
    }
  }, [navTab, movies]);

  const tabs = ['All', 'Action', 'Horror', 'Anime', 'Sci-Fi', 'Thriller'];

  const displayedMovies = useMemo(() => {
    let currentPool = movies;

    if (navTab === 'saved') {
      currentPool = movies.filter(m => bookmarkedIds.includes(m.id));
    } else if (navTab === 'discover') {
      currentPool = discoverMovies;
    }

    // Apply filters (Category and Search)
    return currentPool.filter(movie => {
      // Category Filter (only applies on Home tab or if pool is already filtered)
      const matchesCategory = 
        navTab !== 'home' || 
        activeCategory === 'All' || 
        movie.genres.includes(activeCategory);

      // Search Filter (case-insensitive)
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, movies, navTab, bookmarkedIds, discoverMovies]);

  const viewTitle = useMemo(() => {
    if (navTab === 'saved') return { label: 'Saved Collection', icon: <BookmarkIcon className="w-5 h-5 text-primary" /> };
    if (navTab === 'discover') return { label: 'Pick for You', icon: <Sparkles className="w-5 h-5 text-primary" /> };
    return { 
      label: activeCategory === 'All' ? 'Trending Content' : `${activeCategory} Highlights`,
      icon: <TrendingUp className="w-5 h-5 text-primary" /> 
    };
  }, [navTab, activeCategory]);

  return (
    <div className="relative min-h-screen bg-[#050505] pb-32 max-w-[420px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      <Header />
      
      {navTab === 'home' && <NewReleaseToast movieName="The Z Effect - 4K Release Live!" />}

      <main>
        {navTab === 'home' && (
          <>
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
                  onClick={() => setActiveCategory(tab)}
                  className={`px-5 py-2.5 rounded-2xl text-[12px] font-black whitespace-nowrap transition-all border ${
                    activeCategory === tab 
                      ? "bg-primary text-black border-primary shadow-[0_5px_15px_rgba(0,229,255,0.2)]" 
                      : "bg-[#121212] text-[#8b95a5] border-white/5 hover:border-white/20"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </>
        )}

        {navTab === 'discover' && (
          <div className="px-5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[32px] p-6 text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-2">Feeling Lucky?</h2>
              <p className="text-sm text-[#8b95a5] font-bold">Discover something unexpected from our library.</p>
              <button 
                onClick={() => setDiscoverMovies([...movies].sort(() => 0.5 - Math.random()).slice(0, 6))}
                className="mt-6 px-8 py-3 bg-primary text-black font-black rounded-2xl shadow-lg hover:brightness-110 transition-all"
              >
                SHUFFLE AGAIN
              </button>
            </div>
          </div>
        )}

        <section className="px-5 min-h-[400px]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[18px] font-black flex items-center gap-2">
              {viewTitle.icon}
              {viewTitle.label}
            </h3>
          </div>

          {displayedMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-[15px] animate-in fade-in duration-500">
              {displayedMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onSelect={setSelectedMovie}
                  onToggleBookmark={toggleBookmark}
                  isBookmarked={bookmarkedIds.includes(movie.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-10 border-2 border-dashed border-white/5 rounded-[32px]">
              <Film className="w-16 h-16 text-[#222] mb-4" />
              <h4 className="text-white font-bold text-lg mb-1">
                {navTab === 'saved' ? 'Your list is empty' : 'No movies found'}
              </h4>
              <p className="text-[#555] text-sm">
                {searchQuery 
                  ? `No matches for "${searchQuery}"` 
                  : navTab === 'saved' 
                    ? 'Start bookmarking your favorite content!' 
                    : 'Try selecting a different category.'}
              </p>
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

      <BottomNav activeTab={navTab} onTabChange={setNavTab} />
    </div>
  );
}
