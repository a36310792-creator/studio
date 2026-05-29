'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { TrendingUp, Film, Search, Sparkles, Bookmark as BookmarkIcon, Calendar, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Hathras Season 1',
    posterUrl: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 8.5,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'Hindi Dubbed',
    genres: ['Web Series'],
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
    genres: ['South'],
    description: 'An ancient spirit awakens in the dark forests of southern India. When a group of hikers goes missing, only the locals know what truly haunts the trees.',
    watchUrl: '#'
  },
  {
    id: '3',
    title: 'Krishnavatara',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 6.8,
    quality: 'CAM',
    releaseYear: 2025,
    audio: 'Dual Audio',
    genres: ['Animation'],
    description: 'A modern retelling of the legends, blending traditional storytelling with cutting-edge futuristic animation in a world where gods and machines coexist.',
    watchUrl: '#'
  },
  {
    id: '4',
    title: 'The Z Effect',
    posterUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 9.1,
    quality: 'HD',
    releaseYear: 2024,
    audio: 'English Sub',
    genres: ['Hollywood'],
    description: 'In the year 2099, a biological breakthrough turns into a global catastrophe. One soldier must navigate the wasteland to deliver the only known cure.',
    watchUrl: '#'
  }
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [navTab, setNavTab] = useState('home');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [discoverMovies, setDiscoverMovies] = useState<Movie[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const genres = ['All', 'Action', 'Horror', 'Anime', 'Sci-Fi'];
  const categories = ['All', 'Bollywood', 'Hollywood', 'South', 'Web Series', 'Animation', 'Cartoon'];
  
  const years = useMemo(() => {
    const startYear = new Date().getFullYear();
    const range = Array.from({ length: 17 }, (_, i) => (startYear - i).toString());
    return ['All', ...range];
  }, []);

  const displayedMovies = useMemo(() => {
    let currentPool = movies;

    if (navTab === 'saved') {
      currentPool = movies.filter(m => bookmarkedIds.includes(m.id));
    } else if (navTab === 'discover') {
      currentPool = discoverMovies;
    }

    return currentPool.filter(movie => {
      const matchesGenre = 
        navTab !== 'home' || 
        activeGenre === 'All' || 
        movie.genres.includes(activeGenre);

      const matchesCategory = 
        navTab !== 'home' || 
        activeCategory === 'All' || 
        movie.genres.includes(activeCategory);

      const matchesYear = 
        selectedYear === 'All' || 
        movie.releaseYear.toString() === selectedYear;

      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesGenre && matchesCategory && matchesYear && matchesSearch;
    });
  }, [activeGenre, activeCategory, selectedYear, searchQuery, movies, navTab, bookmarkedIds, discoverMovies]);

  const latestMovie = useMemo(() => {
    return movies.length > 0 ? movies[0] : null;
  }, [movies]);

  const viewTitle = useMemo(() => {
    if (navTab === 'saved') return { label: 'Saved Collection', icon: <BookmarkIcon className="w-5 h-5 text-primary" /> };
    if (navTab === 'discover') return { label: 'Pick for You', icon: <Sparkles className="w-5 h-5 text-primary" /> };
    
    let label = 'Trending Content';
    if (activeGenre !== 'All' && activeCategory !== 'All') {
      label = `${activeGenre} in ${activeCategory}`;
    } else if (activeGenre !== 'All') {
      label = `${activeGenre} Highlights`;
    } else if (activeCategory !== 'All') {
      label = `${activeCategory} Collection`;
    }

    return { 
      label,
      icon: <TrendingUp className="w-5 h-5 text-primary" /> 
    };
  }, [navTab, activeGenre, activeCategory]);

  const handleSearchIconClick = () => {
    if (navTab !== 'home') {
      setNavTab('home');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      searchInputRef.current?.focus();
    }
  };

  const handleSidebarCategorySelect = (category: string) => {
    setNavTab('home');
    if (genres.includes(category)) {
      setActiveGenre(category);
      setActiveCategory('All');
    } else {
      setActiveCategory(category);
      setActiveGenre('All');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSidebarHomeClick = () => {
    setNavTab('home');
    setActiveGenre('All');
    setActiveCategory('All');
    setSelectedYear('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050505] pb-32 max-w-[420px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      <Header 
        onSearchClick={handleSearchIconClick} 
        onCategorySelect={handleSidebarCategorySelect}
        onHomeClick={handleSidebarHomeClick}
      />
      
      {navTab === 'home' && latestMovie && (
        <NewReleaseToast 
          movieName={`${latestMovie.title} - Now Streaming!`} 
          onWatch={() => setSelectedMovie(latestMovie)}
        />
      )}

      <main>
        {navTab === 'home' && (
          <>
            <div className="px-5 mb-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-primary transition-colors" />
                <Input 
                  ref={searchInputRef}
                  placeholder="Search movies, series..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#121212] border-white/5 h-12 rounded-2xl pl-11 text-white placeholder:text-[#555] focus-visible:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Row 1: Genres */}
            <div className="px-5 mb-1.5 flex items-center gap-2">
              <div className="text-[10px] font-black text-[#444] uppercase tracking-wider">Genres</div>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="flex gap-2.5 px-5 mb-4 overflow-x-auto no-scrollbar py-1">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border ${
                    activeGenre === genre 
                      ? "bg-primary text-black border-primary shadow-[0_5px_10px_rgba(0,229,255,0.15)]" 
                      : "bg-[#121212] text-[#8b95a5] border-white/5 hover:border-white/20"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Row 2: Categories + Year Dropdown */}
            <div className="px-5 mb-1.5 flex items-center gap-2">
              <div className="text-[10px] font-black text-[#444] uppercase tracking-wider">Categories</div>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="flex items-center gap-3 px-5 mb-8">
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1 pr-2 border-r border-white/5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border ${
                      activeCategory === cat 
                        ? "bg-primary text-black border-primary shadow-[0_5px_10px_rgba(0,229,255,0.15)]" 
                        : "bg-[#121212] text-[#8b95a5] border-white/5 hover:border-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="w-24 shrink-0">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-[#121212] border-white/5 h-9 rounded-xl text-[11px] font-black text-white focus:ring-primary/30">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/10 text-white min-w-[120px]">
                    {years.map(year => (
                      <SelectItem key={year} value={year} className="focus:bg-primary focus:text-black font-bold text-[12px]">
                        {year === 'All' ? 'Year: All' : year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <h3 className="text-[16px] font-black flex items-center gap-2">
              {viewTitle.icon}
              {viewTitle.label}
              {selectedYear !== 'All' && navTab === 'home' && (
                <span className="text-primary/60 text-[13px]">({selectedYear})</span>
              )}
            </h3>
            {(activeGenre !== 'All' || activeCategory !== 'All' || selectedYear !== 'All') && navTab === 'home' && (
               <button 
                onClick={() => { setActiveGenre('All'); setActiveCategory('All'); setSelectedYear('All'); }}
                className="text-[10px] font-black text-[#555] hover:text-white transition-colors underline underline-offset-4"
               >
                 RESET FILTERS
               </button>
            )}
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
                    : 'Try selecting a different year or category.'}
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