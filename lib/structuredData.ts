const BASE_URL = "https://www.growmax.io";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Growmax",
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
    description: "The connected platform for B2B revenue operations. Customer self-ordering portals, sales quote & pricing, partner portals, and ERP integration for industrial distributors and manufacturers.",
    sameAs: ["https://www.linkedin.com/company/growmax", "https://twitter.com/growaborr"],
    contactPoint: { "@type": "ContactPoint", contactType: "sales", url: `${BASE_URL}/demo` },
  };
}

// Search engines and AI answer engines only read ISO 8601 dates; posts store a display date
// ("Sep 5, 2025"), so it is parsed here, falling back to the row's created_at.
function toIsoDate(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  // A display date carries no time zone; keep it a plain calendar date so it never shifts a day.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function articleSchema({ title, description, slug, date, author, createdAt, updatedAt }: { title: string; description: string; slug: string; date: string; author: string; createdAt?: string | Date | null; updatedAt?: string | Date | null }) {
  const url = `${BASE_URL}/blog/${slug}`;
  const datePublished = toIsoDate(date) ?? toIsoDate(createdAt);
  const modified = toIsoDate(updatedAt);
  const dateModified = modified && (!datePublished || modified > datePublished) ? modified : datePublished;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${BASE_URL}/opengraph.jpg`,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: "Growmax", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/icon-512.png` } },
  };
}

export function webPageSchema({ title, description, path, keywords }: { title: string; description: string; path: string; keywords?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}${path}`,
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    publisher: { "@type": "Organization", name: "Growmax" },
  };
}

export function softwareApplicationSchema({ name, description, path, operatingSystem = "Web, iOS, Android", category = "BusinessApplication", offers }: { name: string; description: string; path: string; operatingSystem?: string; category?: string; offers?: { price: string; priceCurrency: string; billingPeriod?: string } }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}${path}`,
    applicationCategory: category,
    operatingSystem,
    ...(offers ? { offers: { "@type": "Offer", price: offers.price, priceCurrency: offers.priceCurrency, ...(offers.billingPeriod ? { billingPeriod: offers.billingPeriod } : {}) } } : {}),
    publisher: { "@type": "Organization", name: "Growmax", logo: { "@type": "ImageObject", url: `${BASE_URL}/icon-512.png` } },
  };
}

export function productOfferSchema({ name, description, path, price, priceCurrency = "USD", features }: { name: string; description: string; path: string; price: string; priceCurrency?: string; features?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${BASE_URL}${path}`,
    brand: { "@type": "Organization", name: "Growmax" },
    offers: { "@type": "Offer", price, priceCurrency, priceValidUntil: "2026-12-31", availability: "https://schema.org/InStock", url: `${BASE_URL}${path}` },
    ...(features && features.length > 0 ? { additionalProperty: features.map((f) => ({ "@type": "PropertyValue", name: f })) } : {}),
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Growmax | B2B Commerce for Industrial Distributors",
    description: "Growmax delivers connected B2B commerce platforms for industrial distributors and manufacturers. Founded by ex-Siemens and ex-SAP leaders with 25+ years of industry experience.",
    url: `${BASE_URL}/company/about`,
    mainEntity: organizationSchema(),
  };
}

export function faqPageSchema({ title, path, faqs }: { title: string; path: string; faqs: { question: string; answer: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: title,
    url: `${BASE_URL}${path}`,
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export function collectionPageSchema({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${BASE_URL}${path}`,
    publisher: { "@type": "Organization", name: "Growmax" },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Request a Demo | Growmax B2B Revenue Platform",
    description: "Schedule a technical consultation with the Growmax architecture team. Deploy pilot programs in 8-12 weeks.",
    url: `${BASE_URL}/demo`,
    publisher: { "@type": "Organization", name: "Growmax" },
  };
}
