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

  // If it's already a Sanity image object (already processed)
  if (typeof imagePath === 'object' && imagePath._type === 'image' && imagePath.asset) {
    // Already processed, return as-is
    return imagePath;
  }

  // If it's already a Sanity image reference string
  if (typeof imagePath === 'string' && imagePath.startsWith('image-') && imagePath.includes('-')) {
    return {
      _type: 'image',
      asset: {
        _ref: imagePath,
        _type: 'reference',
      },
    };
  }

  // Ensure imagePath is a string for file path processing
  if (typeof imagePath !== 'string') {
    // Try to extract path from object
    const extractedPath = imagePath?.url || imagePath?.image || imagePath?.path;
    if (extractedPath && typeof extractedPath === 'string') {
      imagePath = extractedPath;
    } else {
      console.warn(`⚠️  Image path is not a string and could not extract path: ${typeof imagePath}`, imagePath);
      return null;
    }
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
// Helper: upload or reference video file
// ------------------------
async function handleVideo(videoPath) {
  if (!videoPath) return null;

  // If it's already a Sanity file reference
  if (videoPath.startsWith('file-') && videoPath.includes('-')) {
    return {
      _type: 'file',
      asset: {
        _ref: videoPath,
        _type: 'reference',
      },
    };
  }

  // Handle paths starting with /videos/ or /
  let fullPath = videoPath;
  if (videoPath.startsWith('/videos/') || videoPath.startsWith('/')) {
    fullPath = path.join(process.cwd(), 'public', videoPath);
  } else {
    fullPath = path.join(process.cwd(), videoPath);
  }

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Video not found: ${fullPath}`);
    return null;
  }

  try {
    const videoAsset = await client.assets.upload('file', fs.createReadStream(fullPath), {
      filename: path.basename(fullPath),
    });
    console.log(`✅ Uploaded video: ${path.basename(fullPath)}`);
    return {
      _type: 'file',
      asset: {
        _ref: videoAsset._id,
        _type: 'reference',
      },
    };
  } catch (error) {
    console.error(`❌ Failed to upload video: ${fullPath}`, error.message);
    return null;
  }
}

// ------------------------
// Convert Markdown string to Sanity Portable Text blocks
// Supports paragraphs, bold text, highlights (==text==), and bullet lists
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

  // Parse a line for highlights (==text==), bold (**text**), and convert to spans
  // Handles nested marks (e.g., bold containing highlight)
  function parseLineForHighlights(line) {
    const children = [];
    let processedLine = line;
    let lastIndex = 0;

    // Process in layers: first highlights, then bold
    // This allows bold to wrap highlighted text
    
    // Step 1: Find and mark all highlights first (they can be nested inside bold)
    const highlightMatches = [];
    const highlightRegex = /==([^=]+)==/g;
    let match;
    while ((match = highlightRegex.exec(line)) !== null) {
      highlightMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        type: 'highlight',
      });
    }

    // Step 2: Find bold patterns, but be smart about nested highlights
    // Bold can be **text** or __text__, and can contain highlights
    // Use a more flexible approach: match **...** allowing == inside
    const boldMatches = [];
    // Match ** followed by content (allowing ==) until closing **
    // We'll use a simpler approach: find **, then find the matching closing **
    let pos = 0;
    while (pos < line.length) {
      const asteriskStart = line.indexOf('**', pos);
      if (asteriskStart === -1) break;
      
      // Find the matching closing **
      let asteriskEnd = line.indexOf('**', asteriskStart + 2);
      if (asteriskEnd === -1) break;
      
      const boldText = line.substring(asteriskStart + 2, asteriskEnd);
      const hasHighlight = /==[^=]+==/.test(boldText);
      
      boldMatches.push({
        start: asteriskStart,
        end: asteriskEnd + 2,
        text: boldText,
        type: 'strong',
        hasHighlight,
      });
      
      pos = asteriskEnd + 2;
    }
    
    // Also handle __text__ format
    pos = 0;
    while (pos < line.length) {
      const underscoreStart = line.indexOf('__', pos);
      if (underscoreStart === -1) break;
      
      // Find the matching closing __
      let underscoreEnd = line.indexOf('__', underscoreStart + 2);
      if (underscoreEnd === -1) break;
      
      const boldText = line.substring(underscoreStart + 2, underscoreEnd);
      const hasHighlight = /==[^=]+==/.test(boldText);
      
      boldMatches.push({
        start: underscoreStart,
        end: underscoreEnd + 2,
        text: boldText,
        type: 'strong',
        hasHighlight,
      });
      
      pos = underscoreEnd + 2;
    }

    // Step 3: Merge and sort all matches, handling overlaps
    const allMatches = [];
    
    // Add bold matches first (they're outer)
    for (const boldMatch of boldMatches) {
      allMatches.push(boldMatch);
    }
    
    // Add highlight matches that aren't inside bold
    for (const highlightMatch of highlightMatches) {
      const isInsideBold = boldMatches.some(
        (b) => highlightMatch.start >= b.start && highlightMatch.end <= b.end
      );
      if (!isInsideBold) {
        allMatches.push(highlightMatch);
      }
    }
    
    // Sort by start position
    allMatches.sort((a, b) => a.start - b.start);

    // Step 4: Process matches, handling nested cases
    for (let i = 0; i < allMatches.length; i++) {
      const currentMatch = allMatches[i];
      
      // Add text before this match
      if (currentMatch.start > lastIndex) {
        const beforeText = line.substring(lastIndex, currentMatch.start);
        if (beforeText) {
          children.push({
            _type: 'span',
            _key: generateKey(),
            text: beforeText,
            marks: [],
          });
        }
      }

      // If this is a bold that contains highlights, parse it recursively
      if (currentMatch.type === 'strong' && currentMatch.hasHighlight) {
        // Parse the inner text for highlights
        const innerChildren = parseLineForHighlights(currentMatch.text);
        // Add 'strong' mark to all inner spans
        const boldChildren = innerChildren.map((child) => ({
          ...child,
          marks: [...(child.marks || []), 'strong'],
        }));
        children.push(...boldChildren);
      } else {
        // Simple case: just add the mark
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: currentMatch.text,
          marks: [currentMatch.type],
        });
      }

      lastIndex = currentMatch.end;
    }

    // Add remaining text
    if (lastIndex < line.length) {
      const afterText = line.substring(lastIndex);
      if (afterText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: afterText,
          marks: [],
        });
      }
    }

    // If no matches found, return a single span
    if (children.length === 0) {
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: line,
        marks: [],
      });
    }

    return children;
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
        children: parseLineForHighlights(content),
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
      children: parseLineForHighlights(trimmed),
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
// Helper: Process a single content block (image, list, table, cta)
// ------------------------
async function processContentBlock(block) {
  block._key = generateKey();

  // Determine block type
  if (block.image) {
    // Image block (supports single image or array of images for slideshow)
    block._type = 'image';
    
      // Check if it's the new structure with images array
      if (block.image.images && Array.isArray(block.image.images)) {
        // New structure: array of images for slideshow
        block.images = await Promise.all(
          block.image.images.map(async (imgItem) => {
            const imageData = await handleImage(imgItem.image);
            if (imageData) {
              return {
                _type: 'image',
                asset: imageData.asset,
                alt: imgItem.alt || '',
              };
            }
            return null;
          })
        );
        // Filter out failed uploads
        block.images = block.images.filter((img) => img !== null);
        if (block.images.length === 0) {
          return null; // All images failed
        }
        // Preserve display option if present
        if (block.image.display) {
          block.display = block.image.display;
        }
        delete block.image;
    } else {
      // Legacy structure: single image
      const imagePath = typeof block.image === 'string' ? block.image : block.image.image;
      const imageData = await handleImage(imagePath);
      if (imageData) {
        // For backward compatibility, also support single image
        block.images = [
          {
            _type: 'image',
            asset: imageData.asset,
            alt: block.image.alt || block.alt || '',
          },
        ];
        delete block.image;
        delete block.alt;
      } else {
        // If image upload failed, remove the block
        return null;
      }
    }
  } else if (block.listBlock) {
    // List block
    block._type = 'listBlock';
    const listData = block.listBlock;
    block.variant = listData.variant || 'default';
    block.columns = listData.columns || 2;
    block.items = [];

    // Process heading if present
    if (listData.heading) {
      if (typeof listData.heading === 'string') {
        block.heading = convertMarkdownToBlocks(listData.heading);
      } else {
        block.heading = listData.heading;
      }
    }

    if (Array.isArray(listData.items)) {
      block.items = await Promise.all(
        listData.items.map(async (item) => {
          item._key = generateKey();
          item._type = 'listItem';

          ['heading', 'body'].forEach((key) => {
            if (item[key] && typeof item[key] === 'string') {
              item[key] = convertMarkdownToBlocks(item[key]);
            }
          });

          if (item.icon) {
            item.icon = await handleImage(item.icon);
          }

          return item;
        })
      );
    }

    delete block.listBlock;
  } else if (block.tableBlock) {
    // Table block
    block._type = 'tableBlock';
    const tableData = block.tableBlock;
    block.columnA = tableData.columnA || '';
    block.columnB = tableData.columnB || '';
    block.rows = [];

    if (Array.isArray(tableData.rows)) {
      block.rows = await Promise.all(
        tableData.rows.map(async (row) => {
          row._key = generateKey();
          row.a =
            row.a && typeof row.a === 'string'
              ? convertMarkdownToBlocks(row.a)
              : row.a || [];
          row.b =
            row.b && typeof row.b === 'string'
              ? convertMarkdownToBlocks(row.b)
              : row.b || [];
          return row;
        })
      );
    }

    delete block.tableBlock;
  } else if (block.ctaBlock) {
    // CTA block
    block._type = 'ctaBlock';
    const ctaData = block.ctaBlock;
    block.title = ctaData.title || '';
    block.url = ctaData.url || '';
    block.style = ctaData.style || 'primary';
    delete block.ctaBlock;
  } else if (block.buttonBlock) {
    // Button block (multiple buttons)
    block._type = 'buttonBlock';
    const buttonData = block.buttonBlock;
    block.buttons = [];
    
    if (Array.isArray(buttonData.buttons)) {
      block.buttons = buttonData.buttons.map((button) => {
        button._key = generateKey();
        button._type = 'button';
        return {
          title: button.title || '',
          url: button.url || '',
          style: button.style || 'primary',
        };
      });
    }
    
    delete block.buttonBlock;
  } else if (block.linkBlock) {
    // Link block (single link with arrow)
    block._type = 'linkBlock';
    const linkData = block.linkBlock;
    block.text = linkData.text || '';
    block.url = linkData.url || '';
    delete block.linkBlock;
  }

  return block;
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

  // Also search for pages with "home" or slug in ID (fallback)
  let fallbackExisting = null;
  if (!existing && data.slug === 'home') {
    const byId = await client.fetch(
      `*[_type == $type && _id match "*home*"][0]{ _id, orderRank }`,
      { type: pageType }
    );
    if (byId) {
      console.log(`⚠️  Found page by ID pattern: ${byId._id}`);
      fallbackExisting = byId;
    }
  }

  const finalExisting = existing || fallbackExisting;

  // Preserve orderRank if page exists
  const orderRank = finalExisting?.orderRank || (await getLastOrderRank(pageType));

  if (finalExisting) {
    console.log(`♻️  Overwriting existing page: ${finalExisting._id}`);
  } else {
    console.log(`🆕 Creating new page`);
    console.log(`⚠️  WARNING: No existing page found with slug "${data.slug}". This will create a new document.`);
  }
  console.log(`📊 Setting orderRank: ${orderRank}`);

  if (!data.sections) {
    data.sections = [];
  }

  console.log(`🔄 Processing ${data.sections.length} sections...`);

  // Process sections
  for (let i = 0; i < data.sections.length; i++) {
    const section = data.sections[i];
    const sectionTheme = section.theme || 'default';
    const sectionRows = section.rows?.length || 0;
    console.log(`  Section ${i + 1}: ${section.type || 'unknown'}${section.type === 'sectionMain' ? ` (theme: ${sectionTheme}, rows: ${sectionRows})` : ''}`);

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
    // SECTION: sectionHeroMain
    // -------------------------------------------
    if (section._type === 'sectionHeroMain') {
      // Process slides
      if (Array.isArray(section.slides)) {
        section.slides = await Promise.all(
          section.slides.map(async (slide) => {
            slide._key = generateKey();
            slide._type = 'heroSlide';

            // Convert text fields to blocks
            ['label', 'heading', 'subheading', 'lead', 'body'].forEach((key) => {
              if (slide[key] && typeof slide[key] === 'string') {
                slide[key] = convertMarkdownToBlocks(slide[key]);
              }
            });

            // Handle background images and videos
            if (slide.backgroundImage) {
              slide.backgroundImage = await handleImage(slide.backgroundImage);
            }

            if (slide.backgroundVideo) {
              slide.backgroundVideo = await handleVideo(slide.backgroundVideo);
            }

            // Process buttons
            if (Array.isArray(slide.buttons)) {
              slide.buttons = slide.buttons.map((button) => {
                button._key = generateKey();
                button._type = 'button';
                return button;
              });
            }

            return slide;
          })
        );
      }
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

    // -------------------------------------------
    // SECTION: sectionMain
    // -------------------------------------------
    if (section._type === 'sectionMain') {
      // Process background image if present
      // handleImage will check if it's already processed and return as-is
      if (section.backgroundImage) {
        const imageData = await handleImage(section.backgroundImage);
        if (imageData) {
          section.backgroundImage = imageData;
        } else {
          delete section.backgroundImage; // Remove if upload failed
        }
      }
      
      // Process rows
      if (Array.isArray(section.rows)) {
        section.rows = await Promise.all(
          section.rows.map(async (row) => {
            row._key = generateKey();

            // Convert text fields to blocks
            ['heading', 'subheading', 'body'].forEach((key) => {
              if (row[key] && typeof row[key] === 'string') {
                row[key] = convertMarkdownToBlocks(row[key]);
              }
            });

            // Process contentBlocks
            if (Array.isArray(row.contentBlocks)) {
              const processedBlocks = await Promise.all(
                row.contentBlocks.map(async (block) => {
                  // CONTENT ROW (nested row with text + blocks)
                  if (block.contentRow) {
                    block._key = generateKey();
                    block._type = 'contentRow';
                    const rowData = block.contentRow;
                    
                    // Convert text fields to blocks
                    ['heading', 'body'].forEach((key) => {
                      if (rowData[key] && typeof rowData[key] === 'string') {
                        block[key] = convertMarkdownToBlocks(rowData[key]);
                      } else if (rowData[key]) {
                        block[key] = rowData[key];
                      }
                    });

                    // Process nested blocks
                    if (Array.isArray(rowData.blocks)) {
                      block.blocks = await Promise.all(
                        rowData.blocks.map(async (nestedBlock) => {
                          return await processContentBlock(nestedBlock);
                        })
                      );
                      // Filter out null blocks
                      block.blocks = block.blocks.filter((b) => b !== null);
                    }

                    delete block.contentRow;
                    return block;
                  }

                  // LEGACY: Direct blocks (backwards compatibility)
                  return await processContentBlock(block);
                })
              );
              // Filter out null blocks (failed image uploads)
              row.contentBlocks = processedBlocks.filter((block) => block !== null);
            }

            return row;
          })
        );
      }
    }
  }

  const safeId = finalExisting?._id || `${data.slug}-import`;

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
  console.log(`   Total sections in document: ${doc.sections.length}`);
  const sectionMainCount = doc.sections.filter(s => s._type === 'sectionMain').length;
  console.log(`   sectionMain entries: ${sectionMainCount}`);

  try {
    await client.createOrReplace(doc);
    console.log(`\n✅ Successfully imported: ${data.title}`);
    console.log(`   Type: ${pageType}`);
    console.log(`   ID: ${safeId}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   Order Rank: ${orderRank}`);
    console.log(`   Total sections: ${doc.sections.length}`);
    console.log(`   sectionMain sections: ${sectionMainCount}`);
  } catch (error) {
    console.error(`\n❌ Error importing page:`, error.message);
    console.error(`   Document ID: ${safeId}`);
    console.error(`   Slug: ${data.slug}`);
    throw error;
  }
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
