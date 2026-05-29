"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { CineSuggest } from '@/components/movie/CineSuggest';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { Play, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Hathras Season 1',
    posterUrl: 'https://picsum.photos/seed/hathras/400/600',
    rating: 8.5,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'Hindi Dubbed',
  },
  {
    id: '2',
    title: 'Karuppu: Echoes',
    posterUrl: 'https://picsum.photos/seed/karuppu/400/600',
    rating: 7.2,
    quality: '4K',
    releaseYear: 2026,
    audio: 'Multi Audio',
  },
  {
    id: '3',
    title: 'Krishnavatara',
    posterUrl: 'https://picsum.photos/seed/krishna/400/600',
    rating: 6.8,
    quality: 'CAM',
    releaseYear: 2026,
    audio: 'Dual Audio',
  },
  {
    id: '4',
    title: 'The Z Effect',
    posterUrl: 'https://picsum.photos/seed/zeffect/400/600',
    rating: 9.1,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'English Sub',
  },
  {
    id: '5',
    title: 'Shadow Realm',
    posterUrl: 'https://picsum.photos/seed/shadow/400/600',
    rating: 7.9,
    quality: '4K',
    releaseYear: 2025,
    audio: 'English',
  },
  {
    id: '6',
    title: 'Neon Nights',
    posterUrl: 'https://picsum.photos/seed/neon/400/600',
    rating: 8.2,
    quality: 'HD',
    releaseYear: 2025,
    audio: 'Japanese',
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('trending');
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-avatar')?.imageUrl || 'https://picsum.photos/seed/hero/1200/600';

  return (
    <div className="relative min-h-screen bg-background pb-32 max-w-[600px] mx-auto shadow-2xl border-x border-white/5">
      <Header />
      
      {/* Dynamic Toast Notification */}
      <NewReleaseToast movieName="Avatar: The Way of Water" />

      <main>
        {/* Hero Section */}
        <section className="px-5 mt-2">
          <div className="relative h-[220px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
            <img 
              src={heroImage} 
              alt="Avatar: Way of Water" 
              className="w-full h-full object-cover"
              data-ai-hint="avatar scifi"
            />
            <div className="hero-gradient absolute inset-0" />
            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black mb-1 leading-tight">Avatar: Way of Water</h2>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase text-white/60 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">Sci-Fi</span>
                  <span className="text-[10px] font-bold uppercase text-white/60 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">Action</span>
                  <span className="text-[10px] font-bold uppercase text-white/60 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">2023</span>
                </div>
              </div>
              <Button size="icon" className="rounded-full w-12 h-12 bg-primary text-black cyan-glow transition-transform hover:scale-110 active:scale-95">
                <Play className="w-6 h-6 fill-current" />
              </Button>
            </div>
          </div>
        </section>

        {/* Categories / Tabs */}
        <section className="mt-8 px-5">
          <Tabs defaultValue="trending" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="bg-transparent h-12 gap-3 p-0 w-full overflow-x-auto justify-start no-scrollbar">
              <TabsTrigger 
                value="trending" 
                className="rounded-full px-5 py-2.5 bg-card data-[state=active]:bg-primary data-[state=active]:text-black border-none text-xs font-bold transition-all"
              >
                🔥 Trending
              </TabsTrigger>
              <TabsTrigger 
                value="movies" 
                className="rounded-full px-5 py-2.5 bg-card data-[state=active]:bg-primary data-[state=active]:text-black border-none text-xs font-bold transition-all"
              >
                🎬 Movies
              </TabsTrigger>
              <TabsTrigger 
                value="web-series" 
                className="rounded-full px-5 py-2.5 bg-card data-[state=active]:bg-primary data-[state=active]:text-black border-none text-xs font-bold transition-all"
              >
                📺 Web Series
              </TabsTrigger>
              <TabsTrigger 
                value="anime" 
                className="rounded-full px-5 py-2.5 bg-card data-[state=active]:bg-primary data-[state=active]:text-black border-none text-xs font-bold transition-all"
              >
                ✨ Anime
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        {/* AI Suggest Section */}
        <CineSuggest />

        {/* Content Grid */}
        <section className="mt-10 px-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Latest Updates
            </h3>
            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {MOCK_MOVIES.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
