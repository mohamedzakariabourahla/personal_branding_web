"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import AuthPageTemplate from "@/features/auth/components/AuthPageTemplate";

export default function LoginPage() {
  return (
    <AuthPageTemplate
      title="Welcome Back"
      subtitle="Log in to continue creating, scheduling, and growing your social media presence."
    >
      <LoginForm />
    </AuthPageTemplate>
  );
}
