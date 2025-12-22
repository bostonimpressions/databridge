'use client';

import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { SanityImageSource } from '@sanity/image-url';
import List from '@/components/ui/List';
import TextHeading from '@/components/ui/TextHeading';
import AnimatedElement from '@/components/AnimatedElement';
import React from 'react';

interface ListItem {
  heading: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  icon?: SanityImageSource;
}

interface ListSection {
  theme?: 'default' | 'image-only' | 'cards' | 'cards-white' | 'checks' | 'flags' | 'negatives' | 'positives';
  columns?: 1 | 2 | 3 | 4;
  items: ListItem[];
}

interface Props {
  heading: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  list?: ListSection;
  theme?: 'light' | 'dark';
}

export default function SectionFeatureList({ heading, subheading, body, list, theme = 'light' }: Props) {
  return (
    <section
      className={`relative overflow-hidden py-12 ${theme === 'dark' ? 'bg-perano-200' : 'bg-white'}`}
    >
      <div className="container mx-auto px-4">
        <div className="pb-10 max-w-xl">
          {heading && (
            <AnimatedElement animation="fade" delay={0}>
              <TextHeading level={'h2'}>
                <PortableText value={heading} />
              </TextHeading>
            </AnimatedElement>
          )}
          {subheading && (
            <AnimatedElement animation="fadeLeft" delay={0.1}>
              <h4>
                <PortableText value={subheading} />
              </h4>
            </AnimatedElement>
          )}
          {body && (
            <AnimatedElement animation="fadeLeft" delay={0.2}>
              <PortableText value={body} />
            </AnimatedElement>
          )}
        </div>

        {/* List Section */}
        {list && list.items?.length > 0 && (
          <List items={list.items} columns={list.columns} theme={list.theme} />
        )}
      </div>
    </section>
  );
}
