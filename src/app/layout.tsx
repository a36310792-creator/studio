import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { GlobalAdScript } from '@/components/ads/GlobalAdScript';

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
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="d834ecb04445436012b4b06b1ed95c08683273d5" content="d834ecb04445436012b4b06b1ed95c08683273d5" />
        <meta name="google-site-verification" content="snafVVUtWPoIl1CcuWj2frOMDTLiqkswr3cvkWuISJY" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {/* CRITICAL: Global Ad Injection Logic */}
          <GlobalAdScript />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
