"use client";

import { useState } from "react";
import { Button, Box, Stepper, Step, StepLabel, Paper, Typography } from "@mui/material";
import { useOnboarding } from "../hooks/useOnboarding";
import { OnboardingRequest } from "../models/OnboardingModel";
import StepPersonal from "./onboardingSteps/StepPersonal";
import StepBrand from "./onboardingSteps/StepBrand";
import StepPreferences from "./onboardingSteps/StepPreferences";
import StepPlatforms from "./onboardingSteps/StepPlatforms";

const steps = ["Personal Info", "Brand", "Preferences", "Platforms"];

export default function OnboardingForm() {
  const { handleOnboarding, loading, success } = useOnboarding();
  const [activeStep, setActiveStep] = useState(0);

  const [data, setData] = useState<OnboardingRequest>({
    personal: { fullName: "", birthDate: "", countryOfResidence: "", countriesOfWork: [], profession: "" },
    brand: { brandName: "", niche: "", tagline: "", description: "" },
    preferences: { favoriteColor: "", tone: "Professional", postFrequency: "Weekly" },
    platforms: { instagram: false, tiktok: false, youtube: false, facebook: false, linkedin: false },
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleOnboarding(data);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const updateData = <K extends keyof OnboardingRequest>(key: K, patch: Partial<OnboardingRequest[K]>) => {
    setData((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0: return <StepPersonal data={data.personal} onChange={(p) => updateData("personal", p)} />;
      case 1: return <StepBrand data={data.brand} onChange={(p) => updateData("brand", p)} />;
      case 2: return <StepPreferences data={data.preferences} onChange={(p) => updateData("preferences", p)} />;
      case 3: return <StepPlatforms data={data.platforms} onChange={(p) => updateData("platforms", p)} />;
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 6 }}>
      <Typography variant="h5" mb={3} textAlign="center">Onboarding</Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Box>{renderStep()}</Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        <Button variant="contained" onClick={handleNext} disabled={loading}>
          {activeStep === steps.length - 1 ? (loading ? "Submitting..." : "Finish") : "Next"}
        </Button>
      </Box>

      {success && <Typography color="success.main" mt={2}>Onboarding complete!</Typography>}
    </Paper>
  );
}
