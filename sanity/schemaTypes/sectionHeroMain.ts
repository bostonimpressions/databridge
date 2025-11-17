import { defineType, defineField } from 'sanity'
import blockContentMinimal from './blockContentMinimal'
import { toPlainText } from '../../utils/toPlainText'

export default defineType({
  name: 'sectionHeroMain',
  title: 'Hero Main',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'blockContentMinimal' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'blockContentMinimal' }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'number' }),
    defineField({ name: 'ctaLink', title: 'CTA Link', type: 'string' }),
  ],
  preview: {
    select: {
      titleValue: 'title',
    },
    prepare({ titleValue }) {
      const plainTextTitle = toPlainText(titleValue)

      return {
        title: 'Hero Main',
        subtitle: plainTextTitle,
      }
    },
  },

})
