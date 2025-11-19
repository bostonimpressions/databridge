import { defineType, defineField } from 'sanity';
import { toPlainText } from '../../utils/toPlainText';

export default defineType({
  name: 'sectionHeroSubpage',
  title: 'Hero (subpage)',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'blockContentMinimal' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'url',
          title: 'Button URL',
          type: 'url',
        }),
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
        title: 'Hero (subpage)',
        subtitle: plainTextTitle,
      };
    },
  },
});
