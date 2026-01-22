'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useYard } from '@/contexts/yard-context';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowRight, Calendar, Ship, Tag, Weight, CheckIcon, Dock, Rss, VenetianMask } from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  CheckIcon,
  Dock,
  Rss,
  VenetianMask,
};

export function ContainerDetailsSheet() {
  const { activeContainer, setActiveContainer } = useYard();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveContainer(undefined);
    }
  };

  return (
    <Sheet open={!!activeContainer} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Container {activeContainer?.id}</SheetTitle>
          <SheetDescription>
            Detailed information and timeline for this container.
          </SheetDescription>
        </SheetHeader>
        {activeContainer && (
            <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Details</h4>
                        <Badge variant={activeContainer.priority === 'High' ? 'destructive' : (activeContainer.priority === 'Medium' ? 'secondary' : 'outline')}>
                            {activeContainer.priority} Priority
                        </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground"><Ship className="w-4 h-4"/> Size:</div>
                        <div className="font-medium text-right">{activeContainer.size}</div>
                        <div className="flex items-center gap-2 text-muted-foreground"><Tag className="w-4 h-4"/> Cargo:</div>
                        <div className="font-medium text-right">{activeContainer.cargoType}</div>
                        <div className="flex items-center gap-2 text-muted-foreground"><Weight className="w-4 h-4"/> Current Slot:</div>
                        <div className="font-medium text-right">{activeContainer.slotId || 'N/A'}</div>
                        <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4"/> Arrived:</div>
                        <div className="font-medium text-right">{new Date(activeContainer.arrivalTimestamp).toLocaleString()}</div>
                         <div className="flex items-center gap-2 text-muted-foreground"><ArrowRight className="w-4 h-4"/> Predicted ETA:</div>
                        <div className="font-medium text-right">{activeContainer.predictedETA ? new Date(activeContainer.predictedETA).toLocaleString() : 'N/A'}</div>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                     <h4 className="font-semibold">Timeline</h4>
                    <div className="relative pl-8">
                    {activeContainer.timeline.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((event, index, arr) => {
                        const IconComponent = event.iconName ? iconMap[event.iconName] : null;
                        return (
                        <div key={event.id} className="flex gap-4 items-start">
                            <div className="absolute left-0 top-1.5 flex flex-col items-center">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    {IconComponent ? <IconComponent className="h-3 w-3" /> : null}
                                </span>
                                {index !== arr.length - 1 && <div className="h-12 w-px bg-border my-1" />}
                            </div>
                            <div className="pb-8">
                                <p className="font-medium">{event.event}</p>
                                <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                                {event.details && <p className="text-sm mt-1">{event.details}</p>}
                            </div>
                        </div>
                    )})}
                    </div>
                </div>
            </div>
        )}
        <SheetFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
