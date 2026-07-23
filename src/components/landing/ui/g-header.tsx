"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import G_logo from "@/assets/logo.svg";
import GButton, { GButtonIcon } from "../ui/g-button";
import Link from "next/link";

const navItems = [
  { name: "Início", href: "#" },
  { name: "Serviço", href: "#servico" },
  { name: "Preço", href: "#preco" },
  { name: "blog", href: "/blog" },
  { name: "Docs", href: "/document" },
];

export default function GPayGoHeader() {
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

  const headerStyles = hasScrolled
    ? "fixed top-4 left-1/2 z-50 w-[min(100%-2rem,1040px)] -translate-x-1/2 rounded-full border border-white/60 bg-white/70 px-4 py-3 shadow-[0_18px_50px_rgba(13,19,48,0.10)] backdrop-blur-xl"
    : "relative mx-auto w-full max-w-[1170px] rounded-none border border-transparent bg-transparent px-0 py-0 shadow-none backdrop-blur-0";

  return (
    <div className={headerStyles}>
      <header className="flex items-center justify-between gap-4 px-3 sm:px-0">
        <Link href="/" className="relative h-10 w-[118px] shrink-0 sm:h-11 sm:w-[132px]">
          <Image
            src={G_logo}
            alt="GPayGo"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-[15px] font-medium text-[#40414F] transition-colors hover:text-[#5E53FF]"
            >
              {item.name}
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
            href="/login"
          >
            Entrar
          </GButton>
        </div>
      </header>
    </div>
  );
}
