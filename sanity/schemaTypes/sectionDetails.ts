import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionDetails',
  title: 'Details Section',
  type: 'object',
  fields: [
    // Main Section
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'blockContentMinimal',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'blockContentMinimal',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),

    // Steps List
    defineField({
      name: 'steps',
      title: 'Steps List',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'step',
          title: 'Step',
          fields: [
            { name: 'heading', title: 'Heading', type: 'blockContentMinimal' },
            { name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' },
            { name: 'body', title: 'Body', type: 'blockContent' },
          ],
          preview: {
            select: { heading: 'heading', subheading: 'subheading', body: 'body' },
            prepare({ heading, subheading, body }) {
              const title =
                (heading && toPlainText(heading)) ||
                (subheading && toPlainText(subheading)) ||
                (body && toPlainText(body)) ||
                'Step';
              return { title };
            },
          },
        }),
      ],
    }),

    // Secondary content row
    defineField({
      name: 'secondary',
      title: 'Secondary Content',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'blockContentMinimal' },
        { name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' },
        { name: 'body', title: 'Body', type: 'blockContent' },
      ],
    }),

    // Stats footer
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'statRow',
          title: 'Stat Row',
          fields: [
            { name: 'heading', title: 'Row Heading', type: 'blockContentMinimal' },
            {
              name: 'list',
              title: 'List Items',
              type: 'array',
              of: [
                defineField({
                  type: 'object',
                  name: 'statItem',
                  title: 'Stat Item',
                  fields: [
                    { name: 'heading', title: 'Heading', type: 'blockContentMinimal' },
                    { name: 'label', title: 'Label', type: 'string' },
                    { name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' },
                    { name: 'body', title: 'Body', type: 'blockContent' },
                  ],
                  preview: {
                    select: { heading: 'heading', label: 'label', subheading: 'subheading', body: 'body' },
                    prepare({ heading, label, subheading, body }) {
                      const headingText = heading ? toPlainText(heading) : '';
                      const labelText = label ? ` ${label}` : '';
                      const title =
                        (headingText + labelText) ||
                        (subheading && toPlainText(subheading)) ||
                        (body && toPlainText(body)) ||
                        'Stat Item';
                      return { title };
                    },
                  },

                }),
              ],
            },
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              const title = heading ? toPlainText(heading) : 'Stat Row';
              return { title };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      titleValue: 'heading',
    },
    prepare({ titleValue }) {
      const plainTextTitle = titleValue ? toPlainText(titleValue) : '';
      return {
        title: 'Details Section',
        subtitle: plainTextTitle || 'Details Section',
      };
    },
  },
});
