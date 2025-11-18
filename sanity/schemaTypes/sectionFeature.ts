import { defineType, defineField } from 'sanity';
import { toPlainText } from '../../utils/toPlainText';

export default defineType({
  name: 'sectionFeature',
  title: 'Feature Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'blockContentMinimal' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
  ],
  preview: {
    select: {
      titleValue: 'title',
    },
    prepare({ titleValue }) {
      const plainTextTitle = toPlainText(titleValue);

      return {
        title: 'Feature Section',
        subtitle: plainTextTitle,
      };
    },
  },
});
