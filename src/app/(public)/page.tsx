import type { Metadata } from "next";
import GPayGoFaq from "@/components/landing/g-faq";
import GPayGoFeatures from "@/components/landing/g-features";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHero from "@/components/landing/g-hero";
import GPayGoHowItWorks from "@/components/landing/g-how-it-works";
import GPayGoStories from "@/components/landing/g-stories";
import GPayGoTestimonials from "@/components/landing/g-testimonials";
import { urbanist } from "@/components/landing/font";
import GPayGoCTA from "@/components/landing/g-cta";
import {
  OrganizationJsonLd,
  WebsiteJsonLd,
  WebApplicationJsonLd,
  FAQPageJsonLd,
} from "@/components/landing/seo-jsonld";

export const metadata: Metadata = {
  title: "Gpayment — Gateway de Pagamento em Angola | Multicaixa Express, Referências & Stripe",
  description:
    "Gpayment é o gateway de pagamento completo para empresas em Angola. Aceite Multicaixa Express, Referências Multicaixa, PayPay e cartões internacionais via Stripe. Integração rápida e taxas competitivas.",
  keywords: [
    "gateway pagamento angola",
    "multicaixa express pagamento",
    "referência multicaixa online",
    "pagamento online angola",
    "stripe angola",
    "fintech angola",
    "checkout online angola",
    "api pagamento angola",
    "receber pagamentos online",
    "sistema pagamento digital",
  ],
  openGraph: {
    title: "Gpayment — Gateway de Pagamento em Angola",
    description:
      "Aceite pagamentos online em Angola com Multicaixa Express, Referências Multicaixa, PayPay e cartões internacionais via Stripe.",
    url: "https://gpayment.ao",
    siteName: "Gpayment",
    images: [
      {
        url: "https://gpayment.ao/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gpayment — Gateway de Pagamento em Angola",
      },
    ],
    locale: "pt_AO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gpayment — Gateway de Pagamento em Angola",
    description:
      "Aceite pagamentos online em Angola com Multicaixa Express, Referências Multicaixa e cartões internacionais via Stripe.",
    images: ["https://gpayment.ao/og-image.png"],
  },
  alternates: {
    canonical: "https://gpayment.ao",
  },
};

const faqItems = [
  {
    question: "O que é a Gpayment?",
    answer:
      "A Gpayment é uma plataforma de integração de pagamentos digitais que permite às empresas receber pagamentos online em Angola através de métodos como Multicaixa Express, PayPay e Pagamento por Referência.",
  },
  {
    question: "Quais métodos de pagamento a Gpayment suporta?",
    answer:
      "A Gpayment suporta Multicaixa Express, Referências Multicaixa, PayPay e cartões internacionais (Visa/Mastercard) via Stripe.",
  },
  {
    question: "Como funciona o Pagamento por Referência?",
    answer:
      "O Pagamento por Referência permite gerar referências únicas para pagamentos e confirmar a transação de forma simples e organizada.",
  },
  {
    question: "Quanto tempo demora para receber os pagamentos?",
    answer:
      "O tempo de recebimento depende do método utilizado e do fluxo de validação da transação.",
  },
  {
    question: "A Gpayment é segura?",
    answer:
      "Sim. A Gpayment foi pensada para garantir segurança, confiabilidade e controlo nas transações com encriptação de ponta a ponta.",
  },
  {
    question: "Posso integrar a Gpayment na minha loja online?",
    answer:
      "Sim. A plataforma foi criada para integração em lojas online e outros sistemas digitais através da nossa API RESTful.",
  },
];

export default function Home() {
  return (
    <main className={`${urbanist.variable} bg-white`} style={{ fontFamily: "var(--font-urbanist), sans-serif" }}>
      <OrganizationJsonLd url="https://gpayment.ao" />
      <WebsiteJsonLd url="https://gpayment.ao" />
      <WebApplicationJsonLd url="https://gpayment.ao" />
      <FAQPageJsonLd items={faqItems} />
      <GPayGoHero />
      <GPayGoFeatures />
      <GPayGoHowItWorks />
      <GPayGoStories />
      <GPayGoFaq />
      <GPayGoTestimonials />
      <GPayGoCTA
        backgroundSrc="/page/footer-bg.png"
      />
      <GPayGoFooter
        backgroundSrc="/page/footer-bg.png"
        logoSrc="/page/logo.svg"
      />
    </main>
  );
}
