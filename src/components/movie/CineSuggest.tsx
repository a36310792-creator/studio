"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { smartCineSuggestRecommendations, type SmartCineSuggestRecommendationsOutput } from '@/ai/flows/smart-cinesuggest-recommendations';

export const CineSuggest = () => {
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SmartCineSuggestRecommendationsOutput | null>(null);

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsLoading(true);
    try {
      const response = await smartCineSuggestRecommendations({ moodOrGenreVibe: mood });
      setResults(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-5 mb-8">
      <div className="bg-gradient-to-br from-[#111a22] to-[#0a0f14] border border-primary/20 rounded-2xl p-5 shadow-2xl cyan-glow">
        <div className="flex items-center gap-1.5 text-primary text-[10px] font-extrabold uppercase tracking-widest mb-2.5">
          <Sparkles className="w-3 h-3" />
          CINESUGGEST AI
        </div>
        <h3 className="text-[18px] font-bold mb-1">What's the vibe today?</h3>
        <p className="text-[11px] text-[#8b95a5] mb-4">
          Describe your mood and I'll find the perfect match.
        </p>
        <form onSubmit={handleSuggest} className="flex bg-black border border-[#333] rounded-full p-1.5 gap-2">
          <Input
            placeholder="e.g. Gritty space thriller..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-transparent border-none h-9 text-[12px] focus-visible:ring-0 placeholder:text-[#555] px-3 flex-1"
          />
          <Button 
            disabled={isLoading} 
            className="bg-primary text-black rounded-full px-5 py-0 h-9 font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
          </Button>
        </form>

        {results && results.recommendations.length > 0 && (
          <div className="mt-5 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            {results.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-16 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${rec.title}/100/150`} 
                    className="w-full h-full object-cover" 
                    alt={rec.title} 
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-[12px] font-bold truncate text-white">{rec.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-primary uppercase">{rec.quality}</span>
                    <span className="text-[9px] text-[#8b95a5]">{rec.releaseYear}</span>
                  </div>
                </div>
                <div className="flex items-center pr-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-primary hover:bg-primary/10">
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};