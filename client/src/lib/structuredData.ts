const BASE_URL = "https://www.growmax.io";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Growmax",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "The connected platform for B2B revenue operations. Customer self-ordering portals, sales quote & pricing, partner portals, and ERP integration for industrial distributors and manufacturers.",
    sameAs: [
      "https://www.linkedin.com/company/growmax",
      "https://twitter.com/growaborr",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: `${BASE_URL}/demo`,
    },
  };
}

export function articleSchema({
  title,
  description,
  slug,
  date,
  author,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished: date,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Growmax",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };
}

export function webPageSchema({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}${path}`,
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    publisher: {
      "@type": "Organization",
      name: "Growmax",
    },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Request a Demo | Growmax B2B Revenue Platform",
    description:
      "Schedule a technical consultation with the Growmax architecture team. Deploy pilot programs in 8-12 weeks.",
    url: `${BASE_URL}/demo`,
    publisher: {
      "@type": "Organization",
      name: "Growmax",
    },
  };
}
