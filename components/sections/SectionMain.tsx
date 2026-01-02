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

interface ContentBlock {
  _type: 'imageBlock' | 'listBlock' | 'tableBlock' | 'ctaBlock' | 'buttonBlock' | 'linkBlock';
  [key: string]: any;
}

interface RowLayout {
  columns?: ColumnLayout;
  contentAlign?: 'left' | 'right';
  mobileReverse?: boolean; // Reverse column order on mobile only
}

interface ColumnContent {
  label?: string;
  heading?: any[];
  subheading?: any[];
  body?: any[];
  contentBlocks?: ContentBlock[];
}

interface Row {
  divider?: boolean;
  layout?: RowLayout;
  spacing?: 'default' | 'compact';
  leftColumn?: ColumnContent;
  rightColumn?: ColumnContent;
}

interface SectionMainProps {
  rows?: Row[];
  theme?: SectionTheme;
  backgroundImage?: any;
  topBorder?: boolean;
}

const renderPT = (value?: any[] | string) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return (
      <PortableText
        value={[
          {
            _type: 'block',
            _key: 'temp',
            style: 'normal',
            children: [{ _type: 'span', text: value, marks: [] }],
            markDefs: [],
          },
        ]}
        components={portableTextComponents}
      />
    );
  }
  if (!Array.isArray(value)) return null;
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

// Helper function to get image URL
const getImageUrl = (imageObj: any): string => {
  if (typeof imageObj === 'string') {
    return imageObj;
  }
  if (imageObj?.image && typeof imageObj.image === 'string') {
    return imageObj.image;
  }
  if (imageObj?.asset || imageObj?._type === 'image') {
    return urlFor(imageObj).url();
  }
  try {
    return urlFor(imageObj).url();
  } catch {
    return '';
  }
};

