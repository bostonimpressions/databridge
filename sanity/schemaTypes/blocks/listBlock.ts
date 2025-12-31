// schemas/objects/listBlock.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'listBlock',
  title: 'List',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'blockContentMinimal',
      description: 'Optional heading that appears above the list',
    }),

    defineField({
      name: 'variant',
      type: 'string',
      options: {
        list: [
          'default',
          'cards',
          'cards-blue',
          'cards-service',
          'cards-data',
          'checks',
          'flags',
          'positives',
          'negatives',
          'counter',
          'images',
        ],
      },
      initialValue: 'default',
    }),

    defineField({
      name: 'columns',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 6],
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
      variant: 'variant',
      itemCount: 'items',
    },
    prepare(selection: { variant?: string; itemCount?: unknown[] }) {
      const { variant, itemCount } = selection;
      const count = itemCount?.length || 0;
      return {
        title: `List (${variant || 'default'})`,
        subtitle: `${count} item${count !== 1 ? 's' : ''}`,
      };
    },
  },
});
