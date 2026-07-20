import type { Metadata } from "next";
import ActivateClient from "./activate-client";

export const metadata: Metadata = {
  title: "Ativar Conta — Gpayment",
  description:
    "Ative sua conta Gpayment para começar a receber pagamentos online em Angola.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ActivatePage() {
  return <ActivateClient />;
}
