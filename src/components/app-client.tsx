'use client';

import type { Yard } from '@/lib/types';
import { YardProvider } from '@/contexts/yard-context';
import { AppLayout } from '@/components/layout/app-layout';
import { YardMap } from './yard-map';

interface AppClientProps {
  initialState: Yard;
}

export function AppClient({ initialState }: AppClientProps) {
  return (
    <YardProvider initialState={initialState}>
      <AppLayout>
        <YardMap />
      </AppLayout>
    </YardProvider>
  );
}
