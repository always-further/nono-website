#!/usr/bin/env node

/**
 * SEO smoke test — runs against `next build` output (.next/server/app/*.html).
 * Usage: npm run build && node scripts/test-seo.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const BUILD_DIR = join(ROOT, '.next/server/app');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

function readPage(pagePath) {
  const filePath = join(BUILD_DIR, pagePath);
  if (!existsSync(filePath)) {
    console.error(`  SKIP: ${filePath} not found (run 'npm run build' first)`);
    return null;
  }
  return readFileSync(filePath, 'utf-8');
}

function testPage(name, pagePath, checks) {
  console.log(`\n${name} (${pagePath})`);
  const html = readPage(pagePath);
  if (!html) return;
  checks(html);
}

// ── Homepage ──

testPage('Homepage', 'index.html', (html) => {
  assert(html.includes('rel="canonical"'), 'missing canonical URL');
  assert(html.includes('application/ld+json'), 'missing JSON-LD structured data');
  assert(html.includes('"@type":"WebSite"'), 'missing WebSite schema');
  assert(html.includes('"@type":"SoftwareApplication"'), 'missing SoftwareApplication schema');
  assert(html.includes('name="description"'), 'missing meta description');
  assert(html.includes('name="keywords"'), 'missing keywords meta');
  assert(html.includes('og:title'), 'missing OG title');
  assert(html.includes('twitter:card'), 'missing Twitter card');
  assert(html.includes('Learn about AI agent security'), 'missing cross-link to AF blog in footer');
});

// ── Sitemap & robots.txt ──

console.log('\nSitemap');
const sitemapMeta = join(BUILD_DIR, 'sitemap.xml.meta');
const sitemapRoute = join(BUILD_DIR, 'sitemap.xml/route.js');
if (existsSync(sitemapMeta) || existsSync(sitemapRoute)) {
  passed++;
  console.log('  OK: sitemap.xml exists');
} else {
  failed++;
  console.error('  FAIL: sitemap.xml not found in build output');
}

console.log('\nrobots.txt');
const robotsMeta = join(BUILD_DIR, 'robots.txt.meta');
const robotsRoute = join(BUILD_DIR, 'robots.txt/route.js');
if (existsSync(robotsMeta) || existsSync(robotsRoute)) {
  passed++;
  console.log('  OK: robots.txt exists');
} else {
  failed++;
  console.error('  FAIL: robots.txt not found in build output');
}

// ── Summary ──

console.log(`\n${'─'.repeat(40)}`);
console.log(`SEO tests: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
