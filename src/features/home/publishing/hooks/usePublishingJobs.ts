import { useCallback, useEffect, useState } from "react";
import {
  cancelPublishingJob,
  fetchPublishingAttempts,
  fetchPublishingJobs,
  retryPublishingJob,
} from "@/features/home/publishing/api/platformApi";
import { PublishingJob } from "@/features/home/publishing/models/publishingJobModels";
import { PublishingAttempt } from "@/features/home/publishing/models/publishingAttemptModels";

export function usePublishingJobs(refreshKey?: number) {
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [attemptsByJob, setAttemptsByJob] = useState<Record<number, PublishingAttempt[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishingJobs();
      setJobs(data);
    } catch {
      setError("Unable to load publishing jobs right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAttempts = useCallback(async (jobId: number) => {
    try {
      const data = await fetchPublishingAttempts(jobId);
      setAttemptsByJob((prev) => ({ ...prev, [jobId]: data }));
    } catch {
      // ignore attempt load failures for now
    }
  }, []);

  const retryJob = useCallback(
    async (jobId: number) => {
      setRetryingId(jobId);
      try {
        await retryPublishingJob(jobId);
        await loadJobs();
        await loadAttempts(jobId);
      } finally {
        setRetryingId(null);
      }
    },
    [loadAttempts, loadJobs]
  );

  const cancelJob = useCallback(
    async (jobId: number) => {
      setCancellingId(jobId);
      try {
        await cancelPublishingJob(jobId);
        await loadJobs();
      } finally {
        setCancellingId(null);
      }
    },
    [loadJobs]
  );

  const removeJob = useCallback((jobId: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
    setAttemptsByJob((prev) => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (cancelled) return;
      await loadJobs();
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [loadJobs, refreshKey]);

  return {
    jobs,
    attemptsByJob,
    loading,
    error,
    retryingId,
    cancellingId,
    reload: loadJobs,
    loadAttempts,
    retryJob,
    cancelJob,
    removeJob,
  };
}
