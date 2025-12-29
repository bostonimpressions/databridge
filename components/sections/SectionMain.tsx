'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import List from '@/components/ui/List';
import TableBlock from '@/components/blocks/TableBlock';
import { portableTextComponents } from '@/lib/portableTextComponents';

/* -------------------------------- Types -------------------------------- */

type ColumnLayout = '1/1' | '1/2-1/2' | '2/3-1/3' | '1/3-2/3';
type TextColumn = 'left' | 'right';

interface ContentBlock {
  _type: 'image' | 'listBlock' | 'tableBlock' | 'ctaBlock' | 'contentRow';
  [key: string]: any;
}

interface RowLayout {
  columns?: ColumnLayout;
  textColumn?: TextColumn;
}

interface Row {
  divider?: boolean;
  label?: string;
  heading?: any[];
  subheading?: any[];
  body?: any[];
  link?: { text: string; url: string };
  layout?: RowLayout;
  spacing?: 'default' | 'compact';
  contentBlocks?: ContentBlock[];
}

interface SectionMainProps {
  rows: Row[];
  theme?: 'light' | 'dark' | 'midnight' | 'sky' | 'orange';
  backgroundImage?: any;
  topBorder?: boolean;
}

const renderPT = (value?: any[]) => {
  if (!value) return null;
  return <PortableText value={value} components={portableTextComponents} />;
};

const getGridCols = (columns?: ColumnLayout) => {
  switch (columns) {
    case '1/2-1/2':
      return 'md:grid-cols-2';
    case '2/3-1/3':
      return 'md:grid-cols-[2fr_1fr]';
    case '1/3-2/3':
      return 'md:grid-cols-[1fr_2fr]';
    default:
      return 'md:grid-cols-1';
  }
};

