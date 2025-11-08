export type PlatformProviderId = 'tiktok' | 'meta' | 'youtube';

export interface PlatformConnection {
  id: number;
  userId: number;
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

export interface PlatformProviderConfig {
  id: PlatformProviderId;
  name: string;
  platformKey: string;
  description: string;
  accent: string;
  badge?: 'Available' | 'In Review' | 'Coming Soon';
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
    badge: 'Available',
  },
  {
    id: 'meta',
    name: 'Instagram / Facebook',
    platformKey: 'Instagram',
    description: 'Connect professional accounts to schedule reels and carousels (coming soon).',
    accent: '#e1306c',
    badge: 'In Review',
    disabled: true,
    betaNote: 'Awaiting Meta business verification',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    platformKey: 'YouTube',
    description: 'Plan long-form content, upload thumbnails, and auto-publish from one queue.',
    accent: '#ff0000',
    badge: 'Coming Soon',
    disabled: true,
  },
];
