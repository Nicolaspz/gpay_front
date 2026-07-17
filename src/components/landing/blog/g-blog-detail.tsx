import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/data/blog";
import { ArrowLeft } from "lucide-react";

type BlogDetailProps = {
  article: BlogArticle;
};

export default function GPayGoBlogDetail({ article }: BlogDetailProps) {
  return (
    <section
      className="w-full bg-white px-4 pb-16 sm:px-6 lg:px-8"
      style={{ fontFamily: "Urbanist, sans-serif" }}
    >
      <article className="mx-auto flex w-full max-w-[700px] flex-col items-start pt-6 sm:pt-8">

        <h1 className="max-w-[560px] text-[23px] font-semibold leading-[1.15] tracking-[-0.045em] text-[#1F1F1F] sm:text-[27px] md:text-[30px]">
          {article.title}
        </h1>

        <p className="mt-2 text-[11px] font-medium text-[#A1A1A1] sm:text-[12px]">
          {article.subtitle}
        </p>

        <div className="mt-5 flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full bg-[#EDEDED]">
              <Image
                src={article.avatar}
                alt={article.author}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <div className="leading-none">
              <p className="text-[10px] font-medium text-[#2D2D2D] sm:text-[11px]">
                {article.author}
              </p>
              <p className="mt-1 text-[9px] text-[#A1A1A1] sm:text-[10px]">
                {article.authorRole}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-medium text-[#A1A1A1] sm:text-[11px]">
            {article.date}
          </span>
        </div>

        <div className="relative mt-5 h-auto w-full overflow-hidden bg-[#F2F2F2]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 620px"
              priority
            />
          </div>
        </div>

        <div
          className="mt-4 w-full font-medium text-[14px] leading-[1.55] text-[#5E5E5E] sm:text-[16px]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </section>
  );
}
