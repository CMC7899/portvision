import { AppClient } from '@/components/app-client';
import { generateInitialYard } from '@/lib/data';

export default function Home() {
  const initialState = generateInitialYard();
  return <AppClient initialState={initialState} />;
}
