import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Collapse, Divider, Stack, Typography } from "@mui/material";
import { cancelPublishingJob, fetchPublishingAttempts, fetchPublishingJobs, retryPublishingJob } from "@/features/home/publishing/api/platformApi";
import { PublishingJob } from "@/features/home/publishing/models/publishingJobModels";
import { PublishingAttempt } from "@/features/home/publishing/models/publishingAttemptModels";
import { PlatformConnection } from "@/features/home/publishing/models/platformModels";
import dayjs from "dayjs";

const statusColor: Record<string, "default" | "success" | "error" | "warning" | "info"> = {
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  SUCCEEDED: "success",
  FAILED: "error",
  DEAD_LETTER: "error",
};

const statusLabel: Record<string, string> = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In progress",
  SUCCEEDED: "Published",
  FAILED: "Failed",
  DEAD_LETTER: "Stopped",
};

type Props = {
  refreshKey?: number;
  connections?: PlatformConnection[];
  onChanged?: () => void;
};

export default function PublishingJobList({ refreshKey, connections, onChanged }: Props) {
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Record<number, PublishingAttempt[]>>({});
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const connectionLookup = useMemo(() => {
    const map = new Map<number, PlatformConnection>();
    (connections || []).forEach((c) => map.set(c.id, c));
    return map;
  }, [connections]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPublishingJobs();
        if (!cancelled) {
          setJobs(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load publishing jobs right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const hasJobs = useMemo(() => jobs.length > 0, [jobs]);

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading scheduled posts…</Typography>
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!hasJobs) {
    return <Typography variant="body2">No scheduled posts yet.</Typography>;
  }

  const handleToggleAttempts = async (jobId: number) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    setExpandedJobId(jobId);
    if (attempts[jobId]) {
      return;
    }
    try {
      const data = await fetchPublishingAttempts(jobId);
      setAttempts((prev) => ({ ...prev, [jobId]: data }));
    } catch {
      // ignore
    }
  };

  const handleRetry = async (jobId: number) => {
    setRetryingId(jobId);
    try {
      await retryPublishingJob(jobId);
      const updatedJobs = await fetchPublishingJobs();
      setJobs(updatedJobs);
      if (expandedJobId === jobId) {
        try {
          const atts = await fetchPublishingAttempts(jobId);
          setAttempts((prev) => ({ ...prev, [jobId]: atts }));
        } catch {
          // ignore
        }
      }
      if (onChanged) {
        onChanged();
      }
    } catch {
      // ignore
    } finally {
      setRetryingId(null);
    }
  };

  const handleCancel = async (jobId: number) => {
    setCancellingId(jobId);
    try {
      await cancelPublishingJob(jobId);
      const data = await fetchPublishingJobs();
      setJobs(data);
      if (onChanged) {
        onChanged();
      }
    } catch {
      // ignore
    } finally {
      setCancellingId(null);
    }
  };

  const handleRemoveFromHistory = (jobId: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setAttempts((prev) => {
      const next = { ...prev };
      delete next[jobId];
      return next;
    });
    if (onChanged) {
      onChanged();
    }
  };

  return (
    <Stack spacing={1.5}>
      {jobs.map((job) => (
        <Box
          key={job.id}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={600}>
                Post #{job.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {connectionLookup.get(job.connectionId)?.platformName ?? "Platform"} –{" "}
                {connectionLookup.get(job.connectionId)?.externalDisplayName ||
                  connectionLookup.get(job.connectionId)?.externalUsername ||
                  `Connection ${job.connectionId}`}
              </Typography>
              {job.caption && (
                <Typography variant="body2" color="text.primary">
                  {job.caption}
                </Typography>
              )}
              {job.mediaAssetIds?.length ? (
                <Typography variant="body2" color="text.secondary">
                  Media: {job.mediaAssetIds.join(", ")}
                </Typography>
              ) : null}
              <Typography variant="body2" color="text.secondary">
                Scheduled: {dayjs(job.scheduledAt).format("YYYY-MM-DD HH:mm")}
              </Typography>
            </Stack>
            <Stack spacing={1} alignItems="flex-end">
              <Chip
                label={statusLabel[job.status] ?? job.status}
                color={statusColor[job.status] ?? "default"}
                size="small"
                variant="outlined"
              />
              {(job.status === "FAILED" || job.status === "DEAD_LETTER") && (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={retryingId === job.id}
                  onClick={() => void handleRetry(job.id)}
                >
                  {retryingId === job.id ? "Retrying..." : "Retry"}
                </Button>
              )}
              {job.failureReason && (
                <Typography variant="caption" color="error.main" textAlign="right">
                  {job.failureReason}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Attempts: {job.attemptCount}
              </Typography>
              <Button size="small" onClick={() => void handleToggleAttempts(job.id)}>
                {expandedJobId === job.id ? "Hide attempts" : "Show attempts"}
              </Button>
              {job.externalPostId && (
                <Typography variant="caption" color="text.secondary">
                  External ID: {job.externalPostId}
                </Typography>
              )}
              {job.status !== "SUCCEEDED" && (
                <Button
                  size="small"
                  color="error"
                  variant="text"
                  disabled={cancellingId === job.id}
                  onClick={() => void handleCancel(job.id)}
                >
                  {cancellingId === job.id ? "Cancelling..." : "Cancel post"}
                </Button>
              )}
              {job.status === "SUCCEEDED" && (
                <Button size="small" variant="text" color="inherit" onClick={() => handleRemoveFromHistory(job.id)}>
                  Remove from history
                </Button>
              )}
            </Stack>
          </Stack>
          <Collapse in={expandedJobId === job.id} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1}>
              {(attempts[job.id] ?? []).map((att) => (
                <Box key={att.id} sx={{ p: 1, borderRadius: 1, border: "1px dashed", borderColor: "divider" }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={600}>
                      {att.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(att.attemptedAt).format("YYYY-MM-DD HH:mm")}
                    </Typography>
                  </Stack>
                  {att.error && (
                    <Typography variant="caption" color="error.main">
                      {att.error}
                    </Typography>
                  )}
                  {att.providerResponse && (
                    <Typography variant="caption" color="text.secondary">
                      {att.providerResponse}
                    </Typography>
                  )}
                </Box>
              ))}
              {attempts[job.id] && attempts[job.id].length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No attempts recorded yet.
                </Typography>
              )}
            </Stack>
          </Collapse>
        </Box>
      ))}
    </Stack>
  );
}
