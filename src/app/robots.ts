import { MetadataRoute } from 'next'

/**
 * @fileOverview Robots.txt configuration for MP4VEGA.
 * Directs search engine crawlers to the dynamic sitemap and secures admin paths.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mp4vega.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
