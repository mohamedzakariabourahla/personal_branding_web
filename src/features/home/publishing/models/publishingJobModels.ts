import { PublishingJobStatus } from "@/features/home/publishing/models/publishingJobStatus";

export interface PublishingJob {
  id: number;
  platformId: number;
  connectionId: number;
  mediaAssetIds: string[];
  caption: string | null;
  scheduledAt: string;
  createdAt: string;
  lastTriedAt: string | null;
  completedAt: string | null;
  attemptCount: number;
  status: PublishingJobStatus;
  failureReason: string | null;
  externalPostId?: string | null;
}
