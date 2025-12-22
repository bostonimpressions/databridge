import { defineType, defineField } from 'sanity';
import { toPlainText } from '@portabletext/react';

export default defineType({
  name: 'sectionHeroMain',
  title: 'Hero (main)',
  type: 'object',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineField({
          name: 'heroSlide',
          title: 'Hero Slide',
          type: 'object',
          fields: [
            // HEADING
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'blockContentMinimal',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'subheading',
              title: 'Subheading',
              type: 'blockContentMinimal',
            }),

            defineField({
              name: 'lead',
              title: 'Lead',
              type: 'blockContentMinimal',
            }),

            // BODY
            defineField({
              name: 'body',
              title: 'Body',
              type: 'blockContentMinimal',
            }),

            // BUTTONS
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
                    defineField({ name: 'title', title: 'Title', type: 'string' }),
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
                    defineField({
                      name: 'internal',
                      title: 'Internal link?',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: { title: 'title', url: 'url' },
                    prepare({ title, url }) {
                      return {
                        title: title || 'Untitled Button',
                        subtitle: url,
                      };
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.max(2),
            }),

            // THEME
            defineField({
              name: 'theme',
              title: 'Theme',
              type: 'string',
              options: {
                list: ['default', 'service'],
                layout: 'radio',
              },
              initialValue: 'default',
            }),

            // BACKGROUND TYPE SWITCH
            defineField({
              name: 'backgroundType',
              title: 'Background Type',
              type: 'string',
              options: {
                list: ['image', 'video'],
                layout: 'radio',
              },
              initialValue: 'image',
            }),

            // IMAGE BACKGROUND
            defineField({
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.backgroundType !== 'image',
            }),

            // VIDEO BACKGROUND
            defineField({
              name: 'backgroundVideo',
              title: 'Background Video',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              hidden: ({ parent }) => parent?.backgroundType !== 'video',
            }),

            defineField({
              name: 'autoHeight',
              title: 'Auto Height',
              type: 'boolean',
              description: 'If true, the Hero section will use height:auto instead of min-height.',
            })

          ],

          // ✅ EDITOR PREVIEW FIX (No more "Untitled Slide")
          preview: {
            select: {
              label: 'label',
              heading: 'heading',
              theme: 'theme',
              bgType: 'backgroundType',
            },
            prepare({ heading, theme }) {
              const title = (heading && toPlainText(heading)) || 'Untitled Slide';

              return {
                title,
                subtitle: `${theme || 'default'} slide`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(5),
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Hero (main)',
        subtitle: 'Hero slideshow',
      };
    },
  },
});
