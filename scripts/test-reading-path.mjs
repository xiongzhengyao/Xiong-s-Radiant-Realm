import test from 'node:test'
import assert from 'node:assert/strict'
import { locateInPath, readingPaths, stepsForPath } from '../src/modules/reading-paths.mjs'
import { loadPosts } from './generate-feeds.mjs'

const camera = () => readingPaths.find(path => path.id === 'camera-to-first-frame')

test('camera path runs from the sensor to the first frame', () => {
  const path = camera()
  assert.ok(path)
  assert.deepEqual(path.slugs, [
    'image-sensors',
    'i2c-i3c-protocols',
    '计算',
    'qualcomm-dual-cam-camnoc-bandwidth',
    'camera-stream-on-bringup-checklist',
    'camera-first-frame-cold-start'
  ])
})

test('locateInPath returns neighbors inside the path', () => {
  const first = locateInPath('image-sensors')
  assert.equal(first.index, 0)
  assert.equal(first.prevSlug, null)
  assert.equal(first.nextSlug, 'i2c-i3c-protocols')
  assert.equal(first.total, 6)

  const middle = locateInPath('计算')
  assert.equal(middle.index, 2)
  assert.equal(middle.prevSlug, 'i2c-i3c-protocols')
  assert.equal(middle.nextSlug, 'qualcomm-dual-cam-camnoc-bandwidth')

  const last = locateInPath('camera-first-frame-cold-start')
  assert.equal(last.index, 5)
  assert.equal(last.nextSlug, null)
  assert.equal(last.prevSlug, 'camera-stream-on-bringup-checklist')
})

test('notes outside the path are not placed on it', () => {
  assert.equal(locateInPath('linux-system-programming'), null)
  assert.equal(locateInPath(''), null)
  assert.equal(locateInPath(undefined), null)
})

test('stepsForPath keeps path order and skips a missing note', () => {
  const posts = new Map([
    ['image-sensors', { slug: 'image-sensors', title: '传感器' }],
    ['camera-first-frame-cold-start', { slug: 'camera-first-frame-cold-start', title: '首帧' }]
  ])
  const steps = stepsForPath(camera(), posts)
  assert.deepEqual(steps.map(step => step.slug), [
    'image-sensors',
    'camera-first-frame-cold-start'
  ])
  assert.deepEqual(steps.map(step => step.index), [0, 5])
})

test('every path slug is a published note', () => {
  const slugs = new Set(loadPosts().map(post => post.slug))
  for (const path of readingPaths) {
    for (const slug of path.slugs) {
      assert.ok(slugs.has(slug), `${path.id} points at missing note ${slug}`)
    }
  }
})
