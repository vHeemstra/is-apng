import test from 'ava'
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import isApng from '../dist/index.mjs'

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

test('returns false on JPG', (t) => {
  t.false(check(dir + '/images/static.jpg'))
})

test('returns false on static PNG with `acTL` text in metadata', (t) => {
  t.false(check(dir + '/images/staticWithMetadata.png'))
})

test('returns true when IDAT follows acTL', (t) => {
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
      ]),
    ),
  )
})

test('returns false when IDAT precedes acTL', (t) => {
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
      ]),
    ),
  )
})

test('chunks should be found when preceded by a partial of themselves', (t) => {
  t.true(
    isApng(
      new Uint8Array([
        // PNG header
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        // Chunk length: a
        0x00, 0x00, 0x00, 0x61,
        // Chunk type: acTL
        0x61, 0x63, 0x54, 0x4c,
      ]),
    ),
  )
})
