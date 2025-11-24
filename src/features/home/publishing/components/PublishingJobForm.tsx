import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface Props {
  connections: PlatformConnection[];
  onCreated?: () => void;
  serverTime?: string | null;
  accountTimezone?: string;
  selectedConnectionId?: number | null;
}

export default function PublishingJobForm({
  connections,
  onCreated,
  serverTime,
  accountTimezone,
  selectedConnectionId,
}: Props) {
  const [connectionId, setConnectionId] = useState<number | "">("");
  const [caption, setCaption] = useState("");
  const [mediaAssetIds, setMediaAssetIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const maxCaptionLength = 2200;
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const availableConnections = useMemo(
    () => [...connections].sort((a, b) => (a.platformName || "").localeCompare(b.platformName || "")),
    [connections]
  );

  useEffect(() => {
    if (selectedConnectionId) {
      setConnectionId(selectedConnectionId);
    }
  }, [selectedConnectionId]);

  const selectedConnection = useMemo(
    () => connections.find((c) => c.id === connectionId) ?? null,
    [connectionId, connections]
  );

  const localTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const serverTimeValue = useMemo(() => (serverTime ? dayjs(serverTime) : null), [serverTime]);
  const localTimeValue = useMemo(() => dayjs(), []);
  const clockSkewMinutes = useMemo(() => {
    if (!serverTimeValue) return null;
    return Math.round(serverTimeValue.diff(localTimeValue, "minute"));
  }, [localTimeValue, serverTimeValue]);

  const minSchedule = dayjs().add(1, "minute").format("YYYY-MM-DDTHH:mm");

  const applyQuickSchedule = (dt: dayjs.Dayjs) => {
    setScheduledDate(dt.format("YYYY-MM-DDTHH:mm"));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedCaption = caption.trim();
    if (!connectionId) {
      setError("Select a connection to schedule a post.");
      return;
    }
    if (!trimmedCaption) {
      setError("Caption is required.");
      return;
    }
    if (mediaAssetIds.length === 0) {
      setError("Add at least one media asset or URL.");
      return;
    }
    if (!scheduledDate) {
      setError("Pick a scheduled date.");
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
        caption: trimmedCaption,
        mediaAssetIds,
        scheduledAt: new Date(scheduledDate).toISOString(),
      });
      setSuccess("Post scheduled.");
      setCaption("");
      setScheduledDate("");
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
        {!selectedConnection && (
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
                  {conn.platformName} - {conn.externalDisplayName || conn.externalUsername || conn.externalAccountId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600}>Caption</Typography>
          <TextField
            label="Write a caption. Add CTAs, tags, and credits."
            size="small"
            fullWidth
            multiline
            minRows={2}
            placeholder="Write a caption. Add CTAs, tags, and credits."
            helperText={`${caption.length}/${maxCaptionLength}`}
            inputProps={{ maxLength: maxCaptionLength }}
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, maxCaptionLength))}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600}>Media assets</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
            <Button
              variant="outlined"
              component="label"
              disabled={uploading}
              sx={{ minWidth: 180, minHeight: 40, textTransform: "none" }}
            >
              {uploading ? "Uploading..." : "Upload file"}
              <input
                type="file"
                accept="image/*,video/*"
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
              placeholder="https://..."
              InputProps={{
                sx: {
                  minHeight: 40,
                  "& .MuiInputBase-input": {
                    height: "100%",
                    boxSizing: "border-box",
                    py: 0,
                  },
                },
              }}
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
              <Chip
                key={url}
                label={url.length > 32 ? `${url.slice(0, 32)}...` : url}
                onDelete={() => setMediaAssetIds((prev) => prev.filter((u) => u !== url))}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={600}>Scheduled date & time</Typography>
            <TextField
              size="small"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              inputRef={dateInputRef}
              inputProps={{
                min: minSchedule,
                step: 300,
                style: { cursor: "pointer" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Open date time picker"
                      edge="end"
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        const picker = dateInputRef.current as unknown as { showPicker?: () => void } | null;
                        if (picker?.showPicker) {
                          picker.showPicker();
                        } else {
                          dateInputRef.current?.focus();
                        }
                      }}
                    >
                      <CalendarMonthIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  "& input::-webkit-calendar-picker-indicator": {
                    opacity: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    cursor: "pointer",
                  },
                },
              }}
            />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button size="small" variant="outlined" onClick={() => applyQuickSchedule(dayjs().add(1, "minute"))}>
              In 1 minute
            </Button>
            <Button size="small" variant="outlined" onClick={() => applyQuickSchedule(dayjs().add(5, "minute"))}>
              In 5 minutes
            </Button>
            <Button size="small" variant="outlined" onClick={() => applyQuickSchedule(dayjs().add(1, "hour"))}>
              In 1 hour
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => applyQuickSchedule(dayjs().add(1, "day").startOf("day"))}
            >
              Midnight
            </Button>
            <Button size="small" variant="outlined" onClick={() => applyQuickSchedule(dayjs().add(1, "day"))}>
              In 1 day
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Server time: {serverTimeValue ? serverTimeValue.format("YYYY-MM-DD HH:mm") : "Not available"} - Your timezone:{" "}
            {accountTimezone || localTimezone}
            {clockSkewMinutes !== null && ` (offset ${clockSkewMinutes} min)`}
          </Typography>
        </Stack>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule post"}
        </Button>
      </Stack>
    </Box>
  );
}
