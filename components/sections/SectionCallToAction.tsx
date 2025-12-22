'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

interface Link {
  text: string;
  url: string;
}

interface Props {
  heading: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  body?: PortableTextBlock[];
  link: Link;
}

function SectionCallToAction({ heading, subheading, body, link }: Props) {
  return (
    <AnimatedSection animation="scale" className="bg-white py-12">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-xl p-10 md:p-20">
          {/* Green background */}
          <div className="bg-apple-500 absolute inset-0 h-full w-full"></div>

          {/* Black → transparent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-color-burn"></div>

          {/* Content */}
          <div className="relative m-auto flex max-w-[540px] flex-col gap-10 text-center">
            <h2 className="mb-0 text-white">
              <PortableText value={heading} />
            </h2>

            {subheading && (
              <div className="text-base text-white">
                <PortableText value={subheading} />
              </div>
            )}

            {link && (
              <Link
                href={link.url}
                className="btn-primary-white mx-auto w-fit p-3 px-10 md:text-lg"
              >
                {link.text}
              </Link>
            )}

            {body && (
              <div className="text-sm text-white">
                <PortableText value={body} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default SectionCallToAction;
