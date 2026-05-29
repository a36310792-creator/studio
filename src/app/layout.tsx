
import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'MP4VEGA - Premium Movie Downloads',
  description: 'Fastest 4K movie streaming and direct download experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
        
        {/* Anti-Adblock Protection - Loaded with lazyOnload to ensure no interference with player or core UI */}
        <Script 
          src="https://commendtwisted.com/11/f8/cd/11f8cdd1ff10792fecc6b0787fd19c7f.js" 
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
