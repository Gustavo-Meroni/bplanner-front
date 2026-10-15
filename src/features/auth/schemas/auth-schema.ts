import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um email válido'),
  senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  nome: z.string().trim().min(2, 'Seu nome precisa ter pelo menos 2 caracteres').max(60),
  email: z.string().trim().email('Informe um email válido'),
  senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
