import OnboardingForm from "@/features/auth/components/OnboardingForm";
import PageContainer from "@/shared/components/layouts/PageContainer";
import { VerifiedUserGate } from "@/features/auth/components/guards/VerifiedUserGate";

export default function OnboardingPage() {
  return (
    <VerifiedUserGate>
      <PageContainer>
        <OnboardingForm />
      </PageContainer>
    </VerifiedUserGate>
  );
}
