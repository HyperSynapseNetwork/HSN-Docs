/**
 * scripts/generate-sidebar.mjs
 *
 * Scans guide/ and en/guide/ directories for .md files, extracts the
 * first `# Title` from each file, and generates a sidebar JSON for
 * config.mts to consume.
 *
 * Run via:  node scripts/generate-sidebar.mjs
 * Output:   .vitepress/cache/sidebar.json
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import { resolve, dirname, relative, basename, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CACHE_DIR = resolve(ROOT, '.vitepress/cache')
const OUT_FILE = resolve(CACHE_DIR, 'sidebar.json')

// Directories to scan: [sourceDir, urlPrefix, groupLabel]
const LOCALES = [
  { dir: 'guide', prefix: '/guide/', label: '指南' },
  { dir: 'en/guide', prefix: '/en/guide/', label: 'Guides' },
  { dir: 'zh-tw/guide', prefix: '/zh-tw/guide/', label: '指南' },
  { dir: 'ja/guide', prefix: '/ja/guide/', label: 'ガイド' },
]

// Override auto-capitalised directory names with custom display labels.
// Key = directory name, Value = sidebar group text.
const GROUP_RENAMES = {
  'v1': 'HSNPhira v1',
  'v2': 'HSNPhira v2',
  'v3': 'Phira + (HSNPhira v3)',
  'other-docs': '其他文档',
}

// Same for sub-groups (second directory level, e.g. v2/phira-mp/ → "Phira-mp").
const SUBGROUP_RENAMES = {
  'phira-mp': 'Phira-mp',
  'phira-mp-plus': 'Phira-mp +',
}

mkdirSync(CACHE_DIR, { recursive: true })

// ── Helpers ──────────────────────────────────────────────────────────

/** Extract the first `# Title` from a markdown file. */
function extractTitle(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const match = content.match(/^#\s+(.+)$/m)
    if (match) return match[1].trim()
  } catch { /* fallback */ }
  return null
}

/** Convert a kebab-case filename to human-readable text. */
function fileNameToTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Extract numeric `order` from frontmatter (defaults to 999). */
function extractOrder(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const match = content.match(/---\s*\n([\s\S]*?)\n---/)
    if (match) {
      const orderMatch = match[1].match(/^order:\s*(\d+)$/m)
      if (orderMatch) return parseInt(orderMatch[1], 10)
    }
  } catch { /* fallback */ }
  return 999
}

/** Recursively list .md files in a directory, sorted. */
function listMdFiles(dir) {
  const results = []
  if (!existsSync(dir)) return results
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...listMdFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

// ── Build sidebar ───────────────────────────────────────────────────

const sidebar = {}

for (const locale of LOCALES) {
  const srcDir = resolve(ROOT, locale.dir)
  const files = listMdFiles(srcDir)

  // groups: versionGroup → { directItems[], subGroups: Map<subGroupName, items[]> }
  //
  //   guide/v2/frontend.md           → directItems of group "HSNPhira v2"
  //   guide/v2/phira-mp/rust.md      → subGroups["Phira-mp"] of group "HSNPhira v2"
  //   guide/v2/phira-mp/cpp.md       → subGroups["Phira-mp"] of group "HSNPhira v2"
  //
  const groups = new Map()

  for (const filePath of files) {
    const rel = relative(srcDir, filePath)
    const parts = rel.split(sep)
    const fileName = basename(rel, '.md')
    const isIndex = fileName === 'index'

    // Skip index.md (directory landing pages)
    if (isIndex) continue

    // ── Group label (from first subdirectory) ────────────────────
    let groupLabel
    if (parts.length <= 1) {
      groupLabel = locale.label
    } else {
      groupLabel = GROUP_RENAMES[parts[0]] || parts[0]
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
    }

    // Build the link path
    const relWithoutExt = rel.replace(/\.md$/, '')
    const finalLink = relWithoutExt.endsWith('/index')
      ? relWithoutExt.replace(/\/index$/, '/')
      : '/' + locale.dir + '/' + relWithoutExt

    // Extract title from file, fallback to filename
    let title = extractTitle(filePath)
    if (!title) title = fileNameToTitle(fileName)

    // ── Ensure group entry exists ────────────────────────────────
    if (!groups.has(groupLabel)) {
      groups.set(groupLabel, { directItems: [], subGroups: new Map() })
    }
    const group = groups.get(groupLabel)

    // ── Determine if this goes into a sub-group ──────────────────
    //   parts.length == 2 →   v2/frontend.md        → direct item
    //   parts.length >= 3 →   v2/phira-mp/rust.md   → sub-group "Phira-mp"
    const order = extractOrder(filePath)
    const item = { text: title, link: finalLink, _order: order }

    if (parts.length <= 2) {
      group.directItems.push(item)
    } else {
      // sub-group named after the second directory (parts[1])
      const subName = SUBGROUP_RENAMES[parts[1]] || parts[1]
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())

      if (!group.subGroups.has(subName)) {
        group.subGroups.set(subName, [])
      }
      group.subGroups.get(subName).push(item)
    }
  }

  // ── Assemble sidebar groups array ──────────────────────────────
  const sidebarGroups = []
  for (const [text, group] of groups) {
    // Sort items by order field, then alphabetically by title
    const sortItems = (arr) => arr.sort((a, b) =>
      (a._order ?? 999) - (b._order ?? 999) || a.text.localeCompare(b.text)
    )

    const directItems = sortItems(group.directItems).map(({ _order, ...rest }) => rest)

    // Append sub-groups as nested items
    for (const [subText, subItems] of group.subGroups) {
      sortItems(subItems)
      directItems.push({ text: subText, items: subItems.map(({ _order, ...rest }) => rest) })
    }

    sidebarGroups.push({ text, items: directItems })
  }

  sidebar[locale.prefix] = sidebarGroups
}

// ── Write cache ─────────────────────────────────────────────────────
writeFileSync(OUT_FILE, JSON.stringify(sidebar, null, 2), 'utf-8')

const total = Object.values(sidebar).reduce((s, g) => s + g.reduce((a, b) => a + b.items.length, 0), 0)
console.log(`✅ sidebar: cached ${total} item(s) across ${Object.keys(sidebar).length} locale(s) → ${OUT_FILE}`)
