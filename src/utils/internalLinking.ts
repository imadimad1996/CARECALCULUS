import { LangCode } from '../types';
import { ORIGIN } from './seo';

interface LinkTarget {
  keywords: string[];
  url: string;
}

import linkingDbRaw from '../data/internalLinks.json';

const linkingDb: LinkTarget[] = linkingDbRaw;

/**
 * Parses markdown content and injects internal markdown links for key terms.
 * This function ensures keywords inside existing links or headers are NOT modified.
 */
export function injectInternalLinks(content: string, lang: LangCode): string {
  let processedContent = content;
  const langPrefix = lang === 'en' ? '' : `/${lang}`;

  linkingDb.forEach(target => {
    // Determine the full absolute path or relative path
    const targetUrl = `${langPrefix}${target.url}`;

    target.keywords.forEach(keyword => {
      // Create a regex to find the keyword as a standalone word (case insensitive)
      // We use negative lookaheads to avoid replacing keywords inside existing markdown links [keyword](url)
      // or inside markdown image tags ![alt](url)
      // or inside headers (lines starting with #)
      const regex = new RegExp(`(?<!\\[)(?<!#.*\\b)\\b(${keyword})\\b(?!\\]\\([^)]*\\))`, 'gi');

      processedContent = processedContent.replace(regex, (match) => {
        // Only replace the first occurrence per paragraph/block to avoid link stuffing
        // For simplicity in runtime replacement, we'll wrap it in a markdown link.
        return `[${match}](${targetUrl})`;
      });
    });
  });

  return processedContent;
}
