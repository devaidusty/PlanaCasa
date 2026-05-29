/**
 * Generate a URL-safe slug from a title string
 * e.g. "Casa Rizal — Modern Filipino" → "casa-rizal-modern-filipino"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')                          // decompose accented chars
    .replace(/[̀-ͯ]/g, '')           // strip accent marks
    .replace(/[^a-z0-9\s-]/g, '')             // remove non-alphanumeric
    .trim()
    .replace(/\s+/g, '-')                      // spaces → hyphens
    .replace(/-+/g, '-')                       // collapse multiple hyphens
}
