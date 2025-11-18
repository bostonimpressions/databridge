import { defineType, defineField } from 'sanity';
import { toPlainText } from '../../utils/toPlainText';

export default defineType({
  name: 'sectionHeroMain',
  title: 'Hero (main)',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'heading', title: 'Heading', type: 'blockContentMinimal' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContentMinimal' }),
  ],
  preview: {
    select: {
      titleValue: 'heading',
    },
    prepare({ titleValue }) {
      const plainTextTitle = toPlainText(titleValue);

      return {
        title: 'Hero (main)',
        subtitle: plainTextTitle,
      };
    },
  },
});
