import httpClient from "@/lib/httpClient";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  RegistrationPendingResponse,
  AuthSessionInfo,
} from "../models/AuthModel";
import { OnboardingRequest, OnboardingResponse, ReferenceDataCollections } from "../models/OnboardingModel";

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(
  payload: RegisterRequest
): Promise<RegistrationPendingResponse> {
  const response = await httpClient.post<RegistrationPendingResponse>("/auth/register", payload);
  return response.data;
}

export async function refreshTokens(
  payload?: RefreshRequest
): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/auth/refresh", payload ?? {});
  return response.data;
}

export async function fetchCurrentSession(): Promise<AuthResponse> {
  const response = await httpClient.get<AuthResponse>("/auth/session");
  return response.data;
}

export async function logoutUser(refreshToken?: string): Promise<void> {
  const body = typeof refreshToken === "string" && refreshToken.trim().length > 0 ? { refreshToken } : {};
  await httpClient.post("/auth/logout", body);
}

export async function fetchSessions(): Promise<AuthSessionInfo[]> {
  const response = await httpClient.get<AuthSessionInfo[]>("/auth/sessions");
  return response.data;
}

export async function revokeSession(deviceId: string): Promise<void> {
  await httpClient.delete(`/auth/sessions/${encodeURIComponent(deviceId)}`);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await httpClient.post("/auth/password/reset-request", { email });
}

export async function submitPasswordReset(token: string, newPassword: string): Promise<void> {
  await httpClient.post("/auth/password/reset", { token, newPassword });
}

export async function verifyEmail(token: string): Promise<void> {
  await httpClient.post("/auth/email/verify", { token });
}

export async function resendVerificationEmail(): Promise<number | null> {
  const response = await httpClient.post("/auth/email/resend");
  const retryAfter = Number(response.headers["retry-after"]);
  return Number.isFinite(retryAfter) ? retryAfter : null;
}

export async function resendVerificationEmailGuest(email: string): Promise<number | null> {
  const response = await httpClient.post("/auth/email/resend-guest", { email });
  const retryAfter = Number(response.headers["retry-after"]);
  return Number.isFinite(retryAfter) ? retryAfter : null;
}

export async function submitOnboarding(
  payload: OnboardingRequest
): Promise<OnboardingResponse> {
  const response = await httpClient.post<OnboardingResponse>("/onboarding", payload);
  return response.data;
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
