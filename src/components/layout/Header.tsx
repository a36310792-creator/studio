import React from 'react';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-center px-5 py-6 bg-background/80 backdrop-blur-2xl border-b border-white/5">
      {/* Centered Logo with Glowing Effect */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic select-none">
          <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">MP4</span>
          <span className="text-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.5)]">VEGA</span>
        </h1>
        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-primary to-transparent mt-0.5 opacity-50"></div>
      </div>

      {/* Action Buttons (Absolute positioned to keep logo centered) */}
      <div className="absolute right-5 flex items-center gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-[#121212] hover:bg-white/10 text-[#8b95a5] hover:text-primary w-9 h-9 border-none transition-all"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
