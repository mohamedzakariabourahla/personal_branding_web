"use client";

import { Stack, TextField } from "@mui/material";
import { BrandInfo } from "../../models/OnboardingModel";

interface Props {
  data: BrandInfo;
  onChange: (patch: Partial<BrandInfo>) => void;
}

export default function StepBrand({ data, onChange }: Props) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Brand name"
        value={data.brandName}
        onChange={(e) => onChange({ brandName: e.target.value })}
        required
      />
      <TextField
        label="Niche / Industry"
        value={data.niche}
        onChange={(e) => onChange({ niche: e.target.value })}
      />
      <TextField
        label="Tagline"
        value={data.tagline}
        onChange={(e) => onChange({ tagline: e.target.value })}
      />
      <TextField
        label="Short description"
        multiline
        rows={3}
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
    </Stack>
  );
}
