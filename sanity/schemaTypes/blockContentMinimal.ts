import { defineType } from "sanity"

export default defineType({
  name: 'blockContentMinimal',
  title: 'Simple Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [], // no lists
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Highlight', value: 'highlight' },
        ],
        annotations: [],
      },
    },
  ],
})
