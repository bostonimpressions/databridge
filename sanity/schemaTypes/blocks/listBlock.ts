// schemas/objects/listBlock.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'listBlock',
  title: 'List',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'blockContentMinimal' }),
    defineField({ name: 'body', type: 'blockContent' }),

    defineField({
      name: 'variant',
      type: 'string',
      options: {
        list: ['default', 'cards', 'checks', 'flags', 'positives', 'negatives', 'counter'],
      },
      initialValue: 'default',
    }),

    defineField({
      name: 'columns',
      type: 'number',
      options: {
        list: [1, 2, 3, 4],
      },
      initialValue: 2,
    }),

    defineField({
      name: 'items',
      type: 'array',
      of: [{ type: 'listItem' }],
    }),
  ],

  preview: {
    select: {
      heading: 'heading',
    },
    prepare(selection: { heading?: any[] }) {
      const { heading } = selection;
      const firstHeadingText = heading?.[0]?.children?.[0]?.text?.trim() || 'List';
      return {
        title: firstHeadingText,
        subtitle: 'List block',
      };
    },
  },
});
