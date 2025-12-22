// scripts/importPage.js
import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

// ------------------------
// Sanity client
// ------------------------
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// ------------------------
// Helper: Get next orderRank
// ------------------------
async function getLastOrderRank(pageType) {
  const query = `*[_type == $pageType] | order(orderRank desc)[0].orderRank`;
  const lastRank = await client.fetch(query, { pageType });

  if (!lastRank) {
    // First document, return initial rank
    return '0|hzzzzz:';
  }

  // Generate next rank after the last one
  const lastChar = lastRank.split('|')[1] || 'hzzzzz:';
  const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
  return `0|${nextChar}`;
}

// ------------------------
// Helper: upload or reference image
// ------------------------
async function handleImage(imagePath) {
  if (!imagePath) return null;

  // If it's already a Sanity image reference
  if (imagePath.startsWith('image-') && imagePath.includes('-')) {
    return {
      _type: 'image',
      asset: {
        _ref: imagePath,
        _type: 'reference',
      },
    };
  }

  // Handle paths starting with /images/
  let fullPath = imagePath;
  if (imagePath.startsWith('/images/') || imagePath.startsWith('/')) {
    fullPath = path.join(process.cwd(), 'public', imagePath);
  } else {
    fullPath = path.join(process.cwd(), imagePath);
  }

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageAsset = await client.assets.upload('image', fs.createReadStream(fullPath));
    console.log(`✅ Uploaded image: ${path.basename(fullPath)}`);
    return {
      _type: 'image',
      asset: {
        _ref: imageAsset._id,
        _type: 'reference',
      },
    };
  } catch (error) {
    console.error(`❌ Failed to upload image: ${fullPath}`, error.message);
    return null;
  }
}

// ------------------------
// Convert Markdown string to Sanity Portable Text blocks
// Supports paragraphs, bold text, and bullet lists
// ------------------------
function convertMarkdownToBlocks(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split('\n');
  const blocks = [];
  let currentList = [];

  function flushList() {
    currentList.forEach((item) => blocks.push(item));
    currentList = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Bullet list item
    if (/^[-*]\s+/.test(trimmed)) {
      const content = trimmed.replace(/^[-*]\s+/, '');
      currentList.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text: content,
            marks: [],
          },
        ],
        markDefs: [],
      });
      return;
    }

    // Empty line ends a list
    if (trimmed === '') {
      flushList();
      return;
    }

    // Normal paragraph
    flushList();
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: generateKey(),
          text: trimmed,
          marks: [],
        },
      ],
      markDefs: [],
    });
  });

  flushList();
  return blocks;
}

// ------------------------
// Generate short unique keys (matching Sanity's format)
// ------------------------
function generateKey() {
  return Math.random().toString(36).substring(2, 14);
}

