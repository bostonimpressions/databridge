// schemaTypes/sectionMain.ts
import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionMain',
  title: 'Section Main',
  type: 'object',
  fields: [
    // SECTION ID (for anchor links - stable, won't change with content)
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description:
        'Optional unique ID for this section (used for anchor links). If not set, will use section-main-{index}. Once set, keep it stable to avoid breaking links.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true; // Optional
          // Must be URL-safe
          const urlSafe = /^[a-z0-9-]+$/.test(value);
          if (!urlSafe) {
            return 'Section ID must be lowercase letters, numbers, and hyphens only';
          }
          return true;
        }),
    }),

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
          { title: 'Sky', value: 'sky' },
          { title: 'Orange', value: 'orange' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      description:
        'Controls styling for entire section including text, backgrounds, images, lists, and tables',
    }),

    // BACKGROUND IMAGE
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional background image for the section (positioned at bottom with color-burn blend mode for orange theme)',
      validation: (Rule) =>
        Rule.custom((value) => {
          // Allow null, undefined, or valid image objects
          if (value === null || value === undefined || (value && value._type === 'image')) {
            return true;
          }
          return 'Must be a valid image or empty';
        }),
    }),

    // TOP BORDER
    defineField({
      name: 'topBorder',
      title: 'Top Border',
      type: 'boolean',
      description: 'Add a 2px top border in color #DEE2FF',
      initialValue: false,
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
            // DIVIDER
            defineField({
              name: 'divider',
              title: 'Divider Row',
              type: 'boolean',
              description: 'If enabled, this row will render as a simple horizontal divider line',
              initialValue: false,
            }),

            // LABEL
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional eyebrow label (appears above the grid)',
              hidden: ({ parent }) => parent?.divider === true,
            }),

            // HEADING
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'blockContentMinimal',
              hidden: ({ parent }) => parent?.divider === true,
            }),

            // SUBHEADING
            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'blockContentMinimal',
              hidden: ({ parent }) => parent?.divider === true,
            }),

            // BODY
            defineField({
              name: 'body',
              title: 'Body',
              type: 'blockContent',
              hidden: ({ parent }) => parent?.divider === true,
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
                      { title: 'Narrow Left (1/4 - 3/4)', value: '1/4-3/4' },
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
                  description:
                    'Which column should text content appear in? (Content blocks appear in the opposite column)',
                  hidden: ({ parent }) => parent?.columns === '1/1',
                }),

                // CONTENT COLUMN ALIGNMENT
                defineField({
                  name: 'contentAlign',
                  title: 'Content Column Alignment',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Left', value: 'left' },
                      { title: 'Right', value: 'right' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'left',
                  description:
                    'Align content blocks to the left or right within the content column',
                  hidden: ({ parent }) => parent?.columns === '1/1',
                }),
              ],
              hidden: ({ parent }) => parent?.divider === true,
            }),

            // SPACING
            defineField({
              name: 'spacing',
              title: 'Spacing',
              type: 'string',
              options: {
                list: [
                  { title: 'Default', value: 'default' },
                  { title: 'Compact', value: 'compact' },
                ],
                layout: 'radio',
              },
              initialValue: 'default',
              description:
                'Controls the bottom margin spacing after this row. Compact reduces spacing for rows that should be closer together.',
              hidden: ({ parent }) => parent?.divider === true,
            }),

            // CONTENT BLOCKS
            defineField({
              name: 'contentBlocks',
              title: 'Content Blocks',
              type: 'array',
              description:
                'Add content rows with text and/or blocks (images, lists, tables, CTAs). Appears opposite the text column.',
              of: [
                // CONTENT ROW (can have text + blocks)
                defineField({
                  name: 'contentRow',
                  title: 'Content Row',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      description: 'Optional eyebrow label (appears above the heading)',
                    }),
                    defineField({
                      name: 'heading',
                      title: 'Heading',
                      type: 'blockContentMinimal',
                      description: 'Optional heading for this content row',
                    }),
                    defineField({
                      name: 'subheading',
                      title: 'Subheading',
                      type: 'blockContentMinimal',
                      description:
                        'Optional subheading for this content row (smaller than heading)',
                    }),
                    defineField({
                      name: 'body',
                      title: 'Body',
                      type: 'blockContent',
                      description: 'Optional body text for this content row',
                    }),
                    defineField({
                      name: 'blocks',
                      title: 'Blocks',
                      type: 'array',
                      description: 'Add images, lists, tables, or CTAs to this row',
                      of: [
                        // IMAGE BLOCK (single image or multiple images for slideshow)
                        defineField({
                          name: 'imageBlock',
                          title: 'Image',
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'images',
                              title: 'Images',
                              type: 'array',
                              description:
                                'Add one or more images. Multiple images will create an automatic slideshow.',
                              of: [
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
                              ],
                              validation: (Rule) => Rule.min(1).max(10),
                            }),
                            defineField({
                              name: 'display',
                              title: 'Image Display',
                              type: 'string',
                              options: {
                                list: [
                                  { title: 'Cover (default)', value: 'cover' },
                                  { title: 'Square (350px max)', value: 'square' },
                                ],
                                layout: 'radio',
                              },
                              initialValue: 'cover',
                              description:
                                'Cover fills container, Square is 350px max with square aspect ratio',
                            }),
                          ],
                          preview: {
                            select: {
                              images: 'images',
                            },
                            prepare({ images }) {
                              const count = images?.length || 0;
                              return {
                                title: count === 1 ? 'Image' : `Image Slideshow (${count} images)`,
                                subtitle: count > 1 ? 'Auto-fade slideshow' : 'Single image',
                              };
                            },
                          },
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
                            defineField({ name: 'url', title: 'URL', type: 'string' }),
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

                        // BUTTON BLOCK (multiple buttons)
                        defineField({
                          name: 'buttonBlock',
                          title: 'Button Block',
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'buttons',
                              title: 'Buttons',
                              type: 'array',
                              of: [
                                defineField({
                                  name: 'button',
                                  title: 'Button',
                                  type: 'object',
                                  fields: [
                                    defineField({
                                      name: 'title',
                                      title: 'Button Text',
                                      type: 'string',
                                    }),
                                    defineField({ name: 'url', title: 'URL', type: 'string' }),
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
                                        title: title || 'Button',
                                        subtitle: url,
                                      };
                                    },
                                  },
                                }),
                              ],
                              validation: (Rule) => Rule.max(3),
                            }),
                          ],
                          preview: {
                            select: { buttons: 'buttons' },
                            prepare({ buttons }) {
                              const count = buttons?.length || 0;
                              return {
                                title: `Button Block (${count} button${count !== 1 ? 's' : ''})`,
                              };
                            },
                          },
                        }),

                        // LINK BLOCK (single link with arrow)
                        defineField({
                          name: 'linkBlock',
                          title: 'Link Block',
                          type: 'object',
                          fields: [
                            defineField({ name: 'text', title: 'Link Text', type: 'string' }),
                            defineField({ name: 'url', title: 'URL', type: 'string' }),
                          ],
                          preview: {
                            select: { text: 'text', url: 'url' },
                            prepare({ text, url }) {
                              return {
                                title: text || 'Link',
                                subtitle: url,
                              };
                            },
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      heading: 'heading',
                      blockCount: 'blocks',
                    },
                    prepare({ heading, blockCount }) {
                      const title = (heading && toPlainText(heading)) || 'Content Row';
                      const blockText = blockCount?.length
                        ? `${blockCount.length} block(s)`
                        : 'No blocks';
                      return {
                        title,
                        subtitle: blockText,
                      };
                    },
                  },
                }),

                // LEGACY: Direct blocks (for backwards compatibility)
                // IMAGE BLOCK (single image or multiple images for slideshow)
                defineField({
                  name: 'imageBlock',
                  title: 'Image',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'images',
                      title: 'Images',
                      type: 'array',
                      description:
                        'Add one or more images. Multiple images will create an automatic slideshow.',
                      of: [
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
                      ],
                      validation: (Rule) => Rule.min(1).max(10),
                    }),
                    defineField({
                      name: 'display',
                      title: 'Image Display',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Cover (default)', value: 'cover' },
                          { title: 'Square (350px max)', value: 'square' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'cover',
                      description:
                        'Cover fills container, Square is 350px max with square aspect ratio',
                    }),
                  ],
                  preview: {
                    select: {
                      images: 'images',
                    },
                    prepare({ images }) {
                      const count = images?.length || 0;
                      return {
                        title: count === 1 ? 'Image' : `Image Slideshow (${count} images)`,
                        subtitle: count > 1 ? 'Auto-fade slideshow' : 'Single image',
                      };
                    },
                  },
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
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
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

                // BUTTON BLOCK (multiple buttons)
                defineField({
                  name: 'buttonBlock',
                  title: 'Button Block',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'buttons',
                      title: 'Buttons',
                      type: 'array',
                      of: [
                        defineField({
                          name: 'button',
                          title: 'Button',
                          type: 'object',
                          fields: [
                            defineField({ name: 'title', title: 'Button Text', type: 'string' }),
                            defineField({ name: 'url', title: 'URL', type: 'string' }),
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
                                title: title || 'Button',
                                subtitle: url,
                              };
                            },
                          },
                        }),
                      ],
                      validation: (Rule) => Rule.max(3),
                    }),
                  ],
                  preview: {
                    select: { buttons: 'buttons' },
                    prepare({ buttons }) {
                      const count = buttons?.length || 0;
                      return {
                        title: `Button Block (${count} button${count !== 1 ? 's' : ''})`,
                      };
                    },
                  },
                }),

                // LINK BLOCK (single link with arrow)
                defineField({
                  name: 'linkBlock',
                  title: 'Link Block',
                  type: 'object',
                  fields: [
                    defineField({ name: 'text', title: 'Link Text', type: 'string' }),
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
                  ],
                  preview: {
                    select: { text: 'text', url: 'url' },
                    prepare({ text, url }) {
                      return {
                        title: text || 'Link',
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
              divider: 'divider',
              label: 'label',
              heading: 'heading',
              columns: 'layout.columns',
              textColumn: 'layout.textColumn',
            },
            prepare({ divider, label, heading, columns, textColumn }) {
              if (divider) {
                return {
                  title: 'Divider',
                  subtitle: 'Horizontal divider line',
                };
              }
              const title = label || (heading && toPlainText(heading)) || 'Untitled Row';
              const layout =
                columns === '1/1' ? 'Full Width' : `${columns} • Text ${textColumn || 'left'}`;
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
