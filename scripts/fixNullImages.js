/**
 * Script to find and fix documents with null image values
 * Run with: node scripts/fixNullImages.js
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2025-11-12',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/**
 * Recursively find and remove null image values from an object
 */
function removeNullImages(obj, path = '') {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item, index) => removeNullImages(item, `${path}[${index}]`));
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // If it's an image field with null value, skip it (don't include in cleaned object)
    if (key === 'backgroundImage' && value === null) {
      console.log(`⚠️  Found null backgroundImage at ${currentPath} - will be removed`);
      continue; // Skip this field
    }
    
    // If it's an image object with null asset, skip it
    if (key === 'image' && value === null) {
      console.log(`⚠️  Found null image at ${currentPath} - will be removed`);
      continue; // Skip this field
    }
    
    // Recursively clean nested objects
    if (value && typeof value === 'object') {
      cleaned[key] = removeNullImages(value, currentPath);
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

async function fixNullImages() {
  try {
    console.log('🔍 Searching for documents with null image values...\n');

    // Find all pages
    const pages = await client.fetch(`
      *[_type == "page"] {
        _id,
        _rev,
        title,
        slug,
        sections
      }
    `);

    console.log(`Found ${pages.length} page(s) to check\n`);

    let fixedCount = 0;

    for (const page of pages) {
      const originalSections = JSON.stringify(page.sections);
      const cleanedSections = removeNullImages(page.sections);
      const cleanedSectionsStr = JSON.stringify(cleanedSections);

      // Only update if something changed
      if (originalSections !== cleanedSectionsStr) {
        console.log(`📝 Fixing page: ${page.title || page.slug?.current || page._id}`);
        
        await client
          .patch(page._id)
          .set({ sections: cleanedSections })
          .commit();

        fixedCount++;
        console.log(`✅ Fixed page: ${page.title || page.slug?.current || page._id}\n`);
      }
    }

    if (fixedCount === 0) {
      console.log('✅ No documents with null image values found. All good!');
    } else {
      console.log(`\n✅ Fixed ${fixedCount} document(s)`);
    }
  } catch (error) {
    console.error('❌ Error fixing null images:', error.message);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
    process.exit(1);
  }
}

// Run the script
fixNullImages();



