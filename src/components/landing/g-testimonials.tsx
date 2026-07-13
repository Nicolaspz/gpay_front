
"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Testimonial = {
  id: string;
  text: string;
  name: string;
  role: string;
  avatarSrc?: string;
  avatarAlt?: string;
};

const testimonials: Testimonial[] = [
  {
    id: "joao-tambue",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.",
    name: "João Tambue",
    role: "Frontend Software Developer",
    avatarSrc: "/page/eu.jpeg",
    avatarAlt: "João Tambue",
  },
  {
    id: "romeu-cajambe",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    name: "Romeu Cajambe",
    role: "Product Designer",
    avatarSrc: "/page/euu.jpeg",
    avatarAlt: "Romeu Cajambe",
  },
  {
    id: "carlos-fernando",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.",
    name: "Carlos Fernando",
    role: "UI Engineer",
    avatarSrc: "/page/chris.jpeg",
    avatarAlt: "Carlos Fernando",
  },
];

function Avatar({
  src,
  alt,
  name,
}: {
  src?: string;
  alt?: string;
  name: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (!src) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9EDF6] text-[12px] font-semibold text-[#1E2433]">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#E9EDF6]">
      <Image src={src} alt={alt ?? name} fill className="object-cover" />
    </div>
  );
}

export default function GPayGoTestimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * 278,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#F7F7FA] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 lg:grid-cols-[390px_1fr] lg:gap-10">
        <div className="">
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7B52FF]">
            Depoimento
          </p>

          <h2 className="mt-2 text-[30px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#0E172A] sm:text-[34px] lg:text-[34px]">
            Construímos confiança com
            <br />
            avaliações de usuários reais.
          </h2>

          <p className="mt-4 font-medium max-w-[340px] text-[13px] leading-[1.55] tracking-[-0.01em] text-[#6E7486]">
            Aumente sua credibilidade exibindo depoimentos autênticos de
            usuários reais, destacando suas experiências positivas e satisfação
            com os serviços da G-Pay.
          </p>

          <div className="mt-9 flex items-center gap-3">
            <button
              type="button"
              aria-label="Depoimento anterior"
              onClick={() => scroll(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#D8DCE7] bg-transparent text-[#101828] transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-[16px] w-[16px] stroke-[2.2]" />
            </button>

            <button
              type="button"
              aria-label="Próximo depoimento"
              onClick={() => scroll(1)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#0B1220] text-white transition-transform hover:scale-[1.02]"
            >
              <ChevronRight className="h-[16px] w-[16px] stroke-[2.2]" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-[14px] overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="relative w-[390px] shrink-0 rounded-[14px] bg-white px-5 py-8 shadow-[0_10px_30px_rgba(28,32,44,0.06)]"
              >
                <div className="flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-[11px] w-[11px] fill-[#F7B500] text-[#F7B500]"
                    />
                  ))}
                </div>

                <p className="mt-4 font-medium text-[14px] leading-[1.55] tracking-[-0.01em] text-[#515A6B]">
                  {testimonial.text}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <Avatar
                    src={testimonial.avatarSrc}
                    alt={testimonial.avatarAlt}
                    name={testimonial.name}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold leading-none text-[#121826]">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 truncate text-[11px] leading-none text-[#6E7486]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}