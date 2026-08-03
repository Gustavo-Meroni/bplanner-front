import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Informe um email válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z
  .object({
    nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Informe um email válido'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    temConvite: z.boolean(),
    codigoConvite: z.string().optional(),
    nomeCasal: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.temConvite) {
        return !!data.codigoConvite && data.codigoConvite.length === 6;
      }
      return true;
    },
    {
      message: 'Informe um código de convite válido (6 caracteres)',
      path: ['codigoConvite'],
    }
  )
  .refine(
    (data) => {
      if (!data.temConvite) {
        return !!data.nomeCasal && data.nomeCasal.length >= 2;
      }
      return true;
    },
    {
      message: 'Informe o nome do casal (mínimo 2 caracteres)',
      path: ['nomeCasal'],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
