'use client';

import React from 'react';
import TextHeading from '@/components/ui/TextHeading';
import List from '@/components/ui/List';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import AnimatedElement from '@/components/AnimatedElement';

interface SnapshotPanel {
  heading?: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  challenge?: PortableTextBlock[];
  solution?: PortableTextBlock[];
  impact?: PortableTextBlock[];
}

interface Props {
  theme?: 'light' | 'dark' | 'none';
  heading?: PortableTextBlock[];
  panels: SnapshotPanel[];
}

function SectionSnapshots({ theme, heading, panels }: Props) {
  return (
    <section
      className={`relative overflow-hidden py-12  pb-20 ${
        theme === 'dark' ? 'bg-perano-200' : theme === 'light' ? 'bg-white' : 'bg-transparent'
      }`}
    >

    <div className="container mx-auto">
        {/* Top-level heading */}
        {heading && (
          <AnimatedElement animation="fade" delay={0}>
            <TextHeading level="h2">
              <PortableText value={heading} />
            </TextHeading>
          </AnimatedElement>
        )}
    </div>
    <div className="max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem] mx-auto 2xl:px-6">

      {/* Panels */}
      {panels?.map((panel, idx) => {
        // Alternate panel animations
        const animation = idx % 2 === 0 ? 'fadeLeft' : 'fadeRight';
        
        return (
          <AnimatedElement
            key={idx}
            animation={animation}
            delay={idx * 0.2}
            className="panel w-full bg-perano-200 p-8 pb-20 md:p-12 border-b-5 last:border-0 border-perano-300 md:border-0 md:mb-6 md:rounded-lg"
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col justify-start">
              <div className="font-semibold text-xl text-perano-600 mb-2">About client</div>
              {panel.heading && (
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  <PortableText value={panel.heading} />
                </h3>
              )}
              {panel.subheading && (
                <div className="text-gray-800 mb-4">
                  <PortableText value={panel.subheading} />
                </div>
              )}
              {panel.body && (
                <div className="text-gray-700">
                  <PortableText value={panel.body} />
                </div>
              )}
            </div>

            {/* Right Column - Snapshot List */}
            <div>
              <List
                columns={1}
                theme="snapshot"
                items={[
                  { heading: [{ _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', text: 'Challenge', marks: [] }] }], body: panel.challenge },
                  { heading: [{ _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', text: 'Solution', marks: [] }] }], body: panel.solution },
                  { heading: [{ _type: 'block', style: 'normal', markDefs: [], children: [{ _type: 'span', text: 'Outcome', marks: [] }] }], body: panel.impact },
                ]}
              />
            </div>
          </div>
        </AnimatedElement>
        );
      })}
      </div>
    </section>
  );
}

export default SectionSnapshots;
