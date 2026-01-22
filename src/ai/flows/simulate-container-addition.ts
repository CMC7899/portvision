'use server';

/**
 * @fileOverview Simulates the addition of a specified number of containers with a defined mix of sizes, cargo types, and priorities.
 *
 * - simulateContainerAddition - A function that simulates container addition and returns congestion heatmap and estimated relocations.
 * - SimulateContainerAdditionInput - The input type for the simulateContainerAddition function.
 * - SimulateContainerAdditionOutput - The return type for the simulateContainerAddition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateContainerAdditionInputSchema = z.object({
  numberOfContainers: z.number().describe('The number of containers to simulate adding.'),
  sizeMix: z.record(z.number()).describe('A record defining the mix of container sizes (e.g., {small: 0.3, medium: 0.4, large: 0.3}).'),
  cargoTypeMix: z.record(z.number()).describe('A record defining the mix of cargo types (e.g., {electronics: 0.5, perishables: 0.5}).'),
  priorityMix: z.record(z.number()).describe('A record defining the mix of container priorities (e.g., {high: 0.2, medium: 0.5, low: 0.3}).'),
});
export type SimulateContainerAdditionInput = z.infer<typeof SimulateContainerAdditionInputSchema>;

const SimulateContainerAdditionOutputSchema = z.object({
  congestionHeatmap: z.string().describe('A textual representation of the congestion heatmap.'),
  estimatedRelocations: z.number().describe('The estimated number of relocations that would occur.'),
});
export type SimulateContainerAdditionOutput = z.infer<typeof SimulateContainerAdditionOutputSchema>;

export async function simulateContainerAddition(input: SimulateContainerAdditionInput): Promise<SimulateContainerAdditionOutput> {
  return simulateContainerAdditionFlow(input);
}

const simulateContainerAdditionPrompt = ai.definePrompt({
  name: 'simulateContainerAdditionPrompt',
  input: {schema: SimulateContainerAdditionInputSchema},
  output: {schema: SimulateContainerAdditionOutputSchema},
  prompt: `You are an expert port operations analyst.

You are tasked with simulating the addition of new containers to a port and predicting the resulting congestion and relocations.

Based on the input parameters (number of containers, size mix, cargo type mix, and priority mix), generate a textual representation of the congestion heatmap and estimate the number of container relocations that would occur.

Number of Containers: {{{numberOfContainers}}}
Size Mix: {{{sizeMix}}}
Cargo Type Mix: {{{cargoTypeMix}}}
Priority Mix: {{{priorityMix}}}

Congestion Heatmap (textual representation):
Estimated Relocations:`, // Explicitly requesting output, and setting up for the LLM to answer directly
});

const simulateContainerAdditionFlow = ai.defineFlow(
  {
    name: 'simulateContainerAdditionFlow',
    inputSchema: SimulateContainerAdditionInputSchema,
    outputSchema: SimulateContainerAdditionOutputSchema,
  },
  async input => {
    const {output} = await simulateContainerAdditionPrompt(input);
    return output!;
  }
);
