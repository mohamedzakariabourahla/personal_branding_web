"use client";

import { Stack, TextField, MenuItem } from "@mui/material";
import { PreferencesInfo, Tone, PostFrequency } from "../../models/OnboardingModel";

interface Props {
  data: PreferencesInfo;
  onChange: (patch: Partial<PreferencesInfo>) => void;
}

const tones: Tone[] = ["Professional", "Casual", "Funny", "Inspirational"];
const frequencies: PostFrequency[] = ["Daily", "Weekly", "Monthly"];

export default function StepPreferences({ data, onChange }: Props) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Favorite color"
        value={data.favoriteColor}
        onChange={(e) => onChange({ favoriteColor: e.target.value })}
      />
      <TextField
        label="Tone"
        select
        value={data.tone}
        onChange={(e) => onChange({ tone: e.target.value as Tone })}
      >
        {tones.map((t) => (
          <MenuItem key={t} value={t}>{t}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Post frequency"
        select
        value={data.postFrequency}
        onChange={(e) => onChange({ postFrequency: e.target.value as PostFrequency })}
      >
        {frequencies.map((f) => (
          <MenuItem key={f} value={f}>{f}</MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
