const BASE_URL = "https://www.growmax.io";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Growmax",
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
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

export function softwareApplicationSchema({
  name,
  description,
  path,
  operatingSystem = "Web, iOS, Android",
  category = "BusinessApplication",
  offers,
}: {
  name: string;
  description: string;
  path: string;
  operatingSystem?: string;
  category?: string;
  offers?: { price: string; priceCurrency: string; billingPeriod?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}${path}`,
    applicationCategory: category,
    operatingSystem,
    ...(offers
      ? {
          offers: {
            "@type": "Offer",
            price: offers.price,
            priceCurrency: offers.priceCurrency,
            ...(offers.billingPeriod ? { billingPeriod: offers.billingPeriod } : {}),
          },
        }
      : {}),
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

export function productOfferSchema({
  name,
  description,
  path,
  price,
  priceCurrency = "USD",
  features,
}: {
  name: string;
  description: string;
  path: string;
  price: string;
  priceCurrency?: string;
  features?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${BASE_URL}${path}`,
    brand: {
      "@type": "Organization",
      name: "Growmax",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}${path}`,
    },
    ...(features && features.length > 0
      ? {
          additionalProperty: features.map((f) => ({
            "@type": "PropertyValue",
            name: f,
          })),
        }
      : {}),
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Growmax | B2B Commerce for Industrial Distributors",
    description:
      "Growmax delivers connected B2B commerce platforms for industrial distributors and manufacturers. Founded by ex-Siemens and ex-SAP leaders with 25+ years of industry experience.",
    url: `${BASE_URL}/company/about`,
    mainEntity: organizationSchema(),
  };
}

export function faqPageSchema({
  title,
  path,
  faqs,
}: {
  title: string;
  path: string;
  faqs: { question: string; answer: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: title,
    url: `${BASE_URL}${path}`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
