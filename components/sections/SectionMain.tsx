'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import List from '../ui/List';

interface ContentBlock {
  _type: 'image' | 'listBlock' | 'tableBlock' | 'ctaBlock';
  [key: string]: any;
}

interface Row {
  label?: string;
  heading?: any[];
  subheading?: any[];
  body?: any[];
  link?: { text: string; url: string };
  layout?: {
    columns?: '1/1' | '1/2-1/2' | '2/3-1/3' | '1/3-2/3';
    textColumn?: 'left' | 'right' | 'top' | 'bottom';
    labelPosition?: 'stacked' | 'leftCol';
  };
  contentBlocks?: ContentBlock[];
}

// PortableText helper
const renderPT = (value: any) => {
  if (!value) return null;
  if (Array.isArray(value)) return <PortableText value={value} />;
  return <PortableText value={[{ _type: 'block', children: [{ _type: 'span', text: value }] }]} />;
};

interface SectionMainProps {
  rows: Row[];
  theme?: 'light' | 'dark' | 'midnight';
}

export default function SectionMain({ rows, theme = 'light' }: SectionMainProps) {
  const sectionBgClass = theme === 'dark' ? 'bg-gray-100' : 'bg-white';
  const proseClass = theme === 'midnight' ? 'prose-invert' : '';

  return (
    <section className={`relative overflow-hidden py-12 ${sectionBgClass}`}>
      <div className="container mx-auto px-4">
        {rows.map((row, rowIndex) => {
          const columns = row.layout?.columns || '1/1';
          const textLeft = row.layout?.textColumn !== 'right';
          const labelPosition = row.layout?.labelPosition || 'stacked';

          const gridClasses =
            columns === '1/2-1/2'
              ? 'md:grid-cols-2'
              : columns === '2/3-1/3'
                ? 'md:grid-cols-[2fr_1fr]'
                : columns === '1/3-2/3'
                  ? 'md:grid-cols-[1fr_2fr]'
                  : 'md:grid-cols-1';

          // Column ordering
          const textOrderClass = textLeft ? '' : 'md:order-2';

          return (
            <div key={rowIndex} className="mb-16">
              {/* Stacked Label */}
              {row.label && labelPosition === 'stacked' && (
                <AnimatedElement animation="fade" delay={0}>
                  <p className="mb-4 text-sm font-semibold uppercase">{row.label}</p>
                </AnimatedElement>
              )}

              <div className={`grid gap-8 ${gridClasses} items-start`}>
                {/* Left Column */}
                <div className={textLeft ? '' : 'md:order-2'}>
                  {labelPosition === 'leftCol' && row.label && (
                    <AnimatedElement animation="fade" delay={0}>
                      <p className="mb-2 text-sm font-semibold uppercase">{row.label}</p>
                    </AnimatedElement>
                  )}

                  {/* LeftCol: show content blocks only if leftCol label */}
                  {labelPosition === 'leftCol' &&
                    row.contentBlocks?.map((block, i) => {
                      switch (block._type) {
                        case 'image':
                          return (
                            <AnimatedElement key={i} animation="fade" delay={0.1 * i}>
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
                              key={i}
                              items={block.items || []}
                              columns={block.columns || 1}
                              theme={block.variant || 'default'}
                            />
                          );
                        case 'tableBlock':
                          return (
                            <div key={i} className="mt-4 overflow-x-auto">
                              <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                  <tr>
                                    {block.headers?.map((h: string, j: number) => (
                                      <th key={j} className="border p-2 text-left">
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

                {/* Right Column / Text Column */}
                <div className={textOrderClass}>
                  {row.heading && (
                    <AnimatedElement animation="fade" delay={0.1}>
                      <TextHeading level="h2" color={proseClass}>
                        {renderPT(row.heading)}
                      </TextHeading>
                    </AnimatedElement>
                  )}
                  {row.subheading && (
                    <AnimatedElement animation="fade" delay={0.2}>
                      <h4 className="mt-2">{renderPT(row.subheading)}</h4>
                    </AnimatedElement>
                  )}
                  {row.body && (
                    <AnimatedElement animation="fade" delay={0.3}>
                      {renderPT(row.body)}
                    </AnimatedElement>
                  )}
                  {row.link && (
                    <AnimatedElement animation="fade" delay={0.4}>
                      <a href={row.link.url} className="mt-2 block text-blue-600 hover:underline">
                        {row.link.text}
                      </a>
                    </AnimatedElement>
                  )}

                  {/* Content blocks for stacked label or normal layout */}
                  {labelPosition !== 'leftCol' &&
                    row.contentBlocks?.map((block, i) => {
                      switch (block._type) {
                        case 'image':
                          return (
                            <AnimatedElement key={i} animation="fade" delay={0.1 * i}>
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
                              key={i}
                              items={block.items || []}
                              columns={block.columns || 1}
                              theme={block.variant || 'default'}
                            />
                          );
                        case 'tableBlock':
                          return (
                            <div key={i} className="mt-4 overflow-x-auto">
                              <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                  <tr>
                                    {block.headers?.map((h: string, j: number) => (
                                      <th key={j} className="border p-2 text-left">
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
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
