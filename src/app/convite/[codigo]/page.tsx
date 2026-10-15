import type { Metadata } from 'next';
import { ConviteScreen } from '@/features/convites/components/ConviteScreen';

export const metadata: Metadata = {
  title: 'Convite para viagem',
  description: 'Você foi convidado para planejar uma viagem no BPlanner.',
};

export default async function ConvitePage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  return <ConviteScreen codigo={decodeURIComponent(codigo)} />;
}
