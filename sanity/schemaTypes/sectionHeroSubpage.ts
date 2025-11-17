import { defineType, defineField } from 'sanity'
import { toPlainText } from '../../utils/toPlainText'

export default defineType({
  name: 'sectionHeroSubpage',
  title: 'Hero (subpage)',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'blockContentMinimal' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'blockContentMinimal' }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
  ],
  preview: {
    select: {
      titleValue: 'title',
    },
    prepare({ titleValue }) {
      const plainTextTitle = toPlainText(titleValue)

      return {
        title: 'Hero (subpage)',
        subtitle: plainTextTitle,
      }
    },
  },

})
