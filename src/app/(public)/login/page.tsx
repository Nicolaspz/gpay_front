import type { Metadata } from "next";
import { LoginForm } from "@/components/publicc/login-form";

export const metadata: Metadata = {
  title: "Login — Acesse sua conta Gpayment",
  description:
    "Acesse sua conta Gpayment para gerenciar pagamentos, transações e configurações do seu gateway de pagamento em Angola.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://gpayment.ao/login",
  },
};

export default function Login() {
  return <LoginForm />;
}
