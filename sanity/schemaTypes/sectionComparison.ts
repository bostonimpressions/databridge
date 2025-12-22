import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionComparison',
  title: 'Comparison Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'blockContentMinimal',
    }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),

    // NuView Features
    defineField({
      name: 'nuview',
      title: 'NuView Panel',
      type: 'object',
      fields: [
        {
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineField({
              name: 'item',
              title: 'Item',
              type: 'object',
              fields: [{ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }],
              preview: {
                select: {
                  titleHeading: 'heading',
                },
                prepare({ titleHeading }) {
                  const title = (titleHeading && toPlainText(titleHeading)) || 'List item';

                  return {
                    title,
                  };
                },
              },
            }),
          ],
          initialValue: [],
        },
      ],
    }),

    // competitor
    defineField({
      name: 'competitor',
      title: 'Competitor Panel',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'blockContentMinimal',
          initialValue: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  text: 'Piecemeal MSPs',
                  marks: [],
                },
              ],
            },
          ],
        }),

        {
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineField({
              name: 'item',
              title: 'Item',
              type: 'object',
              fields: [{ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }],
              preview: {
                select: {
                  titleHeading: 'heading',
                },
                prepare({ titleHeading }) {
                  const title = (titleHeading && toPlainText(titleHeading)) || 'List item';

                  return {
                    title,
                  };
                },
              },
            }),
          ],
          initialValue: [],
        },
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
        title: 'Comparison Section',
        subtitle: plainTextTitle || 'Comparison Section',
      };
    },
  },
});
