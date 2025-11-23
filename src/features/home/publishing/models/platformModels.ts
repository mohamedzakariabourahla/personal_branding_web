export type PlatformProviderId = 'tiktok' | 'meta' | 'youtube';

export interface PlatformConnection {
  id: number;
  userId: number;
  platformId?: number;
  platformCode?: string | null;
  platformName: string;
  externalAccountId: string;
  externalUsername: string | null;
  externalDisplayName: string | null;
  status: string | null;
  metadata: Record<string, unknown>;
  lastSyncedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PlatformAuthorization {
  authorizationUrl: string;
  state: string;
  expiresAt: string;
}

export interface PlatformAccountCandidate {
  primaryId: string;
  primaryName: string;
  secondaryId?: string | null;
  secondaryHandle?: string | null;
  secondaryName?: string | null;
}

export type OAuthCompletionStatus = 'CONNECTED' | 'SELECTION_REQUIRED' | 'FAILED';

export interface OAuthCompletionResult {
  status: OAuthCompletionStatus;
  connection?: PlatformConnection;
  candidates?: PlatformAccountCandidate[];
  message?: string;
}

export interface PlatformProviderConfig {
  id: PlatformProviderId;
  name: string;
  platformKey: string;
  description: string;
  accent: string;
  badge?: 'Available' | 'In Review' | 'Coming Soon' | 'Beta';
  disabled?: boolean;
  betaNote?: string;
  docsLink?: string;
}

export const PLATFORM_PROVIDERS: PlatformProviderConfig[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    platformKey: 'TikTok',
    description: 'Schedule and publish short-form videos, then sync performance insights.',
    accent: '#ff0050',
    badge: 'Beta',
    disabled: false,
    betaNote: 'TikTok OAuth live. You can connect up to 3 accounts.',
  },
  {
    id: 'meta',
    name: 'Instagram / Facebook',
    platformKey: 'Instagram',
    description: 'Connect professional accounts to schedule reels and carousels (coming soon).',
    accent: '#e1306c',
    badge: 'Coming Soon',
    disabled: false,
    betaNote: 'Awaiting Meta business verification',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    platformKey: 'YouTube',
    description: 'Plan long-form content, upload thumbnails, and auto-publish from one queue.',
    accent: '#ff0000',
    badge: 'Beta',
    disabled: false,
    betaNote: 'Connect your primary channel while we finish analytics + publishing.',
  },
];
