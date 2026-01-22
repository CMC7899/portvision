"use server";

import { predictContainerETA, type PredictContainerETAInput, type PredictContainerETAOutput } from '@/ai/flows/predict-container-eta';
import { suggestOptimalSlot, type SuggestOptimalSlotInput, type SuggestOptimalSlotOutput } from '@/ai/flows/suggest-optimal-slot';
import { simulateContainerAddition, type SimulateContainerAdditionInput, type SimulateContainerAdditionOutput } from '@/ai/flows/simulate-container-addition';

export async function getEtaPrediction(input: PredictContainerETAInput): Promise<PredictContainerETAOutput> {
  return await predictContainerETA(input);
}

export async function getSlotSuggestion(input: SuggestOptimalSlotInput): Promise<SuggestOptimalSlotOutput> {
  return await suggestOptimalSlot(input);
}

export async function getSimulationResult(input: SimulateContainerAdditionInput): Promise<SimulateContainerAdditionOutput> {
  // The AI flow expects a generic record for mixes, so we might need to adapt the input.
  // For this app, the structure is compatible.
  return await simulateContainerAddition(input);
}
