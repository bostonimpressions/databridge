import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionFeature',
  title: 'Feature Section',
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
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),

    // Optional image with layout
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageLayout',
      title: 'Image Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Image Left', value: 'imgLeft' },
          { title: 'Image Right', value: 'imgRight' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => !parent?.image,
    }),

    // List Section
    defineField({
      name: 'list',
      title: 'List Section',
      type: 'object',
      fields: [
        {
          name: 'theme',
          title: 'Theme',
          type: 'string',
          options: {
            list: ['default', 'cards', 'cards-white', 'checks', 'flags', 'negatives', 'positives'],
            layout: 'radio',
          },
          initialValue: 'default',
        },
        {
          name: 'columns',
          title: 'Columns',
          type: 'number',
          options: {
            list: [
              { title: '1', value: 1 },
              { title: '2', value: 2 },
              { title: '3', value: 3 },
            ],
          },
          initialValue: 2,
        },
        {
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineField({
              name: 'item',
              title: 'Item',
              type: 'object',
              fields: [
                { name: 'heading', title: 'Heading', type: 'blockContentMinimal' },
                { name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' },
                { name: 'body', title: 'Body', type: 'blockContent' },
                { name: 'icon', title: 'Icon', type: 'image', options: { hotspot: true } },
              ],
              preview: {
                select: {
                  titleHeading: 'heading',
                  titleBody: 'body',
                },
                prepare({ titleHeading, titleBody }) {
                  const title =
                    (titleHeading && toPlainText(titleHeading)) ||
                    (titleBody && toPlainText(titleBody)) ||
                    'List item';

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
        title: 'Feature Section',
        subtitle: plainTextTitle || 'Feature Section',
      };
    },
  },
});
