export interface LoginDto {
  email: string;
  senha: string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  codigoConvite?: string;
  nomeCasal?: string;
}

export interface CasalInfo {
  id: string;
  nome: string;
  codigoConvite: string;
}

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  casal: CasalInfo;
}

export interface AuthResponse {
  access_token: string;
  usuario: UsuarioInfo;
}

export interface ValidarConviteResponse {
  id: string;
  nome: string;
}