"use client";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  OutlinedInput,
  Chip,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { useOnboarding } from "../hooks/useOnboarding";
import {
  AUDIENCES,
  NICHES,
  PLATFORMS,
  POSTING_FREQUENCIES,
  TONES,
} from "../constants/onboardingOptions";
import {
  Audience,
  Niche,
  OnboardingRequest,
  Platform,
  PostingFrequency,
  Tone,
} from "../models/OnboardingModel";
import { getCountries } from "@/shared/utils/loadCountries";
import BrandColorPicker from "@/shared/components/BrandColorPicker";

export default function OnboardingForm() {
  const { loading, success, error, handleOnboarding } = useOnboarding();
  const countries = getCountries();

  const [form, setForm] = useState<OnboardingRequest>({
    niche: "",
    targetAudience: "",
    marketFocus: [],
    tonePersonality: "",
    brandColors: "",
    fontStyle: "",
    preferredPlatforms: [],
    postingFrequency: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof OnboardingRequest>(
    key: K,
    value: OnboardingRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.niche) newErrors.niche = "Please select your niche";
    if (!form.targetAudience) newErrors.targetAudience = "Please select your target audience";
    if (!form.tonePersonality) newErrors.tonePersonality = "Please select tone/personality";
    if (!form.brandColors) newErrors.brandColors = "Please pick a brand color";
    if (form.marketFocus.length === 0)
      newErrors.marketFocus = "Select at least one market focus";
    if (form.preferredPlatforms.length === 0)
      newErrors.preferredPlatforms = "Select at least one platform";
    if (!form.postingFrequency)
      newErrors.postingFrequency = "Please select posting frequency";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    handleOnboarding(form);
  };

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        mx: "auto",
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        boxShadow: 4,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={5}
        color="primary"
      >
        Personalize Your Brand Strategy
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
          {/* SECTION 1: Brand Identity */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Brand Identity
            </Typography>
            <Stack spacing={3}>
              {/* Niche */}
              <FormControl fullWidth error={!!errors.niche}>
                <InputLabel>Niche</InputLabel>
                <Select
                  value={form.niche}
                  label="Niche"
                  onChange={(e) => handleChange("niche", e.target.value as Niche)}
                >
                  <MenuItem value="">
                    <em>Select your niche</em>
                  </MenuItem>
                  {NICHES.map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
                {errors.niche && <FormHelperText>{errors.niche}</FormHelperText>}
              </FormControl>

              {/* Tone & Personality */}
              <FormControl fullWidth error={!!errors.tonePersonality}>
                <InputLabel>Tone & Personality</InputLabel>
                <Select
                  value={form.tonePersonality}
                  label="Tone & Personality"
                  onChange={(e) =>
                    handleChange("tonePersonality", e.target.value as Tone)
                  }
                >
                  <MenuItem value="">
                    <em>Select tone/personality</em>
                  </MenuItem>
                  {TONES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tonePersonality && (
                  <FormHelperText>{errors.tonePersonality}</FormHelperText>
                )}
              </FormControl>

              {/* Brand Color Picker */}
              <Box>
                <BrandColorPicker
                  value={form.brandColors}
                  onChange={(color) => handleChange("brandColors", color)}
                />
                {errors.brandColors && (
                  <Typography color="error" variant="body2" mt={1}>
                    {errors.brandColors}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* SECTION 2: Audience & Market */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Audience & Market Focus
            </Typography>
            <Stack spacing={3}>
              {/* Target Audience */}
              <FormControl fullWidth error={!!errors.targetAudience}>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={form.targetAudience}
                  label="Target Audience"
                  onChange={(e) =>
                    handleChange("targetAudience", e.target.value as Audience)
                  }
                >
                  <MenuItem value="">
                    <em>Select your target audience</em>
                  </MenuItem>
                  {AUDIENCES.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
                {errors.targetAudience && (
                  <FormHelperText>{errors.targetAudience}</FormHelperText>
                )}
              </FormControl>

              {/* Market Focus */}
              <Autocomplete
                multiple
                options={countries}
                getOptionLabel={(option) => option.name}
                value={countries.filter((c) =>
                  form.marketFocus.includes(c.code)
                )}
                onChange={(_, newValue) =>
                  handleChange(
                    "marketFocus",
                    newValue.map((v) => v.code)
                  )
                }
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Market Focus (Countries)"
                    placeholder="Start typing to search..."
                    error={!!errors.marketFocus}
                    helperText={errors.marketFocus}
                  />
                )}
              />
            </Stack>
          </Box>

          {/* SECTION 3: Platforms & Strategy */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Platforms & Strategy
            </Typography>
            <Stack spacing={3}>
              {/* Preferred Platforms */}
              <FormControl fullWidth error={!!errors.preferredPlatforms}>
                <InputLabel>Preferred Platforms</InputLabel>
                <Select
                  multiple
                  value={form.preferredPlatforms}
                  onChange={(e) =>
                    handleChange(
                      "preferredPlatforms",
                      typeof e.target.value === "string"
                        ? (e.target.value.split(",") as Platform[])
                        : (e.target.value as Platform[])
                    )
                  }
                  input={<OutlinedInput label="Preferred Platforms" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {PLATFORMS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
                {errors.preferredPlatforms && (
                  <FormHelperText>{errors.preferredPlatforms}</FormHelperText>
                )}
              </FormControl>

              {/* Posting Frequency */}
              <FormControl fullWidth error={!!errors.postingFrequency}>
                <InputLabel>Posting Frequency</InputLabel>
                <Select
                  value={form.postingFrequency}
                  label="Posting Frequency"
                  onChange={(e) =>
                    handleChange(
                      "postingFrequency",
                      e.target.value as PostingFrequency
                    )
                  }
                >
                  <MenuItem value="">
                    <em>Select posting frequency</em>
                  </MenuItem>
                  {POSTING_FREQUENCIES.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
                {errors.postingFrequency && (
                  <FormHelperText>{errors.postingFrequency}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{
              fontWeight: 700,
              py: 1.3,
              borderRadius: 2,
              boxShadow: 2,
              mt: 2,
            }}
          >
            {loading ? <CircularProgress size={26} /> : "Save & Continue"}
          </Button>

          {/* Feedback */}
          {error && (
            <Typography color="error" textAlign="center" mt={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" textAlign="center" mt={2}>
              Onboarding completed successfully!
            </Typography>
          )}
        </Stack>
      </form>
    </Box>
  );
}
