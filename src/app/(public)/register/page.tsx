import type { Metadata } from "next";
import RegisterClient from "./register-client";

export const metadata: Metadata = {
  title: "Criar Conta — Registar-se na Gpayment",
  description:
    "Crie sua conta gratuita na Gpayment e comece a receber pagamentos online em Angola via Multicaixa Express, Referências e cartões internacionais.",
  keywords: [
    "registo gpayment",
    "criar conta gateway pagamento",
    "cadastro pagamento online angola",
  ],
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://gpayment.ao/register",
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
