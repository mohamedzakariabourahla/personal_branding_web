import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PlatformConnection } from "@/features/home/publishing/models/platformModels";
import { schedulePublishingJob } from "@/features/home/publishing/api/platformApi";
import { uploadAsset } from "@/features/home/publishing/api/assetApi";

interface Props {
  connections: PlatformConnection[];
  onCreated?: () => void;
}

export default function PublishingJobForm({ connections, onCreated }: Props) {
  const [connectionId, setConnectionId] = useState<number | "">("");
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [mediaAssetIds, setMediaAssetIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const availableConnections = useMemo(
    () => [...connections].sort((a, b) => (a.platformName || "").localeCompare(b.platformName || "")),
    [connections]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!connectionId) {
      setError("Select a connection to schedule a post.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const conn = connections.find((c) => c.id === connectionId);
      if (!conn) {
        setError("Selected connection not found.");
        return;
      }
      if (!conn.platformId) {
        setError("Selected connection is missing platform information. Please reconnect and try again.");
        return;
      }
      await schedulePublishingJob({
        platformId: conn.platformId,
        connectionId: conn.id,
        caption: caption.trim() || undefined,
        mediaAssetIds,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      });
      setSuccess("Post scheduled.");
      setCaption("");
      setScheduledAt("");
      setMediaAssetIds([]);
      if (onCreated) {
        onCreated();
      }
    } catch {
      setError("Failed to schedule post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          Schedule a post
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <FormControl fullWidth size="small">
          <InputLabel id="connection-select-label">Connection</InputLabel>
          <Select
            labelId="connection-select-label"
            label="Connection"
            value={connectionId}
            onChange={(e) => setConnectionId(Number(e.target.value))}
            required
          >
            {availableConnections.map((conn) => (
              <MenuItem key={conn.id} value={conn.id}>
                {conn.platformName} – {conn.externalDisplayName || conn.externalUsername || conn.externalAccountId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Caption"
          size="small"
          fullWidth
          multiline
          minRows={2}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Stack spacing={1}>
          <Typography variant="body2">Media assets</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" component="label" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload file"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  if (!e.target.files || e.target.files.length === 0) {
                    return;
                  }
                  setUploading(true);
                  setError(null);
                  try {
                    const uploadedUrls: string[] = [];
                    for (const file of Array.from(e.target.files)) {
                      const resp = await uploadAsset(file);
                      uploadedUrls.push(resp.url);
                    }
                    setMediaAssetIds((prev) => [...prev, ...uploadedUrls]);
                  } catch {
                    setError("Failed to upload media. Please try again.");
                  } finally {
                    setUploading(false);
                    e.target.value = "";
                  }
                }}
              />
            </Button>
            <TextField
              label="Or paste a URL"
              size="small"
              fullWidth
              onBlur={(e) => {
                const url = e.target.value.trim();
                if (url) {
                  setMediaAssetIds((prev) => [...prev, url]);
                  e.target.value = "";
                }
              }}
            />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {mediaAssetIds.map((url) => (
              <Button
                key={url}
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => setMediaAssetIds((prev) => prev.filter((u) => u !== url))}
              >
                Remove
              </Button>
            ))}
          </Stack>
        </Stack>
        <TextField
          label="Scheduled time"
          size="small"
          fullWidth
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule post"}
        </Button>
      </Stack>
    </Box>
  );
}
