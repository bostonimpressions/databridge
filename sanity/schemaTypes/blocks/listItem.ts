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
