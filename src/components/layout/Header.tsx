import React from 'react';
import { Search, Menu, Home, Settings, Film, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { SponsoredAd } from '@/components/ads/SponsoredAd';

interface HeaderProps {
  onSearchClick?: () => void;
  onCategorySelect?: (category: string) => void;
  onHomeClick?: () => void;
}

const CATEGORIES = [
  'Action', 'Horror', 'Anime', 'Sci-Fi',
  'Bollywood', 'Web Series', 'Hollywood', 'South', 'Animation', 'Cartoon'
];

export const Header = ({ onSearchClick, onCategorySelect, onHomeClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-center px-5 py-6 bg-background/80 backdrop-blur-2xl border-b border-white/5">
      {/* Sidebar Menu (Absolute positioned left) */}
      <div className="absolute left-5">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-[#121212] hover:bg-white/10 text-[#8b95a5] hover:text-primary w-9 h-9 border-none transition-all"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#050505] border-white/5 p-0 w-72 overflow-y-auto no-scrollbar">
            <SheetHeader className="p-6 border-b border-white/5">
              <SheetTitle className="text-left">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                    <span className="text-white">MP4</span>
                    <span className="text-primary">VEGA</span>
                  </h1>
                  <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mt-1">Premium Streaming</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex flex-col py-4">
              <div className="px-6 py-2">
                <p className="text-[10px] font-black text-[#444] uppercase tracking-[2px] mb-4">Main Navigation</p>
                <nav className="space-y-1">
                  <SheetClose asChild>
                    <button 
                      onClick={onHomeClick}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-[#8b95a5] group-hover:text-primary" />
                        <span className="font-bold text-sm text-white">Home</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#222]" />
                    </button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      href="/admin/login" 
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-[#8b95a5] group-hover:text-primary" />
                        <span className="font-bold text-sm text-white">Admin Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#222]" />
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button 
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-[#8b95a5] group-hover:text-primary" />
                        <span className="font-bold text-sm text-white">Request Movie</span>
                      </div>
                      <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase">Soon</span>
                    </button>
                  </SheetClose>
                </nav>
              </div>

              <div className="px-6 py-4">
                <SponsoredAd />
              </div>

              <div className="px-6 py-6 border-t border-white/5 mt-4">
                <p className="text-[10px] font-black text-[#444] uppercase tracking-[2px] mb-4">Categories</p>
                <div className="grid grid-cols-1 gap-1">
                  {CATEGORIES.map((cat) => (
                    <SheetClose key={cat} asChild>
                      <button 
                        onClick={() => onCategorySelect?.(cat)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 group transition-all text-sm font-bold text-[#8b95a5] hover:text-white text-left"
                      >
                        <Film className="w-4 h-4 text-[#333] group-hover:text-primary" />
                        {cat}
                      </button>
                    </SheetClose>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[11px] font-bold text-[#8b95a5] leading-relaxed">
                  Enjoy the latest 4K content with <span className="text-primary">MP4VEGA</span>. Fast downloads, premium speed.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

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
          onClick={onSearchClick}
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