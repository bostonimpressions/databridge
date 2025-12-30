'use client';

import React, { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/lib/image';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import List from '@/components/ui/List';
import TableBlock from '@/components/blocks/TableBlock';
import { portableTextComponents } from '@/lib/portableTextComponents';
import type { SectionTheme } from '@/types/sections';

/* -------------------------------- Types -------------------------------- */

type ColumnLayout = '1/1' | '1/2-1/2' | '2/3-1/3' | '1/3-2/3' | '1/4-3/4';
type TextColumn = 'left' | 'right';

interface ContentBlock {
  _type:
    | 'image'
    | 'listBlock'
    | 'tableBlock'
    | 'ctaBlock'
    | 'contentRow'
    | 'buttonBlock'
    | 'linkBlock';
  [key: string]: any;
}

interface RowLayout {
  columns?: ColumnLayout;
  textColumn?: TextColumn;
  contentAlign?: 'left' | 'right';
}

interface Row {
  divider?: boolean;
  label?: string;
  heading?: any[];
  subheading?: any[];
  body?: any[];
  layout?: RowLayout;
  spacing?: 'default' | 'compact';
  contentBlocks?: ContentBlock[];
}

interface SectionMainProps {
  rows: Row[];
  theme?: SectionTheme;
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
    case '1/4-3/4':
      return 'md:grid-cols-[1fr_3fr]';
    default:
      return 'md:grid-cols-1';
  }
};

