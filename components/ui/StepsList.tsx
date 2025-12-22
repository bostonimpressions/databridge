'use client';

import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import AnimatedElement from '@/components/AnimatedElement';

interface StepsItem {
  heading?: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
}

interface StepsListProps {
  items: StepsItem[];
}

export default function StepsList({ items }: StepsListProps) {
  return (
    <ol className="steps-list grid sm:grid-cols-3 gap-12 md:gap-20">
      {items.map((item, i) => {
        // Vary the animation based on position
        const animations = ['fadeUp', 'fadeLeft', 'fadeRight'] as const;
        const animation = animations[i % 3];
        
        return (
          <AnimatedElement
            key={i}
            as="li"
            animation={animation}
            delay={i * 0.15}
            duration={0.5}
          >
          <div className="flex w-14 h-14 md:h-18 md:w-18 mb-2 flex-shrink-0 items-center justify-center rounded-lg bg-perano-500 text-biscay-500 text-5xl md:text-6xl font-semibold">
            {i + 1}
          </div>

          <div className="list-content">
            {item.heading && (
              <h4 className="mb-1 font-semibold text-2xl! md:text-3xl!">
                <PortableText value={item.heading} />
              </h4>
            )}

            {item.subheading && (
              <h5 className="text-sm opacity-80">
                <PortableText value={item.subheading} />
              </h5>
            )}

            {item.body && (
              <div>
                <PortableText value={item.body} />
              </div>
            )}
          </div>
        </AnimatedElement>
        );
      })}
    </ol>
  );
}
