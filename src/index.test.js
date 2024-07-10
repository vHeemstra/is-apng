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
