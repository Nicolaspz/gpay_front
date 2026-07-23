"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import GButton, { GButtonIcon } from "./ui/g-button";

type HowItWorksProps = {
  heroImage?: string;
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
    title: "Integre nossa API",
    description:
      "Integre a API ou use o painel para gerar referências e acompanhar todas as suas transações em tempo real.",
  },
  {
    number: "03",
    icon: "/icons/3.svg",
    title: "Comece a receber e a crescer",
    description:
      "Com a conta activa e a integração concluída, o seu negócio aceita pagamentos dos seus clientes.",
  },
];

export default function GPayGoHowItWorks({
  heroImage = "/page/Video.svg",
}: HowItWorksProps) {
  return (
    <section className="bg-[#F6F6F7] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7B52FF] sm:text-[12px]">
              Como funciona
            </p>

            <h2 className="mt-2 max-w-[640px] text-[26px] font-bold leading-[1.08] tracking-[-0.055em] text-[#0F172A] sm:text-[34px] lg:text-[38px]">
              Faça pagamentos, transferências e
              <br className="hidden sm:block" />
              muito mais em 3 passos simples
            </h2>
          </div>

          <div className="hidden sm:block">
            <GButton
              variant="primary"
              size="sm"
              icon={<GButtonIcon size="default" />}
              href="/register"
            >
              Comece agora
            </GButton>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-[14px] rounded-[16px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6 md:grid-cols-3 md:p-8">
          {steps.map((step) => {
            return (
              <article
                key={step.number}
                className="relative min-h-[160px] rounded-[16px] px-4 py-5 sm:min-h-[180px]"
              >
                <span className="absolute left-4 top-2 text-[44px] font-semibold leading-none tracking-[-0.08em] text-[#EEF0F4] sm:text-[56px]">
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

                <h3 className="mt-8 max-w-full text-[18px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#111827] sm:mt-10 sm:text-[20px]">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-full text-[14px] font-medium leading-[1.55] tracking-[-0.01em] text-[#6B7280] sm:text-[16px]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-3 overflow-hidden rounded-[16px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:mt-[14px]">
          <div className="w-full">
            <Image
                src={heroImage || "/page/Video.svg"}
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