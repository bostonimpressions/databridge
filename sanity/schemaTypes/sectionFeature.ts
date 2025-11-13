import { defineType, defineField } from 'sanity'
import blockContent from './blockContent'
import blockContentMinimal from './blockContentMinimal'

export default defineType({
  name: 'sectionFeature',
  title: 'Feature Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'blockContentMinimal' }),
    defineField({ name: 'description', title: 'Description', type: 'blockContent' }),
  ],
})
