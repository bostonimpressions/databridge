import { defineType, defineField } from 'sanity'
import blockContentMinimal from './blockContentMinimal'

export default defineType({
  name: 'sectionHeroMain',
  title: 'Hero Section (Home Only)',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'blockContentMinimal' }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
    defineField({ name: 'ctaLink', title: 'CTA Link', type: 'url' }),
  ],
})
