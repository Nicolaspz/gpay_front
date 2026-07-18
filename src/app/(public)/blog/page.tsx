import GPayGoBlogGrid from "@/components/landing/blog/g-blog";
import { urbanist } from "@/components/landing/font";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHeader from "@/components/landing/ui/g-header";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";

export default async function Blog() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <main
      className={`${urbanist.variable} bg-white`}
      style={{ fontFamily: "var(--font-urbanist), sans-serif" }}
    >
      <header className="py-[24px]">
        <GPayGoHeader />
      </header>
      <GPayGoBlogGrid articles={posts} />

      <GPayGoFooter logoSrc="/page/logo.svg" />
    </main>
  );
}
