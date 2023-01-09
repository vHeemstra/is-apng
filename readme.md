# is-apng

> Check if a Buffer/Uint8Array is a [Animated PNG / APNG](https://en.wikipedia.org/wiki/APNG) image

## Install

```
$ npm install is-apng
```

## Usage

##### Node.js

```js
import { readFile } from 'node:fs/promises'
import isApng from 'is-apng'

const buffer = await readFile('image.png')

isApng(buffer)
// => true
```

##### Browser

```js
import isApng from 'is-apng'

const response = await fetch('image.png')
const buffer = await response.arrayBuffer()

isApng(new Uint8Array(buffer))
// => true
```

## API

### isApng(buffer)

Accepts a Buffer (Node.js) or Uint8Array. Returns a `boolean` of whether `buffer` is a APNG image.

#### buffer

The buffer to check.

## Based on

- [**is-png**](https://github.com/sindresorhus/is-png) - Check if a Buffer/Uint8Array is a PNG image<br>
  by [Sindre Sorhus](https://github.com/sindresorhus)
