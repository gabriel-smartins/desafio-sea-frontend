import { api } from "./api";
import type { AuthResponse } from "../types";
import { storageKeys } from "../config/env";

interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    const roleDoBackend = response.data.role || "ROLE_USER";

    const roleLimpa = roleDoBackend.replace(/^ROLE_/, "").toUpperCase();

    return {
      token: response.data.token,
      role: roleLimpa as "ADMIN" | "USER",
    };
  },

  logout: () => {
    localStorage.removeItem(storageKeys.token);
    localStorage.removeItem(storageKeys.role);
  },
};
