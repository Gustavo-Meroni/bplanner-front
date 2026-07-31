export interface Aporte {
  id: string;
  descricao: string;
  valor: number;
  mes: string; // <-- adicionado
  createdAt?: string;
}

export interface CreateAporteDto {
  descricao: string;
  valor: number;
  mes: string; // <-- adicionado
}