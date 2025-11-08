import { VerifiedUserGate } from '@/features/auth/components/guards/VerifiedUserGate';
import WorkspaceLayout from '@/features/home/components/WorkspaceLayout';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <VerifiedUserGate>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </VerifiedUserGate>
  );
}
