const readEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
};

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

export const appConfig = {
  apiBaseUrl: normalizeBaseUrl(
    readEnv("VITE_API_BASE_URL", "http://localhost:8080"),
  ),
  viaCepBaseUrl: normalizeBaseUrl(
    readEnv("VITE_VIA_CEP_BASE_URL", "https://viacep.com.br/ws"),
  ),
  storagePrefix: readEnv("VITE_STORAGE_PREFIX", "@DesafioBackend"),
};

export const storageKeys = {
  token: `${appConfig.storagePrefix}:token`,
  role: `${appConfig.storagePrefix}:role`,
};
