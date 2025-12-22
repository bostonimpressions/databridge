// ./sanity/schemaTypes/servicePage.ts
import { defineType, defineField } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';

interface ServicePageDocument {
  slug?: {
    current?: string;
  };
}

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  fields: [
    orderRankField({
      type: 'servicePage',
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
      description: 'Click "Generate" once to create the slug. Cannot be changed after to preserve SEO.',
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
            .slice(0, 96)
      },
      readOnly: ({ document }) => {
        const doc = document as ServicePageDocument;
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
        { type: 'sectionHeroSubpage' },
        { type: 'sectionOverview' },
        { type: 'sectionBanner' },
        { type: 'sectionDetails' },
        { type: 'sectionCallToAction' },
      ],
    }),
  ],
});
