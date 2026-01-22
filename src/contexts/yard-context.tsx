'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Yard, Container, Slot, CheckInFormValues } from '@/lib/types';
import { getEtaPrediction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface YardContextType {
  slots: Slot[];
  containers: Container[];
  isLoading: boolean;
  activeContainer?: Container;
  setActiveContainer: (container?: Container) => void;
  addContainer: (values: CheckInFormValues) => Promise<Container>;
  assignSlotToContainer: (containerId: string, slotId: string) => void;
  updateContainer: (updatedContainer: Container) => void;
}

const YardContext = createContext<YardContextType | undefined>(undefined);

export function YardProvider({ children, initialState }: { children: ReactNode, initialState: Yard }) {
  const [slots, setSlots] = useState<Slot[]>(initialState.slots);
  const [containers, setContainers] = useState<Container[]>(initialState.containers);
  const [isLoading, setIsLoading] = useState(false);
  const [activeContainer, setActiveContainer] = useState<Container | undefined>(undefined);
  const { toast } = useToast();

  const updateContainer = useCallback((updatedContainer: Container) => {
    setContainers(prev => prev.map(c => c.id === updatedContainer.id ? updatedContainer : c));
    if (activeContainer?.id === updatedContainer.id) {
        setActiveContainer(updatedContainer);
    }
  }, [activeContainer]);

  const addContainer = useCallback(async (values: CheckInFormValues): Promise<Container> => {
    setIsLoading(true);
    try {
      const arrivalTimestamp = new Date().toISOString();
      const newContainer: Container = {
        id: values.containerId,
        size: values.size,
        cargoType: values.cargoType,
        priority: values.priority,
        arrivalTimestamp,
        timeline: [{
          id: `evt-${values.containerId}-1`,
          timestamp: arrivalTimestamp,
          event: 'Container Checked In',
          iconName: 'CheckIcon',
        }],
      };

      const etaPrediction = await getEtaPrediction({
        arrivalTimestamp,
        cargoType: newContainer.cargoType,
        priority: newContainer.priority,
        size: newContainer.size,
      });

      newContainer.predictedETA = etaPrediction.predictedETA;
      newContainer.timeline.push({
        id: `evt-${values.containerId}-2`,
        timestamp: new Date().toISOString(),
        event: 'ETA Predicted',
        details: `${new Date(etaPrediction.predictedETA).toLocaleString()} - ${etaPrediction.reasoning}`,
        iconName: 'Rss',
      });

      setContainers(prev => [...prev, newContainer]);
      toast({
        title: "Container Checked In",
        description: `Container ${newContainer.id} has been successfully checked in.`,
      });
      return newContainer;
    } catch (error) {
      console.error("Failed to add container:", error);
      toast({
        variant: "destructive",
        title: "Check-in Failed",
        description: "Could not check in the new container.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const assignSlotToContainer = useCallback((containerId: string, slotId: string) => {
    let assignedContainer: Container | undefined;
    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        assignedContainer = {
          ...c,
          slotId: slotId,
          timeline: [...c.timeline, {
            id: `evt-${c.id}-${c.timeline.length + 1}`,
            timestamp: new Date().toISOString(),
            event: 'Slot Assigned',
            details: `Assigned to slot ${slotId}`,
            iconName: 'VenetianMask',
          }]
        };
        return assignedContainer;
      }
      return c;
    }));

    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, status: 'occupied', containerId: containerId };
      }
      return s;
    }));
    
    if (assignedContainer) {
        setActiveContainer(assignedContainer);
    }

    toast({
      title: "Slot Assigned",
      description: `Container ${containerId} assigned to slot ${slotId}.`,
    });
  }, [toast]);


  return (
    <YardContext.Provider value={{ slots, containers, isLoading, addContainer, assignSlotToContainer, activeContainer, setActiveContainer, updateContainer }}>
      {children}
    </YardContext.Provider>
  );
}

export function useYard() {
  const context = useContext(YardContext);
  if (context === undefined) {
    throw new Error('useYard must be used within a YardProvider');
  }
  return context;
}
