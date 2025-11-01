"use client";

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useOnboarding } from "../hooks/useOnboarding";
import {
  fetchOnboardingProfile,
  fetchReferenceData,
} from "../api/authApi";
import {
  OnboardingRequest,
  OnboardingResponse,
  ReferenceDataCollections,
} from "../models/OnboardingModel";
import { FONT_STYLES } from "../constants/onboardingOptions";
import BrandColorPicker from "@/shared/components/BrandColorPicker";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";

type FormErrors = Partial<Record<keyof OnboardingRequest | "general", string>>;

const emptyForm: OnboardingRequest = {
  fullName: "",
  phoneNumber: "",
  companyName: "",
  position: "",
  brandColor: "",
  fontStyle: "",
  nicheIds: [],
  audienceIds: [],
  toneIds: [],
  platformIds: [],
  countryIds: [],
  postingFrequencyIds: [],
};

function toOnboardingRequest(profile: OnboardingResponse | null): OnboardingRequest {
  if (!profile) {
    return { ...emptyForm };
  }

  return {
    fullName: profile.fullName ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    companyName: profile.companyName ?? "",
    position: profile.position ?? "",
    brandColor: profile.brandColor ?? "",
    fontStyle: profile.fontStyle ?? "",
    nicheIds: (profile.niches ?? []).map((item) => item.id),
    audienceIds: (profile.audiences ?? []).map((item) => item.id),
    toneIds: (profile.tones ?? []).map((item) => item.id),
    platformIds: (profile.platforms ?? []).map((item) => item.id),
    countryIds: (profile.countries ?? []).map((item) => item.id),
    postingFrequencyIds: (profile.postingFrequencies ?? []).map((item) => item.id),
  };
}

