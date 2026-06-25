import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LangCode } from '../types';
import { buildHead } from '../utils/seo';

interface SEOProps {
  logicalPath: string;
  lang: LangCode;
}

export default function SEO({ logicalPath, lang }: SEOProps) {
  // Use the existing buildHead logic to generate identical tags
  // to what the prerender plugin generates, ensuring smooth hydration.
  const head = buildHead(logicalPath, lang);

  return (
    <Helmet>
      <title>{head.title}</title>
      <meta name="description" content={head.meta.desc} />
      <meta name="keywords" content={head.meta.keywords} />
      <link rel="canonical" href={head.url} />

      {/* Open Graph */}
      <meta property="og:title" content={head.title} />
      <meta property="og:description" content={head.meta.desc} />
      <meta property="og:url" content={head.url} />
      <meta property="og:image" content={head.ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={head.title} />
      <meta name="twitter:description" content={head.meta.desc} />
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
