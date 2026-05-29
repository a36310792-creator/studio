'use server';
/**
 * @fileOverview An AI assistant that recommends movies or shows based on user's mood or genre vibe.
 *
 * - smartCineSuggestRecommendations - A function that handles the movie/show recommendation process.
 * - SmartCineSuggestRecommendationsInput - The input type for the smartCineSuggestRecommendations function.
 * - SmartCineSuggestRecommendationsOutput - The return type for the smartCineSuggestRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCineSuggestRecommendationsInputSchema = z.object({
  moodOrGenreVibe: z
    .string()
    .describe(
      'A natural language description of the user\'s current mood or desired genre vibe (e.g., "something light and funny," "a dark, gritty thriller").'
    ),
});
export type SmartCineSuggestRecommendationsInput = z.infer<
  typeof SmartCineSuggestRecommendationsInputSchema
>;

const SmartCineSuggestRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('The title of the movie or show.'),
      description: z
        .string()
        .describe('A brief summary or synopsis of the movie/show.'),
      genres: z.array(z.string()).describe('Primary genres of the content.'),
      releaseYear: z.number().describe('The release year of the content.'),
      rating: z
        .number()
        .min(0)
        .max(10)
        .describe('An estimated rating out of 10.'),
      quality: z
        .enum(['HD', '4K', 'CAM'])
        .describe('The video quality (HD, 4K, or CAM).'),
      audioLanguage: z
        .string()
        .describe('The main audio language (e.g., "English", "Hindi Dubbed", "Dual Audio").'),
      isSeries: z
        .boolean()
        .describe('True if the content is a TV series, false if it is a movie.'),
      posterImageUrl: z
        .string()
        .url()
        .describe('A placeholder URL for the poster image.'),
    })
  ),
});
export type SmartCineSuggestRecommendationsOutput = z.infer<
  typeof SmartCineSuggestRecommendationsOutputSchema
>;

export async function smartCineSuggestRecommendations(
  input: SmartCineSuggestRecommendationsInput
): Promise<SmartCineSuggestRecommendationsOutput> {
  return smartCineSuggestRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartCineSuggestRecommendationsPrompt',
  input: {schema: SmartCineSuggestRecommendationsInputSchema},
  output: {schema: SmartCineSuggestRecommendationsOutputSchema},
  prompt: `You are an AI assistant named CineSuggest that recommends movies and TV shows based on a user's mood or desired genre vibe.

The user will provide a description of their current mood or the kind of content they want to watch. Your task is to analyze this input and suggest 3-5 relevant movies or TV shows that perfectly match their preferences.

For each recommendation, provide the title, a brief description, primary genres, release year, an estimated rating out of 10, the video quality (choose from 'HD', '4K', or 'CAM'), the main audio language, whether it's a series (true/false), and a placeholder URL for the poster image (e.g., 'https://example.com/poster1.jpg'). Ensure the placeholder URLs are unique.

Here is the user's mood or genre vibe description:
"""{{{moodOrGenreVibe}}}"""
`,
});

const smartCineSuggestRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartCineSuggestRecommendationsFlow',
    inputSchema: SmartCineSuggestRecommendationsInputSchema,
    outputSchema: SmartCineSuggestRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get recommendations from the AI.');
    }
    return output;
  }
);
