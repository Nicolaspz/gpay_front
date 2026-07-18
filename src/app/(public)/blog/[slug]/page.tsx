import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { POST_QUERY } from "@/sanity/queries";
import GPayGoBlogDetail from "@/components/landing/blog/g-blog-detail";
import { urbanist } from "@/components/landing/font";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHeader from "@/components/landing/ui/g-header";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await client.fetch(POST_QUERY, { slug });

  if (!article) {
    notFound();
  }

  return (
    <main
      className={`${urbanist.variable} bg-white`}
      style={{ fontFamily: "var(--font-urbanist), sans-serif" }}
    >
      <header className="py-[24px]">
        <GPayGoHeader />
      </header>
      <GPayGoBlogDetail article={article} />
      <GPayGoFooter logoSrc="/page/logo.svg" />
    </main>
  );
}
