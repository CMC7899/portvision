'use server';

/**
 * @fileOverview A flow for suggesting optimal slot assignments for containers.
 *
 * - suggestOptimalSlot - A function that suggests an optimal slot assignment for a container.
 * - SuggestOptimalSlotInput - The input type for the suggestOptimalSlot function.
 * - SuggestOptimalSlotOutput - The return type for the suggestOptimalSlot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalSlotInputSchema = z.object({
  containerSize: z.string().describe('The size of the container (e.g., 20ft, 40ft).'),
  cargoType: z.string().describe('The type of cargo the container is carrying (e.g., dry goods, refrigerated).'),
  priority: z.string().describe('The priority of the container (e.g., high, medium, low).'),
  distanceToGate: z.number().describe('The distance from the potential slot to the gate.'),
  blockingIndex: z.number().describe('The blocking index of the potential slot (how many containers would need to be moved to access it).'),
  sizeMatch: z.boolean().describe('Whether the potential slot matches the container size.'),
  zoneCongestion: z.number().describe('The congestion level of the zone the potential slot is in.'),
});
export type SuggestOptimalSlotInput = z.infer<typeof SuggestOptimalSlotInputSchema>;

const SuggestOptimalSlotOutputSchema = z.object({
  slotId: z.string().describe('The ID of the suggested optimal slot.'),
  score: z.number().describe('The overall score of the suggested slot, based on the input factors.'),
  reasoning: z.string().describe('The reasoning behind the slot suggestion, explaining how the input factors contributed to the score.'),
});
export type SuggestOptimalSlotOutput = z.infer<typeof SuggestOptimalSlotOutputSchema>;

export async function suggestOptimalSlot(input: SuggestOptimalSlotInput): Promise<SuggestOptimalSlotOutput> {
  return suggestOptimalSlotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalSlotPrompt',
  input: {schema: SuggestOptimalSlotInputSchema},
  output: {schema: SuggestOptimalSlotOutputSchema},
  prompt: `You are a port operations expert. Your task is to suggest the optimal slot assignment for a container in a container yard. Consider the following factors to calculate a score for each potential slot:

*   **Distance to Gate:** Minimize this distance to reduce handling time. Shorter distances are better.
*   **Blocking Index:** Minimize this index to reduce the number of container relocations needed. Lower indices are better.
*   **Size Match:** A slot that perfectly matches the container size is highly desirable.
*   **Zone Congestion:** Distribute containers across zones to avoid congestion. Less congested zones are better.

Given the following container attributes and slot characteristics:

Container Size: {{{containerSize}}}
Cargo Type: {{{cargoType}}}
Priority: {{{priority}}}
Distance to Gate: {{{distanceToGate}}}
Blocking Index: {{{blockingIndex}}}
Size Match: {{{sizeMatch}}}
Zone Congestion: {{{zoneCongestion}}}

Based on these factors, suggest an optimal slot assignment. Provide the slot ID, its overall score (higher is better), and a detailed reasoning explaining how each of the input factors contributed to the score. Adhere to the the Zod schema descriptions in the output.
`,
});

const suggestOptimalSlotFlow = ai.defineFlow(
  {
    name: 'suggestOptimalSlotFlow',
    inputSchema: SuggestOptimalSlotInputSchema,
    outputSchema: SuggestOptimalSlotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
