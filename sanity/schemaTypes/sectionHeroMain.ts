import { defineType, defineField } from 'sanity'
import { toPlainText } from '../../utils/toPlainText'

export default defineType({
  name: 'sectionHeroMain',
  title: 'Hero (main)',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'blockContentMinimal' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'blockContentMinimal' }),
  ],
  preview: {
    select: {
      titleValue: 'title',
    },
    prepare({ titleValue }) {
      const plainTextTitle = toPlainText(titleValue)

      return {
        title: 'Hero (main)',
        subtitle: plainTextTitle,
      }
    },
  },

})
