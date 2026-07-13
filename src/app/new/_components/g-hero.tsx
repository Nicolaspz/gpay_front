"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { TrendingUp, UserCircle2 } from "lucide-react";
import G_logo from "@/assets/logo.svg";
import G_imagem1 from "@/assets/eu.jpeg";
import G_imagem2 from "@/assets/chris.jpeg";
import G_imagem3 from "@/assets/euu.jpeg";
import G_vector from "@/assets/Vector.svg";
import GButton, { GButtonIcon } from "./g-button";

type HeroProps = {
backgroundImage?: string;
heroImage?: string;
};

const navItems = ["Início", "Sobre", "Serviço", "Preço", "Blog", "Docs"];

export default function GPayGoHero({
  backgroundImage = "/page/bg.png",
  heroImage = "/page/modelo.png",
  }: HeroProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
  setHasScrolled(window.scrollY > 10);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };

}, []);

const headerShellStyles = hasScrolled
  ? "mx-auto w-[min(100%,1040px)] rounded-full border border-white/60 bg-white/70 px-4 py-3 shadow-[0_18px_50px_rgba(13,19,48,0.10)] backdrop-blur-xl"
  : "mx-auto w-full rounded-none border border-transparent bg-transparent px-0 py-0 shadow-none backdrop-blur-0";

  return (
  <section className="w-full bg-white px-4 py-4 sm:px-6 lg:px-8">
    <div className="mx-auto w-full">
  <div
    className="relative overflow-hidden rounded-[28px] border border-[#ECE8FF] bg-white"
    style={{
    boxShadow: "0 10px 40px rgba(145, 128, 255, 0.08)",
  }}
  >
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
    backgroundImage: `url(${backgroundImage})`,
  }}
/>

      <div className="relative z-10 min-h-[598px] w-full mx-auto max-w-[1170px] pt-6 sm:pt-7 lg:pt-7">
        <div className={`sticky top-4 z-50 transition-all duration-300 ease-out ${headerShellStyles}`}>
          <header className="flex items-center justify-between gap-4">
            <div className="relative h-10 w-[118px] shrink-0 sm:h-11 sm:w-[132px]">
              <Image
                src={G_logo}
                alt="GPayGo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            <nav className="hidden items-center gap-8 xl:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[15px] font-medium text-[#40414F] transition-colors hover:text-[#5E53FF]"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                aria-label="Conta"
                className="grid h-9 w-9 place-items-center rounded-full text-[#1E1E2C] transition-colors hover:bg-white/70"
              >
                <UserCircle2 className="h-[18px] w-[18px] stroke-[1.8]" />
              </button>

              <GButton
                variant="primary"
                size="default"
                icon={<GButtonIcon size="default" />}
              >
                Criar uma conta
              </GButton>
            </div>
          </header>
        </div>

        <div className="relative mt-10 min-h-[598px] lg:mt-12">
          <div className="relative z-10 max-w-[740px] pt-2 lg:pt-10 xl:pl-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-[#7B52FF] sm:text-[14px]">
              PAGAMENTOS SIMPLIFICADOS
            </p>

            <h1 className="mt-3 max-w-[740px] text-[41px] font-bold leading-[1.15] tracking-[-0.045em] text-[#0D1330] sm:text-[48px] md:text-[58px] lg:text-[64px] xl:text-[66px]">
              A plataforma que integra
              <br />
              pagamentos online em
              <br />
              Angola
            </h1>

            <div className="absolute top-55 right-50">
              <Image src={G_vector} alt="linha decorativa" />
            </div>

            <p className="mt-4 max-w-[520px] text-[16px] font-medium leading-[1.55] text-[#5A5F73] sm:text-[17px]">
              O Gpayment oferece tudo o que precisa para aceitar pagamentos
              <br />
              em Angola de forma simples e eficiente.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
              <GButton
                variant="primary"
                size="default"
                icon={<GButtonIcon size="default" />}
              >
                Entrar Em Contacto
              </GButton>

              <GButton
                variant="secondary"
                size="default"
                icon={<GButtonIcon size="default" />}
              >
                Comece Agora
              </GButton>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[520px] lg:block">
            <div className="absolute bottom-0 right-0 h-[608px] w-[507px]">
              <Image
                src={heroImage}
                alt="Mulher a usar telemóvel"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>

            <div className="absolute -left-[30px] top-[400px] z-20 w-[186px] rounded-[10px] bg-white px-4 py-4 shadow-[0_10px_30px_rgba(24,24,60,0.10)]">
              <p className="text-[14px] font-bold leading-none text-[#23263A]">
                Pagamento Processados
              </p>
              <p className="mt-1 text-[15px] font-extrabold tracking-[-0.03em] text-[#5E53FF]">
                +25.000.000
              </p>
              <div className="mt-2 flex items-end justify-between gap-3 text-[13px] font-medium text-[#6D7285]">
                <span>01 Jan, 2026</span>
                <span className="flex gap-2 text-[#28C77B]">
                  3.09% <TrendingUp size={16} />
                </span>
              </div>
            </div>

            <div className="absolute right-[22px] top-[300px] z-20 flex h-[54px] items-center gap-3 rounded-[10px] bg-white px-4 shadow-[0_10px_30px_rgba(24,24,60,0.10)]">
              <div className="flex -space-x-2">
                <Image
                  src={G_imagem1}
                  alt="Usuário 1"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
                <Image
                  src={G_imagem2}
                  alt="Usuário 2"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
                <Image
                  src={G_imagem3}
                  alt="Usuário 3"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
              </div>

              <div className="leading-none">
                <p className="text-[13px] font-bold text-[#23263A]">+12</p>
                <p className="mt-1 text-[11px] font-medium text-[#6D7285]">
                  usuários ativos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

);
}