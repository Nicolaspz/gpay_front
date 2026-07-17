// components/landing/blog/g-blog.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blogArticles } from "@/data/blog";

type TrendItem = {
  slug: string;
  title: string;
  image: string;
  author: string;
  date: string;
};

const ARTICLES_PER_PAGE = 4;
const CAROUSEL_INTERVAL = 5000;

export default function GPayGoBlogGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const articles = blogArticles;
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const carouselArticles = articles.slice(0, 5);

  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % carouselArticles.length);
  }, [carouselArticles.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const trendItems: TrendItem[] = articles.slice(0, 3).map((article) => ({
    slug: article.slug,
    title: article.title,
    image: article.cover,
    author: article.author,
    date: article.date,
  }));

  const featuredSidebar = articles[3] ?? articles[0];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1170px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* LEFT CONTENT */}
          <div>
            <div className="grid gap-6 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start">
              <h1 className="max-w-[420px] text-[30px] font-bold leading-[1.03] tracking-[-0.05em] text-[#1F1F1F] sm:text-[34px]">
                Explore as últimas novidades e atualizações da G-PayGo
              </h1>
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
              {currentArticles.map((article) => (
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

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] transition-all duration-200 hover:border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-[#E5E5E5]"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-10 min-w-[40px] rounded-full px-4 text-sm font-medium transition-colors hover:bg-[#F5F5F5] ${
                      page === currentPage
                        ? "bg-[#1F1F1F] text-white hover:bg-[#1F1F1F]"
                        : "text-[#666]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] transition-all duration-200 hover:border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-[#E5E5E5]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="pt-2">
            <p className="max-w-[270px] font-medium text-[15px] leading-[1.55] text-[#767676]">
              Explore artigos, guias e novidades sobre pagamentos digitais,
              e-commerce e fintech em Angola.
            </p>

            <div className="mt-8">
              <h2 className="text-[18px] font-semibold leading-none tracking-[-0.03em] text-[#1F1F1F]">
                Trending Post
              </h2>

              <div className="mt-5 space-y-5">
                {trendItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <div className="relative h-[150px] w-[150px] shrink-0 overflow-hidden bg-[#EDEDED] rounded-sm">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="72px"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[12px] font-medium leading-none text-[#9A9A9A]">
                        {item.date}
                      </p>

                      <h3 className="mt-1 line-clamp-2 font-semibold max-w-[200px] text-[14px] leading-[1.35] tracking-[-0.01em] text-[#1F1F1F]">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-5 w-5 overflow-hidden rounded-full bg-[#EDEDED">
                          <Image
                            src={item.image}
                            alt=""
                            width={20}
                            height={20}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-[12px] font-medium text-[#767676]">
                          {item.author}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 relative">
              <Link href={`/blog/${carouselArticles[carouselIndex].slug}`} className="block">
                <article className="relative h-[400px] overflow-hidden bg-[#1F1535] rounded-sm">
                  {carouselArticles.map((article, index) => (
                    <div
                      key={article.slug}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === carouselIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={article.cover}
                        alt={article.title}
                        fill
                        className="object-cover opacity-35 mix-blend-screen"
                        sizes="340px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />

                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <p className="text-[10px] leading-none text-white/75">
                          {article.date}
                        </p>
                        <h3 className="mt-2 max-w-[240px] text-[17px] leading-[1.3] tracking-[-0.04em] text-white">
                          {article.title}
                        </h3>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full bg-white/20">
                            <Image
                              src={article.avatar}
                              alt=""
                              width={24}
                              height={24}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-[11px] text-white/80">
                            {article.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </article>
              </Link>

              <div className="mt-5 flex justify-center gap-2">
                {carouselArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      index === carouselIndex
                        ? "bg-[#1F1F1F] scale-110"
                        : "bg-[#D7D7D7] hover:bg-[#999]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function PaginationDot({ active = false }: { active?: boolean }) {
  return (
    <span
      className={[
        "block h-2.5 w-2.5 rounded-full transition-all",
        active ? "bg-[#1F1F1F]" : "bg-[#D9D9D9]",
      ].join(" ")}
    />
  );
}

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    date: string;
  };
};

type BlogCardProps = {
  post: BlogPost;
};

function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="w-full">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EDEDED] rounded-sm">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
            priority={false}
          />
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-[11px] leading-none text-[#8E8E8E]">
            <span className="font-normal text-[#606060]">
              {post.author.name}
            </span>
            <span>•</span>
            <span>{post.author.date}</span>
          </div>
        </div>

        <h3 className="mt-2 max-w-[320px] text-[18px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#1F1F1F] sm:text-[18px]">
          {post.title}
        </h3>

        <p className="mt-2 max-w-[330px] font-medium text-[16px] leading-[1.45] text-[#676767]">
          {post.excerpt}
        </p>

        <span className="mt-4 inline-flex h-[32px] items-center gap-2 bg-[#F2F2F2] px-3 text-[11px] font-medium uppercase tracking-[0.04em] text-[#444] transition-colors group-hover:bg-[#E8E8E8]">
          <span>READ MORE</span>
          <ChevronRight className="h-3.5 w-3.5 stroke-[1.8]" />
        </span>
      </Link>
    </article>
  );
}
