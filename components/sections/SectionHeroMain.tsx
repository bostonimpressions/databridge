'use client';

import { PortableText, PortableTextBlock } from '@portabletext/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SanityImageSource } from '@sanity/image-url';
import { urlFor } from '@/sanity/lib/image';
import TextHeading from '@/components/ui/TextHeading';
import { mergePortableTextComponents } from '@/lib/portableTextComponents';

interface Button {
  title: string;
  url: string;
  internal?: boolean;
}

interface Slide {
  heading: PortableTextBlock[];
  label?: PortableTextBlock[];
  subheading?: PortableTextBlock[];
  lead?: PortableTextBlock[];
  body?: PortableTextBlock[];
  buttons?: Button[];
  theme?: 'default' | 'service';
  backgroundType?: 'image' | 'video';
  backgroundImage?: SanityImageSource;
  backgroundVideo?: {
    asset: {
      url: string;
    };
  };
  autoHeight?: boolean;
}

interface Props {
  slides: Slide[];
}

export default function SectionHeroMain({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    slides.forEach((slide) => {
      if (!slide.backgroundImage) return;
      const img = new Image();
      img.src = urlFor(slide.backgroundImage).width(1920).url();
    });
  }, [slides]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[current];

  // Get the properly formatted image URL
  const backgroundImageUrl = slide.backgroundImage
    ? urlFor(slide.backgroundImage).width(1920).url()
    : undefined;

  // Determine background based on theme
  const backgroundStyle =
    slide.theme === 'default'
      ? {
          background: 'white',
        }
      : slide.theme === 'service'
        ? {
            backgroundColor: '#394FA2',
          }
        : {};

  // Determine blend mode for the background image
  const blendMode =
    slide.theme === 'default' ? 'multiply' : slide.theme === 'service' ? 'color-dodge' : 'normal';

  const textColor =
    slide.theme === 'default' || slide.theme === 'service' ? 'text-gray-900' : 'text-white';

  return (
    <section
      className={`${slide.autoHeight ? 'h-auto' : 'min-h-[600px]'} relative overflow-hidden py-[20] pb-[40] md:py-[60]`}
      style={{ ...backgroundStyle }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${slide.theme}-bg`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 bg-white"
          style={{
            background:
              slide.theme === 'default'
                ? 'linear-gradient(346deg, rgba(69, 218, 255, 0.32) 4.34%, rgba(111, 231, 181, 0.32) 28.41%, rgba(187, 255, 48, 0.24) 60.32%)'
                : '#286AFA',
          }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* IMAGE BACKGROUND */}
        {slide.backgroundType === 'image' && backgroundImageUrl && (
          <motion.div
            key={backgroundImageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="will-change-opacity absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: blendMode,
            }}
          />
        )}

        {/* VIDEO BACKGROUND */}
        {slide.backgroundType === 'video' && slide.backgroundVideo?.asset?.url && (
          <motion.video
            key={slide.backgroundVideo.asset.url}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="will-change-opacity absolute inset-0 h-full w-full object-cover"
            style={{ mixBlendMode: blendMode }}
            src={slide.backgroundVideo.asset.url}
          />
        )}
      </AnimatePresence>

      <div className="container relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div className="max-w-xl md:col-span-2">
              {slide.theme === 'service' && (
                <div className="mb-4 text-sm font-semibold text-white">Services</div>
              )}

              {slide.label && (
                <PortableText
                  value={slide.label}
                  components={mergePortableTextComponents({
                    block: {
                      normal: ({ children }) => (
                        <p className={`text-sm font-semibold ${textColor}`}>{children}</p>
                      ),
                    },
                  })}
                />
              )}

              <TextHeading color={textColor} border={current != 0}>
                <PortableText
                  value={slide.heading}
                  components={{
                    marks: {
                      highlight: ({ children }) => (
                        <span className="text-highlight">{children}</span>
                      ),
                    },
                  }}
                />
              </TextHeading>

              {slide.subheading && (
                <PortableText
                  value={slide.subheading}
                  components={{
                    block: {
                      normal: ({ children }) => <h4 className={textColor}>{children}</h4>,
                    },
                    marks: {
                      highlight: ({ children }) => (
                        <span className="text-highlight">{children}</span>
                      ),
                    },
                  }}
                />
              )}

              {slide.lead && (
                <PortableText
                  value={slide.lead}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className={`text-lg font-semibold ${textColor}`}>{children}</p>
                      ),
                    },
                    marks: {
                      highlight: ({ children }) => (
                        <span className="text-highlight">{children}</span>
                      ),
                    },
                  }}
                />
              )}

              {slide.body && (
                <div className="mb-6 max-w-lg">
                  <PortableText
                    value={slide.body}
                    components={mergePortableTextComponents({
                      block: {
                        normal: ({ children }) => <p className={textColor}>{children}</p>,
                      },
                    })}
                  />
                </div>
              )}

              {slide.buttons && (
                <div className="flex gap-2">
                  {slide.buttons.map((btn, i) => (
                    <a
                      key={btn.title}
                      href={btn.url}
                      className={i === 0 ? 'btn-primary' : 'btn-secondary'}
                    >
                      {btn.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
