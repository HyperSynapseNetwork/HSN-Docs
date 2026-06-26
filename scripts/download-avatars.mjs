/**
 * scripts/download-avatars.mjs
 *
 * Downloads team member avatars from GitHub to public/images/team/
 * so the site serves local images instead of hot-linking to GitHub
 * (which can be slow in some regions).
 *
 * Run via:  node scripts/download-avatars.mjs
 * Output:   public/images/team/{login}.png
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const AVATAR_DIR = resolve(ROOT, 'public/images/team')

// ── Team member logins (source of truth) ────────────────────────────
const TEAM_LOGINS = [
  'FireflyF09',
  'htadiy',
  'ExplodingKonjac',
  'LY-Xiang',
]

// All avatar sources to try (fallback order)
function avatarUrls(login) {
  return [
    `https://github.com/${login}.png?size=160`,
    `https://avatars.githubusercontent.com/${login}?s=160&v=4`,
  ]
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  mkdirSync(AVATAR_DIR, { recursive: true })

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const login of TEAM_LOGINS) {
    const dest = resolve(AVATAR_DIR, `${login}.png`)

    // Skip if file exists and is less than 7 days old
    if (existsSync(dest)) {
      const stat = await import('node:fs').then(fs => fs.promises.stat(dest))
      const ageMs = Date.now() - stat.mtimeMs
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (ageMs < sevenDays) {
        skipped++
        continue
      }
    }

    // Try each URL in order
    let success = false
    for (const url of avatarUrls(login)) {
      try {
        const resp = await fetch(url, {
          signal: AbortSignal.timeout(15_000),
          headers: { 'User-Agent': 'HSN-Docs/1.0' },
        })
        if (!resp.ok) continue
        const buf = Buffer.from(await resp.arrayBuffer())
        writeFileSync(dest, buf)
        console.log(`  ✓ ${login} (${buf.length} bytes)`)
        success = true
        break
      } catch (e) {
        // Try next URL
      }
    }

    if (success) {
      downloaded++
    } else {
      console.error(`  ✗ ${login} — all sources failed`)
      failed++
    }
  }

  console.log(`\n✅ Avatars: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed → ${AVATAR_DIR}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
