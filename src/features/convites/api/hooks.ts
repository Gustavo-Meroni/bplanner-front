import { useQuery } from '@tanstack/react-query';
import { previaConviteService } from './services';

export function useConvitePreviaQuery(codigo: string | null | undefined) {
  return useQuery({
    queryKey: ['convite', codigo?.toUpperCase()],
    queryFn: () => previaConviteService(codigo!),
    enabled: Boolean(codigo),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
