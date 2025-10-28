export interface PersonalInfo {
  fullName: string;
  birthDate: string;
  countryOfResidence: string;
  countriesOfWork: string[];
  profession: string;
}

export interface BrandInfo {
  brandName: string;
  niche: string;
  tagline: string;
  description: string;
}

export type Tone = "Professional" | "Casual" | "Funny" | "Inspirational";
export type PostFrequency = "Daily" | "Weekly" | "Monthly";

export interface PreferencesInfo {
  favoriteColor: string;
  tone: Tone;
  postFrequency: PostFrequency;
}

export interface PlatformsInfo {
  instagram: boolean;
  tiktok: boolean;
  youtube: boolean;
  facebook: boolean;
  linkedin: boolean;
}

export interface OnboardingRequest {
  personal: PersonalInfo;
  brand: BrandInfo;
  preferences: PreferencesInfo;
  platforms: PlatformsInfo;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
}
