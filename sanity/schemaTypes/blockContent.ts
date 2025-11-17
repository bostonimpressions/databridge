import { defineType } from 'sanity'
import HighlightDecorator from '../components/HighlightDecorator' 
import { HighlightIcon } from '@sanity/icons' 

export default defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
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
        annotations: [
          { title: 'URL', name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] }
        ]
      }
    }
  ]
})