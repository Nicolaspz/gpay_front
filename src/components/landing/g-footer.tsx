"use client";

import Image from "next/image";
import Link from "next/link";
import GButton from "./g-button";

type GPayGoFooterProps = {
  backgroundSrc?: string;
  logoSrc?: string;
};

const usefulLinks = [
  { label: "Documentação", href: "/document" },
  { label: "Suporte", href: "mailto:suporte@gpayment.ao" },
  { label: "Vendas", href: "mailto:vendas@gpayment.ao" },
  { label: "+244 222 123 457", href: "tel:+244222123457" },
];

const otherPages = [
  { label: "Política de Reembolso", href: "/refund" },
  { label: "Termos e Condições", href: "/terms" },
];

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
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative flex min-h-[452px] flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
            <h2 className="max-w-[560px] text-[24px] font-semibold leading-[1.18] tracking-[0.05em] text-white sm:text-[28px]">
              Pronto para vivenciar pagamentos
              <br />
              seguros e fluídos?
            </h2>

            <p className="mt-3 max-w-[600px] font-medium text-[12px] leading-[1.5] text-white/85 sm:text-[14px]">
              Pronto para pagamentos seguros e descomplicados ? Comece a usar a
              G-PayGo hoje mesmo: é rápido, gratuito e focado em manter suas
              transações seguras !
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <GButton variant="primary" size="lg" href="/login">
                Entrar Em Contato
              </GButton>

              <GButton variant="outline" size="lg" href="/register">
                Comece Agora
              </GButton>
            </div>
          </div>
        </section>

        <section className="px-1 py-10 sm:px-2 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.8fr] lg:gap-12">
            <div className="max-w-[230px]">
              <GPayGoLogo logoSrc={logoSrc} />

              <p className="mt-4 max-w-[370px] font-medium text-[13px] leading-[1.7] tracking-[-0.01em] text-[#61677A]">
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

              <div className="mt-4 space-y-3 text-[13px] leading-[1.5] font-medium text-[#5F6576]">
                <Link href={usefulLinks[0].href} className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                  {usefulLinks[0].label}
                </Link>
                <Link href={usefulLinks[1].href} className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                  {usefulLinks[1].label}
                </Link>
                <div>
                  <Link href={usefulLinks[2].href} className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                    {usefulLinks[2].label}
                  </Link>
                  <Link href={usefulLinks[3].href} className="block w-fit border-b border-transparent hover:border-[#9CA3AF]">
                    {usefulLinks[3].label}
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-[#0F172A]">
                Outras páginas
              </h3>

              <div className="mt-4 space-y-3 font-medium text-[13px] leading-[1.5] text-[#5F6576]">
                {otherPages.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block w-fit border-b border-transparent hover:border-[#9CA3AF]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#E7E7EC] pt-5">
            <div className="flex flex-col gap-3 font-medium text-[13px] text-[#61677A] sm:flex-row sm:items-center sm:justify-between">
              <p>Desenvolvida pela <Link href="https://g-corporate.com/" target="_blank" className="border-b border-transparent hover:border-[#9CA3AF]">G-Corporate</Link></p>
              <p>Copyright 2026 © Gpayment. Todos os Direitos Reservados.</p>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}