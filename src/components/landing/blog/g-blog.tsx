// components/landing/blog/g-blog.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blogArticles } from "@/data/blog";

type TrendItem = {
  slug: string;
  title: string;
  image: string;
  author: string;
  date: string;
};

export default function GPayGoBlogGrid() {
  const articles = blogArticles;

  const trendItems: TrendItem[] = [
    {
      slug: articles[0]?.slug ?? "#",
      title: "Sustainable Travel Tips: Reducing Your Carbon Footprint",
      image: articles[0]?.cover ?? "/page/blog/trend-1.png",
      author: "Clara Wilson",
      date: "Nov 29, 2024",
    },
    {
      slug: articles[1]?.slug ?? "#",
      title: "The Rise of Minimalist Interior Design",
      image: articles[1]?.cover ?? "/page/blog/trend-2.png",
      author: "Sophia Turner",
      date: "Nov 29, 2024",
    },
    {
      slug: articles[2]?.slug ?? "#",
      title: "Mastering Night Photography: Capturing the Dark",
      image: articles[2]?.cover ?? "/page/blog/trend-3.png",
      author: "James Harper",
      date: "Nov 29, 2024",
    },
  ];

  const featuredSidebar = articles[3] ?? articles[0];

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
              {articles.slice(0, 4).map((article) => (
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

            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                className="
      flex h-10 w-10 items-center justify-center
      rounded-full border border-[#E5E5E5]
      transition-all duration-200
      hover:border-[#1F1F1F]
      hover:bg-[#1F1F1F]
      hover:text-white
    "
              >
                <ChevronLeft size={16} />
              </button>

              <button
                className="
      h-10 min-w-[40px]
      rounded-full
      bg-[#1F1F1F]
      px-4
      text-sm
      font-semibold
      text-white
    "
              >
                1
              </button>

              <button
                className="
      h-10 min-w-[40px]
      rounded-full
      px-4
      text-sm
      font-medium
      text-[#666]
      transition-colors
      hover:bg-[#F5F5F5]
    "
              >
                2
              </button>

              <button
                className="
      h-10 min-w-[40px]
      rounded-full
      px-4
      text-sm
      font-medium
      text-[#666]
      transition-colors
      hover:bg-[#F5F5F5]
    "
              >
                3
              </button>

              <span className="px-1 text-[#999]">...</span>

              <button
                className="
      h-10 min-w-[40px]
      rounded-full
      px-4
      text-sm
      font-medium
      text-[#666]
      transition-colors
      hover:bg-[#F5F5F5]
    "
              >
                12
              </button>

              <button
                className="
      flex h-10 w-10 items-center justify-center
      rounded-full border border-[#E5E5E5]
      transition-all duration-200
      hover:border-[#1F1F1F]
      hover:bg-[#1F1F1F]
      hover:text-white
    "
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="pt-2">
            <p className="max-w-[270px] font-medium text-[15px] leading-[1.55] text-[#767676]">
              Dive into a world of insights, ideas, and inspiration. Stay
              updated with the latest trends shaping our present and future.
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

            <Link href={`/blog/${featuredSidebar.slug}`} className="mt-8 block">
              <article className="relative h-[400px] overflow-hidden bg-[#1F1535] rounded-sm">
                <Image
                  src={featuredSidebar.cover}
                  alt={featuredSidebar.title}
                  fill
                  className="object-cover opacity-35 mix-blend-screen"
                  sizes="340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="text-[10px] leading-none text-white/75">
                    Nov 29, 2024
                  </p>
                  <h3 className="mt-2 max-w-[240px] text-[17px] leading-[1.3] tracking-[-0.04em] text-white">
                    The Science of Sleep: How Rest Shapes Your Productivity
                  </h3>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-6 w-6 overflow-hidden rounded-full bg-white/20">
                      <Image
                        src={featuredSidebar.cover}
                        alt=""
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] text-white/80">
                      Daniel Cruz
                    </span>
                  </div>
                </div>
              </article>
            </Link>

            <div className="mt-5 flex justify-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1F1F1F]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D7D7D7]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D7D7D7]" />
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
