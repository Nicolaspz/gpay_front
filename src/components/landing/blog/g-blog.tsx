"use client";

import { BlogCard } from "../ui/g-blogCard";



type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    date: string;
  };
};

const posts: BlogPost[] = [
  {
    id: "1",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,...",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ir...",
    image: "/blog.png",
    author: {
      name: "Author",
      date: "Nov 29, 2024",
    },
  },
  {
    id: "2",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,...",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ir...",
    image: "/blog.png",
    author: {
      name: "Saarah Mcbride",
      date: "Nov 29, 2024",
    },
  },
  {
    id: "3",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,...",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ir...",
    image: "/blog.png",
    author: {
      name: "Cruz Mcintyre",
      date: "Nov 29, 2024",
    },
  },
  {
    id: "4",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,...",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ir...",
    image: "/blog.png",
    author: {
      name: "Author",
      date: "Nov 29, 2024",
    },
  },
  {
    id: "5",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,...",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ir...",
    image: "/blog.png",
    author: {
      name: "Saarah Mcbride",
      date: "Nov 29, 2024",
    },
  },
  {
    id: "6",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,...",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ir...",
    image: "/blog.png",
    author: {
      name: "Cruz Mcintyre",
      date: "Nov 29, 2024",
    },
  },
];

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
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
