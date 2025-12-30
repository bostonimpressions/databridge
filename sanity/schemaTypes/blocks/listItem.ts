// schemas/objects/listItem.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'listItem',
  title: 'List Item',
  type: 'object',
  fields: [
    { name: 'heading', type: 'blockContentMinimal' },
    { name: 'body', type: 'blockContent' },
    { name: 'icon', type: 'image', options: { hotspot: true } },
    {
      name: 'url',
      type: 'string',
      title: 'URL',
      description: 'Optional link URL. If provided, the card will be clickable.',
    },
    {
      name: 'label',
      type: 'string',
      title: 'Label',
      description:
        'Optional label (e.g., "sq. ft") to display inline next to the heading. Used with cards-data variant.',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      body: 'body',
    },
    prepare(selection) {
      const { heading, body } = selection;
      const title = heading ? heading[0]?.children?.[0]?.text : 'List Item';
      const subtitle = body ? body[0]?.children?.[0]?.text : '';
      return {
        title,
        subtitle,
      };
    },
  },
});
