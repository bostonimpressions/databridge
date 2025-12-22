import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionCallToAction',
  title: 'Call To Action Section',
  type: 'object',
  fields: [

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'blockContentMinimal',
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Link Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'string',
          validation: (Rule) => Rule.required(),
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
        title: 'Call To Action Section',
        subtitle: plainTextTitle || "Call To Action Section",
      };
    },
  },
});
