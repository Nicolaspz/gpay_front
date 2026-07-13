"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type GPayGoFaqProps = {
  illustrationSrc?: string;
};

const faqItems: FaqItem[] = [
  {
    question: "O que é a Gpayment?",
    answer:
      "A Gpayment é uma plataforma de integração de pagamentos digitais que permite às empresas receber pagamentos online em Angola através de métodos como Multicaixa Express, PayPay e Pagamento por Referência.",
  },
  {
    question: "Quais métodos de pagamento a Gpayment suporta?",
    answer:
      "A Gpayment suporta diferentes métodos de pagamento para atender cenários variados de integração e operação.",
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
      "Sim. A Gpayment foi pensada para garantir segurança, confiabilidade e controlo nas transações.",
  },
  {
    question: "Posso integrar a Gpayment na minha loja online?",
    answer:
      "Sim. A plataforma foi criada para integração em lojas online e outros sistemas digitais.",
  },
];

export default function GPayGoFaq({
  illustrationSrc = "/page/image.png",
}: GPayGoFaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10 lg:grid-cols-[1fr_300px] lg:items-center lg:gap-12">
        <div className="max-w-[720px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7B52FF]">
            FAQ
          </p>

          <h2 className="mt-2 max-w-[560px] text-[30px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#0E172A] sm:text-[34px] lg:text-[38px]">
            Perguntas Frequentes
          </h2>

          <div className="mt-10 border-t border-[#E5E7EF]">
            {faqItems.map((item, index) => {
              const isOpen = index === openIndex;

              return (
                <div key={item.question} className="border-b border-[#E5E7EF]">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-[14px] leading-[1.35] tracking-[-0.02em] sm:text-[15px] ${
                        isOpen
                          ? "font-semibold text-[#0E172A]"
                          : "font-medium text-[#5E6474]"
                      }`}
                    >
                      {item.question}
                    </span>

                    <span className="shrink-0 text-[#7B52FF]">
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 stroke-[2.2]" />
                      ) : (
                        <Plus className="h-4 w-4 stroke-[2.2]" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`grid overflow-hidden transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-[560px] text-[13px] leading-[1.5] tracking-[-0.01em] text-[#77809A]">
                        {item.answer}
                      </p>
                    </div>
                  </div>

                  {isOpen ? (
                    <div className="-mt-px h-[1px] w-full bg-[#B8B4FF]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden justify-self-end lg:block">
          <div className="relative h-[500px] w-[400px]">
            <Image
              src={illustrationSrc}
              alt="Ilustração decorativa"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}