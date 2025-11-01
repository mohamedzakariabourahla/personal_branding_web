import {
  CountryReference,
  PersonProfile,
  ReferenceDataItem,
} from "./AuthModel";

export interface OnboardingRequest {
  fullName: string;
  phoneNumber: string;
  companyName: string;
  position: string;
  brandColor: string;
  fontStyle: string;
  nicheIds: number[];
  audienceIds: number[];
  toneIds: number[];
  platformIds: number[];
  countryIds: number[];
  postingFrequencyIds: number[];
}

export type OnboardingResponse = PersonProfile;

export interface ReferenceDataCollections {
  niches: ReferenceDataItem[];
  audiences: ReferenceDataItem[];
  tones: ReferenceDataItem[];
  platforms: ReferenceDataItem[];
  postingFrequencies: ReferenceDataItem[];
  countries: CountryReference[];
}
