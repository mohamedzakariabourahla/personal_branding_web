"use client";

import { Stack, TextField } from "@mui/material";
import { PersonalInfo } from "../../models/OnboardingModel";

interface Props {
  data: PersonalInfo;
  onChange: (patch: Partial<PersonalInfo>) => void;
}

export default function StepPersonal({ data, onChange }: Props) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Full name"
        value={data.fullName}
        onChange={(e) => onChange({ fullName: e.target.value })}
        required
      />
      <TextField
        label="Date of birth"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={data.birthDate}
        onChange={(e) => onChange({ birthDate: e.target.value })}
      />
      <TextField
        label="Country of residence"
        value={data.countryOfResidence}
        onChange={(e) => onChange({ countryOfResidence: e.target.value })}
      />
      <TextField
        label="Countries you work in (comma separated)"
        value={data.countriesOfWork.join(", ")}
        onChange={(e) =>
          onChange({
            countriesOfWork: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />
      <TextField
        label="Profession / Role"
        value={data.profession}
        onChange={(e) => onChange({ profession: e.target.value })}
      />
    </Stack>
  );
}
