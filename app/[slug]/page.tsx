import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultMetadata } from '@/lib/seo';
import { toPlainText } from '@portabletext/react';
import { getPageData, getAllPageSlugs, PageData } from '@/lib/getPageData';

import SectionBanner from '@/components/sections/SectionBanner';
import SectionHeroMain from '@/components/sections/SectionHeroMain';
import SectionHeroSubpage from '@/components/sections/SectionHeroSubpage';
import SectionOverview from '@/components/sections/SectionOverview';
import SectionFeatureList from '@/components/sections/SectionFeatureList';
import SectionFeature from '@/components/sections/SectionFeature';
import SectionSnapshots from '@/components/sections/SectionSnapshots';
import SectionComparison from '@/components/sections/SectionComparison';
import SectionCallToAction from '@/components/sections/SectionCallToAction';
import SectionDetails from '@/components/sections/SectionDetails';
import SectionBody from '@/components/sections/SectionBody';
import SectionMain from '@/components/sections/SectionMain';

interface PageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

const sectionComponents: Record<string, React.ComponentType<any>> = {
  sectionBanner: SectionBanner,
  sectionHeroMain: SectionHeroMain,
  sectionHeroSubpage: SectionHeroSubpage,
  sectionOverview: SectionOverview,
  sectionFeatureList: SectionFeatureList,
  sectionFeature: SectionFeature,
  sectionSnapshots: SectionSnapshots,
  sectionComparison: SectionComparison,
  sectionCallToAction: SectionCallToAction,
  sectionDetails: SectionDetails,
  sectionBody: SectionBody,
  sectionMain: SectionMain,
};

// Utility: generate safe anchor ID from heading or type
function generateAnchorId(section: any, index: number) {
  let title = '';
  
  // For sectionMain, check rows for headings or labels
  if (section._type === 'sectionMain' && section.rows && Array.isArray(section.rows)) {
    // Find first row with a heading
    const rowWithHeading = section.rows.find((row: any) => row.heading);
    if (rowWithHeading?.heading) {
      title = toPlainText(rowWithHeading.heading);
    }
    // If no heading, check for label
    if (!title) {
      const rowWithLabel = section.rows.find((row: any) => row.label);
      if (rowWithLabel?.label) {
        title = rowWithLabel.label;
      }
    }
    // If still no title, try to get any text from first row body
    if (!title && section.rows[0]?.body) {
      const bodyText = toPlainText(section.rows[0].body);
      // Take first few words as fallback
      const words = bodyText.split(/\s+/).slice(0, 3).join(' ');
      if (words) title = words;
    }
  } else if (section?.heading) {
    // For other sections, check top-level heading
    title = toPlainText(section.heading);
  } else if (section?.label) {
    // Check for label at top level
    title = typeof section.label === 'string' ? section.label : toPlainText(section.label);
  } else if (section?.title) {
    // Check for title
    title = typeof section.title === 'string' ? section.title : toPlainText(section.title);
  }
  
  // Fallback to type with index if nothing found
  const base = title || `${section._type || 'section'}-${index}`;
  const id = base
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // spaces → hyphens
    .replace(/[^\w-]/g, '') // remove invalid chars
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-|-$/g, ''); // remove leading/trailing hyphens
  
  return id || `${section._type || 'section'}-${index}`;
}

export const revalidate = 0;

export default async function Page(props: PageProps) {
  const params = props.params instanceof Promise ? await props.params : props.params;

  const slug = params.slug === 'home' ? '/' : params.slug;
  const page: PageData | null = await getPageData(slug);

  if (!page) notFound();

  // Track IDs to ensure uniqueness
  const usedIds = new Set<string>();

  return (
    <main className="font-sans">
      {page.sections?.map((section, i) => {
        const { _type, ...sectionProps } = section;
        const SectionComponent = sectionComponents[_type];

        if (!SectionComponent) {
          console.warn(`Unknown section type: ${_type}`);
          return null;
        }

        // Generate an anchor ID
        let anchorId = generateAnchorId(section, i);
        
        // Ensure uniqueness by appending index if needed
        let uniqueId = anchorId;
        let counter = 0;
        while (usedIds.has(uniqueId)) {
          counter++;
          uniqueId = `${anchorId}-${counter}`;
        }
        usedIds.add(uniqueId);

        return (
          <div
            id={uniqueId}
            key={`${_type}-${i}`}
            className="scroll-mt-24" // Tailwind: offset scroll for sticky nav (~6rem)
          >
            <SectionComponent {...sectionProps} />
          </div>
        );
      })}
    </main>
  );
}

// Generate static params for all pages
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({
    slug: slug === '/' ? 'home' : slug,
  }));
}

// Generate metadata
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = props.params instanceof Promise ? await props.params : props.params;
  const slug = params.slug === 'home' ? '/' : params.slug;

  const page: PageData | null = await getPageData(slug);

  if (!page) return defaultMetadata;

  const title = page.metaTitle || defaultMetadata.title!;
  const description = page.metaDescription || defaultMetadata.description!;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${slug === '/' ? '' : slug}`,
    },
  };
}
