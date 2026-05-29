"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { MovieCard, type Movie } from '@/components/movie/MovieCard';
import { CineSuggest } from '@/components/movie/CineSuggest';
import { NewReleaseToast } from '@/components/movie/NewReleaseToast';
import { TrendingUp, ChevronRight } from 'lucide-react';

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Hathras Season 1',
    posterUrl: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 8.5,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'Hindi Dubbed',
  },
  {
    id: '2',
    title: 'Karuppu: Echoes',
    posterUrl: 'https://images.unsplash.com/photo-1505506874110-6a7a4c9891ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 7.2,
    quality: '4K',
    releaseYear: 2026,
    audio: 'Multi Audio',
  },
  {
    id: '3',
    title: 'Krishnavatara',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 6.8,
    quality: 'CAM',
    releaseYear: 2026,
    audio: 'Dual Audio',
  },
  {
    id: '4',
    title: 'The Z Effect',
    posterUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 9.1,
    quality: 'HD',
    releaseYear: 2026,
    audio: 'English Sub',
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = [
    { id: 'trending', label: '🔥 Trending' },
    { id: 'movies', label: '🎬 Movies' },
    { id: 'web-series', label: '📺 Web Series' },
    { id: 'anime', label: '✨ Anime' },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] pb-32 max-w-[420px] mx-auto shadow-2xl overflow-x-hidden">
      <Header />
      
      <NewReleaseToast movieName="Avatar: The Way of Water" />

      <main>
        {/* Scrollable Tabs */}
        <div className="flex gap-2.5 px-5 mb-6 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? "bg-primary text-black" 
                  : "bg-[#1a1a1a] text-[#8b95a5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Suggest Section */}
        <CineSuggest />

        {/* Content Section */}
        <section className="px-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[16px] font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Latest Updates
            </h3>
            <button className="text-[12px] font-bold text-primary flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
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