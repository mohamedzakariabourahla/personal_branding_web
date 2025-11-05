import { VerifiedUserGate } from "@/features/auth/components/guards/VerifiedUserGate";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <VerifiedUserGate>{children}</VerifiedUserGate>;
}
