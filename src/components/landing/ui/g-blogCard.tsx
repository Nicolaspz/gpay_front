import { ChevronRight } from "lucide-react";
import Image from "next/image";

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
  
  type BlogCardProps = {
    post: BlogPost;
  };

export function BlogCard({ post }: BlogCardProps) {
    return (
      <article className="w-full">
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EDEDED]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
            priority={false}
          />
        </div>
  
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-[11px] leading-none text-[#8E8E8E]">
            <span className="font-normal text-[#606060]">{post.author.name}</span>
            <span>•</span>
            <span>{post.author.date}</span>
          </div>
        </div>
  
        <h3 className="mt-2 max-w-[320px] text-[17px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#1F1F1F] sm:text-[18px]">
          {post.title}
        </h3>
  
        <p className="mt-2 max-w-[330px] text-[13px] leading-[1.45] text-[#676767]">
          {post.excerpt}
        </p>
  
        <a
          href="#"
          className="mt-4 inline-flex h-[32px] items-center gap-2 bg-[#F2F2F2] px-3 text-[11px] font-medium uppercase tracking-[0.04em] text-[#444] transition-colors hover:bg-[#E8E8E8]"
        >
          <span>LER MAIS</span>
          <ChevronRight className="h-3.5 w-3.5 stroke-[1.8]" />
        </a>
      </article>
    );
  }