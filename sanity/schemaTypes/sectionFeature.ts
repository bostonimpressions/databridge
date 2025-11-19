import { defineType, defineField } from 'sanity';
import { toPlainText } from '../../utils/toPlainText';

export default defineType({
  name: 'sectionFeature',
  title: 'Feature Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', type: 'string' },
            { name: 'body', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'table',
      title: 'Table',
      type: 'object',
      fields: [
        {
          name: 'headers',
          title: 'Headers',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Row',
              fields: [
                defineField({
                  name: 'values',
                  title: 'Values',
                  type: 'array',
                  of: [{ type: 'string' }],
                  description: 'Enter values in order matching the headers',
                }),
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      titleValue: 'heading',
    },
    prepare({ titleValue }) {
      const plainTextTitle = toPlainText(titleValue);

      return {
        title: 'Feature Section',
        subtitle: plainTextTitle,
      };
    },
  },
});
