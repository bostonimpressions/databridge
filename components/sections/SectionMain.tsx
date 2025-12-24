'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import List from '@/components/ui/List';

/* -------------------------------- Types -------------------------------- */

type ColumnLayout = '1/1' | '1/2-1/2' | '2/3-1/3' | '1/3-2/3';
type TextColumn = 'left' | 'right';

interface ContentBlock {
  _type: 'image' | 'listBlock' | 'tableBlock' | 'ctaBlock';
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
  theme?: 'light' | 'dark' | 'midnight';
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

/* ------------------------------ Component ------------------------------ */

export default function SectionMain({ rows, theme = 'light' }: SectionMainProps) {
  const sectionBg = theme === 'dark' ? 'bg-gray-100' : 'bg-white';
  const proseClass = theme === 'midnight' ? 'prose-invert' : '';

  return (
    <section className={`relative overflow-hidden py-16 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        {rows.map((row, i) => {
          const columns = row.layout?.columns || '1/1';
          const textColumn = row.layout?.textColumn || 'left';

          const isTextLeft = textColumn === 'left';
          const gridCols = getGridCols(columns);

          const textColOrder = isTextLeft ? 'md:order-1' : 'md:order-2';
          const contentColOrder = isTextLeft ? 'md:order-2' : 'md:order-1';

          return (
            <div key={i} className="mb-20">
              {row.label && (
                <AnimatedElement animation="fade">
                  <p className="mb-4 text-sm font-semibold uppercase">
                    {row.label}
                  </p>
                </AnimatedElement>
              )}

              <div className={`grid gap-10 ${gridCols} items-start`}>
                {/* TEXT COLUMN */}
                <div className={textColOrder}>
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

                {/* CONTENT COLUMN */}
                {columns !== '1/1' && (
                  <div className={contentColOrder}>
                    {row.contentBlocks?.map((block, j) => {
                      switch (block._type) {
                        case 'image':
                          return (
                            <AnimatedElement
                              key={j}
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
                              key={j}
                              items={block.items || []}
                              columns={block.columns || 1}
                              theme={block.variant || 'default'}
                            />
                          );

                        case 'tableBlock':
                          return (
                            <div key={j} className="overflow-x-auto">
                              <table className="w-full border-collapse border">
                                <thead>
                                <tr>
                                  {block.headers?.map((h: string, k: number) => (
                                    <th key={k} className="border p-2 text-left">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                                </thead>
                                <tbody>
                                {block.rows?.map((r: string[], k: number) => (
                                  <tr key={k}>
                                    {r.map((cell, c) => (
                                      <td key={c} className="border p-2">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                                </tbody>
                              </table>
                            </div>
                          );

                        default:
                          return null;
                      }
                    })}
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
