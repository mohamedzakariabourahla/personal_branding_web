export type OnboardingStatus = "NOT_STARTED" | "PROFILE_PENDING" | "COMPLETED";

export interface ReferenceDataItem {
  id: number;
  name: string;
}

export interface CountryReference {
  id: number;
  name: string;
  isoCode: string;
}

export interface PersonProfile {
  id: number | null;
  userId: number;
  fullName: string | null;
  phoneNumber: string | null;
  companyName: string | null;
  position: string | null;
  brandColor: string | null;
  fontStyle: string | null;
  niches: ReferenceDataItem[];
  audiences: ReferenceDataItem[];
  tones: ReferenceDataItem[];
  platforms: ReferenceDataItem[];
  countries: CountryReference[];
  postingFrequencies: ReferenceDataItem[];
}

export interface AuthUser {
  id: number;
  email: string;
  active: boolean;
  onboardingStatus: OnboardingStatus;
  roles: string[];
  person: PersonProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  tokenType: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = AuthResponse;

export interface RegisterRequest {
  email: string;
  password: string;
}

export type RegisterResponse = AuthResponse;

export interface RefreshRequest {
  refreshToken: string;
}

export type RefreshResponse = AuthResponse;
