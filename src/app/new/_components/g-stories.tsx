"use client";

import Image, { StaticImageData } from "next/image";

import PayPayBackground from "@/assets/story/paypay-background.png";
import PayPayLogo from "@/assets/story/logo-paypay.png";
import TupucaLogo from "@/assets/story/tupuca-logo.png";

interface Story {
  id: number;
  title: string;
  image?: StaticImageData;
  logo: StaticImageData;
  featured?: boolean;
}

const stories: Story[] = [
  {
    id: 1,
    title: "Agora é possível realizar top up usando o cartão Visa dentro da PayPay.",
    image: PayPayBackground,
    logo: PayPayLogo,
    featured: true,
  },

  {
    id: 2,
    title:
      "TUPUCA processa +100 transações por mês utilizando tecnologia de ponta.",
    logo: TupucaLogo,
  },

  {
    id: 3,
    title:
      "TUPUCA processa +100 transações por mês utilizando tecnologia de ponta.",
    logo: TupucaLogo,
  },

  {
    id: 4,
    title:
      "TUPUCA processa +100 transações por mês utilizando tecnologia de ponta.",
    logo: TupucaLogo,
  },

  {
    id: 5,
    title:
      "TUPUCA processa +100 transações por mês utilizando tecnologia de ponta.",
    logo: TupucaLogo,
  },
];

export default function GPayGoStories() {
  const featuredStory = stories.find((story) => story.featured);

  const secondaryStories = stories.filter((story) => !story.featured);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto w-full max-w-[1170px] px-4">

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7B52FF]">
            Confiança
          </p>

          <h2 className="max-w-[620px] text-[44px] font-bold leading-[1.1] tracking-[-0.05em] text-[#0F172A]">
            Quando a certeza importa,
            <br />
            a G-Pay é a plataforma preferida.
          </h2>
        </div>
        

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.25fr_1fr]">

          {/* CARD PRINCIPAL */}

          {featuredStory && (
            <article className="relative overflow-hidden rounded-[6px] h-[713px]">

              <Image
                src={featuredStory.image!}
                alt=""
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/80" />

              <span className="absolute right-4 top-4 text-[11px] font-medium uppercase tracking-wider text-white">
                STORY
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
          )}

          {/* GRID */}

          <div className="grid grid-cols-2 gap-4">

            {secondaryStories.map((story) => (

              <article key={story.id}>

                <div className="relative overflow-hidden rounded-[6px] bg-[#F5F3F0]">

                  <span className="absolute left-4 top-4 text-[11px] uppercase tracking-wide text-[#3C3C3C]">
                    STORY
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

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}