"use client";

import Image from "next/image";
import { ArrowUpRight, CreditCard, Download, Wallet } from "lucide-react";

type HowItWorksProps = {
  videoSrc?: string;
};

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Acessa e crie a conta client",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "----------",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut lib",
  },
  {
    number: "03",
    icon: Wallet,
    title: "----------",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut lib",
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

            <h2 className="mt-2 max-w-[640px] text-[30px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#0F172A] sm:text-[34px] lg:text-[38px]">
              Faça pagamentos, transferências e
              <br />
              muito mais em 3 passos simples
            </h2>
          </div>

          <a
            href="#"
            className="inline-flex h-[42px] items-center gap-3 rounded-full bg-[#5E53FF] pl-5 pr-1.5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(94,83,255,0.18)] transition-transform hover:scale-[1.01]"
          >
            <span>Comece agora</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#5E53FF]">
              <ArrowUpRight className="h-[16px] w-[16px] stroke-[2.4]" />
            </span>
          </a>
        </div>

        <div className="mt-10 grid gap-[14px] rounded-[16px] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:grid-cols-3 md:p-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative min-h-[180px] rounded-[16px] px-4 py-5"
              >
                <span className="absolute left-4 top-2 text-[56px] font-semibold leading-none tracking-[-0.08em] text-[#EEF0F4]">
                  {step.number}
                </span>

                <div className="relative mt-8 flex h-10 w-10 items-center justify-center">
                  <Icon className="h-[28px] w-[28px] stroke-[1.9] text-[#111827]" />
                </div>

                <h3 className="mt-10 max-w-[230px] text-[15px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#111827]">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-[230px] text-[13px] leading-[1.55] tracking-[-0.01em] text-[#6B7280]">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-[14px] overflow-hidden rounded-[16px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="w-full">
            {/* <video
              className="h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            /> */}
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