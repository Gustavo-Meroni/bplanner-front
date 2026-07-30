// ─── Auth DTOs ────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  password: string;
  /** Token de convite do casal */
  conviteToken?: string;
}

export interface ValidarConviteDto {
  token: string;
}

// ─── Auth Responses ───────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

export interface AuthCasal {
  id: string;
  nome: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
  casal: AuthCasal;
}

export interface ConviteInfo {
  casalNome: string;
  convidadoPor: string;
}
