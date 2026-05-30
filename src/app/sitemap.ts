import { MetadataRoute } from 'next'

/**
 * @fileOverview Dynamic sitemap generator for MP4VEGA.
 * Fetches movie documents via Firestore REST API to ensure dynamic routes are indexed
 * while adhering to client-side only Firebase SDK constraints.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mp4vega.com';
  const projectId = 'studio-513450744-fa0e1';
  
  let movieEntries: MetadataRoute.Sitemap = [];
  
  try {
    // Fetch movies via REST API to stay compatible with server-side generation
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/movies?pageSize=100`,
      { 
        next: { revalidate: 3600 }, // Revalidate cache every hour
        headers: { 'Accept': 'application/json' }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      movieEntries = (data.documents || []).map((doc: any) => {
        // Extract document ID from the resource name: projects/.../databases/.../documents/movies/{id}
        const movieId = doc.name.split('/').pop();
        return {
          url: `${baseUrl}/download/${movieId}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      });
    }
  } catch (error) {
    // Fallback to static routes if API fetch fails
    console.error('Sitemap dynamic fetch failed:', error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...movieEntries,
  ];
}
