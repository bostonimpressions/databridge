// ./sanity/schemaTypes/blogPage.ts
import { defineType, defineField } from 'sanity';

export const blogPage = defineType({
  name: 'blogPage', // <- must be exactly "blogPage"
  title: 'Blog page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    // ...
  ],
});
