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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkInSchema } from '@/lib/schemas';
import type { CheckInFormValues, Container } from '@/lib/types';
import { useYard } from '@/contexts/yard-context';
import { containerSizes, cargoTypes, containerPriorities } from '@/lib/types';

interface ContainerCheckInDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContainerCheckedIn: (container: Container) => void;
}

export function ContainerCheckInDialog({ isOpen, onOpenChange, onContainerCheckedIn }: ContainerCheckInDialogProps) {
  const { addContainer, isLoading } = useYard();
  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      containerId: '',
    },
  });

  const onSubmit = async (data: CheckInFormValues) => {
    try {
      const newContainer = await addContainer(data);
      onContainerCheckedIn(newContainer);
      form.reset();
    } catch (error) {
        // Error is handled in context
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Container Check-in</DialogTitle>
          <DialogDescription>
            Enter the details for the new container. An arrival timestamp will be automatically assigned.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="containerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MSCU1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {containerSizes.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cargo type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cargoTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {containerPriorities.map(priority => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Checking in...' : 'Check In & Suggest Slot'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
