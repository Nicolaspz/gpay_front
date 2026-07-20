import type { Metadata } from "next";
import GPayGoBlogGrid from "@/components/landing/blog/g-blog";
import { urbanist } from "@/components/landing/font";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHeader from "@/components/landing/ui/g-header";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";
import { BreadcrumbJsonLd } from "@/components/landing/seo-jsonld";

export const metadata: Metadata = {
  title: "Blog — Notícias, Guias e Novidades sobre Pagamentos Digitais em Angola",
  description:
    "Explore artigos, guias e novidades sobre pagamentos digitais, e-commerce e fintech em Angola. Acompanhe as últimas tendências do mercado de pagamentos.",
  keywords: [
    "blog pagamentos digitais angola",
    "artigos fintech angola",
    "guia pagamento online angola",
    "notícias e-commerce angola",
    "blog gpayment",
    "tendências pagamentos africa",
  ],
  openGraph: {
    title: "Blog Gpayment — Pagamentos Digitais em Angola",
    description:
      "Artigos, guias e novidades sobre pagamentos digitais, e-commerce e fintech em Angola.",
    url: "https://gpayment.ao/blog",
    images: [
      {
        url: "https://gpayment.ao/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blog Gpayment",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://gpayment.ao/blog",
  },
};

export default async function Blog() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <main
      className={`${urbanist.variable} bg-white`}
      style={{ fontFamily: "var(--font-urbanist), sans-serif" }}
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://gpayment.ao" },
          { name: "Blog", url: "https://gpayment.ao/blog" },
        ]}
      />
      <header className="py-[24px]">
        <GPayGoHeader />
      </header>
      <GPayGoBlogGrid articles={posts} />

      <GPayGoFooter logoSrc="/page/logo.svg" />
    </main>
  );
}
