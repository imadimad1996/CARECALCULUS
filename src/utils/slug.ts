// Shared slug helpers for giving every blog post, journal article, course, and
// presentation its own shareable, indexable URL.

/**
 * Turn an arbitrary title into a URL-safe, SEO-friendly slug.
 * Handles Latin diacritics (é, à, ç…) and strips anything non-alphanumeric.
 * Falls back to the provided id when a title produces an empty slug
 * (e.g. an Arabic-only title).
 */
export function slugify(title: string, fallbackId?: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .toLowerCase()
    .replace(/['’"]/g, '') // drop apostrophes/quotes without inserting a dash
    .replace(/[^a-z0-9]+/g, '-') // everything else becomes a dash
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
    .slice(0, 80)
    .replace(/-+$/g, '');

  if (base) return base;
  return fallbackId ? fallbackId.toLowerCase() : '';
}

/**
 * Locate an item in a list by matching the URL slug against each item's
 * title-derived slug, then falling back to a direct id match. This keeps old
 * id-based links working and tolerates minor title edits.
 */
export function findBySlug<T extends { id: string }>(
  items: T[],
  slug: string | undefined,
  getTitle: (item: T) => string
): T | null {
  if (!slug) return null;
  const target = slug.toLowerCase();
  return (
    items.find(item => slugify(getTitle(item), item.id) === target) ||
    items.find(item => item.id.toLowerCase() === target) ||
    null
  );
}
