
"use client";

import React from 'react';
import { Home, Compass, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'HOME', href: '/' },
    { id: 'discover', icon: Compass, label: 'DISCOVER', href: '#' },
    { id: 'saved', icon: Bookmark, label: 'SAVED', href: '#' },
    { id: 'settings', icon: Settings, label: 'SETTINGS', href: '/admin/login' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100]">
      <nav className="glass-nav rounded-[30px] flex items-center justify-around py-4 px-2 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.id === 'home' || item.id === 'settings') {
             return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onTabChange(item.id)}
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
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
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
