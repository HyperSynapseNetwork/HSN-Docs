/**
 * scripts/git-info.mjs
 *
 * Extracts the last-commit author and timestamp for every Markdown
 * file in the project and writes a JSON cache consumed by
 * config.mts → transformPageData.
 *
 * Run via:  node scripts/git-info.mjs
 * Output:   .vitepress/cache/git-info.json
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CACHE_FILE = resolve(ROOT, '.vitepress/cache/git-info.json')

// Ensure cache dir exists
mkdirSync(dirname(CACHE_FILE), { recursive: true })

// ── Gather all *.md files ────────────────────────────────────────
const src = resolve(ROOT)

/** Recursively find Markdown files, respecting .gitignore boundaries. */
function findMdFiles(dir) {
  const files = []
  let entries
  try {
    entries = execSync(`find "${dir}" -name "*.md" -not -path "*/\node_modules/*" -not -path "*/.vitepress/*"`, {
      encoding: 'utf-8',
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .trim()
      .split('\n')
      .filter(Boolean)
  } catch {
    return files
  }
  for (const f of entries) {
    files.push(f.trim())
  }
  return files
}

const mdFiles = findMdFiles(src)

// ── Extract git info per file ────────────────────────────────────
const infoMap = {}

for (const absPath of mdFiles) {
  // Relative path as VitePress sees it (e.g. "guide/getting-started.md")
  const relPath = relative(ROOT, absPath).replace(/\\/g, '/')

  try {
    const logOutput = execSync(
      `git log -1 --format="%an|%ai" -- "${relPath}"`,
      { encoding: 'utf-8', cwd: ROOT, stdio: ['pipe', 'pipe', 'ignore'] },
    ).trim()

    if (!logOutput) continue

    const pipeIdx = logOutput.indexOf('|')
    if (pipeIdx === -1) continue

    const author = logOutput.slice(0, pipeIdx)
    const rawDate = logOutput.slice(pipeIdx + 1)

    // Format: "YYYY-MM-DD HH:mm" (strip timezone offset / seconds)
    // rawDate is like "2025-06-24 14:30:00 +0800"
    const datePart = rawDate.slice(0, 16) // "2025-06-24 14:30"

    infoMap[relPath] = {
      author,
      date: datePart,
    }
  } catch {
    // File not tracked by git yet → skip
  }
}

// ── Write cache ──────────────────────────────────────────────────
writeFileSync(CACHE_FILE, JSON.stringify(infoMap, null, 2), 'utf-8')

const count = Object.keys(infoMap).length
console.log(`✅ git-info: cached ${count} file(s) → ${CACHE_FILE}`)
