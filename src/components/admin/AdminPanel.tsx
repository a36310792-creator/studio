"use client";

import React from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for adding movie will go here
    onClose();
  };

  return (
    <div className="mx-5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#121212] border border-primary rounded-2xl p-5 shadow-2xl relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-primary font-bold text-[16px] flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Add New Movie
          </h3>
          <button onClick={onClose} className="text-[#8b95a5] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input 
            placeholder="Movie Name (e.g. Avatar)" 
            required 
            className="bg-[#050505] border-[#333] h-12 rounded-xl text-white placeholder:text-[#555]"
          />
          
          <Input 
            type="url" 
            placeholder="Poster Image URL" 
            required 
            className="bg-[#050505] border-[#333] h-12 rounded-xl text-white placeholder:text-[#555]"
          />
          
          <Input 
            type="url" 
            placeholder="Movie Download/Watch Link" 
            required 
            className="bg-[#050505] border-[#333] h-12 rounded-xl text-white placeholder:text-[#555]"
          />
          
          <div className="flex gap-3">
            <Input 
              placeholder="Quality (HD/4K)" 
              required 
              className="flex-1 bg-[#050505] border-[#333] h-12 rounded-xl text-white placeholder:text-[#555]"
            />
            <Input 
              placeholder="Rating (e.g. 8.5)" 
              required 
              className="flex-1 bg-[#050505] border-[#333] h-12 rounded-xl text-white placeholder:text-[#555]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary text-black font-extrabold text-[14px] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_5px_15px_rgba(0,229,255,0.2)]"
          >
            Publish Movie 🚀
          </Button>
        </form>
      </div>
    </div>
  );
};
