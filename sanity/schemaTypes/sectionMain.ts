// schemaTypes/section.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'sectionMain',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Row',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              description: 'Optional label for the row (can be stacked or positioned)',
            }),
            defineField({
              name: 'heading',
              type: 'blockContentMinimal', // string reference, not imported object
              title: 'Heading',
            }),
            defineField({
              name: 'subheading',
              type: 'blockContentMinimal',
              title: 'Subheading',
            }),
            defineField({
              name: 'body',
              type: 'blockContent',
              title: 'Body',
            }),
            defineField({
              name: 'link',
              type: 'object',
              title: 'Row Link',
              fields: [
                defineField({ name: 'text', type: 'string', title: 'Link Text' }),
                defineField({ name: 'url', type: 'url', title: 'URL' }),
              ],
              description: 'Optional link at the bottom of the row',
            }),
            defineField({
              name: 'layout',
              type: 'object',
              title: 'Layout Options',
              fields: [
                defineField({
                  name: 'columns',
                  type: 'string',
                  title: 'Columns',
                  options: {
                    list: [
                      { title: 'Full Width', value: '1/1' },
                      { title: '1/2 - 1/2', value: '1/2-1/2' },
                      { title: '2/3 - 1/3', value: '2/3-1/3' },
                      { title: '1/3 - 2/3', value: '1/3-2/3' },
                    ],
                  },
                }),
                defineField({
                  name: 'textColumn',
                  type: 'string',
                  title: 'Text Column Position',
                  options: {
                    list: [
                      { title: 'Left', value: 'left' },
                      { title: 'Right', value: 'right' },
                      { title: 'Top', value: 'top' },
                      { title: 'Bottom', value: 'bottom' },
                    ],
                  },
                }),
                defineField({
                  name: 'labelPosition',
                  type: 'string',
                  title: 'Label Position',
                  options: {
                    list: [
                      { title: 'Stacked', value: 'stacked' },
                      { title: 'Left Column', value: 'leftCol' },
                    ],
                  },
                }),
              ],
            }),
            defineField({
              name: 'contentBlocks',
              type: 'array',
              title: 'Content Blocks',
              of: [
                { type: 'image', name: 'imageBlock', title: 'Image Block' },
                { type: 'listBlock' }, // string reference to globally registered block
                { type: 'tableBlock' },
              ],
              description: 'Flexible content blocks that can appear in any column or full-width',
            }),
          ],
          preview: {
            select: {
              heading: 'heading',
              label: 'label',
            },
            prepare(selection: { heading?: { children: { text: string }[] }[]; label?: string }) {
              const { heading, label } = selection;
              const firstHeadingText = heading?.[0]?.children?.[0]?.text || label || 'Row';
              return {
                title: firstHeadingText,
                subtitle: 'Section row',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { firstRowHeading: 'rows.0.heading' },
    prepare(selection: { firstRowHeading?: { children: { text: string }[] }[] }) {
      const { firstRowHeading } = selection;
      const headingText = firstRowHeading?.[0]?.children?.[0]?.text || 'Section';
      return {
        title: headingText,
      };
    },
  },
});
