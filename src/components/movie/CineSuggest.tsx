"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <div className="mt-8 space-y-4 px-5">
      <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl cyan-glow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">CineSuggest AI</span>
          </div>
          <CardTitle className="text-xl">What's the vibe today?</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Describe your mood and I'll find the perfect match.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSuggest} className="flex gap-2">
            <Input
              placeholder="e.g. Gritty space thriller or happy anime..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="bg-background/50 border-white/5 h-11"
            />
            <Button disabled={isLoading} className="h-11 px-6 shadow-lg shadow-primary/20">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask'}
            </Button>
          </form>

          {results && results.recommendations.length > 0 && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">My Top Picks:</div>
              {results.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group transition-all hover:bg-white/10">
                  <div className="w-16 h-20 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${rec.title}/100/150`} 
                      className="w-full h-full object-cover" 
                      alt={rec.title} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{rec.title}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{rec.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-primary">{rec.quality}</span>
                      <span className="text-[10px] text-muted-foreground">{rec.releaseYear}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                      <Play className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};