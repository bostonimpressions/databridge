import { PortableTextBlock } from '@portabletext/react'

// Define the minimal interface for the text-containing children (spans).
// This ensures type safety without needing to rely on hard-to-find external imports.
interface TextSpan {
  text: string;
}

export function toPlainText(blocks: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return ''
  }

  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      
      // Assert the children to the locally defined minimal type
      const children = block.children as TextSpan[]

      return children
        .map((span) => span.text)
        .join('')
    })
    .join('\n\n') 
}