import { defineType, defineField } from 'sanity'
//import blockContentMinimal from './blockContentMinimal'

export default defineType({
  name: 'sectionHeroMain',
  title: 'Hero Main',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'blockContentMinimal' }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'number' }),
    defineField({ name: 'ctaLink', title: 'CTA Link', type: 'url' }),
  ],
  preview: {
    select: {
      subtitle: 'title',
    },
    prepare({ subtitle }) {
      return {
        title: 'Hero Main',
        subtitle: subtitle || '(no subtitle)',
      }
    },
  },
})
