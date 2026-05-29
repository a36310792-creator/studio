"use client";

import React, { useState } from 'react';
import { Home, Compass, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'watchlist', icon: Bookmark, label: 'Watchlist' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[400px] z-[100]">
      <nav className="glass-nav rounded-full flex items-center justify-around py-3 px-6 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]")} />
              <span className={cn("text-[10px] font-bold uppercase tracking-wider", !isActive && "hidden")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};