import httpClient from "@/lib/httpClient";
import { RegisterRequest, RegisterResponse } from "../models/RegisterModel";
import { LoginRequest, LoginResponse } from "../models/LoginModel";
import { OnboardingRequest, OnboardingResponse } from "../models/OnboardingModel";

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>("/auth/login", data);
  return response.data;
}

export async function registerUser(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await httpClient.post<RegisterResponse>("/auth/register", data);
  return response.data;
}

export async function submitOnboarding(payload: OnboardingRequest): Promise<OnboardingResponse> {
  const response = await httpClient.post<OnboardingResponse>("/onboarding", payload);
  return response.data;
}