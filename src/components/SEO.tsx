import { Helmet } from "react-helmet-async";
import { defaultSEOConfig } from "@/config/seo";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps) {
  const metaTitle = title
    ? defaultSEOConfig.titleTemplate.replace("%s", title)
    : defaultSEOConfig.title;
  const metaDescription = description || defaultSEOConfig.description;
  const rawMetaImage = image || defaultSEOConfig.openGraph.images[0].url;

  // Ensure image URL is absolute
  const metaImage = rawMetaImage.startsWith("http")
    ? rawMetaImage
    : `${window.location.origin}${rawMetaImage}`;

  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{metaTitle}</title>
      <meta name='description' content={metaDescription} />
      <link rel='canonical' href={metaUrl} />

      {/* Open Graph */}
      <meta property='og:url' content={metaUrl} />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={metaTitle} />
      <meta property='og:description' content={metaDescription} />
      <meta property='og:image' content={metaImage} />
      <meta
        property='og:site_name'
        content={defaultSEOConfig.openGraph.siteName}
      />
      <meta property='og:locale' content={defaultSEOConfig.openGraph.locale} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={metaTitle} />
      <meta name='twitter:description' content={metaDescription} />
      <meta name='twitter:image' content={metaImage} />
    </Helmet>
  );
}
