"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";

import PayPayLogo from "@/assets/paysmethode/paypay.svg";
import PagaLogo from "@/assets/paysmethode/baipaga.png";
import ExpressLogo from "@/assets/paysmethode/express.png";
import VisaLogo from "@/assets/paysmethode/visa.png";

import PagamentoNaHoraIcon from "@/assets/icons/pagamento-na-hora.svg";
import ExtratoIcon from "@/assets/icons/p-2.svg";
import CarteiraIcon from "@/assets/icons/p-3.svg";
import CartaoIcon from "@/assets/icons/p-4.svg";

interface FeatureCard {
  backgroundColor: string;
  icon: StaticImageData;
  badge?: ReactNode;
  title?: string;
  description?: string;
}

interface PartnerLogo {
  id: string;
  image: StaticImageData;
  alt: string;
  width: number;
  height: number;
}

const partnerLogos: PartnerLogo[] = [
  {
    id: "paypay",
    image: PayPayLogo,
    alt: "PayPay",
    width: 112,
    height: 30,
  },
  {
    id: "paga",
    image: PagaLogo,
    alt: "Paga",
    width: 72,
    height: 28,
  },
  {
    id: "express",
    image: ExpressLogo,
    alt: "Express",
    width: 118,
    height: 28,
  },
  {
    id: "visa",
    image: VisaLogo,
    alt: "Visa",
    width: 110,
    height: 30,
  },
];

const featureCards: FeatureCard[] = [
  {
    backgroundColor: "#EEF2FF",
    icon: PagamentoNaHoraIcon,
    title: "Pagamento na hora",
    description:
      "Envie dinheiro para amigos ou familiares em tempo real, gratuitamente.",
  },
  {
    backgroundColor: "#FBF3E9",
    icon: ExtratoIcon,
    title: "Extrato detalhado",
    description:
      "Acesse o extrato completo de todas as suas transações com filtros por data e status.",
  },
  {
    backgroundColor: "#EAF7FF",
    icon: CarteiraIcon,
    title: "Carteira digital",
    description:
      "Gerencie seus saldos em múltiplas moedas — AOA, USD e EUR — em um só lugar.",
  },
  {
    backgroundColor: "#F2EAFE",
    icon: CartaoIcon,
    title: "Aceite cartões",
    description:
      "Receba pagamentos via Multicaixa Express, referências bancárias e cartões internacionais.",
  },
];

export default function GPayGoFeatures() {
  const cardsRowRef = useRef<HTMLDivElement>(null);

  const scrollCards = (direction: -1 | 1) => {
    cardsRowRef.current?.scrollBy({
      left: direction * 272,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-14 sm:py-[100px]">
      <div className="px-4 sm:px-6 md:px-0">
        <div className="mx-auto w-full max-w-[1170px] px-3 sm:px-[145px]">
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {partnerLogos.map((logo) => (
              <div
                key={logo.id}
                className="flex h-10 items-center justify-center shrink-0"
              >
                <Image
                  src={logo.image}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-auto w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <section className="max-w-[1170px] mx-auto w-full mt-[72px]">
          <div className="max-w-[560px] text-left sm:mt-12">
            <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#10182A] sm:text-[32px]">
              Gerencie seus pagamentos com confiança.
              <br />
              A G-Pay oferece o controle, a confiabilidade
              <br />e a total{" "}
              <span className="text-[#9A9EA9]">
                segurança que você precisa.
              </span>
            </h2>
          </div>
        </section>

        <div className="mt-[80px] overflow-hidden">
          <div
            ref={cardsRowRef}
            className="flex w-full mx-auto max-w-[1170px] gap-[13px] overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {featureCards.map((card, index) => (
              <article
                key={index}
                className="relative h-[324px] min-w-[337px] shrink-0 rounded-[18px] p-4"
                style={{ backgroundColor: card.backgroundColor }}
              >
                <div className="relative inline-flex h-8 w-8 items-center justify-center">
                  <Image
                    src={card.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />

                  {card.badge}
                </div>

                {card.title ? (
                  <div className="mt-auto flex h-[calc(100%-40px)] flex-col justify-end pb-1">
                    <h3 className="max-w-[192px] text-[22px] font-bold leading-[1.05] tracking-[-0.04em] text-[#10182A]">
                      {card.title}
                    </h3>

                    <p className="mt-3 max-w-[220px] font-medium text-[16px] leading-[1.55] tracking-[-0.02em] text-[#596173]">
                      {card.description}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="w-full mx-auto max-w-[1170px] mt-8 flex items-center gap-4 pl-2 sm:mt-10 sm:pl-3">
          <button
            type="button"
            aria-label="Mover cartões para a esquerda"
            onClick={() => scrollCards(-1)}
            className="grid h-9 w-9 place-items-center rounded-full text-[#1E2433] transition-colors hover:bg-black/5"
          >
            <ArrowLeft className="h-5 w-5 stroke-[1.7]" />
          </button>

          <button
            type="button"
            aria-label="Mover cartões para a direita"
            onClick={() => scrollCards(1)}
            className="grid h-9 w-9 place-items-center rounded-full text-[#1E2433] transition-colors hover:bg-black/5"
          >
            <ArrowRight className="h-5 w-5 stroke-[1.7]" />
          </button>
        </div>
      </div>
    </section>
  );
}
