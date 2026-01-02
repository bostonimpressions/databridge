'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/lib/portableTextComponents';
import { motion } from 'framer-motion';

interface TestimonialItem {
  body: any[];
  source: any[];
  _key?: string;
}

interface SectionTestimonialsProps {
  items: TestimonialItem[];
  sectionId?: string;
}

export default function SectionTestimonials({ items, sectionId }: SectionTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(1); // Start with mobile (1 item)

  // Responsive items per page: 1 on mobile, 2 on desktop
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 2 : 1);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(items.length - itemsPerPage, prev + itemsPerPage));
  };

  const goToPage = (pageIndex: number) => {
    setCurrentIndex(pageIndex * itemsPerPage);
  };

  // Touch/drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      dragStartX.current = e.touches[0].clientX;
    } else {
      dragStartX.current = e.clientX;
    }
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    let endX: number;
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX;
    } else {
      endX = e.clientX;
    }

    const deltaX = dragStartX.current - endX;
    const threshold = 50; // Minimum drag distance to trigger slide

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swiped left - go to next
        goToNext();
      } else {
        // Swiped right - go to previous
        goToPrevious();
      }
    }

    setIsDragging(false);
  };

  return (
    <section className="bg-white py-8" id={sectionId}>
      <div className="container mx-auto">
        <div className="relative px-3 sm:px-8 md:px-8 xl:px-0">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="text-blue-ribbon-400 hover:text-blue-ribbon-600 absolute left-0 top-1/2 z-10 -translate-x-9 -translate-y-1/2 cursor-pointer p-4 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:text-gray-300 xl:-translate-x-4"
            aria-label="Previous testimonials"
          >
            <svg
              width="32"
              height="56"
              viewBox="0 0 12 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 4l-4 8 4 8" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= items.length - itemsPerPage}
            className="text-blue-ribbon-400 hover:text-blue-ribbon-600 absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-9 cursor-pointer p-4 transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:text-gray-300 xl:translate-x-4"
            aria-label="Next testimonials"
          >
            <svg
              width="32"
              height="56"
              viewBox="0 0 12 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4l4 8-4 8" />
            </svg>
          </button>

          {/* Testimonials Grid */}
          <div
            ref={containerRef}
            className="relative mx-auto w-full max-w-5xl cursor-grab overflow-hidden active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <motion.div
              className="flex w-full"
              style={{
                gap: itemsPerPage > 1 ? '1.5rem' : '0',
              }}
              animate={{
                x:
                  itemsPerPage === 1
                    ? `-${currentIndex * 100}%`
                    : `-${currentIndex * (100 / itemsPerPage)}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item._key || `testimonial-${index}`}
                  className="border-b-6 flex h-full flex-shrink-0 flex-col border-t-8 border-b-gray-200 border-t-blue-ribbon-500 bg-gray-100 p-6"
                  style={{
                    width:
                      itemsPerPage === 1
                        ? '100%'
                        : `calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                    minWidth: itemsPerPage === 1 ? '100%' : '0',
                    maxWidth: itemsPerPage === 1 ? '100%' : 'none',
                  }}
                >
                  <div className="text-blue-ribbon-600 [&_p:first-child]:before:text-blue-ribbon-400 [&_p:last-child]:after:text-blue-ribbon-400 relative mb-4 flex min-h-[200px] flex-1 items-start px-5 text-lg [&_p:first-child]:before:absolute [&_p:first-child]:before:left-0 [&_p:first-child]:before:top-0 [&_p:first-child]:before:font-serif [&_p:first-child]:before:text-4xl [&_p:first-child]:before:leading-none [&_p:first-child]:before:content-['\201C'] [&_p:last-child]:after:absolute [&_p:last-child]:after:ml-[5px] [&_p:last-child]:after:font-serif [&_p:last-child]:after:text-4xl [&_p:last-child]:after:leading-none [&_p:last-child]:after:content-['\201D']">
                    <div>
                      <PortableText value={item.body} components={portableTextComponents} />
                    </div>
                  </div>

                  <div className="mt-auto text-right">
                    <div className="text-blue-ribbon-600 px-5 italic [&_p]:text-sm [&_p]:sm:text-sm [&_p]:lg:text-sm">
                      <PortableText value={item.source} components={portableTextComponents} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => goToPage(pageIndex)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsPerPage) === pageIndex
                      ? 'bg-blue-ribbon-500'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
