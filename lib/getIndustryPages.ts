// lib/getIndustryPages.ts
import { client } from '@/sanity/lib/client';

interface IndustryPage {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  orderRank?: number;
  sections?: any[];
}

// Get ALL industry pages
export async function getIndustryPages(): Promise<IndustryPage[]> {
  const query = `*[_type == "industryPage"] | order(orderRank asc){
    title,
    "slug": slug.current,
    orderRank
  }`;

  try {
    const pages = await client.fetch(query);
    return pages;
  } catch (error) {
    console.error('Error fetching industry pages:', error);
    return [];
  }
}

// Get a SINGLE industry page by slug
export async function getIndustryPage(slug: string): Promise<IndustryPage | null> {
  const query = `*[_type == "industryPage" && slug.current == $slug][0]{
    _id,
    title,
    metaTitle,
    metaDescription,
    "slug": slug.current,
    sections[]{
      ...,
      _type
    }
  }`;

  try {
    const page = await client.fetch(query, { slug });
    return page;
  } catch (error) {
    console.error('Error fetching industry page:', error);
    return null;
  }
}

// Get all industry slugs (for generateStaticParams)
export async function getAllIndustrySlugs(): Promise<string[]> {
  const query = `*[_type == "industryPage" && defined(slug.current)]{
    "slug": slug.current
  }`;

  try {
    const pages = await client.fetch(query);
    return pages.map((page: { slug: string }) => page.slug);
  } catch (error) {
    console.error('Error fetching industry slugs:', error);
    return [];
  }
}