// Helper function to render content blocks
const renderContentBlock = (block: ContentBlock, theme: SectionTheme, textColorClass: string) => {
  // Normalize block structure
  let normalizedBlock = block;
  if (!block._type) {
    if (block.tableBlock) {
      normalizedBlock = { ...block.tableBlock, _type: 'tableBlock', _key: block._key || 'block' };
    } else if (block.imageBlock || block.image) {
      const imageData = block.imageBlock || block.image;
      let imagesArray = [];
      if (imageData.images && Array.isArray(imageData.images)) {
        imagesArray = imageData.images;
      } else if (imageData.image) {
        imagesArray = [{ image: imageData.image, alt: imageData.alt }];
      }
      normalizedBlock = {
        _type: 'imageBlock',
        _key: block._key || 'block',
        images: imagesArray,
        display: imageData.display || 'cover',
      };
    } else if (block.listBlock) {
      normalizedBlock = { ...block.listBlock, _type: 'listBlock', _key: block._key || 'block' };
    } else if (block.ctaBlock) {
      normalizedBlock = { ...block.ctaBlock, _type: 'ctaBlock', _key: block._key || 'block' };
    } else if (block.buttonBlock) {
      normalizedBlock = { ...block.buttonBlock, _type: 'buttonBlock', _key: block._key || 'block' };
    } else if (block.linkBlock) {
      normalizedBlock = { ...block.linkBlock, _type: 'linkBlock', _key: block._key || 'block' };
    }
  }

  switch (normalizedBlock._type) {
    case 'imageBlock':
      const images = normalizedBlock.images || [];
      const isSlideshow = images.length > 1;

      if (isSlideshow) {
        return <ImageSlideshow images={images} />;
      } else if (images.length === 1) {
        const image = images[0];
        const display = normalizedBlock.display || 'cover';
        const isSquare = display === 'square';

        return (
          <AnimatedElement animation="fade">
            {isSquare ? (
              <div className="relative mx-auto w-full max-w-[350px]">
                <div className="relative aspect-square max-h-[350px] w-full">
                  <Image
                    src={getImageUrl(image)}
                    alt={image.alt || 'Image'}
                    fill
                    className="rounded-lg object-contain"
                    sizes="(max-width: 350px) 100vw, 350px"
                  />
                </div>
              </div>
            ) : (
              <div className="relative h-64 w-full md:h-80">
                <Image
                  src={getImageUrl(image)}
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
          items={normalizedBlock.items || []}
          columns={normalizedBlock.columns || 1}
          theme={normalizedBlock.variant || 'default'}
          heading={
            normalizedBlock.heading &&
            Array.isArray(normalizedBlock.heading) &&
            normalizedBlock.heading.length > 0
              ? normalizedBlock.heading
              : undefined
          }
          sectionTheme={theme as 'light' | 'dark' | 'midnight' | 'sky' | 'orange'}
          textColorClass={textColorClass}
        />
      );

    case 'tableBlock':
      // Ensure rows is an array and each row has a and b as arrays
      const tableRows = (normalizedBlock.rows || []).map((row: any) => ({
        a: Array.isArray(row.a)
          ? row.a
          : typeof row.a === 'string'
            ? [
                {
                  _type: 'block',
                  _key: 'temp',
                  style: 'normal',
                  children: [{ _type: 'span', text: row.a, marks: [] }],
                  markDefs: [],
                },
              ]
            : [],
        b: Array.isArray(row.b)
          ? row.b
          : typeof row.b === 'string'
            ? [
                {
                  _type: 'block',
                  _key: 'temp',
                  style: 'normal',
                  children: [{ _type: 'span', text: row.b, marks: [] }],
                  markDefs: [],
                },
              ]
            : [],
      }));

      return (
        <AnimatedElement animation="fade">
          <TableBlock
            value={{
              columnA: normalizedBlock.columnA || '',
              columnB: normalizedBlock.columnB || '',
              rows: tableRows,
            }}
            theme={theme as SectionTheme}
          />
        </AnimatedElement>
      );

    case 'ctaBlock':
      return (
        <AnimatedElement animation="fade">
          <a
            href={normalizedBlock.url || '#'}
            className={`inline-block rounded-lg px-6 py-3 font-semibold transition-colors ${
              normalizedBlock.style === 'secondary'
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : normalizedBlock.style === 'outline'
                  ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {normalizedBlock.title || 'Click Here'}
          </a>
        </AnimatedElement>
      );

    case 'buttonBlock':
      return (
        <div className="flex flex-wrap gap-3">
          {(normalizedBlock.buttons || []).map((btn: any, i: number) => (
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
        <a href={normalizedBlock.url || '#'} className="link-w-arrow">
          {normalizedBlock.text || 'Link'}
        </a>
      );

    default:
      return null;
  }
};

/* ------------------------- Image Slideshow Component ------------------------- */
interface ImageSlideshowProps {
  images: any[];
}

function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    images.forEach((img) => {
      const imageUrl = getImageUrl(img);
      if (imageUrl) {
        const imgElement = new window.Image();
        imgElement.src = imageUrl;
      }
    });
  }, [images]);

  return (
    <AnimatedElement animation="fade">
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
              src={getImageUrl(img)}
              alt={img.alt || `Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}

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
  const sectionBg =
    theme === 'dark'
      ? ''
      : theme === 'midnight'
        ? 'bg-gray-900'
        : theme === 'sky'
          ? 'bg-blue-ribbon-500'
          : theme === 'orange'
            ? ''
            : theme === 'gray'
              ? ''
              : 'bg-white';

  const textColorClass =
    theme === 'dark'
      ? 'text-white'
      : theme === 'midnight'
        ? 'text-white'
        : theme === 'sky'
          ? 'text-white'
          : '';

  const orangeGradientStyle =
    theme === 'orange'
      ? {
          background: 'linear-gradient(179deg, var(--color-orange-100) 0.64%, #FFEEDF 91.77%)',
        }
      : {};

  const backgroundImageUrl = backgroundImage ? urlFor(backgroundImage).url() : null;

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
  const grayBgStyle = theme === 'gray' ? { backgroundColor: '#F7F7F7' } : {};

  const grayBgImageStyle =
    theme === 'gray' && backgroundImageUrl
      ? {
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.11,
        }
      : {};

  // Helper to render column content
  const renderColumnContent = (
    columnContent: ColumnContent | undefined,
    animation: string,
    orderClass: string,
    alignClass: string = ''
  ) => {
    if (!columnContent) return null;

    const hasLabel = !!columnContent.label;
    const hasHeading =
      columnContent.heading &&
      (Array.isArray(columnContent.heading)
        ? columnContent.heading.length > 0
        : typeof columnContent.heading === 'string');
    const hasSubheading =
      columnContent.subheading &&
      (Array.isArray(columnContent.subheading)
        ? columnContent.subheading.length > 0
        : typeof columnContent.subheading === 'string');
    const hasBody =
      columnContent.body &&
      (Array.isArray(columnContent.body)
        ? columnContent.body.length > 0
        : typeof columnContent.body === 'string');
    const hasContentBlocks =
      columnContent.contentBlocks &&
      Array.isArray(columnContent.contentBlocks) &&
      columnContent.contentBlocks.length > 0;

    if (!hasLabel && !hasHeading && !hasSubheading && !hasBody && !hasContentBlocks) return null;

    return (
      <AnimatedElement
        animation={
          animation as 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'fade' | 'fadeDown' | 'scale' | 'none'
        }
        delay={0}
        className={`${orderClass} md:sticky md:top-24 md:self-start`}
      >
        {hasLabel && (
          <p className={`mb-4 text-sm font-semibold uppercase ${textColorClass}`}>
            {columnContent.label}
          </p>
        )}

        {hasHeading && columnContent.heading && (
          <TextHeading level="h2" color={textColorClass}>
            {renderPT(columnContent.heading)}
          </TextHeading>
        )}

        {hasSubheading && columnContent.subheading && (
          <h3 className={`mt-2 ${textColorClass}`}>{renderPT(columnContent.subheading)}</h3>
        )}

        {hasBody && columnContent.body && (
          <div className={textColorClass}>{renderPT(columnContent.body)}</div>
        )}

        {hasContentBlocks && columnContent.contentBlocks && (
          <div className={`${hasBody || hasHeading ? 'mt-15' : ''} space-y-8 ${alignClass}`}>
            {columnContent.contentBlocks.map((block, j) => {
              return (
                <React.Fragment key={block._key || j}>
                  {renderContentBlock(block, theme, textColorClass)}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </AnimatedElement>
    );
  };

  return (
    <section
      className={`relative ${sectionBg} py-16 md:py-24`}
      style={{ ...borderStyle, ...darkBgStyle, ...grayBgStyle }}
    >
      {/* Orange theme gradient background */}
      {theme === 'orange' && (
        <div className="pointer-events-none absolute inset-0" style={orangeGradientStyle} />
      )}

      {/* Orange theme background image */}
      {theme === 'orange' && backgroundImageUrl && (
        <div
          className="pointer-events-none absolute inset-0"
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

      {/* Gray theme overlay for background image (11% opacity) */}
      {theme === 'gray' && backgroundImageUrl && (
        <div className="pointer-events-none absolute inset-0" style={grayBgImageStyle} />
      )}

      <div className="container relative z-10 mx-auto px-4">
        {rows && rows.length > 0
          ? rows.map((row, i) => {
              if (row.divider) {
                return (
                  <AnimatedElement key={i} animation="fadeUp">
                    <hr
                      className={`h-[9px] w-full border-0 ${getDividerColor()} my-20`}
                      aria-hidden="true"
                    />
                  </AnimatedElement>
                );
              }

              const columns = row.layout?.columns || '1/1';
              const contentAlign = row.layout?.contentAlign || 'left';
              const mobileReverse = row.layout?.mobileReverse || false;
              const gridCols = getGridCols(columns);
              const spacingClass = row.spacing === 'compact' ? 'mb-6 md:mb-10' : 'mb-12 md:mb-20';
              const gapClass = columns === '1/1' ? '' : 'gap-10 md:gap-20';
              const contentAlignClass = contentAlign === 'right' ? 'md:text-right' : '';

              // Determine order classes based on mobileReverse
              const leftOrderClass = mobileReverse ? 'order-2 md:order-1' : 'md:order-1';
              const rightOrderClass = mobileReverse ? 'order-1 md:order-2' : 'md:order-2';

              return (
                <div key={i} className={`${spacingClass} min-h-0`}>
                  <div className={`grid ${gapClass} ${gridCols} items-start`}>
                    {/* LEFT COLUMN - Always present, even for 1/1 rows */}
                    {renderColumnContent(row.leftColumn, 'fadeLeft', leftOrderClass, '')}

                    {/* RIGHT COLUMN - Only for multi-column layouts */}
                    {columns !== '1/1' &&
                      renderColumnContent(
                        row.rightColumn,
                        'fadeRight',
                        rightOrderClass,
                        contentAlignClass
                      )}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </section>
  );
}