// Helper function to render content blocks
const renderContentBlock = (
  block: ContentBlock,
  isTextLeft: boolean,
  theme: SectionTheme,
  textColorClass: string
) => {
  switch (block._type) {
    case 'image':
      // Check if it's an array of images (slideshow) or single image (legacy format)
      // New structure: block.images is an array
      // Legacy structure: block.asset exists (single image)
      const images = block.images || (block.asset ? [{ asset: block.asset, alt: block.alt }] : []);
      const isSlideshow = images.length > 1;

      if (isSlideshow) {
        // Image slideshow component
        return <ImageSlideshow images={images} isTextLeft={isTextLeft} />;
      } else if (images.length === 1) {
        // Single image
        const image = images[0];
        const display = block.display || 'cover';
        const isSquare = display === 'square';

        return (
          <AnimatedElement animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}>
            {isSquare ? (
              <div
                className="relative mx-auto"
                style={{ width: '350px', height: '350px', maxWidth: '100%' }}
              >
                <Image
                  src={urlFor(image).url()}
                  alt={image.alt || 'Image'}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="relative h-64 w-full md:h-80">
                <Image
                  src={urlFor(image).url()}
                  alt={image.alt || 'Image'}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </AnimatedElement>
        );
      }
      return null;

    case 'listBlock':
      return (
        <List
          items={block.items || []}
          columns={block.columns || 1}
          theme={block.variant || 'default'}
          sectionTheme={theme as 'light' | 'dark' | 'midnight' | 'sky' | 'orange'}
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
            theme={theme as SectionTheme}
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

    case 'buttonBlock':
      return (
        <div className="flex flex-wrap gap-3">
          {block.buttons?.map((btn: any, i: number) => (
            <a
              key={i}
              href={btn.url || '#'}
              className={`inline-block rounded-lg px-6 py-3 font-semibold transition-colors ${
                btn.style === 'secondary'
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : btn.style === 'outline'
                    ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {btn.title || 'Button'}
            </a>
          ))}
        </div>
      );

    case 'linkBlock':
      return (
        <a href={block.url || '#'} className="link-w-arrow">
          {block.text || 'Link'}
        </a>
      );

    default:
      return null;
  }
};

/* ------------------------- Image Slideshow Component ------------------------- */
interface ImageSlideshowProps {
  images: any[];
  isTextLeft: boolean;
}

function ImageSlideshow({ images, isTextLeft }: ImageSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Preload images
  useEffect(() => {
    images.forEach((img) => {
      if (img.asset || img._type === 'image') {
        const imageUrl = urlFor(img).width(1920).url();
        const imgElement = new window.Image();
        imgElement.src = imageUrl;
      }
    });
  }, [images]);

  return (
    <AnimatedElement animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}>
      <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-80">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ zIndex: index === current ? 1 : 0 }}
          >
            <Image
              src={urlFor(img).url()}
              alt={img.alt || `Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}

        {/* Slide indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatedElement>
  );
}

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
      ? '' // Dark theme uses custom background color
      : theme === 'midnight'
        ? 'bg-gray-900'
        : theme === 'sky'
          ? 'bg-blue-50'
          : theme === 'orange'
            ? '' // Orange theme uses custom gradient background
            : 'bg-white';

  const textColorClass = theme === 'dark' ? 'text-white' : theme === 'midnight' ? 'text-white' : '';

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
  const darkBgStyle = theme === 'dark' ? { backgroundColor: '#1C2D50' } : {};

  return (
    <section
      className={`relative py-16 ${sectionBg} ${textColorClass}`}
      data-section-theme={theme}
      style={{ ...orangeGradientStyle, ...darkBgStyle, ...borderStyle }}
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
          const contentAlign = row.layout?.contentAlign || 'left';

          const isTextLeft = textColumn === 'left';
          const gridCols = getGridCols(columns);

          const textColOrder = isTextLeft ? 'md:order-1' : 'md:order-2';
          const contentColOrder = isTextLeft ? 'md:order-2' : 'md:order-1';

          const spacingClass = row.spacing === 'compact' ? 'mb-6 md:mb-10' : 'mb-12 md:mb-20';
          // Only apply gap for multi-column layouts (not 1/1)
          const gapClass = columns === '1/1' ? '' : 'gap-10 md:gap-20';
          // Content alignment class
          const contentAlignClass = contentAlign === 'right' ? 'md:text-right' : '';

          return (
            <div key={i} className={`${spacingClass} min-h-0`}>
              <div className={`grid ${gapClass} ${gridCols} items-start`}>
                {/* TEXT COLUMN - Sticky so shorter column stays in view */}
                <AnimatedElement
                  animation={columns === '1/1' ? 'fadeUp' : isTextLeft ? 'fadeLeft' : 'fadeRight'}
                  delay={0}
                  className={`${textColOrder} md:sticky md:top-24 md:self-start`}
                >
                  {row.label && (
                    <p className={`mb-4 text-sm font-semibold uppercase ${textColorClass}`}>
                      {row.label}
                    </p>
                  )}

                  {row.heading && (
                    <TextHeading level="h2" color={textColorClass}>
                      {renderPT(row.heading)}
                    </TextHeading>
                  )}

                  {row.subheading && (
                    <h3 className={`mt-2 ${textColorClass}`}>{renderPT(row.subheading)}</h3>
                  )}

                  {row.body && <div className={textColorClass}>{renderPT(row.body)}</div>}

                  {/* Support buttonBlock in text column when no heading/body (for buttons on left) */}
                  {!row.heading && !row.body && !row.subheading && row.contentBlocks && (
                    <div className="space-y-8">
                      {row.contentBlocks
                        .filter((block) => block._type === 'buttonBlock')
                        .map((block, j) => (
                          <React.Fragment key={j}>
                            {renderContentBlock(block, isTextLeft, theme, textColorClass)}
                          </React.Fragment>
                        ))}
                    </div>
                  )}
                </AnimatedElement>

                {/* CONTENT COLUMN - Also sticky so shorter column stays in view */}
                {columns !== '1/1' && (
                  <AnimatedElement
                    animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}
                    delay={0.1}
                    className={`${contentColOrder} md:sticky md:top-24 md:self-start`}
                  >
                    <div className={`space-y-8 ${contentAlignClass}`}>
                      {row.contentBlocks
                        ?.filter(
                          (block) =>
                            // If text column has no heading/body, filter out buttonBlock (it goes in text column)
                            // linkBlock stays in content column
                            !(
                              !row.heading &&
                              !row.body &&
                              !row.subheading &&
                              block._type === 'buttonBlock'
                            )
                        )
                        .map((block, j) => {
                          // CONTENT ROW (nested row with text + blocks)
                          if (block._type === 'contentRow') {
                            return (
                              <div key={j} className="space-y-6">
                                {block.label && (
                                  <p
                                    className={`mb-4 text-sm font-semibold uppercase ${textColorClass}`}
                                  >
                                    {block.label}
                                  </p>
                                )}

                                {block.heading && (
                                  <AnimatedElement animation="fade">
                                    <TextHeading level="h2" color={textColorClass}>
                                      {renderPT(block.heading)}
                                    </TextHeading>
                                  </AnimatedElement>
                                )}

                                {block.subheading && (
                                  <AnimatedElement animation="fade">
                                    <h3 className={`mt-2 ${textColorClass}`}>
                                      {renderPT(block.subheading)}
                                    </h3>
                                  </AnimatedElement>
                                )}

                                {block.body && (
                                  <AnimatedElement animation="fade" delay={0.1}>
                                    <div className={textColorClass}>{renderPT(block.body)}</div>
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
                                          textColorClass
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
                              {renderContentBlock(block, isTextLeft, theme, textColorClass)}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </AnimatedElement>
                )}

                {/* FULL WIDTH CONTENT BLOCKS - Render when columns is 1/1 */}
                {columns === '1/1' && row.contentBlocks && row.contentBlocks.length > 0 && (
                  <AnimatedElement animation="fadeUp" delay={0} className="mt-0">
                    <div className={`space-y-8 ${contentAlignClass}`}>
                      {row.contentBlocks.map((block, j) => {
                        // CONTENT ROW (nested row with text + blocks)
                        if (block._type === 'contentRow') {
                          return (
                            <div key={j} className="space-y-6">
                              {block.label && (
                                <p
                                  className={`mb-4 text-sm font-semibold uppercase ${textColorClass}`}
                                >
                                  {block.label}
                                </p>
                              )}

                              {block.heading && (
                                <AnimatedElement animation="fade">
                                  <TextHeading level="h2" color={textColorClass}>
                                    {renderPT(block.heading)}
                                  </TextHeading>
                                </AnimatedElement>
                              )}

                              {block.subheading && (
                                <AnimatedElement animation="fade">
                                  <h3 className={`mt-2 ${textColorClass}`}>
                                    {renderPT(block.subheading)}
                                  </h3>
                                </AnimatedElement>
                              )}

                              {block.body && (
                                <AnimatedElement animation="fade" delay={0.1}>
                                  <div className={textColorClass}>{renderPT(block.body)}</div>
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
                                        textColorClass
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
                            {renderContentBlock(block, isTextLeft, theme, textColorClass)}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </AnimatedElement>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
