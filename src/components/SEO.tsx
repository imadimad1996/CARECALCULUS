import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LangCode } from '../types';
import { buildHead } from '../utils/seo';

interface SEOProps {
  logicalPath: string;
  lang: LangCode;
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEO({ logicalPath, lang, title, description, keywords }: SEOProps) {
  // Use the existing buildHead logic to generate identical tags
  // to what the prerender plugin generates, ensuring smooth hydration.
  const head = buildHead(logicalPath, lang);
  
  const finalTitle = title || head.title;
  const finalDesc = description || head.meta.desc;
  const finalKeywords = keywords || head.meta.keywords;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={head.url} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={head.url} />
      <meta property="og:image" content={head.ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={head.ogImage} />

      {/* hreflang alternates */}
      {head.hreflang.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}

      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(head.jsonLd)}
      </script>
    </Helmet>
  );
}
