'use client';

import React from 'react';
import TextHeading from '@/components/ui/TextHeading';
import List from '@/components/ui/List';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Image from 'next/image';
import AnimatedElement from '@/components/AnimatedElement';

interface ListItem {
  heading: PortableTextBlock[];
}

interface ComparisonPanel {
  heading?: PortableTextBlock[];
  items: ListItem[];
}

interface Props {
  heading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  nuview: ComparisonPanel;
  competitor: ComparisonPanel;
}

function SectionComparison({ heading, body, nuview, competitor }: Props) {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-3">
          {heading && (
            <AnimatedElement animation="fade" delay={0} className="md:col-span-1">
              <TextHeading level="h2">
                <PortableText value={heading} />
              </TextHeading>
            </AnimatedElement>
          )}

          {body && (
            <AnimatedElement animation="fadeLeft" delay={0.1} className="md:col-span-2">
              <PortableText value={body} />
            </AnimatedElement>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* NuView panel */}
          <AnimatedElement animation="fadeRight" delay={0.2} className="mb-2 shadow-lg">
            <header className="border-t-5 border-b-50 min-h-38 mb-2 content-center border-sapphire-500 pb-5 pt-5 text-center">
              <h3 className="relative ml-auto mr-auto h-9 w-auto">
                <div className="sr-only">NuView</div>
                <Image src="/logo.png" alt="NuView" fill className="object-contain" />
              </h3>
            </header>
            <List
              theme="good"
              columns={1}
              items={nuview.items.map((item) => ({ heading: item.heading }))}
              className="p-6 pb-12 pt-6 md:p-10"
            />
          </AnimatedElement>

          {/* Competitor panel */}
          <AnimatedElement animation="fadeLeft" delay={0.2} className="mb-2 shadow-lg">
            {competitor.heading && (
              <header className="border-t-5 border-b-50 min-h-38 mb-2 content-center border-magenta-300 pb-5 pt-5 text-center">
                <h3>
                  <PortableText value={competitor.heading} />
                </h3>
              </header>
            )}
            <List
              theme="bad"
              columns={1}
              items={competitor.items.map((item) => ({ heading: item.heading }))}
              className="p-6 pb-12 pt-6 md:p-10"
            />
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}

export default SectionComparison;