export default function OnboardingForm() {
  const { loading, success, successMessage, error, handleOnboarding } = useOnboarding();
  const { hydrated } = useAuthSession();

  const [form, setForm] = useState<OnboardingRequest>({ ...emptyForm });
  const [referenceData, setReferenceData] = useState<ReferenceDataCollections | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const countriesInputRef = useRef<HTMLInputElement | null>(null);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [reference, profile] = await Promise.all([
          fetchReferenceData(),
          fetchOnboardingProfile().catch(() => null),
        ]);

        if (!isMounted) return;

        setReferenceData(reference);
        setForm(toOnboardingRequest(profile));
      } catch (loadError) {
        if (!isMounted) return;
        setFetchError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load onboarding data. Please try again."
        );
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = <K extends keyof OnboardingRequest>(key: K, value: OnboardingRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (!form.companyName.trim()) nextErrors.companyName = "Company name is required.";
    if (!form.position.trim()) nextErrors.position = "Your role or position is required.";
    if (!form.brandColor) nextErrors.brandColor = "Please choose a brand color.";
    if (!form.fontStyle) nextErrors.fontStyle = "Select a preferred font style.";

    if (!form.nicheIds.length) nextErrors.nicheIds = "Select at least one niche.";
    if (!form.audienceIds.length) nextErrors.audienceIds = "Select at least one audience.";
    if (!form.toneIds.length) nextErrors.toneIds = "Select at least one tone.";
    if (!form.platformIds.length) nextErrors.platformIds = "Choose at least one platform.";
    if (!form.countryIds.length) nextErrors.countryIds = "Select one or more markets.";
    if (!form.postingFrequencyIds.length) {
      nextErrors.postingFrequencyIds = "Choose a posting frequency.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    handleOnboarding(form);
  };

  const resolvedCountries = useMemo(
    () => referenceData?.countries ?? [],
    [referenceData]
  );

  if (!hydrated || initializing) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        sx={{
          maxWidth: 640,
          mx: "auto",
          textAlign: "center",
          py: 6,
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {fetchError}
        </Typography>
        <Typography color="text.secondary">
          Refresh the page or try again later. If the issue persists, contact support.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        mx: "auto",
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 5 },
        backgroundColor: "background.default",
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
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Profile Details
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                error={Boolean(formErrors.fullName)}
                helperText={formErrors.fullName}
                required
              />
              <TextField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(event) => handleChange("phoneNumber", event.target.value)}
                error={Boolean(formErrors.phoneNumber)}
                helperText={formErrors.phoneNumber}
                required
              />
              <TextField
                label="Company Name"
                value={form.companyName}
                onChange={(event) => handleChange("companyName", event.target.value)}
                error={Boolean(formErrors.companyName)}
                helperText={formErrors.companyName}
                required
              />
              <TextField
                label="Position / Title"
                value={form.position}
                onChange={(event) => handleChange("position", event.target.value)}
                error={Boolean(formErrors.position)}
                helperText={formErrors.position}
                required
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Brand Identity
            </Typography>
            <Stack spacing={3}>
              <FormControl fullWidth error={Boolean(formErrors.nicheIds)}>
                <InputLabel required>Niche</InputLabel>
                <Select
                  multiple
                  value={form.nicheIds}
                  onChange={(event) => {
                    const value = event.target.value as number[] | string[];
                    handleChange(
                      "nicheIds",
                      Array.isArray(value) ? value.map(Number) : []
                    );
                  }}
                  input={<OutlinedInput label="Niche" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const label = referenceData?.niches.find((item) => item.id === id)?.name;
                        return <Chip key={id} label={label ?? id} />;
                      })}
                    </Box>
                  )}
                  required
                >
                  {(referenceData?.niches ?? []).map((niche) => (
                    <MenuItem key={niche.id} value={niche.id}>
                      {niche.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.nicheIds && <FormHelperText>{formErrors.nicheIds}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={Boolean(formErrors.audienceIds)}>
                <InputLabel required>Target Audience</InputLabel>
                <Select
                  multiple
                  value={form.audienceIds}
                  onChange={(event) => {
                    const value = event.target.value as number[] | string[];
                    handleChange(
                      "audienceIds",
                      Array.isArray(value) ? value.map(Number) : []
                    );
                  }}
                  input={<OutlinedInput label="Target Audience" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const label = referenceData?.audiences.find((item) => item.id === id)?.name;
                        return <Chip key={id} label={label ?? id} />;
                      })}
                    </Box>
                  )}
                  required
                >
                  {(referenceData?.audiences ?? []).map((audience) => (
                    <MenuItem key={audience.id} value={audience.id}>
                      {audience.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.audienceIds && (
                  <FormHelperText>{formErrors.audienceIds}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={Boolean(formErrors.toneIds)}>
                <InputLabel required>Tone & Personality</InputLabel>
                <Select
                  multiple
                  value={form.toneIds}
                  onChange={(event) => {
                    const value = event.target.value as number[] | string[];
                    handleChange(
                      "toneIds",
                      Array.isArray(value) ? value.map(Number) : []
                    );
                  }}
                  input={<OutlinedInput label="Tone & Personality" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const label = referenceData?.tones.find((item) => item.id === id)?.name;
                        return <Chip key={id} label={label ?? id} />;
                      })}
                    </Box>
                  )}
                  required
                >
                  {(referenceData?.tones ?? []).map((tone) => (
                    <MenuItem key={tone.id} value={tone.id}>
                      {tone.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.toneIds && <FormHelperText>{formErrors.toneIds}</FormHelperText>}
              </FormControl>

              <Box>
                <BrandColorPicker
                  value={form.brandColor}
                  onChange={(color) => handleChange("brandColor", color)}
                />
                {formErrors.brandColor && (
                  <Typography color="error" variant="body2" mt={1}>
                    {formErrors.brandColor}
                  </Typography>
                )}
              </Box>

              <FormControl fullWidth error={Boolean(formErrors.fontStyle)}>
                <InputLabel required>Font Style</InputLabel>
                <Select
                  value={form.fontStyle}
                  label="Font Style"
                  onChange={(event) => handleChange("fontStyle", event.target.value)}
                  required
                >
                  <MenuItem value="">
                    <em>Select font style</em>
                  </MenuItem>
                  {FONT_STYLES.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.fontStyle && <FormHelperText>{formErrors.fontStyle}</FormHelperText>}
              </FormControl>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Market Focus
            </Typography>
            <Autocomplete
              multiple
              options={resolvedCountries}
              value={resolvedCountries.filter((country) =>
                form.countryIds.includes(country.id)
              )}
              onChange={(_, selected) => {
                handleChange("countryIds", selected.map((country) => country.id));
                setAutocompleteOpen(false); 
                if (countriesInputRef.current) {
                  countriesInputRef.current.blur();
                }
              }}
              filterSelectedOptions
              getOptionLabel={(option) => option.name}
              onFocus={(event) => {
                if (event.target === countriesInputRef.current) {
                  setAutocompleteOpen(true);
                }
              }} 
              onBlur={(event) => {
                if (event.relatedTarget !== countriesInputRef.current) {
                  setAutocompleteOpen(false);
                }
              }} 
              open={autocompleteOpen} 
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={(node) => {
                    countriesInputRef.current = node;
                    const ref = params.inputProps.ref;
                    if (typeof ref === "function") {
                      ref(node);
                    } else if (ref && typeof ref === "object") {
                      (ref as MutableRefObject<HTMLInputElement | null>).current = node;
                    }
                  }}
                  label="Focus Countries"
                  placeholder="Start typing to search..."
                  error={Boolean(formErrors.countryIds)}
                  helperText={formErrors.countryIds}
                  //sx={{ backgroundColor: "lightgray" }} 
                />
              )}
            />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Platforms & Strategy
            </Typography>
            <Stack spacing={3}>
              <FormControl fullWidth error={Boolean(formErrors.platformIds)}>
                <InputLabel required>Preferred Platforms</InputLabel>
                <Select
                  multiple
                  value={form.platformIds}
                  onChange={(event) => {
                    const value = event.target.value as number[] | string[];
                    handleChange(
                      "platformIds",
                      Array.isArray(value) ? value.map(Number) : []
                    );
                  }}
                  input={<OutlinedInput label="Preferred Platforms" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const label = referenceData?.platforms.find((item) => item.id === id)?.name;
                        return <Chip key={id} label={label ?? id} />;
                      })}
                    </Box>
                  )}
                  required
                >
                  {(referenceData?.platforms ?? []).map((platform) => (
                    <MenuItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.platformIds && (
                  <FormHelperText>{formErrors.platformIds}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth error={Boolean(formErrors.postingFrequencyIds)}>
                <InputLabel required>Posting Frequency</InputLabel>
                <Select
                  value={form.postingFrequencyIds[0] ?? ""}
                  label="Posting Frequency"
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    handleChange("postingFrequencyIds", Number.isNaN(value) ? [] : [value]);
                  }}
                  required
                >
                  <MenuItem value="">
                    <em>Select posting frequency</em>
                  </MenuItem>
                  {(referenceData?.postingFrequencies ?? []).map((frequency) => (
                    <MenuItem key={frequency.id} value={frequency.id}>
                      {frequency.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.postingFrequencyIds && (
                  <FormHelperText>{formErrors.postingFrequencyIds}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ fontWeight: 700, py: 1.3, borderRadius: 2, boxShadow: 2 }}
            >
              {loading ? <CircularProgress size={26} /> : "Save & Continue"}
            </Button>
            {(error || formErrors.general) && (
              <Typography color="error" textAlign="center" mt={2}>
                {error ?? formErrors.general}
              </Typography>
            )}
            {success && successMessage && (
              <Typography color="success.main" textAlign="center" mt={2}>
                {successMessage}
              </Typography>
            )}
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
