import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionBanner',
  title: 'Banner Section',
  type: 'object',
  fields: [
    // Main Section
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Medium', value: 'medium' },
          { title: 'Dark', value: 'dark' },
          { title: 'Green', value: 'green' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    defineField({ name: 'reference', title: 'Reference', type: 'blockContent' }),
  ],

  preview: {
    select: {
      titleValue: 'body',
    },
    prepare({ titleValue }) {
      const plainTextTitle = titleValue ? toPlainText(titleValue) : '';

      return {
        title: 'Banner Section',
        subtitle: plainTextTitle || 'Banner Section',
      };
    },
  },
});
