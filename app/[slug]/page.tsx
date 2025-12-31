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
import SectionTestimonials from '@/components/sections/SectionTestimonials';

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
  sectionTestimonials: SectionTestimonials,
};

// Utility: generate safe anchor ID - prioritize manual sectionId, fallback to stable index-based ID
function generateAnchorId(section: any, index: number) {
  // First priority: use manually set sectionId if available (most stable)
  if (section?.sectionId) {
    return section.sectionId;
  }

  // Fallback: use section type + index (stable, won't change with content)
  return `${section._type || 'section'}-${index}`;
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
