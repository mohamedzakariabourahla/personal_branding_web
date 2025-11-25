import { useMemo, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Collapse, Divider, Link, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { usePublishingJobs } from "@/features/home/publishing/hooks/usePublishingJobs";

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

const truncateMessage = (message: string | null | undefined, limit = 220) => {
  if (!message) return null;
  return message.length > limit ? `${message.slice(0, limit)}…` : message;
};

function formatAttemptMessage(error: string | null | undefined, providerResponse: string | null | undefined) {
  const friendly = error || providerResponse;
  return truncateMessage(friendly, 240);
}

type Props = {
  refreshKey?: number;
  onChanged?: () => void;
  connectionFilter?: number | null;
};

export default function PublishingJobList({ refreshKey, onChanged, connectionFilter }: Props) {
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const {
    jobs,
    attemptsByJob,
    loading,
    error,
    retryingId,
    cancellingId,
    loadAttempts,
    retryJob,
    cancelJob,
    removeJob,
  } = usePublishingJobs(refreshKey);

  const filteredJobs = useMemo(() => {
    return connectionFilter ? jobs.filter((job) => job.connectionId === connectionFilter) : jobs;
  }, [connectionFilter, jobs]);
  const hasJobs = filteredJobs.length > 0;

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading scheduled posts...</Typography>
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
    if (!attemptsByJob[jobId]) {
      try {
        await loadAttempts(jobId);
      } catch {
        // ignore failures when fetching attempts
      }
    }
  };

  const handleRetry = async (jobId: number) => {
    try {
      await retryJob(jobId);
      if (expandedJobId === jobId) {
        try {
          await loadAttempts(jobId);
        } catch {
          // ignore failures when refreshing attempts
        }
      }
      if (onChanged) {
        onChanged();
      }
    } catch {
      // ignore failures surfaced by retry
    }
  };

  const handleCancel = async (jobId: number) => {
    try {
      await cancelJob(jobId);
      if (onChanged) {
        onChanged();
      }
    } catch {
      // ignore failures surfaced by cancel
    }
  };

  const handleRemoveFromHistory = (jobId: number) => {
    removeJob(jobId);
    if (onChanged) {
      onChanged();
    }
  };

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
      {filteredJobs.map((job) => (
        <Box
          key={job.id}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            sx={{
              flexWrap: "nowrap",
              gap: 2,
              "@media (max-width: 768px)": {
                gap: 1.5,
              },
            }}
          >
            <Stack
              spacing={0.5}
              sx={{
                minWidth: 0,
                flexBasis: { xs: "66%", sm: "66%" },
                flexGrow: 1,
                wordBreak: "break-word",
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                Post-{job.id} : {dayjs(job.scheduledAt).format("YYYY/MM/DD HH:mm")}
              </Typography>
              {job.caption && (
                <Typography variant="body2" color="text.primary">
                  {job.caption}
                </Typography>
              )}
              {job.mediaAssetIds?.length ? (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ maxWidth: 420, overflow: "hidden" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    Media:
                  </Typography>
                  {job.mediaAssetIds.slice(0, 2).map((url, idx) => {
                    const display =
                      url.length > 60 ? `${url.slice(0, 40)}...${url.slice(-10)}` : url;
                    return (
                      <Link
                        key={`${url}-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                          fontSize: "0.9rem",
                          color: "text.primary",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: 320,
                        }}
                        title={url}
                      >
                        {display}
                      </Link>
                    );
                  })}
                  {job.mediaAssetIds.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      +{job.mediaAssetIds.length - 2} more
                    </Typography>
                  )}
                </Stack>
              ) : null}
              {job.externalPostId && (
                <Typography variant="caption" color="text.secondary">
                  Post External ID: {job.externalPostId}
                </Typography>
              )}
            </Stack>

            <Stack
              spacing={0.5}
              alignItems="flex-end"
              sx={{
                flexBasis: { xs: "34%", sm: "34%" },
                flexShrink: 0,
                minWidth: 180,
                maxWidth: 260,
              }}
            >
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
              <Typography variant="caption" color="text.secondary">
                Attempts: {job.attemptCount}
              </Typography>
              <Button size="small" onClick={() => void handleToggleAttempts(job.id)}>
                {expandedJobId === job.id ? "Hide attempts" : "Show attempts"}
              </Button>
              
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
          {(() => {
            const friendlyFailure = truncateMessage(job.failureUserMessage ?? job.failureReason);
            return friendlyFailure ? (
              <Typography variant="caption" color="error.main">
                {friendlyFailure}
              </Typography>
            ) : null;
          })()}
          <Collapse in={expandedJobId === job.id} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1}>
              {(attemptsByJob[job.id] ?? []).map((att) => {
                const attemptMessage = formatAttemptMessage(att.error, att.providerResponse);
                return (
                  <Box key={att.id} sx={{ p: 1, borderRadius: 1, border: "1px dashed", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>
                        {att.status}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(att.attemptedAt).format("YYYY-MM-DD HH:mm")}
                      </Typography>
                    </Stack>
                    {attemptMessage && (
                      <Typography variant="caption" color="error.main">
                        {attemptMessage}
                      </Typography>
                    )}
                  </Box>
                );
              })}
              {attemptsByJob[job.id] && attemptsByJob[job.id].length === 0 && (
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
