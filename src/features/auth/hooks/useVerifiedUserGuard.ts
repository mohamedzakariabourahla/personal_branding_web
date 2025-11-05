"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/shared/providers/AuthSessionProvider";

export function useVerifiedUserGuard() {
  const router = useRouter();
  const { user, tokens, hydrated } = useAuthSession();
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!tokens) {
      setPending(true);
      router.replace("/login");
      return;
    }

    if (!user?.emailVerified) {
      setPending(true);
      router.replace("/verify-email");
      return;
    }

    setPending(false);
  }, [hydrated, tokens, user?.emailVerified, router]);

  const allowed = useMemo(() => hydrated && Boolean(tokens) && Boolean(user?.emailVerified), [hydrated, tokens, user?.emailVerified]);

  return {
    allowed,
    pending,
  };
}
