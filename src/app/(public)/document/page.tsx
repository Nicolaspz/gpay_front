import type { Metadata } from "next";
import GPaymentDocumentationClient from "./document-client";
import { BreadcrumbJsonLd } from "@/components/landing/seo-jsonld";

export const metadata: Metadata = {
  title: "Documentação da API — Gpayment Angola",
  description:
    "Guia completo de integração da API de pagamentos Gpayment. Aprenda a autenticar, criar referências, processar transações e gerenciar pagamentos em Angola via Multicaixa Express e Stripe.",
  keywords: [
    "api pagamento angola",
    "documentação api gpayment",
    "integração gateway pagamento",
    "api multicaixa express",
    "api stripe angola",
    "rest api pagamento",
    "webhook pagamento",
  ],
  openGraph: {
    title: "Documentação API — Gpayment",
    description:
      "Guia completo de integração da API de pagamentos Gpayment para desenvolvedores.",
    url: "https://gpayment.ao/document",
    type: "website",
  },
  alternates: {
    canonical: "https://gpayment.ao/document",
  },
};

export default function GPaymentDocumentation() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://gpayment.ao" },
          { name: "Documentação", url: "https://gpayment.ao/document" },
        ]}
      />
      <GPaymentDocumentationClient />
    </>
  );
}
