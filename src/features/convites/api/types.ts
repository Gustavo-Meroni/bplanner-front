export interface ConvitePrevia {
  codigo: string;
  convidadoPor: string | null;
  viagem: {
    nome: string;
    paradas: Array<{ nome: string; pais: string | null; codigoPais: string | null; lat: number; lng: number }>;
    dataIda: string | null;
    dataVolta: string | null;
  };
  participantes: string[];
}
