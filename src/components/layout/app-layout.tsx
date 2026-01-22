'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Anchor, Bot, Plus, Warehouse, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState } from 'react';
import { ContainerCheckInDialog } from '../container-checkin-dialog';
import { SimulationDialog } from '../simulation-dialog';
import { ContainerDetailsSheet } from '../container-details-sheet';
import { SlotSuggestionDialog } from '../slot-suggestion-dialog';
import type { Container } from '@/lib/types';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const [isCheckInOpen, setCheckInOpen] = useState(false);
  const [isSimulationOpen, setSimulationOpen] = useState(false);
  const [newlyCheckedInContainer, setNewlyCheckedInContainer] = useState<Container | null>(null);

  const handleContainerCheckedIn = (container: Container) => {
    setCheckInOpen(false);
    setNewlyCheckedInContainer(container);
  };
  
  const handleSuggestionClosed = () => {
    setNewlyCheckedInContainer(null);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Anchor className="text-primary" />
            </Button>
            <h1 className="text-xl font-semibold">Port Vision</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Warehouse />
                <span>Yard Map</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start gap-2 p-2 h-auto w-full">
                         <Avatar className="h-8 w-8">
                            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className='text-left'>
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-muted-foreground">admin@portvision.io</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Real-time Yard Map</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setSimulationOpen(true)}>
              <Bot />
              <span>Simulate</span>
            </Button>
            <Button onClick={() => setCheckInOpen(true)}>
              <Plus />
              <span>Container Check-in</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
      <ContainerCheckInDialog isOpen={isCheckInOpen} onOpenChange={setCheckInOpen} onContainerCheckedIn={handleContainerCheckedIn} />
      <SimulationDialog isOpen={isSimulationOpen} onOpenChange={setSimulationOpen} />
      <ContainerDetailsSheet />
      {newlyCheckedInContainer && (
        <SlotSuggestionDialog 
          isOpen={!!newlyCheckedInContainer} 
          onOpenChange={(open) => !open && handleSuggestionClosed()} 
          container={newlyCheckedInContainer}
        />
      )}
    </SidebarProvider>
  );
}
