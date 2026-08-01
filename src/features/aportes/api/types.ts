export interface Aporte {
  id: string;
  descricao: string;
  valor: number;
  mes: string;
  createdAt: string;
}

export type CreateAportePayload = Omit<Aporte, 'id' | 'createdAt'>;