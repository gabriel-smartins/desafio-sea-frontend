export interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
}

export interface Telefone {
  numero: string;
  tipo: "RESIDENCIAL" | "COMERCIAL" | "CELULAR";
}

export interface Cliente {
  id?: string;
  nome: string;
  cpf: string;
  endereco: Endereco;
  telefones: Telefone[];
  emails: string[];
}

export interface AuthResponse {
  token: string;
  role: "ADMIN" | "USER";
}
