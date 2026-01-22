import type { Container, Slot, Yard, ContainerSize, TimelineEvent } from './types';

// Simple pseudo-random number generator for deterministic results
let seed = 1;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

const ZONES = ['A', 'B', 'C'];
const ROWS_PER_ZONE = 5;
const SLOTS_PER_ROW = 10;
const TIERS = 4;

export function generateInitialYard(numInitialContainers: number = 15): Yard {
  const slots: Slot[] = [];
  const containers: Container[] = [];
  seed = 1; // Reset seed for deterministic generation

  for (const zone of ZONES) {
    for (let row = 1; row <= ROWS_PER_ZONE; row++) {
      for (let slotNum = 1; slotNum <= SLOTS_PER_ROW; slotNum++) {
        // Stacks of slots
        for (let tier = 1; tier <= TIERS; tier++) {
            const slotId = `${zone}-${String(row).padStart(2, '0')}-${String(slotNum).padStart(2, '0')}-${tier}`;
            slots.push({
                id: slotId,
                zone,
                row,
                tier,
                status: 'empty',
                distanceToGate: getRandomInt(50, 500),
                blockingIndex: tier -1,
                zoneCongestion: random(),
                size: random() > 0.5 ? '40ft' : '20ft',
            });
        }
      }
    }
  }

  const availableSlots = slots.filter(s => s.tier === 1); // Only place initial containers on the ground level

  for (let i = 0; i < numInitialContainers; i++) {
    if(availableSlots.length === 0) break;
    
    const slotIndex = getRandomInt(0, availableSlots.length - 1);
    const assignedSlot = availableSlots.splice(slotIndex, 1)[0];
    
    if (assignedSlot) {
      const arrivalTimestamp = new Date(Date.now() - random() * 1000 * 60 * 60 * 24 * 5).toISOString();
      const containerId = `CONT${getRandomInt(1000, 9999)}`;
      
      const timeline: TimelineEvent[] = [
        {
          id: `evt-${containerId}-1`,
          timestamp: arrivalTimestamp,
          event: 'Container Checked In',
          details: `Arrived at port.`,
          iconName: 'CheckIcon',
        },
        {
          id: `evt-${containerId}-2`,
          timestamp: new Date(new Date(arrivalTimestamp).getTime() + 1000*60*15).toISOString(),
          event: 'Slot Assigned',
          details: `Assigned to slot ${assignedSlot.id}.`,
          iconName: 'Dock',
        }
      ];

      const container: Container = {
        id: containerId,
        size: assignedSlot.size,
        cargoType: getRandomElement(['Dry Goods', 'Refrigerated', 'General']),
        priority: getRandomElement(['Low', 'Medium', 'High']),
        arrivalTimestamp,
        predictedETA: new Date(Date.now() + random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
        slotId: assignedSlot.id,
        timeline,
      };
      
      containers.push(container);
      
      const slotInYard = slots.find(s => s.id === assignedSlot.id);
      if(slotInYard) {
        slotInYard.status = 'occupied';
        slotInYard.containerId = container.id;
      }
    }
  }

  return { slots, containers };
}
