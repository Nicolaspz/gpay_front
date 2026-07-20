interface OrganizationJsonLdProps {
  url: string;
}

export function OrganizationJsonLd({ url }: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gpayment",
    alternateName: ["G-Pay", "GPay", "G-Payment", "Gpayment Angola"],
    url,
    logo: `${url}/page/logo.svg`,
    description:
      "Gateway de pagamento em Angola. Integração com Multicaixa Express, Referências Multicaixa, PayPay e cartões internacionais via Stripe.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AO",
      addressLocality: "Luanda",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Portuguese", "English"],
      email: "suporte@gpayment.ao",
      telephone: "+244-222-123-457",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  url: string;
}

export function WebsiteJsonLd({ url }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gpayment - Gateway de Pagamento em Angola",
    alternateName: "Gpayment",
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebApplicationJsonLdProps {
  url: string;
}

export function WebApplicationJsonLd({ url }: WebApplicationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Gpayment",
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Plataforma de gateway de pagamento para empresas em Angola. Aceite pagamentos via Multicaixa Express, referências bancárias e cartões internacionais.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AOA",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQPageJsonLdProps {
  items: Array<{ question: string; answer: string }>;
}

export function FAQPageJsonLd({ items }: FAQPageJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}

export function BlogPostJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    ...(image && { image }),
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Gpayment",
      logo: {
        "@type": "ImageObject",
        url: "https://gpayment.ao/page/logo.svg",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
