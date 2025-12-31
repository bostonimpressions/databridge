// schemaTypes/sectionTestimonials.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'sectionTestimonials',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    // SECTION ID (for anchor links - stable, won't change with content)
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description:
        'Optional unique ID for this section (used for anchor links). If not set, will use section-testimonials-{index}. Once set, keep it stable to avoid breaking links.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true; // Optional
          // Must be URL-safe
          const urlSafe = /^[a-z0-9-]+$/.test(value);
          if (!urlSafe) {
            return 'Section ID must be lowercase letters, numbers, and hyphens only';
          }
          return true;
        }),
    }),

    // TESTIMONIALS
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineField({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            defineField({
              name: 'body',
              title: 'Quote',
              type: 'blockContent',
              description: 'The testimonial quote text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'source',
              title: 'Source',
              type: 'blockContentMinimal',
              description: 'The attribution/source of the testimonial (e.g., "Regional Enterprise Customer")',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              body: 'body',
              source: 'source',
            },
            prepare({ body, source }) {
              const bodyText = body && typeof body === 'object' && body[0]?.children?.[0]?.text
                ? body[0].children[0].text
                : 'Testimonial';
              const sourceText = source && typeof source === 'object' && source[0]?.children?.[0]?.text
                ? source[0].children[0].text
                : '';
              return {
                title: bodyText.substring(0, 50) + (bodyText.length > 50 ? '...' : ''),
                subtitle: sourceText || 'No source',
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],

  preview: {
    select: {
      itemCount: 'items',
    },
    prepare({ itemCount }) {
      const count = itemCount?.length || 0;
      return {
        title: 'Testimonials Section',
        subtitle: `${count} testimonial${count !== 1 ? 's' : ''}`,
      };
    },
  },
});

