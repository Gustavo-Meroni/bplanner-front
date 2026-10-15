import type { Metadata } from 'next';
import { OnboardingScreen } from '@/features/onboarding/components/OnboardingScreen';

export const metadata: Metadata = {
  title: 'Planejar viagem',
};

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ viagem?: string }> }) {
  const { viagem } = await searchParams;
  return <OnboardingScreen viagemId={viagem ?? null} />;
}
