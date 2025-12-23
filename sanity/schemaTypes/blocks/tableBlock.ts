// schemas/objects/tableBlock.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'tableBlock',
  title: 'Data Table',
  type: 'object',
  fields: [
    defineField({
      name: 'columnA',
      title: 'Left Column Header',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'columnB',
      title: 'Right Column Header',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineField({
          name: 'row',
          title: 'Row',
          type: 'object',
          fields: [
            {
              name: 'a',
              title: 'Column A Value',
              type: 'blockContentMinimal',
            },
            {
              name: 'b',
              title: 'Column B Value',
              type: 'blockContentMinimal',
            },
          ],
          preview: {
            select: { a: 'a', b: 'b' },
            prepare({ a, b }) {
              return {
                title: 'Row',
                subtitle: `${a?.[0]?.children?.[0]?.text || ''} → ${b?.[0]?.children?.[0]?.text || ''}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
