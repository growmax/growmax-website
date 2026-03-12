import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  structuredData?: Record<string, unknown>;
  extraHead?: ReactNode;
}

const BASE_URL = "https://www.growmax.io";
const OG_IMAGE = `${BASE_URL}/icon-512.png`;

export default function SEOHead({ title, description, path = "", structuredData, extraHead }: SEOHeadProps) {
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@growaboratory" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {extraHead}
    </Helmet>
  );
}
