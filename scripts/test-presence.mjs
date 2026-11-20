import test from 'node:test'
import assert from 'node:assert/strict'
import { formatDocumentTitle } from '../src/utils/documentTitle.mjs'
import { coverAlt, photoAltKey, resolveCoverAlt } from '../src/utils/coverAlt.mjs'

test('home title keeps the brand once', () => {
  assert.equal(
    formatDocumentTitle('Snowhush · Camera Driver 工程师 · 熊正耀', 'Snowhush'),
    'Snowhush · Camera Driver 工程师 · 熊正耀'
  )
})

test('a note title is suffixed with the brand', () => {
  assert.equal(
    formatDocumentTitle('Sensor bring-up 清单', 'Snowhush'),
    'Sensor bring-up 清单 · Snowhush'
  )
})

test('the bare brand is not doubled', () => {
  assert.equal(formatDocumentTitle('Snowhush', 'Snowhush'), 'Snowhush')
  assert.equal(formatDocumentTitle('  ', 'Snowhush'), 'Snowhush')
})

test('cover alt uses the visible title', () => {
  assert.equal(coverAlt('  上海周末游记  '), '上海周末游记')
  assert.equal(coverAlt(''), '')
  assert.equal(coverAlt(null), '')
})

test('known photos map to a translation key', () => {
  assert.equal(photoAltKey('/images/drone-white.jpg'), 'photos.droneWhite')
  assert.equal(photoAltKey('/images/city.jpg?x=1'), 'photos.city')
  assert.equal(photoAltKey('/images/missing.jpg'), '')
})

test('resolveCoverAlt prefers the photo description', () => {
  const t = key => ({ 'photos.city': '城市街道' }[key] || key)
  assert.equal(resolveCoverAlt('/images/city.jpg', '上海周末游记', t), '城市街道')
  assert.equal(resolveCoverAlt('/images/missing.jpg', ' 上海周末游记 ', t), '上海周末游记')
  assert.equal(resolveCoverAlt('', '', t), '')
})
