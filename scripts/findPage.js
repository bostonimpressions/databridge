import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function findPage() {
  console.log('🔍 Searching for pages with slug "home"...\n');

  // Search by slug
  const bySlug = await client.fetch(
    `*[_type == "page" && slug.current == "home"]{ _id, title, slug, _createdAt, _updatedAt }`
  );

  console.log(`Found ${bySlug.length} page(s) with slug "home":`);
  bySlug.forEach((page) => {
    console.log(`  - ID: ${page._id}`);
    console.log(`    Title: ${page.title}`);
    console.log(`    Slug: ${page.slug?.current}`);
    console.log(`    Created: ${page._createdAt}`);
    console.log(`    Updated: ${page._updatedAt}`);
    console.log('');
  });

  // Search by title
  const byTitle = await client.fetch(
    `*[_type == "page" && title == "Home"]{ _id, title, slug, _createdAt, _updatedAt }`
  );

  if (byTitle.length > 0) {
    console.log(`\nFound ${byTitle.length} page(s) with title "Home":`);
    byTitle.forEach((page) => {
      console.log(`  - ID: ${page._id}`);
      console.log(`    Title: ${page.title}`);
      console.log(`    Slug: ${page.slug?.current}`);
      console.log(`    Created: ${page._createdAt}`);
      console.log(`    Updated: ${page._updatedAt}`);
      console.log('');
    });
  }

  // Search for pages with "home" in ID
  const byId = await client.fetch(
    `*[_type == "page" && _id match "*home*"]{ _id, title, slug, _createdAt, _updatedAt }`
  );

  if (byId.length > 0) {
    console.log(`\nFound ${byId.length} page(s) with "home" in ID:`);
    byId.forEach((page) => {
      console.log(`  - ID: ${page._id}`);
      console.log(`    Title: ${page.title}`);
      console.log(`    Slug: ${page.slug?.current}`);
      console.log(`    Created: ${page._createdAt}`);
      console.log(`    Updated: ${page._updatedAt}`);
      console.log('');
    });
  }

  // List all pages
  const allPages = await client.fetch(
    `*[_type == "page"]{ _id, title, slug, _createdAt, _updatedAt } | order(_updatedAt desc)`
  );

  console.log(`\n📋 All pages (${allPages.length} total):`);
  allPages.forEach((page) => {
    console.log(`  - ${page.title} (${page.slug?.current || 'no slug'}) - ID: ${page._id}`);
  });
}

findPage().catch(console.error);

