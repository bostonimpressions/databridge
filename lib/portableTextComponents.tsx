import React from 'react';
import type { PortableTextComponents } from '@portabletext/react';

/**
 * Shared PortableText components configuration
 * Use this for all blockContent and blockContentMinimal fields
 * to ensure consistent styling, especially for the highlight mark
 */
export const portableTextComponents: PortableTextComponents = {
  marks: {
    highlight: ({ children }) => <span className="text-highlight">{children}</span>,
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-blue-600 underline hover:text-blue-700"
        >
          {children}
        </a>
      );
    },
  },
};

/**
 * Helper function to merge custom components with the base components
 * Useful when you need to override block styles but keep marks
 */
export function mergePortableTextComponents(
  customComponents: Partial<PortableTextComponents>
): PortableTextComponents {
  return {
    ...portableTextComponents,
    ...customComponents,
    marks: {
      ...portableTextComponents.marks,
      ...customComponents.marks,
    },
  };
}
