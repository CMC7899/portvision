'use client';

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { Container, Slot } from '@/lib/types';
import { useYard } from '@/contexts/yard-context';
import { getSlotSuggestion } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

interface SlotSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

const initialWeights = {
  distanceToGate: 50,
  blockingIndex: 50,
  zoneCongestion: 50,
  sizeMatch: 100,
};

type ScoredSlot = Slot & { score: number };
type SuggestionWithReasoning = ScoredSlot & { reasoning?: string };

export function SlotSuggestionDialog({ isOpen, onOpenChange, container }: SlotSuggestionDialogProps) {
  const { slots, assignSlotToContainer } = useYard();
  const [weights, setWeights] = useState(initialWeights);
  const [suggestions, setSuggestions] = useState<SuggestionWithReasoning[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionWithReasoning | null>(null);
  const [isReasoningLoading, setReasoningLoading] = useState(false);

  const emptySlots = useMemo(() => {
    return slots.filter(slot => slot.status === 'empty');
  }, [slots]);

  useEffect(() => {
    if(!isOpen) return;

    const normalize = (value: number, min: number, max: number) => (max > min ? (value - min) / (max - min) : 0);
    
    const distances = emptySlots.map(s => s.distanceToGate);
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    
    const blockings = emptySlots.map(s => s.blockingIndex);
    const minBlocking = Math.min(...blockings);
    const maxBlocking = Math.max(...blockings);

    const congestions = emptySlots.map(s => s.zoneCongestion);
    const minCongestion = Math.min(...congestions);
    const maxCongestion = Math.max(...congestions);
    
    const scoredSlots = emptySlots.map(slot => {
      const distanceScore = 1 - normalize(slot.distanceToGate, minDistance, maxDistance);
      const blockingScore = 1 - normalize(slot.blockingIndex, minBlocking, maxBlocking);
      const congestionScore = 1 - normalize(slot.zoneCongestion, minCongestion, maxCongestion);
      const sizeMatchScore = slot.size === container.size ? 1 : 0;

      const totalScore =
        distanceScore * (weights.distanceToGate / 100) +
        blockingScore * (weights.blockingIndex / 100) +
        congestionScore * (weights.zoneCongestion / 100) +
        sizeMatchScore * (weights.sizeMatch / 100);

      return { ...slot, score: totalScore };
    });

    const topSuggestions = scoredSlots.sort((a, b) => b.score - a.score).slice(0, 3);
    setSuggestions(topSuggestions);
    setSelectedSuggestion(topSuggestions[0] || null);
  }, [container, emptySlots, weights, isOpen]);

  useEffect(() => {
    if (selectedSuggestion && !selectedSuggestion.reasoning) {
      setReasoningLoading(true);
      getSlotSuggestion({
        containerSize: container.size,
        cargoType: container.cargoType,
        priority: container.priority,
        distanceToGate: selectedSuggestion.distanceToGate,
        blockingIndex: selectedSuggestion.blockingIndex,
        sizeMatch: selectedSuggestion.size === container.size,
        zoneCongestion: selectedSuggestion.zoneCongestion,
      }).then(result => {
        setSuggestions(prev => prev.map(s => s.id === selectedSuggestion.id ? {...s, reasoning: result.reasoning} : s));
        setSelectedSuggestion(prev => prev && prev.id === selectedSuggestion.id ? {...prev, reasoning: result.reasoning} : prev);
      }).finally(() => {
        setReasoningLoading(false);
      });
    }
  }, [selectedSuggestion, container]);

  const handleAssign = (slotId: string) => {
    assignSlotToContainer(container.id, slotId);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Slot Suggestion for Container {container.id}</DialogTitle>
          <DialogDescription>
            Adjust weights to see how suggestions change. Select a suggestion to see the AI's reasoning.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle>Scoring Weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Distance to Gate</Label>
                <Slider defaultValue={[weights.distanceToGate]} onValueChange={([v]) => setWeights(w => ({ ...w, distanceToGate: v }))} />
              </div>
              <div className="space-y-2">
                <Label>Blocking Index</Label>
                <Slider defaultValue={[weights.blockingIndex]} onValueChange={([v]) => setWeights(w => ({ ...w, blockingIndex: v }))} />
              </div>
              <div className="space-y-2">
                <Label>Zone Congestion</Label>
                <Slider defaultValue={[weights.zoneCongestion]} onValueChange={([v]) => setWeights(w => ({ ...w, zoneCongestion: v }))} />
              </div>
              <div className="space-y-2">
                <Label>Size Match</Label>
                <Slider defaultValue={[weights.sizeMatch]} onValueChange={([v]) => setWeights(w => ({ ...w, sizeMatch: v }))} />
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2 flex flex-col gap-4">
             <Card>
                <CardHeader>
                    <CardTitle>Top Suggestions</CardTitle>
                    <CardDescription>Based on your current weight adjustments.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                {suggestions.map((suggestion) => (
                    <Button key={suggestion.id} variant={selectedSuggestion?.id === suggestion.id ? 'default' : 'outline'} onClick={() => setSelectedSuggestion(suggestion)}>
                    Slot {suggestion.id}
                    </Button>
                ))}
                {suggestions.length === 0 && <p className="text-muted-foreground">No available slots match criteria.</p>}
                </CardContent>
             </Card>
             {selectedSuggestion && (
                 <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>AI Reasoning for Slot {selectedSuggestion.id}</CardTitle>
                        <CardDescription>An AI-powered analysis of the selected slot.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isReasoningLoading ? (
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                             </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">{selectedSuggestion.reasoning}</p>
                        )}
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p>Distance to Gate: <span className="font-semibold">{selectedSuggestion.distanceToGate}m</span></p>
                            <p>Blocking Index: <span className="font-semibold">{selectedSuggestion.blockingIndex}</span></p>
                            <p>Zone Congestion: <span className="font-semibold">{Math.round(selectedSuggestion.zoneCongestion*100)}%</span></p>
                            <p>Size Match: <span className="font-semibold">{selectedSuggestion.size === container.size ? 'Yes' : 'No'}</span></p>
                        </div>
                        <Button className="mt-6 w-full" onClick={() => handleAssign(selectedSuggestion.id)}>Assign to Slot {selectedSuggestion.id}</Button>
                    </CardContent>
                 </Card>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
