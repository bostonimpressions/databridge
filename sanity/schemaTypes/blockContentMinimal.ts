import { defineType } from "sanity"
import HighlightDecorator from '../components/HighlightDecorator'
import { HighlightIcon } from '@sanity/icons'

export default defineType({
  name: 'blockContentMinimal',
  title: 'Simple Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [], 
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { 
            title: 'Highlight', 
            value: 'highlight', 
            component: HighlightDecorator,
            icon: HighlightIcon, 
          },
        ],
        annotations: [],
      },
    },
  ],
})