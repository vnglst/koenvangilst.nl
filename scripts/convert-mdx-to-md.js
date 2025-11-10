#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '..', 'content');
const outputDir = path.join(__dirname, '..', 'src', 'posts');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all MDX files
const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

console.log(`Converting ${files.length} MDX files to Markdown...`);

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse frontmatter and content
  const { data, content } = matter(fileContent);

  // Convert publishedAt to date for 11ty
  if (data.publishedAt) {
    data.date = data.publishedAt;
  }

  // Add layout if not present
  if (!data.layout) {
    data.layout = 'layouts/post.njk';
  }

  // Generate permalink from slug or filename
  const slug = file.replace('.mdx', '');
  if (!data.permalink) {
    data.permalink = `/lab/${slug}/`;
  }

  // Remove React-specific imports and exports
  let cleanContent = content
    .replace(/^import .+ from .+;?\n?/gm, '') // Remove imports
    .replace(/^export .+\n?/gm, '') // Remove exports
    .replace(/<(\w+)Component[^>]*>/g, '') // Remove custom components opening tags
    .replace(/<\/(\w+)Component>/g, ''); // Remove custom components closing tags

  // Recreate the file with frontmatter
  const newContent = matter.stringify(cleanContent, data);

  // Write to new location with .md extension
  const outputPath = path.join(outputDir, file.replace('.mdx', '.md'));
  fs.writeFileSync(outputPath, newContent);

  console.log(`✓ Converted ${file} -> ${path.basename(outputPath)}`);
});

console.log(`\nDone! Converted ${files.length} files.`);
