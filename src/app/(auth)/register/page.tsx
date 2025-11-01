"use client";

import RegisterForm from "@/features/auth/components/RegisterForm";
import AuthPageTemplate from "@/features/auth/components/AuthPageTemplate";

export default function RegisterPage() {
  return (
    <AuthPageTemplate
      title="Create Your Account"
      subtitle="Sign up to plan, create, and publish your social media content with AI."
    >
      <RegisterForm />
    </AuthPageTemplate>
  );
}
