"use client";

import { AxiosError } from "axios";

export type AuthErrorContext = "login" | "register" | "verify-email" | "verification-resend" | "password-reset";

export type ParsedApiError = {
  code: string | null;
  message: string | null;
  detail: string | null;
  retryAfterSeconds: number | null;
  status: number | null;
};

type ResolvedAuthError = {
  code: string | null;
  message: string;
  retryAfterSeconds: number | null;
};

const FALLBACK_MESSAGES: Record<AuthErrorContext, string> = {
  login: "Unable to sign in right now. Please try again.",
  register: "Unable to complete registration right now. Please try again.",
  "verify-email": "Unable to verify your email address right now.",
  "verification-resend": "Unable to send verification email right now. Please try again.",
  "password-reset": "Unable to reset your password right now. Please try again.",
};

function coerceRetryAfterSeconds(value: unknown): number | null {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return numeric;
  }
  return null;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; detail?: string; errorCode?: string; retryAfterSeconds?: number } | undefined;
    const headerRetry = coerceRetryAfterSeconds(error.response?.headers?.["retry-after"]);
    const bodyRetry = coerceRetryAfterSeconds(data?.retryAfterSeconds);

    return {
      code: data?.errorCode ?? null,
      message: data?.message ?? null,
      detail: data?.detail ?? null,
      retryAfterSeconds: bodyRetry ?? headerRetry,
      status: error.response?.status ?? null,
    };
  }

  if (error instanceof Error) {
    return {
      code: null,
      message: error.message,
      detail: null,
      retryAfterSeconds: null,
      status: null,
    };
  }

  return {
    code: null,
    message: null,
    detail: null,
    retryAfterSeconds: null,
    status: null,
  };
}

function formatMinutes(seconds: number): string {
  const minutes = Math.max(Math.ceil(seconds / 60), 1);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function formatSeconds(seconds: number): string {
  const secs = Math.max(Math.ceil(seconds), 1);
  return `${secs} second${secs === 1 ? "" : "s"}`;
}

export function resolveAuthError(error: unknown, context: AuthErrorContext): ResolvedAuthError {
  const parsed = parseApiError(error);
  const fallback = parsed.detail ?? parsed.message ?? FALLBACK_MESSAGES[context];
  let message = fallback;

  switch (context) {
    case "login": {
      if (parsed.code === "INVALID_CREDENTIALS") {
        message = "The email or password you entered is incorrect.";
      } else if (parsed.code === "USER_EMAIL_NOT_VERIFIED") {
        message = "Please verify your email address before signing in. Check your inbox for the verification link.";
      } else if (parsed.code === "LOGIN_RATE_LIMITED") {
        message =
          parsed.retryAfterSeconds !== null
            ? `Too many failed attempts. Please wait ${formatMinutes(parsed.retryAfterSeconds)} and try again.`
            : "Too many failed attempts. Please wait a few minutes and try again.";
      }
      break;
    }
    case "register": {
      if (parsed.code === "USER_EMAIL_EXISTS") {
        message = "An account with this email already exists. Sign in or reset your password.";
      } else if (parsed.code === "EMAIL_VERIFICATION_RATE_LIMITED") {
        message =
          parsed.retryAfterSeconds !== null
            ? `You requested a verification email recently. Please wait ${formatSeconds(parsed.retryAfterSeconds)} before trying again.`
            : "You requested a verification email recently. Please wait before trying again.";
      } else if (parsed.code === "EMAIL_DISPATCH_FAILED") {
        message = "We couldn't send the verification email. Check your address or try again in a moment.";
      } else if (parsed.code === "INVALID_CREDENTIALS" || parsed.code === "USER_EMAIL_NOT_VERIFIED") {
        message = fallback;
      }
      break;
    }
    case "verify-email": {
      if (parsed.code === "EMAIL_VERIFICATION_TOKEN_EXPIRED") {
        message = "This verification link has expired. Request a new verification email and try again.";
      } else if (parsed.code === "EMAIL_VERIFICATION_TOKEN_NOT_FOUND") {
        message = "This verification link is invalid or has already been used.";
      }
      break;
    }
    case "verification-resend": {
      if (parsed.code === "EMAIL_VERIFICATION_RATE_LIMITED" && parsed.retryAfterSeconds !== null) {
        message = `You can request another verification email in ${formatSeconds(parsed.retryAfterSeconds)}.`;
      }
      break;
    }
    case "password-reset": {
      if (parsed.code === "PASSWORD_RESET_TOKEN_EXPIRED") {
        message = "This reset link has expired. Request a new password reset email and try again.";
      } else if (parsed.code === "PASSWORD_RESET_TOKEN_NOT_FOUND") {
        message = "This reset link is invalid or has already been used.";
      }
      break;
    }
    default:
      message = fallback;
  }

  return {
    code: parsed.code,
    message,
    retryAfterSeconds: parsed.retryAfterSeconds,
  };
}
