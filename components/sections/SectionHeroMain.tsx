'use client';

import { PortableText, PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';

interface Props {
  label?: string;
  heading: PortableTextBlock[];
  body?: PortableTextBlock[];
}

export default function HeroSection({ label, heading, body }: Props) {
  return (
    <section className="relative overflow-hidden py-[20] pb-[40] md:py-[60]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 h-full w-full object-cover opacity-10"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-gradient pointer-events-none absolute left-0 top-0 h-full w-full"></div>

      <div className="container relative z-10">
        {label && <div className="mb-4 text-xs font-semibold">{label}</div>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1>
              <PortableText
                value={heading}
                components={{
                  marks: {
                    highlight: ({ children }) => <span className="text-highlight">{children}</span>,
                  },
                }}
              />
            </h1>

            {body && (
              <div className="mb-6">
                <PortableText
                  value={body}
                  components={{
                    marks: {
                      highlight: ({ children }) => (
                        <span className="text-highlight">{children}</span>
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

            <div className="flex gap-2">
              <button className="btn-primary">Schedule facility tour</button>
              <button className="btn-secondary">Learn more</button>
            </div>
          </div>

          <div className="hidden md:col-span-1 md:block">
            <Image src="/images/hero-main-image.png" alt="Hero image" width={300} height={300} />
          </div>
        </div>
      </div>
    </section>
  );
}
