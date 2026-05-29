"use client";

import React, { useState } from 'react';
import { Home, Compass, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'HOME' },
    { id: 'discover', icon: Compass, label: 'DISCOVER' },
    { id: 'saved', icon: Bookmark, label: 'SAVED' },
    { id: 'settings', icon: Settings, label: 'SETTINGS' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100]">
      <nav className="glass-nav rounded-[30px] flex items-center justify-around py-4 px-2 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 min-w-[60px]",
                isActive ? "text-primary scale-105" : "text-[#8b95a5] hover:text-white"
              )}
            >
              <Icon className={cn("w-[22px] h-[22px]", isActive && "drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]")} />
              <span className={cn(
                "text-[9px] font-bold transition-opacity duration-300", 
                isActive ? "opacity-100" : "opacity-0 h-0"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};