import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionHeroSubpage',
  title: 'Hero (subpage)',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' }),
    defineField({ name: 'lead', title: 'Lead', type: 'blockContent' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: ['default', 'service', 'industry'],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    // BACKGROUND TYPE SWITCH
    defineField({
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      options: {
        list: ['image', 'video'],
        layout: 'radio',
      },
      initialValue: 'image',
    }),

    // IMAGE BACKGROUND
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),

    // VIDEO BACKGROUND
    defineField({
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),
  ],
  preview: {
    select: {
      titleValue: 'heading',
    },
    prepare({ titleValue }) {
      const plainTextTitle = titleValue ? toPlainText(titleValue) : '';

      return {
        title: 'Hero (subpage)',
        subtitle: plainTextTitle || 'Hero (subpage)',
      };
    },
  },
});
