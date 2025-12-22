import type { PortableTextBlock } from '@portabletext/types';

export interface BaseSection {
  _key: string;
  _type: string;
}

/* --- HERO --- */
export interface SectionHeroMain extends BaseSection {
  _type: 'sectionHeroMain';
  slides: unknown[];
}

/* --- OVERVIEW --- */
export interface SectionOverview extends BaseSection {
  _type: 'sectionOverview';
  theme?: 'light' | 'dark';
  heading?: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  image?: { url: string; alt?: string };
  imageLayout?: 'imgLeft' | 'imgRight';
  imageGrid?: '1/1' | '2/3' | '3/2';
  list?: unknown;
  cta?: unknown;
}

/* --- BANNER --- */
export interface SectionBanner extends BaseSection {
  _type: 'sectionBanner';
  body?: PortableTextBlock[];
  reference?: PortableTextBlock[];
}

/* --- UNION --- */
export type PageSection = SectionHeroMain | SectionOverview | SectionBanner;
