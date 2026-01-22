'use client';

import { useYard } from '@/contexts/yard-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Slot, Container } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Anchor, Box, Ship, Star } from 'lucide-react';

const getSlotColor = (slot: Slot, container?: Container) => {
  if (slot.status === 'empty') return 'bg-slot-empty';
  if (slot.status === 'reserved') return 'bg-slot-reserved';
  if (slot.status === 'occupied') {
    if (container?.priority === 'High') return 'bg-slot-occupied-high';
    return 'bg-slot-occupied-normal';
  }
  return 'bg-muted';
};

function SlotComponent({ slot }: { slot: Slot }) {
  const { containers, setActiveContainer } = useYard();
  const container = slot.containerId ? containers.find(c => c.id === slot.containerId) : undefined;
  const isClickable = !!container;

  const handleClick = () => {
    if (container) {
      setActiveContainer(container);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleClick}
            className={cn(
              'relative aspect-square rounded-md flex items-center justify-center text-xs transition-transform transform hover:scale-110 hover:z-10',
              getSlotColor(slot, container),
              isClickable && 'cursor-pointer'
            )}
          >
            {container && (
              <>
                <span className="absolute top-1 right-1 font-bold">{container.priority === 'High' && <Star className="w-3 h-3 text-red-800 fill-current" />}</span>
                <div className="text-center">
                    <p className="font-mono text-xs font-bold truncate">{container.id}</p>
                    <p className="text-[10px]">{container.size}</p>
                </div>
              </>
            )}
            {slot.tier > 1 && slot.status === 'empty' && <div className="absolute inset-0 bg-black/20 rounded-md" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">Slot {slot.id}</p>
          <p>Status: {slot.status}</p>
          {container && <p>Container: {container.id}</p>}
          <p>Tier: {slot.tier}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function YardMap() {
  const { slots } = useYard();

  const zones = [...new Set(slots.map(s => s.zone))].sort();

  const getSlotsByZone = (zone: string) => {
    return slots.filter(s => s.zone === zone).sort((a,b) => a.row - b.row || a.id.localeCompare(b.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-slot-empty border"></div> Empty</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-slot-reserved border"></div> Reserved</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-slot-occupied-normal border"></div> Occupied (Normal)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-slot-occupied-high border"></div> Occupied (High Priority)</div>
      </div>
      {zones.map(zone => {
        const zoneSlots = getSlotsByZone(zone);
        const rows = [...new Set(zoneSlots.map(s => s.row))];
        const slotsPerRow = zoneSlots.length / (rows.length * 4); // 4 tiers
        return (
          <Card key={zone}>
            <CardHeader>
              <CardTitle>Zone {zone}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${slotsPerRow}, 1fr)` }}
              >
                {zoneSlots.map(slot => (
                  <SlotComponent key={slot.id} slot={slot} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
