import httpClient from '@/lib/httpClient';
import {
  OAuthCompletionResult,
  PlatformAuthorization,
  PlatformConnection,
  PlatformProviderId,
} from '@/features/home/publishing/models/platformModels';
import { PublishingJob } from '@/features/home/publishing/models/publishingJobModels';
import { PublishingAttempt } from '@/features/home/publishing/models/publishingAttemptModels';

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

export async function fetchPublishingJobs(): Promise<PublishingJob[]> {
  const response = await httpClient.get<PublishingJob[]>('/publishing/jobs');
  return response.data;
}

export async function fetchPublishingAttempts(jobId: number): Promise<PublishingAttempt[]> {
  const response = await httpClient.get<PublishingAttempt[]>(`/publishing/jobs/${jobId}/attempts`);
  return response.data;
}

export async function retryPublishingJob(jobId: number): Promise<void> {
  await httpClient.post(`/publishing/jobs/${jobId}/retry`);
}

export async function schedulePublishingJob(payload: {
  platformId: number;
  connectionId: number;
  caption?: string;
  mediaAssetIds?: string[];
  scheduledAt?: string | null;
}): Promise<PublishingJob> {
  const response = await httpClient.post<PublishingJob>('/publishing/jobs', payload);
  return response.data;
}

export async function cancelPublishingJob(jobId: number): Promise<void> {
  await httpClient.delete(`/publishing/jobs/${jobId}`);
}