// ------------------------
// Import page
// ------------------------
async function importPage(mdFilePath) {
  if (!fs.existsSync(mdFilePath)) {
    console.error('❌ Markdown file not found:', mdFilePath);
    process.exit(1);
  }

  console.log(`📄 Reading file: ${mdFilePath}`);
  const content = fs.readFileSync(mdFilePath, 'utf8');
  const { data } = matter(content);

  // Validate required fields
  if (!data.title) {
    console.error('❌ Missing required field: title');
    process.exit(1);
  }

  if (!data.slug) {
    console.error('❌ Missing required field: slug');
    process.exit(1);
  }

  const pageType = data.pageType || 'page';
  console.log(`📝 Page type: ${pageType}`);

  // -------------------------------------------
  // Find existing page by slug + type
  // -------------------------------------------
  const existing = await client.fetch(
    `*[_type == $type && slug.current == $slug][0]{ _id, orderRank }`,
    {
      type: pageType,
      slug: data.slug,
    }
  );

  // Preserve orderRank if page exists
  const orderRank = existing?.orderRank || (await getLastOrderRank(pageType));

  console.log(existing ? `♻️  Overwriting existing page: ${existing._id}` : `🆕 Creating new page`);
  console.log(`📊 Setting orderRank: ${orderRank}`);

  if (!data.sections) {
    data.sections = [];
  }

  console.log(`🔄 Processing ${data.sections.length} sections...`);

  // Process sections
  for (let i = 0; i < data.sections.length; i++) {
    const section = data.sections[i];
    console.log(`  Section ${i + 1}: ${section.type || 'unknown'}`);

    section._type = section.type;
    section._key = generateKey();
    delete section.type; // Remove the 'type' field

    // Convert text fields to blocks
    ['heading', 'subheading', 'lead', 'body', 'reference'].forEach((key) => {
      if (section[key] && typeof section[key] === 'string') {
        section[key] = convertMarkdownToBlocks(section[key]);
      }
    });

    // Handle images
    if (section.image) {
      section.image = await handleImage(section.image);
    }

    if (section.backgroundImage) {
      section.backgroundImage = await handleImage(section.backgroundImage);
    }

    // -------------------------------------------
    // SECTION: sectionDetails
    // -------------------------------------------
    if (section._type === 'sectionDetails') {
      //
      // Convert top-level text fields
      //
      ['heading', 'subheading', 'body'].forEach((key) => {
        if (section[key] && typeof section[key] === 'string') {
          section[key] = convertMarkdownToBlocks(section[key]);
        }
      });

      // -------------------------------------------
      // STEPS (array of objects)
      // -------------------------------------------
      if (Array.isArray(section.steps)) {
        section.steps = section.steps.map((step) => {
          step._key = generateKey();

          ['heading', 'subheading', 'body'].forEach((key) => {
            if (step[key] && typeof step[key] === 'string') {
              step[key] = convertMarkdownToBlocks(step[key]);
            }
          });

          return step;
        });
      }

      // -------------------------------------------
      // SECONDARY CONTENT (single object)
      // -------------------------------------------
      if (section.secondary) {
        section.secondary._key = generateKey();

        ['heading', 'subheading', 'body'].forEach((key) => {
          if (section.secondary[key] && typeof section.secondary[key] === 'string') {
            section.secondary[key] = convertMarkdownToBlocks(section.secondary[key]);
          }
        });
      }

      // -------------------------------------------
      // STATS (array of statRow)
      // -------------------------------------------
      if (Array.isArray(section.stats)) {
        section.stats = section.stats.map((statRow) => {
          statRow._key = generateKey();

          // Convert statRow heading
          if (statRow.heading && typeof statRow.heading === 'string') {
            statRow.heading = convertMarkdownToBlocks(statRow.heading);
          }

          // -------------------------------------------
          // statRow.list (array of statItem)
          // -------------------------------------------
          if (Array.isArray(statRow.list)) {
            statRow.list = statRow.list.map((item) => {
              item._key = generateKey();

              // Convert block fields
              ['heading', 'subheading', 'body'].forEach((key) => {
                if (item[key] && typeof item[key] === 'string') {
                  item[key] = convertMarkdownToBlocks(item[key]);
                }
              });

              // label = string (do not convert)
              return item;
            });
          }

          return statRow;
        });
      }
    }

    // -------------------------------------------
    // SECTION: sectionSnapshots
    // -------------------------------------------
    if (section._type === 'sectionSnapshots') {
      // Convert section heading
      if (section.heading && typeof section.heading === 'string') {
        section.heading = convertMarkdownToBlocks(section.heading);
      }

      // Panels
      if (Array.isArray(section.panels)) {
        section.panels = section.panels.map((panel) => {
          panel._key = generateKey();

          ['heading', 'subheading', 'body', 'challenge', 'solution', 'impact'].forEach((key) => {
            if (panel[key] && typeof panel[key] === 'string') {
              panel[key] = convertMarkdownToBlocks(panel[key]);
            }
          });

          return panel;
        });
      }
    }

    // Handle CTAs (no _type field needed based on your JSON)
    if (section.cta) {
      ['heading', 'body'].forEach((key) => {
        if (section.cta[key] && typeof section.cta[key] === 'string') {
          section.cta[key] = convertMarkdownToBlocks(section.cta[key]);
        }
      });
    }

    // Handle lists (array of list objects)
    if (section.lists && Array.isArray(section.lists)) {
      for (const list of section.lists) {
        list._key = generateKey();

        // Convert list heading if it exists
        if (list.heading && typeof list.heading === 'string') {
          list.heading = convertMarkdownToBlocks(list.heading);
        }

        // Process list items
        if (list.items && Array.isArray(list.items)) {
          for (const item of list.items) {
            item._key = generateKey();
            item._type = 'item';

            ['heading', 'subheading', 'body'].forEach((key) => {
              if (item[key] && typeof item[key] === 'string') {
                item[key] = convertMarkdownToBlocks(item[key]);
              }
            });

            if (item.icon) {
              item.icon = await handleImage(item.icon);
            }
          }
        }
      }
    }
  }

  const safeId = existing?._id || `${data.slug}-import`;

  const doc = {
    _id: safeId,
    _type: pageType,
    title: data.title,
    slug: {
      _type: 'slug',
      current: data.slug,
    },
    orderRank, // ✅ Add orderRank here
    sections: data.sections,
  };

  // Add optional fields if they exist
  if (data.metaTitle) doc.metaTitle = data.metaTitle;
  if (data.metaDescription) doc.metaDescription = data.metaDescription;

  console.log(`\n📤 Creating/replacing document in Sanity...`);

  await client.createOrReplace(doc);

  console.log(`\n✅ Successfully imported: ${data.title}`);
  console.log(`   Type: ${pageType}`);
  console.log(`   ID: ${safeId}`);
  console.log(`   Slug: ${data.slug}`);
  console.log(`   Order Rank: ${orderRank}`);
}

// ------------------------
// CLI
// ------------------------
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/importPage.js <markdown-file>');
  console.error('Example: node scripts/importPage.js ./content/cybersecurity.md');
  process.exit(1);
}

importPage(filePath)
  .then(() => console.log('\n🎉 Import complete!'))
  .catch((err) => {
    console.error('\n❌ Import failed:', err.message);
    console.error(err);
    process.exit(1);
  });
