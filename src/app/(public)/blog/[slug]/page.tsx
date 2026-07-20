import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { POST_QUERY } from "@/sanity/queries";
import GPayGoBlogDetail from "@/components/landing/blog/g-blog-detail";
import { urbanist } from "@/components/landing/font";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHeader from "@/components/landing/ui/g-header";
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/components/landing/seo-jsonld";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await client.fetch(POST_QUERY, { slug });

  if (!article) {
    return { title: "Artigo não encontrado" };
  }

  const description =
    article.excerpt ||
    article.subtitle ||
    `Leia关于${article.title} no blog da Gpayment.`;

  return {
    title: article.title,
    description,
    keywords: [
      article.title,
      article.category || "blog gpayment",
      "pagamentos digitais angola",
      "fintech angola",
      "gpayment blog",
    ],
    openGraph: {
      title: article.title,
      description,
      url: `https://gpayment.ao/blog/${slug}`,
      images: article.cover
        ? [{ url: article.cover, alt: article.title }]
        : [{ url: "https://gpayment.ao/og-image.png", alt: article.title }],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author || "Gpayment"],
      siteName: "Gpayment",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.cover ? [article.cover] : ["https://gpayment.ao/og-image.png"],
    },
    alternates: {
      canonical: `https://gpayment.ao/blog/${slug}`,
    },
  };
}

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
      <BlogPostJsonLd
        title={article.title}
        description={article.excerpt || article.subtitle || article.title}
        url={`https://gpayment.ao/blog/${slug}`}
        image={article.cover}
        datePublished={article.publishedAt || new Date().toISOString()}
        author={article.author || "Gpayment"}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://gpayment.ao" },
          { name: "Blog", url: "https://gpayment.ao/blog" },
          { name: article.title, url: `https://gpayment.ao/blog/${slug}` },
        ]}
      />
      <header className="py-[24px]">
        <GPayGoHeader />
      </header>
      <GPayGoBlogDetail article={article} />
      <GPayGoFooter logoSrc="/page/logo.svg" />
    </main>
  );
}
