'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @fileOverview Global monetization script injector.
 * Loads the multi-tag video ad script on all pages EXCEPT the homepage.
 */
export function GlobalAdScript() {
  const pathname = usePathname();

  useEffect(() => {
    // CRITICAL: Homepage exclusion logic
    if (pathname === '/') return;

    const script = document.createElement('script');
    // Using the common multi-tag distribution endpoint
    script.src = 'https://bolted-scolding.com/f7/a2/63/f7a2631079204445436012b4b06b1ed9';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [pathname]);

  return null;
}
