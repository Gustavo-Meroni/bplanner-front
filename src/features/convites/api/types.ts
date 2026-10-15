export interface ConvitePrevia {
  codigo: string;
  convidadoPor: string | null;
  viagem: {
    nome: string;
    destinoNome: string | null;
    destinoPais: string | null;
    destinoLat: number | null;
    destinoLng: number | null;
    dataIda: string | null;
    dataVolta: string | null;
  };
  participantes: string[];
}
