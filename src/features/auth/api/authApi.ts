import httpClient from "@/lib/httpClient";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
} from "../models/AuthModel";
import { OnboardingRequest, OnboardingResponse, ReferenceDataCollections } from "../models/OnboardingModel";
import axios, { AxiosError } from "axios";

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(
  payload: RegisterRequest
): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function refreshTokens(
  payload: RefreshRequest
): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/auth/refresh", payload);
  return response.data;
}

export async function submitOnboarding(
  payload: OnboardingRequest
): Promise<OnboardingResponse> {
  try {
    console.log("submitOnboarding -> payload:", payload);
    const response = await httpClient.post<OnboardingResponse>("/onboarding", payload);
    console.log("submitOnboarding <- response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      console.error("submitOnboarding ERROR (axios)", {
        message: axiosErr.message,
        url: axiosErr.config?.url,
        method: axiosErr.config?.method,
        status: axiosErr.response?.status,
        data: axiosErr.response?.data,
        headers: axiosErr.response?.headers,
      });
    } else {
      console.error("submitOnboarding ERROR (unknown)", err);
    }
    throw err;
  }
}

export async function fetchOnboardingProfile(): Promise<OnboardingResponse | null> {
  const response = await httpClient.get<OnboardingResponse>("/onboarding");
  return response.data ?? null;
}

export async function fetchReferenceData(): Promise<ReferenceDataCollections> {
  const [
    niches,
    audiences,
    tones,
    platforms,
    postingFrequencies,
    countries,
  ] = await Promise.all([
    httpClient.get<ReferenceDataCollections["niches"]>("/reference-data/niches"),
    httpClient.get<ReferenceDataCollections["audiences"]>("/reference-data/audiences"),
    httpClient.get<ReferenceDataCollections["tones"]>("/reference-data/tones"),
    httpClient.get<ReferenceDataCollections["platforms"]>("/reference-data/platforms"),
    httpClient.get<ReferenceDataCollections["postingFrequencies"]>(
      "/reference-data/posting-frequencies"
    ),
    httpClient.get<ReferenceDataCollections["countries"]>("/reference-data/countries"),
  ]);

  return {
    niches: niches.data,
    audiences: audiences.data,
    tones: tones.data,
    platforms: platforms.data,
    postingFrequencies: postingFrequencies.data,
    countries: countries.data,
  };
}