// Helper function to render content blocks
const renderContentBlock = (
  block: ContentBlock,
  isTextLeft: boolean,
  theme: string,
  proseClass: string
) => {
  switch (block._type) {
    case 'image':
      return (
        <AnimatedElement animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}>
          <div className="relative h-64 w-full md:h-80">
            <Image
              src={urlFor(block).url()}
              alt={block.alt || 'Image'}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </AnimatedElement>
      );

    case 'listBlock':
      return (
        <List
          items={block.items || []}
          columns={block.columns || 1}
          theme={block.variant || 'default'}
        />
      );

    case 'tableBlock':
      return (
        <AnimatedElement animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}>
          <TableBlock
            value={{
              columnA: block.columnA || '',
              columnB: block.columnB || '',
              rows: block.rows || [],
            }}
            theme={theme as 'light' | 'dark' | 'midnight' | 'sky' | 'orange'}
          />
        </AnimatedElement>
      );

    case 'ctaBlock':
      return (
        <AnimatedElement animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}>
          <a
            href={block.url || '#'}
            className={`inline-block rounded-lg px-6 py-3 font-semibold transition-colors ${
              block.style === 'secondary'
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : block.style === 'outline'
                  ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {block.title || 'Click Here'}
          </a>
        </AnimatedElement>
      );

    default:
      return null;
  }
};

/* ------------------------------ Component ------------------------------ */

export default function SectionMain({
  rows,
  theme = 'light',
  backgroundImage,
  topBorder,
}: SectionMainProps) {
  // Theme-based background colors
  const sectionBg =
    theme === 'dark'
      ? 'bg-gray-100'
      : theme === 'midnight'
        ? 'bg-gray-900'
        : theme === 'sky'
          ? 'bg-blue-50'
          : theme === 'orange'
            ? '' // Orange theme uses custom gradient background
            : 'bg-white';

  const proseClass = theme === 'midnight' ? 'prose-invert' : '';

  // Orange theme background style with gradient
  const orangeGradientStyle =
    theme === 'orange'
      ? {
          background: 'linear-gradient(179deg, var(--color-orange-100) 0.64%, #FFEEDF 91.77%)',
        }
      : {};

  // Background image URL
  const backgroundImageUrl = backgroundImage ? urlFor(backgroundImage).url() : null;

  // Theme-based divider colors
  const getDividerColor = () => {
    switch (theme) {
      case 'midnight':
        return 'bg-white';
      case 'orange':
        return 'bg-orange-600';
      case 'dark':
        return 'bg-gray-700';
      case 'sky':
        return 'bg-blue-600';
      case 'light':
      default:
        return 'bg-blue-ribbon-500';
    }
  };

  const borderStyle = topBorder ? { borderTop: '2px solid #DEE2FF' } : {};

  return (
    <section
      className={`relative py-16 ${sectionBg}`}
      style={{ ...orangeGradientStyle, ...borderStyle }}
    >
      {/* Background image for orange theme (positioned at bottom with color-burn) */}
      {theme === 'orange' && backgroundImageUrl && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            height: '50%',
            mixBlendMode: 'color-burn',
          }}
        />
      )}

      <div className="container relative z-10 mx-auto px-4">
        {rows.map((row, i) => {
          // DIVIDER ROW
          if (row.divider) {
            return (
              <hr
                key={i}
                className={`h-[9px] w-full border-0 ${getDividerColor()} my-8`}
                aria-hidden="true"
              />
            );
          }

          const columns = row.layout?.columns || '1/1';
          const textColumn = row.layout?.textColumn || 'left';

          const isTextLeft = textColumn === 'left';
          const gridCols = getGridCols(columns);

          const textColOrder = isTextLeft ? 'md:order-1' : 'md:order-2';
          const contentColOrder = isTextLeft ? 'md:order-2' : 'md:order-1';

          const spacingClass = row.spacing === 'compact' ? 'mb-8' : 'mb-20';

          // Determine animation for this row
          const rowAnimation = columns === '1/1' ? 'fadeUp' : isTextLeft ? 'fadeLeft' : 'fadeRight';
          const contentAnimation =
            columns === '1/1' ? 'fadeUp' : isTextLeft ? 'fadeRight' : 'fadeLeft';

          return (
            <AnimatedElement
              key={i}
              animation={rowAnimation}
              once={false}
              className={`${spacingClass} min-h-0`}
            >
              <div className={`grid gap-20 ${gridCols} items-start`}>
                {/* TEXT COLUMN - Sticky so shorter column stays in view */}
                <div className={`${textColOrder} md:sticky md:top-24 md:self-start`}>
                  {row.label && <p className="mb-4 text-sm font-semibold uppercase">{row.label}</p>}

                  {row.heading && (
                    <TextHeading level="h2" color={proseClass}>
                      {renderPT(row.heading)}
                    </TextHeading>
                  )}

                  {row.subheading && <h4 className="mt-2">{renderPT(row.subheading)}</h4>}

                  {row.body && <div>{renderPT(row.body)}</div>}

                  {row.link && (
                    <a
                      href={row.link.url}
                      className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                      {row.link.text}
                    </a>
                  )}
                </div>

                {/* CONTENT COLUMN - Also sticky so shorter column stays in view */}
                {columns !== '1/1' && (
                  <div className={`${contentColOrder} md:sticky md:top-24 md:self-start`}>
                    <div className="space-y-8">
                      {row.contentBlocks?.map((block, j) => {
                        // CONTENT ROW (nested row with text + blocks)
                        if (block._type === 'contentRow') {
                          return (
                            <div key={j} className="space-y-6">
                              {block.label && (
                                <p className="mb-4 text-sm font-semibold uppercase">
                                  {block.label}
                                </p>
                              )}

                              {block.heading && (
                                <AnimatedElement animation="fade">
                                  <h3 className={proseClass}>{renderPT(block.heading)}</h3>
                                </AnimatedElement>
                              )}

                              {block.subheading && (
                                <AnimatedElement animation="fade">
                                  <h4 className={`mt-2 ${proseClass}`}>
                                    {renderPT(block.subheading)}
                                  </h4>
                                </AnimatedElement>
                              )}

                              {block.body && (
                                <AnimatedElement animation="fade" delay={0.1}>
                                  {renderPT(block.body)}
                                </AnimatedElement>
                              )}

                              {block.blocks && block.blocks.length > 0 && (
                                <div className="space-y-6">
                                  {block.blocks.map((nestedBlock: ContentBlock, k: number) => (
                                    <React.Fragment key={k}>
                                      {renderContentBlock(
                                        nestedBlock,
                                        isTextLeft,
                                        theme,
                                        proseClass
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // LEGACY: Direct blocks (backwards compatibility)
                        return (
                          <React.Fragment key={j}>
                            {renderContentBlock(block, isTextLeft, theme, proseClass)}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FULL WIDTH CONTENT BLOCKS - Render when columns is 1/1 */}
                {columns === '1/1' && row.contentBlocks && row.contentBlocks.length > 0 && (
                  <div className="mt-0">
                    <div className="space-y-8">
                      {row.contentBlocks.map((block, j) => {
                        // CONTENT ROW (nested row with text + blocks)
                        if (block._type === 'contentRow') {
                          return (
                            <div key={j} className="space-y-6">
                              {block.label && (
                                <p className="mb-4 text-sm font-semibold uppercase">
                                  {block.label}
                                </p>
                              )}

                              {block.heading && (
                                <AnimatedElement animation="fade">
                                  <h3 className={proseClass}>{renderPT(block.heading)}</h3>
                                </AnimatedElement>
                              )}

                              {block.subheading && (
                                <AnimatedElement animation="fade">
                                  <h4 className={`mt-2 ${proseClass}`}>
                                    {renderPT(block.subheading)}
                                  </h4>
                                </AnimatedElement>
                              )}

                              {block.body && (
                                <AnimatedElement animation="fade" delay={0.1}>
                                  {renderPT(block.body)}
                                </AnimatedElement>
                              )}

                              {block.blocks && block.blocks.length > 0 && (
                                <div className="space-y-6">
                                  {block.blocks.map((nestedBlock: ContentBlock, k: number) => (
                                    <React.Fragment key={k}>
                                      {renderContentBlock(
                                        nestedBlock,
                                        isTextLeft,
                                        theme,
                                        proseClass
                                      )}
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Direct blocks
                        return (
                          <React.Fragment key={j}>
                            {renderContentBlock(block, isTextLeft, theme, proseClass)}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedElement>
          );
        })}
      </div>
    </section>
  );
}
