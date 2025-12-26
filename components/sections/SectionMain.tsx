'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import List from '@/components/ui/List';
import TableBlock from '@/components/blocks/TableBlock';

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
  label?: string;
  heading?: any[];
  subheading?: any[];
  body?: any[];
  link?: { text: string; url: string };
  layout?: RowLayout;
  contentBlocks?: ContentBlock[];
}

interface SectionMainProps {
  rows: Row[];
  theme?: 'light' | 'dark' | 'midnight' | 'sky' | 'orange';
}


const renderPT = (value?: any[]) => {
  if (!value) return null;
  return <PortableText value={value} />;
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
        <AnimatedElement
          animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}
        >
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
        <AnimatedElement
          animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}
        >
          <TableBlock 
            value={{
              columnA: block.columnA || '',
              columnB: block.columnB || '',
              rows: block.rows || []
            }} 
            theme={theme as 'light' | 'dark' | 'midnight'} 
          />
        </AnimatedElement>
      );

    case 'ctaBlock':
      return (
        <AnimatedElement animation={isTextLeft ? 'fadeRight' : 'fadeLeft'}>
          <a
            href={block.url || '#'}
            className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
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

export default function SectionMain({ rows, theme = 'light' }: SectionMainProps) {
  // Theme-based background colors
  const sectionBg = 
    theme === 'dark' ? 'bg-gray-100' :
    theme === 'midnight' ? 'bg-gray-900' :
    theme === 'sky' ? 'bg-blue-50' :
    theme === 'orange' ? 'bg-orange-50' :
    'bg-white';
  
  const proseClass = theme === 'midnight' ? 'prose-invert' : '';

  return (
    <section className={`relative py-16 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        {rows.map((row, i) => {
          const columns = row.layout?.columns || '1/1';
          const textColumn = row.layout?.textColumn || 'left';

          const isTextLeft = textColumn === 'left';
          const gridCols = getGridCols(columns);

          const textColOrder = isTextLeft ? 'md:order-1' : 'md:order-2';
          const contentColOrder = isTextLeft ? 'md:order-2' : 'md:order-1';

          return (
            <div key={i} className="mb-20 min-h-0">
              {row.label && (
                <AnimatedElement animation="fade">
                  <p className="mb-4 text-sm font-semibold uppercase">
                    {row.label}
                  </p>
                </AnimatedElement>
              )}

              <div className={`grid gap-10 ${gridCols} items-start`}>
                {/* TEXT COLUMN - Sticky so shorter column stays in view */}
                <div className={`${textColOrder} md:sticky md:top-24 md:self-start`}>
                  {row.heading && (
                    <AnimatedElement animation="fade">
                      <TextHeading level="h2" color={proseClass}>
                        {renderPT(row.heading)}
                      </TextHeading>
                    </AnimatedElement>
                  )}

                  {row.subheading && (
                    <AnimatedElement animation="fade" delay={0.1}>
                      <h4 className="mt-2">
                        {renderPT(row.subheading)}
                      </h4>
                    </AnimatedElement>
                  )}

                  {row.body && (
                    <AnimatedElement animation="fade" delay={0.2}>
                      {renderPT(row.body)}
                    </AnimatedElement>
                  )}

                  {row.link && (
                    <AnimatedElement animation="fade" delay={0.3}>
                      <a
                        href={row.link.url}
                        className="mt-4 inline-block text-blue-600 hover:underline"
                      >
                        {row.link.text}
                      </a>
                    </AnimatedElement>
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
                              {block.heading && (
                                <AnimatedElement animation="fade">
                                  <h3 className={proseClass}>
                                    {renderPT(block.heading)}
                                  </h3>
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
                                      {renderContentBlock(nestedBlock, isTextLeft, theme, proseClass)}
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
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
