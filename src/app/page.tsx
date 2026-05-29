'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdPopup } from '@/components/ads/AdPopup';
import { AdFloating } from '@/components/ads/AdFloating';
import { TrendingUp, Film, Search, Sparkles, Bookmark as BookmarkIcon, Calendar, ArrowDownWideNarrow, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

const MOCK_MOVIES: Movie[] = [
  {
    id: 'hathras-1',
    title: 'Hathras',
    posterUrl: 'https://picsum.photos/seed/hathras/400/600',
    rating: 8.2,
    quality: 'HD',
    releaseYear: 2024,
    audio: 'Hindi',
    genres: ['Thriller', 'Drama', 'Bollywood'],
    description: 'A gripping investigative thriller based on true events.',
    watchUrl: '#',
    directDownloadUrl: '#'
  },
  {
    id: 'karuppu-2',
    title: 'Karuppu',
    posterUrl: 'https://picsum.photos/seed/karuppu/400/600',
    rating: 7.9,
    quality: '4K',
    releaseYear: 2024,
    audio: 'Tamil',
    genres: ['Action', 'Thriller', 'South'],
    description: 'An intense action drama from the heart of South India.',
    watchUrl: '#',
    directDownloadUrl: '#'
  },
  {
    id: 'zeffect-3',
    title: 'The Z Effect',
    posterUrl: 'https://picsum.photos/seed/zeffect/400/600',
    rating: 8.5,
    quality: '4K',
    releaseYear: 2024,
    audio: 'English',
    genres: ['Sci-Fi', 'Horror', 'Hollywood'],
    description: 'A terrifying sci-fi experience that challenges reality.',
    watchUrl: '#',
    directDownloadUrl: '#'
  },
  {
    id: 'mirzapur-4',
    title: 'Mirzapur S3',
    posterUrl: 'https://picsum.photos/seed/mirzapur/400/600',
    rating: 9.1,
    quality: '4K',
    releaseYear: 2024,
    audio: 'Hindi',
    genres: ['Action', 'Web Series', 'Bollywood'],
    description: 'The throne of Mirzapur remains contested as the violence escalates.',
    watchUrl: '#',
    directDownloadUrl: '#'
  }
];

const BANNER_LINK = "https://www.effectivecpmnetwork.com/qv4i5feg5?key=9e0c9d5168b1b5d5c511beb784e7b727";
const SMART_LINK = "https://www.effectivecpmnetwork.com/ypda0qnck?key=83f34bb8cadc279963122cc4a80ebebf";

const ROTATION_LINKS = [
  "https://www.effectivecpmnetwork.com/x44bmppn50?key=3d6bef97902a908afb5bcaaa95bf2bed",
  "https://www.effectivecpmnetwork.com/an3xbf8yd?key=7134258fbe58dce7138f6cea55418995"
];

export default function Home() {
  const db = useFirestore();
  const moviesQuery = useMemo(() => {
    if (!db) return null;
    return collection(db, 'movies');
  }, [db]);

  const { data: firestoreMovies, loading } = useCollection<Movie>(moviesQuery);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [navTab, setNavTab] = useState('home');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [forceShow, setForceShow] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lumina_bookmarks');
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
    const timer = setTimeout(() => setForceShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newBookmarks = bookmarkedIds.includes(id) 
      ? bookmarkedIds.filter(bid => bid !== id)
      : [...bookmarkedIds, id];
    
    setBookmarkedIds(newBookmarks);
    localStorage.setItem('lumina_bookmarks', JSON.stringify(newBookmarks));
  };

  const genres = ['All', 'Action', 'Horror', 'Anime', 'Sci-Fi'];
  const categories = ['All', 'Bollywood', 'Hollywood', 'South', 'Web Series', 'Animation', 'Cartoon'];
  
  const years = useMemo(() => {
    const startYear = new Date().getFullYear();
    const range = Array.from({ length: 17 }, (_, i) => (startYear - i).toString());
    return ['All', ...range];
  }, []);

  const allFilteredMovies = useMemo(() => {
    let currentPool = firestoreMovies && firestoreMovies.length > 0 ? firestoreMovies : MOCK_MOVIES;

    if (navTab === 'saved') {
      currentPool = currentPool.filter(m => bookmarkedIds.includes(m.id));
    } else if (navTab === 'discover') {
      currentPool = [...currentPool].sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    let filtered = currentPool.filter(movie => {
      const movieGenres = movie.genres || [];
      const matchesGenre = 
        navTab !== 'home' || 
        activeGenre === 'All' || 
        movieGenres.includes(activeGenre);

      const matchesCategory = 
        navTab !== 'home' || 
        activeCategory === 'All' || 
        movieGenres.includes(activeCategory);

      const matchesYear = 
        selectedYear === 'All' || 
        movie.releaseYear?.toString() === selectedYear;

      const matchesSearch = !searchQuery || movie.title?.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesGenre && matchesCategory && matchesYear && matchesSearch;
    });

    if (sortBy === 'latest') {
      filtered.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [activeGenre, activeCategory, selectedYear, searchQuery, firestoreMovies, navTab, bookmarkedIds, sortBy]);

  const displayedMovies = useMemo(() => {
    return allFilteredMovies.slice(0, visibleCount);
  }, [allFilteredMovies, visibleCount]);

  const latestMovie = useMemo(() => {
    const pool = firestoreMovies && firestoreMovies.length > 0 ? firestoreMovies : MOCK_MOVIES;
    return pool[0];
  }, [firestoreMovies]);

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

    return { label, icon: <TrendingUp className="w-5 h-5 text-primary" /> };
  }, [navTab, activeGenre, activeCategory]);

  const handleSearchIconClick = () => {
    if (navTab !== 'home') {
      setNavTab('home');
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      searchInputRef.current?.focus();
    }
  };

  const handleSidebarCategorySelect = (category: string) => {
    setNavTab('home');
    setVisibleCount(10);
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
    setVisibleCount(10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadMore = () => setVisibleCount(prev => prev + 10);

  return (
    <div className="relative min-h-screen bg-[#050505] pb-32 max-w-[420px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      <AdPopup hrefs={[SMART_LINK, ...ROTATION_LINKS]} />
      <AdFloating hrefs={[SMART_LINK, ...ROTATION_LINKS]} />
      <AdFloating hrefs={ROTATION_LINKS} side="left" />
      
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

            <div className="px-5 mb-6">
              <AdBanner id="home-top-banner" hrefs={[BANNER_LINK, ...ROTATION_LINKS]} className="w-full" />
            </div>

            <div className="px-5 mb-1.5 flex items-center gap-2">
              <div className="text-[10px] font-black text-[#444] uppercase tracking-wider">Genres</div>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="flex gap-2.5 px-5 mb-4 overflow-x-auto no-scrollbar py-1">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => { setActiveGenre(genre); setVisibleCount(10); }}
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

            <div className="px-5 mb-1.5 flex items-center gap-2">
              <div className="text-[10px] font-black text-[#444] uppercase tracking-wider">Categories</div>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="flex items-center gap-3 px-5 mb-8">
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1 pr-2 border-r border-white/5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(10); }}
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
                <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setVisibleCount(10); }}>
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

        <section className="px-5 min-h-[400px]">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[16px] font-black flex items-center gap-2">
                {viewTitle.icon}
                {viewTitle.label}
              </h3>
              {(activeGenre !== 'All' || activeCategory !== 'All' || selectedYear !== 'All') && navTab === 'home' && (
                <button 
                  onClick={() => { setActiveGenre('All'); setActiveCategory('All'); setSelectedYear('All'); setVisibleCount(10); }}
                  className="text-[10px] font-black text-[#555] hover:text-white transition-colors underline underline-offset-4"
                >
                  RESET FILTERS
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between bg-[#121212]/50 p-2 rounded-2xl border border-white/5">
               <div className="flex items-center gap-2 px-2">
                 <ArrowDownWideNarrow className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-black text-[#555] uppercase tracking-wider">Sort Content</span>
               </div>
               <Select value={sortBy} onValueChange={setSortBy}>
                 <SelectTrigger className="bg-transparent border-none h-8 w-[140px] text-[11px] font-black text-white focus:ring-0">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="bg-[#121212] border-white/10 text-white">
                   <SelectItem value="latest" className="focus:bg-primary focus:text-black font-bold text-[11px]">LATEST ADDED</SelectItem>
                   <SelectItem value="rating" className="focus:bg-primary focus:text-black font-bold text-[11px]">HIGHEST RATED</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {displayedMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-[15px] animate-in fade-in duration-500">
                {displayedMovies.slice(0, 4).map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onSelect={setSelectedMovie}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={bookmarkedIds.includes(movie.id)}
                  />
                ))}
              </div>

              {displayedMovies.length > 4 && (
                <div className="my-8">
                  <AdBanner id="home-mid-banner" hrefs={ROTATION_LINKS} className="w-full" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-[15px] mt-4">
                {displayedMovies.slice(4).map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onSelect={setSelectedMovie}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={bookmarkedIds.includes(movie.id)}
                  />
                ))}
              </div>
              
              {allFilteredMovies.length > visibleCount && (
                <div className="mt-12 mb-8 flex justify-center">
                  <Button 
                    onClick={loadMore}
                    variant="outline"
                    className="h-12 px-10 rounded-2xl bg-[#121212] border-white/5 text-white font-black text-[12px] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl"
                  >
                    LOAD MORE MOVIES
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
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
          
          {loading && !forceShow && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          
          <div className="mt-10 space-y-6">
            <AdBanner id="home-bottom-new-1" hrefs={ROTATION_LINKS} className="w-full" />
            <AdBanner id="home-bottom-new-2" hrefs={ROTATION_LINKS} className="w-full" />
          </div>
        </section>
      </main>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      <BottomNav activeTab={navTab} onTabChange={(tab) => { setNavTab(tab); setVisibleCount(10); }} />
    </div>
  );
}