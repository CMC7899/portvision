import type { z } from "zod";
import type { checkInSchema } from "./schemas";

export type ContainerSize = "20ft" | "40ft";
export const containerSizes: ContainerSize[] = ["20ft", "40ft"];

export type CargoType = "Dry Goods" | "Refrigerated" | "Hazardous" | "General";
export const cargoTypes: CargoType[] = ["Dry Goods", "Refrigerated", "Hazardous", "General"];

export type ContainerPriority = "Low" | "Medium" | "High";
export const containerPriorities: ContainerPriority[] = ["Low", "Medium", "High"];

export type SlotStatus = "empty" | "reserved" | "occupied";

export type Container = {
  id: string;
  size: ContainerSize;
  cargoType: CargoType;
  priority: ContainerPriority;
  arrivalTimestamp: string;
  predictedETA?: string;
  slotId?: string;
  timeline: TimelineEvent[];
};

export type TimelineEvent = {
  id: string;
  timestamp: string;
  event: string;
  details?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type Slot = {
  id: string; // e.g., "A-01-01"
  zone: string;
  row: number;
  tier: number;
  status: SlotStatus;
  containerId?: string;
  distanceToGate: number; // in meters
  blockingIndex: number; // number of containers on top
  zoneCongestion: number; // 0 to 1
  size: ContainerSize;
};

export type Yard = {
  slots: Slot[];
  containers: Container[];
};

export type SimulationInput = {
  numberOfContainers: number;
  sizeMix: Record<ContainerSize, number>;
  cargoTypeMix: Record<CargoType, number>;
  priorityMix: Record<ContainerPriority, number>;
};

export type CheckInFormValues = z.infer<typeof checkInSchema>;
