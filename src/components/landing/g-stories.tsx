"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import PayPayBackground from "@/assets/story/paypay-background.png";
import PayPayLogo from "@/assets/story/logo-paypay.png";
import TupucaLogo from "@/assets/story/tupuca-logo.png";
import GButton, { GButtonIcon } from "./ui/g-button";

interface Story {
  id: number;
  slug: string;
  title: string;
  image?: StaticImageData;
  logo: StaticImageData;
  featured?: boolean;
}

const stories: Story[] = [
  {
    id: 1,
    slug: "top-up-visa-paypay",
    title: "Agora é possível realizar top up usando o cartão Visa dentro da PayPay.",
    image: PayPayBackground,
    logo: PayPayLogo,
    featured: true,
  },

  {
    id: 2,
    slug: "gpayment-25-milhoes-transacoes",
    title:
      "Gpayment processa mais de 25 milhões de transações para empresas em todo o Angola.",
    logo: TupucaLogo,
  },

  {
    id: 3,
    slug: "integracao-stripe-pagamentos-internacionais",
    title:
      "Nova integração com Stripe permite receber pagamentos internacionais em USD e EUR.",
    logo: TupucaLogo,
  },

  {
    id: 4,
    slug: "referencias-multicaixa-api",
    title:
      "Referências Multicaixa agora são geradas em tempo real via API da Gpayment.",
    logo: TupucaLogo,
  },

  {
    id: 5,
    slug: "empresas-angolanas-pagamentos-digitais",
    title:
      "Empresas angolanas adotam pagamentos digitais com a segurança da Gpayment.",
    logo: TupucaLogo,
  },
];

export default function GPayGoStories() {
  const featuredStory = stories.find((story) => story.featured);

  const secondaryStories = stories.filter((story) => !story.featured);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto w-full max-w-[1170px] px-4">

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7B52FF]">
              BLOG
            </p>

            <h2 className="max-w-[620px] text-[44px] font-bold leading-[1.1] tracking-[-0.05em] text-[#0F172A]">
              Quando a certeza importa,
              <br />
              a G-Pay é a plataforma preferida.
            </h2>
          </div>

          <GButton variant="primary" size="default" icon={<GButtonIcon size="default" />} href="/blog">
            Ir para blog
          </GButton>
        </div>
        
        

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.25fr_1fr]">

          {/* CARD PRINCIPAL */}

          {featuredStory && (
            <Link href={`/blog/${featuredStory.slug}`}>
              <article className="relative overflow-hidden rounded-[6px] h-[713px]">

                <Image
                  src={featuredStory.image!}
                  alt=""
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/80" />

                <span className="absolute right-4 top-4 text-[11px] font-medium uppercase tracking-wider text-white">
                  Blog
                </span>

                <div className="absolute inset-0 flex items-center justify-center">

                  <Image
                    src={featuredStory.logo}
                    alt="PayPay"
                    width={140}
                    height={42}
                  />

                </div>

                <div className="absolute bottom-6 left-6 max-w-[380px]">

                  <p className="text-[20px] font-semibold leading-[1.25] text-white">
                    {featuredStory.title}
                  </p>

                </div>

                <div className="aspect-[0.67]" />

              </article>
            </Link>
          )}

          {/* GRID */}

          <div className="grid grid-cols-2 gap-4">

            {secondaryStories.map((story) => (

              <Link key={story.id} href={`/blog/${story.slug}`}>
                <article>

                  <div className="relative overflow-hidden rounded-[6px] bg-[#F5F3F0]">

                    <span className="absolute left-4 top-4 text-[11px] uppercase tracking-wide text-[#3C3C3C]">
                      Blog
                    </span>

                    <div className="flex aspect-square items-center justify-center">

                      <Image
                        src={story.logo}
                        alt=""
                        width={110}
                        height={34}
                      />

                    </div>

                  </div>

                  <p className="mt-3 text-[15px] leading-[1.45] text-[#202020]">
                    {story.title}
                  </p>

                </article>
              </Link>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}