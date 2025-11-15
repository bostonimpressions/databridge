'use client'

import { PortableText, PortableTextBlock } from '@portabletext/react'

interface HeroSectionProps {
  title: string
  subtitle?: PortableTextBlock[] // comes from Sanity blockContent (array of blocks)
  ctaText?: number
  ctaLink?: string
}

export default function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <section className="py-32 text-center bg-gray-50 dark:bg-black">
      <h1 className="text-5xl font-bold mb-4">{title}</h1>

      {subtitle && (
        <div className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          <PortableText
            value={subtitle}
            components={{
              marks: {
                highlight: ({ children }) => (
                  <span className="text-cyan-500 font-semibold">{children}</span>
                ),
                link: ({ value, children }) => (
                  <a
                    href={value?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
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
        <a href={ctaLink} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          {ctaText}
        </a>
      )}
    </section>
  )
}
