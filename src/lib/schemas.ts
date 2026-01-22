import { z } from 'zod';
import { containerSizes, cargoTypes, containerPriorities } from './types';

export const checkInSchema = z.object({
  containerId: z.string().min(4, 'Container ID must be at least 4 characters.'),
  size: z.enum(containerSizes, {
    required_error: "You need to select a container size.",
  }),
  cargoType: z.enum(cargoTypes, {
    required_error: "You need to select a cargo type.",
  }),
  priority: z.enum(containerPriorities, {
    required_error: "You need to select a priority level.",
  }),
});
