'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { TrendingUp, Film, Search, Sparkles, Bookmark as BookmarkIcon, ChevronDown, ArrowDownWideNarrow, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SponsoredAd } from '@/components/ads/SponsoredAd';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function Home() {
  const db = useFirestore();
  const router = useRouter();
  
  const moviesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'movies'), orderBy('title', 'asc'));
  }, [db]);

  const { data: firestoreMovies, loading: firestoreLoading } = useCollection<Movie>(moviesQuery);
  
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [navTab, setNavTab] = useState('home');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

  const genres = ['All', 'Action', 'Horror', 'Anime', 'Sci-Fi'];
  const categories = ['All', 'Bollywood', 'Hollywood', 'South', 'Web Series', 'Animation', 'Cartoon'];
  
  const years = useMemo(() => {
    const startYear = new Date().getFullYear();
    const range = Array.from({ length: 17 }, (_, i) => (startYear - i).toString());
    return ['All', ...range];
  }, []);

  const allFilteredMovies = useMemo(() => {
    if (!firestoreMovies) return [];
    
    let currentPool = [...firestoreMovies];

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

  const handleMovieClick = (movie: Movie) => {
    setTimeout(() => { window.open('https://bold-consequence.com/kYQwC9', '_blank'); }, 50);
    router.push(`/download/${movie.id}`);
  };

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
    <div className="relative min-h-screen bg-[#050505] pb-32 max-w-[420px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5 font-body">
      <Header 
        onSearchClick={handleSearchIconClick} 
        onCategorySelect={handleSidebarCategorySelect}
        onHomeClick={handleSidebarHomeClick}
      />
      
      {navTab === 'home' && firestoreMovies && firestoreMovies.length > 0 && (
        <NewReleaseToast 
          movieName={`${firestoreMovies[0].title} - Now Streaming!`} 
          onWatch={() => handleMovieClick(firestoreMovies[0])}
        />
      )}

      <main className="animate-in fade-in duration-700">
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
                  className="bg-[#0a0a0a] border-white/5 h-14 rounded-2xl pl-12 text-white placeholder:text-[#444] focus-visible:ring-primary/30 transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="px-5 mb-8">
              <SponsoredAd />
            </div>

            <div className="flex gap-2.5 px-5 mb-4 overflow-x-auto no-scrollbar py-1">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => { setActiveGenre(genre); setVisibleCount(10); }}
                  className={`px-5 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all border ${
                    activeGenre === genre 
                      ? "bg-primary text-black border-primary shadow-[0_8px_20px_rgba(0,229,255,0.2)] scale-105" 
                      : "bg-[#111] text-[#8b95a5] border-white/5 hover:border-white/20 hover:bg-[#151515]"
                  }`}
                >
                  {genre.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 px-5 mb-8">
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1 pr-2 border-r border-white/5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(10); }}
                    className={`px-4 py-2.5 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all border ${
                      activeCategory === cat 
                        ? "bg-primary/10 text-primary border-primary/30" 
                        : "bg-[#111] text-[#666] border-white/5 hover:text-white"
                  }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="w-24 shrink-0">
                <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setVisibleCount(10); }}>
                  <SelectTrigger className="bg-[#111] border-white/5 h-10 rounded-2xl text-[10px] font-black text-white focus:ring-primary/20">
                    <SelectValue placeholder="YEAR" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {years.map(year => (
                      <SelectItem key={year} value={year} className="focus:bg-primary focus:text-black font-bold text-[11px]">
                        {year === 'All' ? 'YEAR: ALL' : year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        <section className="px-5 min-h-[400px]">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[17px] font-black flex items-center gap-2 tracking-tight italic">
                {viewTitle.icon}
                <span className="uppercase">{viewTitle.label}</span>
              </h3>
            </div>
            
            <div className="flex items-center justify-between bg-[#0a0a0a] p-2 rounded-2xl border border-white/5 shadow-inner">
               <div className="flex items-center gap-2 px-3">
                 <ArrowDownWideNarrow className="w-4 h-4 text-primary" />
                 <span className="text-[9px] font-black text-[#555] uppercase tracking-[2px]">Sort Library</span>
               </div>
               <Select value={sortBy} onValueChange={setSortBy}>
                 <SelectTrigger className="bg-transparent border-none h-9 w-[150px] text-[10px] font-black text-white focus:ring-0">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="bg-[#111] border-white/10 text-white">
                   <SelectItem value="latest" className="focus:bg-primary focus:text-black font-bold text-[10px] uppercase">Latest Added</SelectItem>
                   <SelectItem value="rating" className="focus:bg-primary focus:text-black font-bold text-[10px] uppercase">Highest Rated</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {firestoreLoading ? (
            <div className="grid grid-cols-2 gap-[15px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-[2/3] rounded-2xl shimmer" />
                  <Skeleton className="h-4 w-3/4 rounded-full shimmer" />
                  <Skeleton className="h-3 w-1/2 rounded-full shimmer" />
                </div>
              ))}
            </div>
          ) : displayedMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-[15px]">
                {displayedMovies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onSelect={handleMovieClick}
                    onToggleBookmark={toggleBookmark}
                    isBookmarked={bookmarkedIds.includes(movie.id)}
                  />
                ))}
              </div>
              
              {allFilteredMovies.length > visibleCount && (
                <div className="mt-14 mb-8 flex justify-center">
                  <Button 
                    onClick={loadMore}
                    variant="outline"
                    className="h-14 px-12 rounded-2xl bg-[#0a0a0a] border-primary/20 text-white font-black text-[12px] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-[0_0_30px_rgba(0,229,255,0.1)] group"
                  >
                    EXPLORE MORE
                    <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center px-10 border border-white/5 rounded-[40px] bg-[#0a0a0a]/50">
              <Film className="w-20 h-20 text-[#151515] mb-6" />
              <h4 className="text-white font-black text-xl mb-2 italic uppercase">
                {navTab === 'saved' ? 'Empty Vault' : 'No Signal Found'}
              </h4>
              <p className="text-[#555] text-xs font-bold uppercase tracking-wider max-w-[200px] leading-relaxed">
                {searchQuery 
                  ? `Zero matches for "${searchQuery.toUpperCase()}"` 
                  : navTab === 'saved' 
                    ? 'Begin bookmarking your elite content.' 
                    : 'Awaiting new server synchronization.'}
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav activeTab={navTab} onTabChange={(tab) => { setNavTab(tab); setVisibleCount(10); }} />
    </div>
  );
}
