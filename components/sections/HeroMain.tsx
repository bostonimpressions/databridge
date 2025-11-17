'use client';

import { PortableText, PortableTextBlock } from '@portabletext/react';

interface HeroSectionProps {
  title: PortableTextBlock[];
  subtitle?: PortableTextBlock[];
  ctaText?: number;
  ctaLink?: string;
}

export default function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <section className="hero-main">
      <div className="container mx-auto p-7">
        <h1>
          <PortableText
            value={title}
            components={{
              marks: {
                highlight: ({ children }) => (
                  <span className="font-semibold text-cyan-500">{children}</span>
                ),
              },
            }}
          />
        </h1>

        {subtitle && (
          <div className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            <PortableText
              value={subtitle}
              components={{
                marks: {
                  highlight: ({ children }) => (
                    <span className="font-semibold text-cyan-500">{children}</span>
                  ),
                  link: ({ value, children }) => (
                    <a
                      href={value?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
        )}

        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="rounded bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
