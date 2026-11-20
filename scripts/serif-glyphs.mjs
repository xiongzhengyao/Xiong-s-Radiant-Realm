import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Latin, digits, and punctuation that show up in serif titles. */
const ALWAYS =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' +
  '，。、；：？！「」『』（）【】《》〈〉“”‘’—…·・～￥'

const TEXT_FILES = [
  'src/i18n/zh.js',
  'src/i18n/en.js',
  'src/data/career.js',
  'src/utils/constants.js'
]

function addText(set, text) {
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    if (cp < 0x20 || cp === 0x7f) continue
    set.add(ch)
  }
}

function titleValues(source) {
  const values = []
  const quoted = /(?:^|[{,\n]\s*)(?:title|titleEn|name|nameAccent|headline|brand)\s*:\s*(['"])((?:\\.|(?!\1)[^\n])*)\1/g
  for (const match of source.matchAll(quoted)) values.push(match[2])
  const plain = /^(?:title|titleEn|name|nameAccent|headline|brand)\s*:\s*([^'"\n][^\n]*)$/gm
  for (const match of source.matchAll(plain)) values.push(match[1].trim())
  return values.join('\n')
}

export function requiredSerifGlyphs() {
  const set = new Set()
  addText(set, ALWAYS)

  for (const rel of TEXT_FILES) {
    addText(set, titleValues(fs.readFileSync(path.join(root, rel), 'utf8')))
  }

  const postsDir = path.join(root, 'src/assets/posts')
  for (const name of fs.readdirSync(postsDir)) {
    if (!name.endsWith('.md')) continue
    const raw = fs.readFileSync(path.join(postsDir, name), 'utf8')
    addText(set, titleValues(raw))
    for (const line of raw.split(/\r?\n/)) {
      const heading = line.match(/^#{1,6}\s+(.+)$/)
      if (heading) addText(set, heading[1])
    }
  }

  return [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('')
}

export const GLYPHS_FILE = path.join(root, 'src/assets/fonts/noto-serif-sc-700.glyphs.txt')
export const SUBSET_FONT = path.join(root, 'src/assets/fonts/noto-serif-sc-700.woff2')
export const SOURCE_FONT = path.join(root, 'src/assets/fonts/source/noto-serif-sc-700.woff2')
