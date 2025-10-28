export type Niche =
  | "Real Estate"
  | "Luxury Properties"
  | "Off-Plan Projects"
  | "Rentals"
  | "Secondary Market"
  | "Interior Design"
  | "Architecture"
  | "Investment Advisory"
  | "E-Commerce"
  | "Personal Branding"
  | "Coaching"
  | "Fitness & Wellness"
  | "Fashion"
  | "Beauty"
  | "Finance & Crypto"
  | "Other";

export type Audience =
  | "Investors"
  | "End-Users"
  | "First-Time Buyers"
  | "Luxury Seekers"
  | "Expats"
  | "Families"
  | "Young Professionals"
  | "Corporates"
  | "Developers"
  | "Agents / Brokers"
  | "Business Owners"
  | "Students"
  | "Other";

export type Market = string; // list of countries or regions
export type Tone =
  | "Professional"
  | "Relatable"
  | "Analytical"
  | "Luxury"
  | "Funny"
  | "Bold"
  | "Friendly"
  | "Inspirational"
  | "Educational"
  | "Playful"
  | "Elegant"
  | "Authentic";

export type Platform =
  | "Instagram"
  | "TikTok"
  | "YouTube"
  | "Facebook"
  | "LinkedIn"
  | "Twitter/X"
  | "Pinterest";

export type PostingFrequency = "3x/week" | "5x/week" | "Daily";

export interface OnboardingRequest {
  niche: Niche | "";
  targetAudience: Audience | "";
  tonePersonality: Tone | "";
  brandColors: string;
  fontStyle: string;
  marketFocus: string[];
  preferredPlatforms: Platform[];
  postingFrequency: PostingFrequency | "";
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
}
