import React from 'react';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-1">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-0.5">
          Lumina<span className="text-primary">Stream</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="icon" className="rounded-full bg-card hover:bg-white/10 text-white w-10 h-10 border-none">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full bg-card hover:bg-white/10 text-white w-10 h-10 border-none">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};