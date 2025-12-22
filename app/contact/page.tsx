// app/contact/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultMetadata } from '@/lib/seo';
import { getPageData, PageData } from '@/lib/getPageData';

import ContactTabs from '@/components/contact/ContactTabs';
import SectionBanner from '@/components/sections/SectionBanner';
import SectionHeroMain from '@/components/sections/SectionHeroMain';
import SectionOverview from '@/components/sections/SectionOverview';

export const revalidate = 300;

export default async function ContactPage() {
  const slug = 'contact';
  const page: PageData | null = await getPageData(slug);

  if (!page) notFound();

  const sections = page.sections ?? [];

  return (
    <main className="font-sans">
      {sections.map((section, i) =>
        section._type === 'sectionHeroMain' ? (
          <SectionHeroMain key={`hero-${i}`} {...section} />
        ) : null
      )}

      <section className="relative overflow-hidden bg-white py-12">
        <div className="container">
          <ContactTabs />
        </div>
      </section>

      {sections.map((section, i) => {
        switch (section._type) {
          case 'sectionBanner':
            return <SectionBanner key={i} {...section} />;
          case 'sectionOverview':
            return <SectionOverview key={i} {...section} />;
          default:
            return null;
        }
      })}
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = 'contact';
  const page: PageData | null = await getPageData(slug);

  if (!page) return defaultMetadata;

  const title = page.metaTitle || defaultMetadata.title!;
  const description = page.metaDescription || defaultMetadata.description!;

  return {
    title,
    description,
    openGraph: { title, description, url: '/contact' },
  };
}
