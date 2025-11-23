export interface PublishingAttempt {
  id: number;
  jobId: number;
  attemptedAt: string;
  status: string;
  error: string | null;
  providerResponse: string | null;
}
