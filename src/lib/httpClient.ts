import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AuthResponse } from "@/features/auth/models/AuthModel";
import {
  clearSessionStorage,
  getStoredTokens,
  persistTokens,
  subscribeToSession,
} from "@/features/auth/utils/authStorage";

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
} as const;

const httpClient: AxiosInstance = axios.create({ ...axiosConfig });

const refreshClient: AxiosInstance = axios.create({ ...axiosConfig });

let inMemoryTokens = getStoredTokens();

subscribeToSession((session) => {
  inMemoryTokens = session?.tokens ?? null;
});

httpClient.interceptors.request.use((config) => {
  const tokens = inMemoryTokens ?? getStoredTokens();
  if (tokens?.accessToken) {
    const scheme = tokens.tokenType || "Bearer";
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `${scheme} ${tokens.accessToken}`;
    }
  }
  return config;
});

let refreshPromise: Promise<AuthResponse | null> | null = null;

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshAuthTokens();
        if (!refreshed) {
          throw error;
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `${refreshed.tokens.tokenType || "Bearer"} ${
          refreshed.tokens.accessToken
        }`;

        return httpClient(originalRequest);
      } catch (refreshError) {
        clearSessionStorage();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAuthTokens(): Promise<AuthResponse | null> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<AuthResponse>("/auth/refresh", {})
      .then((response) => {
        const auth = response.data;
        inMemoryTokens = auth.tokens;
        persistTokens(auth.tokens, auth.user);
        return auth;
      })
      .catch((err) => {
        refreshPromise = null;
        throw err;
      });
  }

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export default httpClient;
