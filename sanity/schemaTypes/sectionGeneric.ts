import { defineType, defineField } from 'sanity';
import { toPlainText } from '../../utils/toPlainText';

export default defineType({
  name: 'sectionGeneric',
  title: 'Generic Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headings',
      title: 'Headings',
      type: 'array',
      of: [{ type: 'blockContentMinimal' }],
    }),
    defineField({
      name: 'bodies',
      title: 'Bodies',
      type: 'array',
      of: [{ type: 'blockContent' }],
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'body', type: 'text' },
            { name: 'image', type: 'image' },
          ],
        },
      ],
    }),
    defineField({
      name: 'table',
      title: 'Table',
      type: 'object',
      fields: [
        { name: 'headers', type: 'array', of: [{ type: 'string' }] },
        {
          name: 'rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'challenge', type: 'string' },
                { name: 'impact', type: 'string' },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      firstHeading: 'headings.0',
    },
    prepare({ firstHeading }) {
      return {
        title: 'Generic Section',
        subtitle: firstHeading ? toPlainText(firstHeading) : '',
      };
    },
  },
});
