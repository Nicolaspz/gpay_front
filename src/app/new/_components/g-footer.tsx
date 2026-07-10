"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type GPayGoFooterProps = {
  backgroundSrc?: string;
  logoSrc?: string;
};

const usefulLinks = [
  "Documentação",
  "Suporte - suporte@gpayment.ao",
  "vendas - vendas@gpayment.ao,",
  "+244 222 123 457",
];

const otherPages = ["Politica de Reembolso", "Termos e Condições"];

function GPayGoLogo({ logoSrc }: { logoSrc?: string }) {
  if (logoSrc) {
    return (
      <Image
        src={logoSrc}
        alt="GPayGo"
        width={142}
        height={42}
        className="h-auto w-[142px] object-contain"
        priority
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute h-4 w-4 -translate-x-[3px] rotate-12 rounded-[2px] border-2 border-[#5C54F5]" />
        <span className="absolute h-4 w-4 translate-x-[4px] -translate-y-[2px] rotate-12 rounded-[2px] border-2 border-[#5C54F5]" />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-[24px] font-extrabold tracking-[-0.06em] text-[#1B1D29]">
          GPay
        </span>
        <span className="text-[24px] font-extrabold tracking-[-0.06em] text-[#5C54F5]">
          Go
        </span>
      </div>
    </div>
  );
}

export default function GPayGoFooter({
  backgroundSrc = "/page/footer-bg.png",
  logoSrc,
}: GPayGoFooterProps) {
  return (
    <footer className="bg-white px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1100px]">
        <section className="relative overflow-hidden rounded-[14px]">
          <div className="absolute inset-0">
            <Image
              src={backgroundSrc}
              alt="Fundo da chamada final"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/58" />
          </div>

          <div className="relative flex min-h-[250px] flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
            <h2 className="max-w-[560px] text-[24px] font-semibold leading-[1.18] tracking-[-0.05em] text-white sm:text-[28px]">
              Pronto para vivenciar pagamentos
              <br />
              seguros e fluídos?
            </h2>

            <p className="mt-3 max-w-[600px] text-[11px] leading-[1.5] text-white/85 sm:text-[12px]">
              Pronto para pagamentos seguros e descomplicados ? Comece a usar a
              G-PayGo hoje mesmo: é rápido, gratuito e focado em manter suas
              transações seguras !
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#"
                className="inline-flex h-[44px] items-center rounded-full bg-[#5E53FF] px-5 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(94,83,255,0.22)] transition-transform hover:scale-[1.01]"
              >
                Entrar Em Contato
              </Link>

              <Link
                href="#"
                className="inline-flex h-[44px] items-center gap-2 rounded-full border border-white/90 bg-transparent pl-5 pr-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/8"
              >
                <span>Comece Agora</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#5E53FF]">
                  <ArrowUpRight className="h-[15px] w-[15px] stroke-[2.4]" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-1 py-10 sm:px-2 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.8fr] lg:gap-12">
            <div className="max-w-[230px]">
              <GPayGoLogo logoSrc={logoSrc} />

              <p className="mt-4 max-w-[220px] text-[12px] leading-[1.7] tracking-[-0.01em] text-[#61677A]">
                Oferecemos integração de pagamentos
                <br />
                seguros, fluídos e sem taxas para
                <br />
                transações descomplicadas.
              </p>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0F172A]">
                Links Úteis
              </h3>

              <div className="mt-4 space-y-3 text-[12px] leading-[1.5] text-[#5F6576]">
                <Link href="#" className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                  {usefulLinks[0]}
                </Link>
                <Link href="#" className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                  {usefulLinks[1]}
                </Link>
                <div>
                  <Link href="#" className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                    {usefulLinks[2]}
                  </Link>
                  <Link href="#" className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                    {usefulLinks[3]}
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0F172A]">
                Outras páginas
              </h3>

              <div className="mt-4 space-y-3 text-[12px] leading-[1.5] text-[#5F6576]">
                {otherPages.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="block w-fit border-b border-transparent hover:border-[#9CA3AF]"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#E7E7EC] pt-5">
            <div className="flex flex-col gap-3 text-[11px] text-[#61677A] sm:flex-row sm:items-center sm:justify-between">
              <p>Desenvolvida pela G-Corporate</p>
              <p>Copyright 2026 © Gpayment. Todos os Direitos Reservados.</p>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}