import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { GLYPHS_FILE, SOURCE_FONT, SUBSET_FONT, requiredSerifGlyphs } from './serif-glyphs.mjs'

const glyphs = requiredSerifGlyphs()
fs.mkdirSync(path.dirname(GLYPHS_FILE), { recursive: true })
fs.writeFileSync(GLYPHS_FILE, glyphs, 'utf8')

if (!fs.existsSync(SOURCE_FONT)) {
  console.error(`Missing source font: ${SOURCE_FONT}`)
  process.exit(1)
}

const candidates = [
  'pyftsubset',
  path.join(os.homedir(), '.local/bin/pyftsubset')
]
const bin = candidates.find(cmd => {
  const probe = spawnSync(cmd, ['--help'], { stdio: 'ignore' })
  return probe.status === 0
})

if (!bin) {
  console.error('pyftsubset is not installed. The glyph list was updated; install fonttools and rerun.')
  process.exit(1)
}

const result = spawnSync(bin, [
  SOURCE_FONT,
  `--output-file=${SUBSET_FONT}`,
  '--flavor=woff2',
  `--text-file=${GLYPHS_FILE}`,
  '--layout-features=kern,liga,calt,locl',
  '--glyph-names',
  '--symbol-cmap',
  '--legacy-cmap',
  '--notdef-glyph',
  '--notdef-outline',
  '--recommended-glyphs',
  '--name-IDs=*',
  '--drop-tables+=DSIG'
], { stdio: 'inherit' })

if (result.status !== 0) process.exit(result.status || 1)

const bytes = fs.statSync(SUBSET_FONT).size
console.log(`Subset ${glyphs.length} characters -> ${(bytes / 1024).toFixed(1)} KB`)
