"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import GButton, { GButtonIcon } from "./ui/g-button";

type HowItWorksProps = {
  videoSrc?: string;
};

const steps = [
  {
    number: "01",
    icon: "/icons/download.svg",
    title: "Acesse e crie a sua conta",
    description:
      "Registre-se gratuitamente na plataforma e configure o perfil da sua empresa em minutos.",
  },
  {
    number: "02",
    icon: "/icons/2.svg",
    title: "Configure os métodos de pagamento",
    description:
      "Escolha entre Multicaixa Express, referências bancárias, PayPay ou Stripe para aceitar pagamentos.",
  },
  {
    number: "03",
    icon: "/icons/3.svg",
    title: "Comece a receber pagamentos",
    description:
      "Integre a API ou use o painel para gerar referências e acompanhar todas as suas transações em tempo real.",
  },
];

export default function GPayGoHowItWorks({
  videoSrc = "/page/video.svg",
}: HowItWorksProps) {
  return (
    <section className="bg-[#F6F6F7] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7B52FF]">
              Como funciona
            </p>

            <h2 className="mt-2 max-w-[640px] text-[40px] font-bold leading-[1.08] tracking-[-0.055em] text-[#0F172A] sm:text-[34px] lg:text-[38px]">
              Faça pagamentos, transferências e
              <br />
              muito mais em 3 passos simples
            </h2>
          </div>

          <GButton variant="primary" size="sm" icon={<GButtonIcon size="default" />} href="/register">
            Comece agora
          </GButton>
        </div>

        <div className="mt-10 grid gap-[14px] rounded-[16px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:grid-cols-3 md:p-8">
          {steps.map((step) => {

            return (
              <article
                key={step.number}
                className="relative min-h-[180px] rounded-[16px] px-4 py-5"
              >
                <span className="absolute left-4 top-2 text-[56px] font-semibold leading-none tracking-[-0.08em] text-[#EEF0F4]">
                  {step.number}
                </span>

                <div className="relative mt-8 flex h-10 w-10 items-center justify-center">
                  <Image
                    src={step.icon}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7"
                  />
                </div>

                <h3 className="mt-10 max-w-[230px] text-[20px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#111827]">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-[230px] text-[16px] font-medium leading-[1.55] tracking-[-0.01em] text-[#6B7280]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-[14px] overflow-hidden rounded-[16px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="w-full">
            <Image  
                src={videoSrc}
                alt="video"
                width={100}
                height={100}
                className="object-contain object-bottom w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}