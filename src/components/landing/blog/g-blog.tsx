"use client";

import { BlogCard } from "../ui/g-blogCard";
import { blogArticles } from "@/data/blog";

export default function GPayGoBlogGrid() {
  return (
    <section
      className="w-full bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      style={{ fontFamily: "Urbanist, sans-serif" }}
    >
      <div className="mx-auto max-w-[1120px]">
        <header className="mx-auto max-w-[640px] text-center">
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#222222] sm:text-[32px]">
            Explore o nosso blog
          </h2>
          <p className="mt-2 text-[15px] leading-[1.5] text-[#4B4B4B] sm:text-[16px]">
            Ideias, tendências e inspiração para um futuro mais brilhante
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <BlogCard
              key={article.slug}
              post={{
                id: article.slug,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                image: article.cover,
                author: {
                  name: article.author,
                  date: article.date,
                },
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
