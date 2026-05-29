'use server';
/**
 * @fileOverview An AI flow that fetches/predicts movie metadata based on a title.
 * 
 * - fetchMovieMetadata - A function that provides movie details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchMovieMetadataInputSchema = z.object({
  title: z.string().describe('The title of the movie or TV show to fetch details for.'),
});

const FetchMovieMetadataOutputSchema = z.object({
  posterUrl: z.string().url().describe('A high-quality poster image URL.'),
  rating: z.number().min(0).max(10).describe('IMDb or average rating.'),
  releaseYear: z.number().describe('The release year.'),
  genres: z.array(z.string()).describe('List of genres.'),
  description: z.string().describe('A compelling synopsis.'),
  audio: z.string().describe('Likely audio languages (e.g., Hindi, English).'),
  quality: z.enum(['HD', '4K', 'CAM']).default('HD'),
});

export type FetchMovieMetadataOutput = z.infer<typeof FetchMovieMetadataOutputSchema>;

export async function fetchMovieMetadata(input: {title: string}): Promise<FetchMovieMetadataOutput> {
  const {output} = await ai.generate({
    prompt: `You are a movie database assistant. Provide accurate metadata for the movie or show titled: "${input.title}". 
    Use placeholder images from Unsplash or similar if you don't have a direct URL, but try to be as accurate as possible.
    For the posterUrl, use a high quality image search compatible URL or a picsum/unsplash placeholder that matches the vibe.`,
    input: input,
    output: {schema: FetchMovieMetadataOutputSchema},
  });

  if (!output) throw new Error('Could not fetch movie details.');
  return output;
}
