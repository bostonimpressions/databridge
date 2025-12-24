// schemaTypes/sectionMain.ts
import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionMain',
  title: 'Section Main',
  type: 'object',
  fields: [
    // THEME
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Midnight', value: 'midnight' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      description: 'Controls styling for entire section including text, backgrounds, images, lists, and tables',
    }),

    // ROWS
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Row',
          fields: [
            // LABEL
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional eyebrow label (appears above the grid)',
            }),

            // HEADING
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'blockContentMinimal',
            }),

            // SUBHEADING
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'blockContentMinimal',
            }),

            // BODY
            defineField({
              name: 'body',
              title: 'Body',
              type: 'blockContent',
            }),

            // LINK
            defineField({
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Link Text', type: 'string' }),
                defineField({ name: 'url', title: 'URL', type: 'url' }),
              ],
              description: 'Optional link at the bottom of the text content',
            }),

            // LAYOUT
            defineField({
              name: 'layout',
              title: 'Layout Options',
              type: 'object',
              fields: [
                // COLUMNS
                defineField({
                  name: 'columns',
                  title: 'Column Layout',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Full Width (1/1)', value: '1/1' },
                      { title: 'Equal Split (1/2 - 1/2)', value: '1/2-1/2' },
                      { title: 'Wide Right (2/3 - 1/3)', value: '2/3-1/3' },
                      { title: 'Wide Left (1/3 - 2/3)', value: '1/3-2/3' },
                    ],
                    layout: 'dropdown',
                  },
                  initialValue: '1/1',
                }),

                // TEXT COLUMN POSITION
                defineField({
                  name: 'textColumn',
                  title: 'Text Column Position',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Left', value: 'left' },
                      { title: 'Right', value: 'right' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'left',
                  description: 'Which column should text content appear in? (Content blocks appear in the opposite column)',
                  hidden: ({ parent }) => parent?.columns === '1/1',
                }),
              ],
            }),

            // CONTENT BLOCKS
            defineField({
              name: 'contentBlocks',
              title: 'Content Blocks',
              type: 'array',
              description: 'Add images, lists, tables, or CTAs (appears opposite the text column)',
              of: [
                // IMAGE BLOCK
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                }),

                // LIST BLOCK (reference to separate schema)
                { type: 'listBlock' },

                // TABLE BLOCK (reference to separate schema)
                { type: 'tableBlock' },

                // CTA BLOCK
                defineField({
                  name: 'ctaBlock',
                  title: 'CTA Block',
                  type: 'object',
                  fields: [
                    defineField({ name: 'title', title: 'Button Text', type: 'string' }),
                    defineField({ name: 'url', title: 'URL', type: 'url' }),
                    defineField({
                      name: 'style',
                      title: 'Button Style',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Primary', value: 'primary' },
                          { title: 'Secondary', value: 'secondary' },
                          { title: 'Outline', value: 'outline' },
                        ],
                      },
                      initialValue: 'primary',
                    }),
                  ],
                  preview: {
                    select: { title: 'title', url: 'url' },
                    prepare({ title, url }) {
                      return {
                        title: title || 'CTA Button',
                        subtitle: url,
                      };
                    },
                  },
                }),
              ],
            }),
          ],

          // ROW PREVIEW
          preview: {
            select: {
              label: 'label',
              heading: 'heading',
              columns: 'layout.columns',
              textColumn: 'layout.textColumn',
            },
            prepare({ label, heading, columns, textColumn }) {
              const title = label || (heading && toPlainText(heading)) || 'Untitled Row';
              const layout = columns === '1/1' ? 'Full Width' : `${columns} • Text ${textColumn || 'left'}`;
              return {
                title,
                subtitle: layout,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(10),
    }),
  ],

  preview: {
    select: {
      theme: 'theme',
      rows: 'rows',
      firstRowHeading: 'rows.0.heading',
    },
    prepare({ theme, rows, firstRowHeading }) {
      const title = (firstRowHeading && toPlainText(firstRowHeading)) || 'Section Main';
      return {
        title,
        subtitle: `${rows?.length || 0} row(s) • ${theme || 'light'} theme`,
      };
    },
  },
});