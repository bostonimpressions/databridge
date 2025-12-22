import { sanityClient } from './sanity';

export interface PageData {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  sections?: any[];
  orderRank?: number; // optional, like service pages
}

// Fetch a single page by slug
export async function getPageData(slug: string): Promise<PageData | null> {
  const query = `*[_type == "page" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    metaTitle,
    metaDescription,
    orderRank,
    sections[]{
      ...,
      _type
    }
  }`;

  try {
    const page = await sanityClient.fetch<PageData>(query, { slug });
    return page || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Fetch all top-level page slugs
export async function getAllPageSlugs(): Promise<string[]> {
  const query = `*[_type == "page" && defined(slug.current)]{
    "slug": slug.current
  }`;

  try {
    const pages = await sanityClient.fetch<{ slug: string }[]>(query);
    return pages.map((p) => p.slug);
  } catch (err) {
    console.error('Error fetching page slugs:', err);
    return [];
  }
}
