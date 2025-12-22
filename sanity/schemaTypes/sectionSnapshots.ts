import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionSnapshots',
  title: 'Snapshots Section',
  type: 'object',
  fields: [
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'None', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'blockContentMinimal',
    }),

    defineField({
      name: 'panels',
      title: 'Snapshots Panels',
      type: 'array',
      of: [
        defineField({
          name: 'panel',
          title: 'Panel',
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'blockContentMinimal' },
            { name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' },
            { name: 'body', title: 'Body', type: 'blockContent' },

            // Hardcoded 3-item snapshot
            defineField({
              name: 'challenge',
              title: 'Challenge',
              type: 'blockContent',
            }),
            defineField({
              name: 'solution',
              title: 'Solution',
              type: 'blockContent',
            }),
            defineField({
              name: 'impact',
              title: 'Outcome',
              type: 'blockContent',
            }),
          ],
          preview: {
            select: {
              titleHeading: 'heading',
            },
            prepare({ titleHeading }) {
              const title =
                (titleHeading && toPlainText(titleHeading)) ||
                'Snapshot Panel';
              return { title };
            },
          },
        }),
      ],
      initialValue: [],
    }),
  ],

  preview: {
    select: {
      titleValue: 'heading',
    },
    prepare({ titleValue }) {
      const plainTextTitle = titleValue ? toPlainText(titleValue) : '';
      return {
        title: 'Snapshots Section',
        subtitle: plainTextTitle || 'Snapshots Section',
      };
    },
  },
});
