import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultMetadata } from '@/lib/seo';
import { getPageData, PageData } from '@/lib/getPageData';
import { toPlainText } from '@portabletext/react';

import SectionMain from '@/components/sections/SectionMain';
import SectionHeroMain from '@/components/sections/SectionHeroMain';

const sectionComponents: Record<string, React.ComponentType<any>> = {
  sectionMain: SectionMain,
  sectionHeroMain: SectionHeroMain,
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
export const dynamic = 'force-dynamic';

export default async function Page() {
  const slug = '/';
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

export async function generateMetadata(): Promise<Metadata> {
  const slug = '/';
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
      url: '/',
    },
  };
}
