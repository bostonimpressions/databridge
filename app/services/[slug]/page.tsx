// app/services/[slug]/page.tsx
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { getServicePage, getAllServiceSlugs } from '@/lib/getServicePages';
import SectionBanner from '@/components/sections/SectionBanner';
import SectionHeroMain from '@/components/sections/SectionHeroMain';
import SectionHeroSubpage from '@/components/sections/SectionHeroSubpage';
import SectionOverview from '@/components/sections/SectionOverview';
import SectionCallToAction from '@/components/sections/SectionCallToAction';
import SectionDetails from '@/components/sections/SectionDetails';

interface ServicePageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

const sectionComponents: Record<string, React.ComponentType<any>> = {
  sectionBanner: SectionBanner,
  sectionHeroMain: SectionHeroMain,
  sectionHeroSubpage: SectionHeroSubpage,
  sectionOverview: SectionOverview,
  sectionCallToAction: SectionCallToAction,
  sectionDetails: SectionDetails,
};

export const revalidate = 0;

export default async function ServicePage(props: ServicePageProps) {
  // ⚡ Unwrap params if it's a promise
  const params = props.params instanceof Promise ? await props.params : props.params;

  const page = await getServicePage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="font-sans">
      {page.sections?.map((section: any, i: number) => {
        const { _type, ...props } = section;
        const SectionComponent = sectionComponents[_type];

        if (!SectionComponent) {
          console.warn(`Unknown section type: ${_type}`);
          return null;
        }

        return <SectionComponent key={`${_type}-${i}`} {...props} />;
      })}
    </main>
  );
}

// Generate static params
export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata(
  props: ServicePageProps
): Promise<Metadata> {
  const params =
    props.params instanceof Promise ? await props.params : props.params;

  const page = await getServicePage(params.slug);

  if (!page) {
    return defaultMetadata;
  }

  const title = page.metaTitle || defaultMetadata.title!;
  const description = page.metaDescription || defaultMetadata.description!;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/services/${params.slug}`,
    },
  };
}

