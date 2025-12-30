'use client';

import { PortableText, toPlainText } from '@portabletext/react';
import Image from 'next/image';
import { SanityImageSource } from '@sanity/image-url';
import { urlFor } from '@/sanity/lib/image';
import type { PortableTextBlock } from '@portabletext/types';
import AnimatedElement from '@/components/AnimatedElement';
import CountUp from '@/components/ui/CountUp';
import type { SectionTheme } from '@/types/sections';

interface ListItemProps {
  heading?: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  icon?: SanityImageSource;
  url?: string;
  label?: string;
}

interface ListProps {
  compact?: boolean;
  className?: string;
  items: ListItemProps[];
  columns?: 1 | 2 | 3 | 4;
  theme?:
    | 'default'
    | 'image-only'
    | 'snapshot'
    | 'cards'
    | 'cards-blue'
    | 'cards-white'
    | 'cards-service'
    | 'cards-data'
    | 'checks'
    | 'flags'
    | 'negatives'
    | 'positives'
    | 'good'
    | 'bad'
    | 'counter';
  sectionTheme?: SectionTheme;
}

const defaultIcons: Record<string, string> = {
  checks: '/images/icon-list-check.png',
  negatives: '/images/icon-list-negative.png',
  positives: '/images/icon-list-check.png',
  good: '/images/icon-list-good.png',
  bad: '/images/icon-list-bad.png',
};

export default function List({
  items,
  columns = 2,
  theme = 'default',
  compact,
  className,
  sectionTheme = 'light',
}: ListProps) {
  const colClass = `cols-${columns}`;
  const isCardsData = theme === 'cards-data';

  const snapshotIcons = [
    '/images/icon-challenge.svg',
    '/images/icon-solution.svg',
    '/images/icon-impact.svg',
  ];

  const themeAllowsUploaded =
    theme === 'default' ||
    theme === 'image-only' ||
    theme === 'cards' ||
    theme === 'cards-blue' ||
    theme === 'cards-white' ||
    theme === 'cards-service';

  const shouldShowImage = (item: ListItemProps) => {
    if (theme === 'snapshot') return true;
    if (theme === 'flags') return false;
    if (theme === 'counter') return false;
    if (themeAllowsUploaded) return !!item.icon;
    return !!defaultIcons[theme];
  };

  const getImageUrl = (item: ListItemProps, index: number) => {
    if (theme === 'snapshot') return snapshotIcons[index];
    if (themeAllowsUploaded && item.icon) return urlFor(item.icon).url();
    return defaultIcons[theme];
  };

  // ------------------------
  // PortableText components for styling lists
  // ------------------------
  const portableComponents = {
    // block: {
    //   normal: ({ children }: any) => <p className="mb-2 ">{children}</p>,
    // },
    list: {
      bullet: ({ children }: any) => (
        <ul className="my-3 list-outside list-disc space-y-2 pl-4 text-sapphire-500 marker:text-sapphire-500">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="my-3 list-outside list-decimal space-y-2 pl-4 text-sapphire-500">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="pl-2">{children}</li>,
      number: ({ children }: any) => <li className="pl-2">{children}</li>,
    },
  };

  return (
    <ul
      className={`list ${colClass} ${compact ? 'compact' : ''} ${className}`}
      data-theme={theme}
      data-section-theme={isCardsData ? sectionTheme : undefined}
      role="list"
    >
      {items.map((item, i) => {
        const src = getImageUrl(item, i);
        // Alternate animations: even items from left, odd items from right
        const animation = i % 2 === 0 ? 'fadeLeft' : 'fadeRight';
        const hasUrl = !!item.url;
        const isCardsServiceWithIcon = theme === 'cards-service' && shouldShowImage(item) && src;
        const isCardsData = theme === 'cards-data';

        // Check if heading is a number for animation
        const headingText = item.heading ? toPlainText(item.heading) : '';
        const isHeadingNumber = isCardsData && /^\d+([,.]\d+)*$/.test(headingText.trim());

        const listItemContent = (
          <>
            {theme === 'flags' && <span className="flag-bar" />}

            {isCardsData ? (
              // Special layout for cards-data: heading + label in card, body below card
              <>
                <div className="card-data-card">
                  <div className="card-data-header">
                    {item.heading && (
                      <h4 className="heading">
                        {isHeadingNumber ? (
                          <CountUp
                            value={headingText.trim()}
                            duration={2000}
                            className="counter-number"
                          />
                        ) : (
                          <PortableText value={item.heading} components={portableComponents} />
                        )}
                      </h4>
                    )}
                    {item.label && <span className="label">{item.label}</span>}
                  </div>
                </div>
                {item.body && (
                  <div className="list-content">
                    <PortableText value={item.body} components={portableComponents} />
                  </div>
                )}
              </>
            ) : isCardsServiceWithIcon ? (
              // Special layout for cards-service with icon: icon and heading inline, body below
              <>
                <div className="icon-heading-row">
                  {src && (
                    <div className="icon-wrapper">
                      <Image
                        src={src}
                        alt={`Icon ${item.heading && '- ' + toPlainText(item.heading)}`}
                        fill
                      />
                    </div>
                  )}
                  {item.heading && (
                    <h4 className="heading">
                      <PortableText value={item.heading} components={portableComponents} />
                    </h4>
                  )}
                </div>
                {item.body && (
                  <div className="list-content">
                    <PortableText value={item.body} components={portableComponents} />
                  </div>
                )}
              </>
            ) : (
              // Default layout for other themes
              <>
                {shouldShowImage(item) && src && (
                  <div className="icon-wrapper">
                    <Image
                      src={src}
                      alt={`Icon ${item.heading && '- ' + toPlainText(item.heading)}`}
                      fill
                    />
                  </div>
                )}

                {theme !== 'image-only' && (
                  <div className="list-content">
                    {item.heading && (
                      <h4 className="heading">
                        {theme === 'counter' ? (
                          // For counter variant, extract number from heading and animate it
                          <CountUp
                            value={toPlainText(item.heading)}
                            duration={2000}
                            className="counter-number"
                          />
                        ) : (
                          <PortableText value={item.heading} components={portableComponents} />
                        )}
                      </h4>
                    )}

                    {item.subheading && (
                      <h5 className="subheading">
                        <PortableText value={item.subheading} components={portableComponents} />
                      </h5>
                    )}

                    {item.body && (
                      <div>
                        <PortableText value={item.body} components={portableComponents} />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        );

        return (
          <AnimatedElement
            key={i}
            as="li"
            animation={animation}
            data-section-theme={isCardsData ? sectionTheme : undefined}
            delay={i * 0.1}
            duration={0.5}
            className={`list-item ${hasUrl ? 'has-link' : ''}`}
          >
            {hasUrl ? (
              <a
                href={item.url}
                className="list-item-link"
                aria-label={item.heading ? toPlainText(item.heading) : 'Learn more'}
              >
                {listItemContent}
              </a>
            ) : (
              listItemContent
            )}
          </AnimatedElement>
        );
      })}
    </ul>
  );
}
