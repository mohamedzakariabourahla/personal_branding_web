import httpClient from '@/lib/httpClient';
import {
  OAuthCompletionResult,
  PlatformAuthorization,
  PlatformConnection,
  PlatformProviderId,
} from '@/features/home/publishing/models/platformModels';

export async function fetchPlatformConnections(): Promise<PlatformConnection[]> {
  const response = await httpClient.get<PlatformConnection[]>('/platforms/connections');
  return response.data;
}

export async function startPlatformOAuth(provider: PlatformProviderId): Promise<PlatformAuthorization> {
  const response = await httpClient.post<PlatformAuthorization>(`/platforms/${provider}/oauth/start`, {});
  return response.data;
}

export async function completePlatformOAuth(
  provider: PlatformProviderId,
  payload: { code: string; state: string; pageId?: string | null }
): Promise<OAuthCompletionResult> {
  const response = await httpClient.post<OAuthCompletionResult>(`/platforms/${provider}/oauth/complete`, payload);
  return response.data;
}

export async function deletePlatformConnection(connectionId: number): Promise<void> {
  await httpClient.delete(`/platforms/connections/${connectionId}`);
}
