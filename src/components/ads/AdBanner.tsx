'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  id: string;
  html?: string;
  className?: string;
}

/**
 * AdBanner Component
 * Safely injects ad scripts or HTML tags.
 * Uses useEffect to ensure code runs only on the client to avoid hydration errors.
 */
export const AdBanner = ({ id, html, className }: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && containerRef.current && html) {
      try {
        // Create a range to parse the HTML string into a fragment
        // This method allows script tags within the HTML to be executed correctly
        const range = document.createRange();
        range.selectNode(containerRef.current);
        const fragment = range.createContextualFragment(html);
        
        // Clear existing placeholder content
        containerRef.current.innerHTML = '';
        // Append the fragment to the DOM
        containerRef.current.appendChild(fragment);
      } catch (error) {
        console.error('Failed to inject ad script:', error);
      }
    }
  }, [isMounted, html]);

  // Prevent server-side rendering of the internal container to avoid hydration mismatch
  if (!isMounted) {
    return <div className={className} style={{ minHeight: '90px' }} />;
  }

  return (
    <div className={className}>
      <div className="text-[9px] text-center text-[#444] font-black uppercase tracking-[3px] mb-1.5">
        Advertisement
      </div>
      <div 
        ref={containerRef} 
        id={id} 
        className="min-h-[90px] w-full flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 overflow-hidden transition-all hover:bg-white/[0.07]"
      >
        {!html && (
          <div className="flex flex-col items-center gap-1 opacity-20">
            <span className="text-[10px] font-black italic tracking-tighter">AD_SLOT_ACTIVE</span>
            <div className="w-12 h-0.5 bg-primary/30 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
