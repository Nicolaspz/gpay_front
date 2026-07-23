import type { Metadata } from "next";
import ResetPasswordClient from "./reset-password-client";

export const metadata: Metadata = {
  title: "Redefinir Senha — Gpayment",
  description:
    "Redefina a senha da sua conta Gpayment de forma rápida e segura.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
