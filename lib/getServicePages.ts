// lib/getServicePages.ts
import { client } from '@/sanity/lib/client';

interface ServicePage {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  orderRank?: number;
  sections?: any[]; //TODO
}

// Get ALL service pages (for listings, navigation, etc.)
export async function getServicePages(): Promise<ServicePage[]> {
  const query = `*[_type == "servicePage"] | order(orderRank asc){
    title,
    "slug": slug.current,
    orderRank
  }`;

  try {
    const pages = await client.fetch(query);
    return pages;
  } catch (error) {
    console.error('Error fetching service pages:', error);
    return [];
  }
}

// Get a SINGLE service page by slug
export async function getServicePage(slug: string): Promise<ServicePage | null> {
  const query = `*[_type == "servicePage" && slug.current == $slug][0]{
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
    console.error('Error fetching service page:', error);
    return null;
  }
}

// Get all service slugs (for generateStaticParams)
export async function getAllServiceSlugs(): Promise<string[]> {
  const query = `*[_type == "servicePage" && defined(slug.current)]{
    "slug": slug.current
  }`;

  try {
    const pages = await client.fetch(query);
    return pages.map((page: { slug: string }) => page.slug);
  } catch (error) {
    console.error('Error fetching service slugs:', error);
    return [];
  }
}