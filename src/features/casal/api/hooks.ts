import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { casalServices } from './services';
import type { UpdateCasalDto } from './types';

export function useUpdateCasalMutation() {
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (dto: UpdateCasalDto) => casalServices.updateCasal(dto),
    onSuccess: (updatedCasal) => {
      // Update the casal name in the auth store so the sidebar reflects it immediately
      if (token && user) {
        setAuth(token, user, updatedCasal);
      }
      qc.invalidateQueries({ queryKey: ['casal'] });
      toast.success('Nome do casal atualizado!');
    },
    onError: () => toast.error('Erro ao atualizar nome do casal.'),
  });
}
