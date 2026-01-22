'use server';

/**
 * @fileOverview Predicts the estimated time of departure (ETA) for containers based on their attributes.
 *
 * - predictContainerETA - A function that predicts the ETA for a container.
 * - PredictContainerETAInput - The input type for the predictContainerETA function.
 * - PredictContainerETAOutput - The return type for the predictContainerETA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictContainerETAInputSchema = z.object({
  arrivalTimestamp: z.string().describe('The arrival timestamp of the container (ISO format).'),
  cargoType: z.string().describe('The type of cargo in the container.'),
  priority: z.string().describe('The priority level of the container (e.g., high, medium, low).'),
  size: z.string().describe('The size of the container (e.g., 20ft, 40ft).'),
});
export type PredictContainerETAInput = z.infer<typeof PredictContainerETAInputSchema>;

const PredictContainerETAOutputSchema = z.object({
  predictedETA: z.string().describe('The predicted estimated time of departure (ETA) in ISO format.'),
  reasoning: z.string().describe('The reasoning behind the predicted ETA.'),
});
export type PredictContainerETAOutput = z.infer<typeof PredictContainerETAOutputSchema>;

export async function predictContainerETA(input: PredictContainerETAInput): Promise<PredictContainerETAOutput> {
  return predictContainerETAFlow(input);
}

const predictContainerETAPrompt = ai.definePrompt({
  name: 'predictContainerETAPrompt',
  input: {schema: PredictContainerETAInputSchema},
  output: {schema: PredictContainerETAOutputSchema},
  prompt: `You are an expert in port logistics, specializing in predicting container ETAs.

  Based on the container's attributes, predict its estimated time of departure (ETA).
  Consider factors like arrival time, cargo type, priority, and size when making your prediction.
  Provide a brief explanation of your reasoning.

  Arrival Time: {{{arrivalTimestamp}}}
  Cargo Type: {{{cargoType}}}
  Priority: {{{priority}}}
  Size: {{{size}}}

  Format the predicted ETA in ISO format (YYYY-MM-DDTHH:mm:ssZ).
  `, 
});

const predictContainerETAFlow = ai.defineFlow(
  {
    name: 'predictContainerETAFlow',
    inputSchema: PredictContainerETAInputSchema,
    outputSchema: PredictContainerETAOutputSchema,
  },
  async input => {
    const {output} = await predictContainerETAPrompt(input);
    return output!;
  }
);
