import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Informe um email válido'),
  senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    nome: z.string().min(2, 'Seu nome precisa ter pelo menos 2 caracteres'),
    email: z.string().email('Informe um email válido'),
    senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
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
      message: 'O código tem 6 caracteres',
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
      message: 'Dê um nome ao planejamento (mínimo de 2 caracteres)',
      path: ['nomeCasal'],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
