"use client";

import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { PlatformsInfo } from "../../models/OnboardingModel";

interface Props {
  data: PlatformsInfo;
  onChange: (patch: Partial<PlatformsInfo>) => void;
}

export default function StepPlatforms({ data, onChange }: Props) {
  const toggle = (key: keyof PlatformsInfo) => 
    onChange({ [key]: !data[key] });

  return (
    <FormGroup>
      {Object.keys(data).map((platform) => (
        <FormControlLabel
          key={platform}
          control={<Checkbox checked={data[platform as keyof PlatformsInfo]} onChange={() => toggle(platform as keyof PlatformsInfo)} />}
          label={platform.charAt(0).toUpperCase() + platform.slice(1)}
        />
      ))}
    </FormGroup>
  );
}
