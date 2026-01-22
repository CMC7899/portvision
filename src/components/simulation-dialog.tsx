'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { getSimulationResult } from '@/lib/actions';
import { useState } from 'react';
import type { SimulateContainerAdditionOutput } from '@/ai/flows/simulate-container-addition';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';
import { containerSizes, cargoTypes, containerPriorities } from '@/lib/types';

interface SimulationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = {
    numberOfContainers: number;
    sizeMix: {name: string, value: number}[];
    cargoTypeMix: {name: string, value: number}[];
    priorityMix: {name: string, value: number}[];
}

export function SimulationDialog({ isOpen, onOpenChange }: SimulationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulateContainerAdditionOutput | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      numberOfContainers: 100,
      sizeMix: containerSizes.map(name => ({name, value: 100 / containerSizes.length})),
      cargoTypeMix: cargoTypes.map(name => ({name, value: 100 / cargoTypes.length})),
      priorityMix: containerPriorities.map(name => ({name, value: 100 / containerPriorities.length})),
    }
  });

  const { fields: sizeMixFields } = useFieldArray({ control: form.control, name: "sizeMix" });
  const { fields: cargoTypeMixFields } = useFieldArray({ control: form.control, name: "cargoTypeMix" });
  const { fields: priorityMixFields } = useFieldArray({ control: form.control, name: "priorityMix" });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    const formatMix = (mix: {name: string, value: number}[]) => 
      Object.fromEntries(mix.map(item => [item.name, item.value / 100]));
    
    try {
      const simulationResult = await getSimulationResult({
        numberOfContainers: data.numberOfContainers,
        sizeMix: formatMix(data.sizeMix),
        cargoTypeMix: formatMix(data.cargoTypeMix),
        priorityMix: formatMix(data.priorityMix),
      });
      setResult(simulationResult);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setResult(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Yard Simulation</DialogTitle>
          <DialogDescription>
            Simulate adding new containers to predict congestion and operational impact.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 flex-1 overflow-y-auto min-h-0 pr-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="numberOfContainers">Number of Containers</Label>
                    <Input id="numberOfContainers" type="number" {...form.register('numberOfContainers', { valueAsNumber: true })} />
                </div>
                {[
                    { title: "Size Mix (%)", fields: sizeMixFields, name: "sizeMix" },
                    { title: "Cargo Type Mix (%)", fields: cargoTypeMixFields, name: "cargoTypeMix" },
                    { title: "Priority Mix (%)", fields: priorityMixFields, name: "priorityMix" },
                ].map((group) => (
                    <div key={group.name} className="space-y-2">
                        <Label>{group.title}</Label>
                        <Card>
                            <CardContent className="p-4 space-y-2">
                            {group.fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-xs col-span-1">{field.name}</Label>
                                    <Input className="col-span-2" type="number" {...form.register(`${group.name}.${index}.value`, { valueAsNumber: true })} />
                                </div>
                            ))}
                            </CardContent>
                        </Card>
                    </div>
                ))}
                
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Running Simulation...' : 'Run Simulation'}
                </Button>
            </form>
            <div className='space-y-4'>
                <Label>Simulation Results</Label>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : result ? (
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Estimated Relocations</p>
                                <p className="text-3xl font-bold">{result.estimatedRelocations}</p>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground mb-2">Congestion Heatmap</p>
                                <pre className="bg-muted p-4 rounded-md text-xs font-code whitespace-pre-wrap">{result.congestionHeatmap}</pre>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Run a simulation to see results.</p>
                    </Card>
                )}
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
