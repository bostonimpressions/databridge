'use client';

import { PortableText, toPlainText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Image from 'next/image';
import { SanityImageSource } from '@sanity/image-url';
import { urlFor } from '@/sanity/lib/image';
import List from '@/components/ui/List';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import React from 'react';

interface ListItem {
  heading: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  icon?: { url: string; alt?: string };
}

interface ListSection {
  heading?: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  theme?:
    | 'default'
    | 'cards'
    | 'cards-blue'
    | 'cards-white'
    | 'checks'
    | 'flags'
    | 'negatives'
    | 'positives';
  columns?: 1 | 2 | 3 | 4;
  items: ListItem[];
}

interface CTA {
  heading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  icon?: SanityImageSource;
  link?: string;
}

interface Props {
  heading: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  image?: SanityImageSource;
  imageRatio?: 'square' | 'landscape' | 'portrait';
  imageLayout?: 'imgLeft' | 'imgRight';
  imageGrid?: '1/1' | '2/3' | '3/2' | '1/3' | '3/1';

  listColumns?: 1 | 2;
  list?: ListSection;
  lists?: ListSection[];
  cta?: CTA;
  theme?: 'light' | 'dark' | 'midnight';
}

export default function SectionOverview({
  heading,
  subheading,
  body,
  image,
  imageRatio = 'landscape',
  imageLayout = 'imgLeft',
  imageGrid = '3/2',
  listColumns = 1,
  list,
  lists,
  cta,
  theme = 'light',
}: Props) {
  // Combine legacy list with new lists array for backwards compatibility
  const allLists: ListSection[] = lists?.length ? lists : list ? [list] : [];

  const isImageLeft = imageLayout === 'imgLeft';

  const getImageAspectClass = () => {
    switch (imageRatio) {
      case 'square':
        return 'aspect-square max-w-[340px]';
      case 'portrait':
        return 'aspect-[2/3]';
      case 'landscape':
      default:
        return 'aspect-[3/2]';
    }
  };

  const getGridClasses = () => {
    if (!image) return 'md:grid-cols-[3fr_2fr]'; // default when no image

    switch (imageGrid) {
      case '2/3':
        return 'md:grid-cols-[2fr_3fr]';
      case '3/2':
        return 'md:grid-cols-[3fr_2fr]';
      case '1/3':
        return 'md:grid-cols-[1.5fr_3.5fr]';
      case '3/1':
        return 'md:grid-cols-[1.5fr_3.5fr]';
      case '1/1':
        return 'md:grid-cols-2';
      default:
        return 'md:grid-cols-[3fr_2fr]';
    }
  };

  const isMidnight = theme === 'midnight';

  const sectionBgClass = theme === 'dark' ? 'bg-perano-200' : 'bg-white';

  const containerClass = isMidnight
    ? 'sm:rounded-xl bg-biscay-500 text-white px-10! py-20! md:px-20!'
    : '';

  const proseClass = isMidnight ? 'prose-invert' : '';

  return (
    <section className={`relative overflow-hidden py-12 ${sectionBgClass}`}>
      <div className={`container mx-auto px-4 ${containerClass}`}>
        {/* Top grid with image and text */}
        <div className={`grid ${getGridClasses()} items-center gap-10`}>
          {/* Image left */}
          {image && isImageLeft && (
            <AnimatedElement animation="fadeRight" delay={0} className="order-1 md:order-1">
              <div className={`relative ${getImageAspectClass()} h-auto w-full`}>
                <Image
                  src={urlFor(image).url()}
                  alt={`Illustration ${heading ? '- ' + toPlainText(heading) : ''}`}
                  fill
                  className="h-auto w-full rounded-xl object-contain"
                />
              </div>
            </AnimatedElement>
          )}

          {/* Text */}
          <div className={`order-2 md:order-2 ${proseClass}`}>
            {heading && (
              <AnimatedElement animation="fade" delay={0.1}>
                <TextHeading level="h2" color={proseClass}>
                  <PortableText value={heading} />
                </TextHeading>
              </AnimatedElement>
            )}
            {subheading && (
              <AnimatedElement animation={isImageLeft ? 'fadeLeft' : 'fadeRight'} delay={0.2}>
                <h4>
                  <PortableText value={subheading} />
                </h4>
              </AnimatedElement>
            )}
            {body && (
              <AnimatedElement animation={isImageLeft ? 'fadeLeft' : 'fadeRight'} delay={0.3}>
                <PortableText value={body} />
              </AnimatedElement>
            )}
          </div>

          {/* Image right */}
          {image && !isImageLeft && (
            <AnimatedElement
              animation="fadeLeft"
              delay={0}
              className="order-1 justify-items-center md:order-3"
            >
              <div className={`relative ${getImageAspectClass()} h-auto w-full`}>
                <Image
                  src={urlFor(image).url()}
                  alt={`Illustration ${heading ? '- ' + toPlainText(heading) : ''}`}
                  fill
                  className="h-auto w-full rounded-xl object-contain"
                />
              </div>
            </AnimatedElement>
          )}
        </div>

        {/* Lists */}
        {allLists.length > 0 && (
          <div className={`grid gap-10 ${listColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
            {allLists.map((listSection, i) => {
              // Alternate list section animations
              const headingAnimation = i % 2 === 0 ? 'fadeLeft' : 'fadeRight';

              return (
                <div key={i} className={`mt-10 ${proseClass} ${theme}`}>
                  {listSection.heading && (
                    <AnimatedElement animation="fade" delay={0.4 + i * 0.1}>
                      <h3>
                        <PortableText value={listSection.heading} />
                      </h3>
                    </AnimatedElement>
                  )}
                  {listSection.subheading && (
                    <AnimatedElement animation={headingAnimation} delay={0.5 + i * 0.1}>
                      <h4>
                        <PortableText value={listSection.subheading} />
                      </h4>
                    </AnimatedElement>
                  )}
                  {listSection.body && (
                    <AnimatedElement animation={headingAnimation} delay={0.6 + i * 0.1}>
                      <div className="mb-2">
                        <PortableText value={listSection.body} />
                      </div>
                    </AnimatedElement>
                  )}
                  <List
                    items={listSection.items || []}
                    columns={listSection.columns}
                    theme={listSection.theme}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {cta && (
          <AnimatedElement animation="scale" delay={0.5} className="call-to-action mt-8">
            {cta.heading && (
              <h3>
                <PortableText value={cta.heading} />
              </h3>
            )}
            <div className="flex items-center gap-5 rounded-lg bg-sapphire-500 p-5 text-white md:gap-8 md:p-10">
              {cta.icon ? (
                <div className="icon-wrapper">
                  <Image src={urlFor(cta.icon).url()} alt="Icon" fill />
                </div>
              ) : (
                <div className="icon-wrapper aspect-[1/.8]!">
                  <Image src="/images/icon-check-green.png" alt="Icon - Check" fill />
                </div>
              )}
              {cta.body && <PortableText value={cta.body} />}
              {cta.link && (
                <a href={cta.link} className="">
                  Learn More
                </a>
              )}
            </div>
          </AnimatedElement>
        )}
      </div>
    </section>
  );
}
