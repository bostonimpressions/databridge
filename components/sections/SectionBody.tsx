'use client';

import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import React from 'react';

interface Props {
  theme?: 'light' | 'medium' | 'dark' | 'green';
  body: PortableTextBlock[];
}

const themeClasses: Record<string, string> = {
  light: 'bg-white text-sapphire-500',
  medium: 'bg-solitude-500 text-sapphire-500',
  dark: 'bg-perano-500 text-white',
};

export default function SectionBody({ body, theme = 'light' }: Props) {
  return (
    <section
      className={`relative overflow-hidden py-12 ${themeClasses[theme] || themeClasses.light}`}
    >
      <div className="container mx-auto px-4">
        <PortableText value={body} />
      </div>
    </section>
  );
}
