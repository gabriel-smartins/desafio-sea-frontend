import { api } from "./api";
import type { Cliente } from "../types";

export const clienteService = {
  findAll: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>("/clientes");
    return response.data;
  },

  findById: async (id: string): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  save: async (cliente: Cliente): Promise<Cliente> => {
    const response = await api.post<Cliente>("/clientes", cliente);
    return response.data;
  },

  update: async (id: string, cliente: Cliente): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};
