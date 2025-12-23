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

function generateAnchorId(section: any, index: number) {
  const title = section?.heading && toPlainText(section.heading[0]);
  const base = title || section._type || `section-${index}`;

  return base
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export const revalidate = 0;

export default async function Page() {
  const slug = 'home';
  const page: PageData | null = await getPageData(slug);

  if (!page) notFound();

  return (
    <main className="font-sans">
      {page.sections?.map((section, i) => {
        const { _type, ...sectionProps } = section;
        const SectionComponent = sectionComponents[_type];

        if (!SectionComponent) {
          console.warn(`Unknown section type: ${_type}`);
          return null;
        }

        const anchorId = generateAnchorId(section, i);

        return (
          <div id={anchorId} key={`${_type}-${i}`} className="scroll-mt-24">
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
