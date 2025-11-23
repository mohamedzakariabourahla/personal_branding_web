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
  emailVerified: boolean;
  onboardingStatus: OnboardingStatus;
  roles: string[];
  person: PersonProfile | null;
}

export interface AuthTokens {
    accessToken: string;
    tokenType: string;
    deviceId?: string;
    deviceName?: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceName?: string;
}

export type LoginResponse = AuthResponse;

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegistrationPendingResponse {
  email: string;
  verificationExpiresAt: string;
  verificationRequired: boolean;
  message: string;
}

export type RegisterResponse = RegistrationPendingResponse;

export type RefreshResponse = AuthResponse;

export interface AuthSessionInfo {
  deviceId: string;
  deviceName: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}
