// ./sanity/schemaTypes/page.ts
import { defineType, defineField } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';

interface PageDocument {
  slug?: {
    current?: string;
  };
}

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    // Orderable field for drag & drop sorting in CMS
    orderRankField({
      type: 'page',
      newItemPosition: 'after',
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Click "Generate" once to create the slug. Cannot be changed after to preserve SEO.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .slice(0, 96),
      },
      readOnly: ({ document }) => {
        const doc = document as PageDocument;
        return !!doc?.slug?.current;
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Used for SEO meta description. Aim for 140–160 characters.',
      rows: 3,
      validation: (Rule) =>
        Rule.max(200).warning('Meta descriptions should be 160 characters or less.'),
    }),

    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'sectionHeroMain' },
        { type: 'sectionHeroSubpage' },
        { type: 'sectionOverview' },
        { type: 'sectionBanner' },
        { type: 'sectionFeatureList' },
        { type: 'sectionFeature' },
        { type: 'sectionSnapshots' },
        { type: 'sectionComparison' },
        { type: 'sectionCallToAction' },
        { type: 'sectionBody' },
      ],
    }),
  ],

  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: '_rank', direction: 'asc' }],
    },
  ],
});
