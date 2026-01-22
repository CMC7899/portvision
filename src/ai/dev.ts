import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-optimal-slot.ts';
import '@/ai/flows/predict-container-eta.ts';
import '@/ai/flows/simulate-container-addition.ts';