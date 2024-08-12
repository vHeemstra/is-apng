import test from 'ava'
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import isApng from '../dist/index.mjs'

/** Input validation tests */

test('returns false on number 0 input', (t) => {
  t.false(isApng(0))
})

test('returns false on number 1 input', (t) => {
  t.false(isApng(1))
})

test('returns false on empty string input', (t) => {
  t.false(isApng(''))
})

test('returns false on non-empty string input', (t) => {
  t.false(isApng('string'))
})

test('returns false on boolean true input', (t) => {
  t.false(isApng(true))
})

test('returns false on boolean false input', (t) => {
  t.false(isApng(false))
})

test('returns false on object input', (t) => {
  t.false(isApng({}))
})

test('returns false on array input', (t) => {
  t.false(isApng([]))
})

/** Real image tests */

const dir =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

const check = (filename) => isApng(readFileSync(filename))

test('returns true on animated PNG', (t) => {
  t.true(check(dir + '/images/animated.png'))
})

test('returns false on static PNG', (t) => {
  t.false(check(dir + '/images/static.png'))
})

test('returns false on static PNG with `acTL` text in metadata', (t) => {
  t.false(check(dir + '/images/staticWithMetadata.png'))
})

test('returns false on JPG', (t) => {
  t.false(check(dir + '/images/static.jpg'))
})

/** Mock data tests */

test('returns true when acTL precedes any IDAT', (t) => {
  t.true(
    isApng(
      new Uint8Array([
        // PNG header
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        // Chunk length: 0
        0x00, 0x00, 0x00, 0x00,
        // Chunk type: acTL
        0x61, 0x63, 0x54, 0x4c,
        // Chunk CRC
        0x00, 0x00, 0x00, 0x00,
        // Chunk length: 0
        0x00, 0x00, 0x00, 0x00,
        // Chunk type: IDAT
        0x49, 0x44, 0x41, 0x54,
        // Chunk CRC
        0x00, 0x00, 0x00, 0x00,
      ]),
    ),
  )
})

test('returns false when any IDAT precedes acTL', (t) => {
  t.false(
    isApng(
      new Uint8Array([
        // PNG header
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        // Chunk length: 0
        0x00, 0x00, 0x00, 0x00,
        // Chunk type: IDAT
        0x49, 0x44, 0x41, 0x54,
        // Chunk CRC
        0x00, 0x00, 0x00, 0x00,
        // Chunk length: 0
        0x00, 0x00, 0x00, 0x00,
        // Chunk type: acTL
        0x61, 0x63, 0x54, 0x4c,
        // Chunk CRC
        0x00, 0x00, 0x00, 0x00,
      ]),
    ),
  )
})

test('returns false when acTL is not a chunk type', (t) => {
  t.false(
    isApng(
      new Uint8Array([
        // PNG header
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        // Chunk length: 4
        0x00, 0x00, 0x00, 0x04,
        // Chunk type: any
        0x00, 0x00, 0x00, 0x01,
        // Chunk data: acTL
        0x61, 0x63, 0x54, 0x4c,
        // Chunk CRC
        0x00, 0x00, 0x00, 0x00,
      ]),
    ),
  )
})

test('returns false on too small PNG', (t) => {
  t.false(
    isApng(
      new Uint8Array([
        // PNG header
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        // Content omitted
      ]),
    ),
  )
})

test('returns false when next chunk size is too small', (t) => {
  t.false(
    isApng(
      new Uint8Array([
        // PNG header
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        // Chunk length: 4
        0x00, 0x00, 0x00, 0x04,
        // Chunk type: any
        0x00, 0x00, 0x00, 0x01,
        // Chunk CRC
        0x00, 0x00, 0x00, 0x00,
        // Chunk length: 4
        0x00, 0x00, 0x00, 0x04,
        // Chunk type: any
        0x00, 0x00, 0x00, 0x02,
        // Chunk CRC omitted
      ]),
    ),
  )
})
