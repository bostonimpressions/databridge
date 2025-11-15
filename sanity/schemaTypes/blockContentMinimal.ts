import { defineType } from "sanity"

// Import the component you will create to render the highlight in the Studio
import HighlightDecorator from '../components/HighlightDecorator' 

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
            // Add the component here for visual preview in the editor
            component: HighlightDecorator, 
          },
        ],
        annotations: [],
      },
    },
  ],
})