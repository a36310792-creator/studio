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
    // Strictly DO NOT run on the homepage
    if (pathname === '/') return;

    // Safely inject the script into the DOM
    const script = document.createElement('script');
    script.src = "//sophisticatedpin.com/b/XvV/sud.GvlQ0wYLWgcc/JeHmk9EuBZKUElZkMPwTQcew/OeTAI/y-NfDbUWtsNAzxAZ5xMDjcIS0-OWQl";
    script.async = true;
    
    // Set the referrer policy as required by the provider
    script.referrerPolicy = 'no-referrer-when-downgrade';
    
    // Add the required custom settings object from the provider
    // Using type assertion since 'settings' is a provider-specific property
    (script as any).settings = {}; 

    document.body.appendChild(script);

    // Cleanup to prevent memory leaks or duplicate ads on page navigation
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [pathname]);

  return null;
}
