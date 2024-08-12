# is-apng &nbsp;&nbsp;[![Latest GitHub release][release-image]][release-url] [![Latest NPM version][npm-image]][npm-url] [![Build Status][ci-image]][ci-url]

> Checks if a Buffer/Uint8Array contains a [Animated PNG / APNG](https://en.wikipedia.org/wiki/APNG) image.

> [!IMPORTANT]
> This is _only_ a quick detect method and does not do full (A)PNG file validation.<br>
> For security and file integrity sensitive operations, use a true (A)PNG validator (see also [specs](https://www.w3.org/TR/png/)).

## Install

```
$ npm install is-apng
```

## Usage

### Node.js &nbsp;<img src="./src/node.svg" style="margin-bottom:-0.15em">

```js
import { readFile } from 'node:fs/promises'
import isApng from 'is-apng'

const buffer = await readFile('image.png')

isApng(buffer)
// => true
```
<sup>_Note: As of version 2, Node versions below 18 are not supported._</sup>

### Browser &nbsp;<img src="./src/chrome.svg" alt="Chrome" title="Chrome" style="margin-bottom:-0.15em"> <img src="./src/edge.svg" alt="Edge" title="Edge" style="margin-bottom:-0.15em"> <img src="./src/firefox.svg" alt="Firefox" title="Firefox" style="margin-bottom:-0.15em"> <img src="./src/safari.svg" alt="Safari" title="Safari" style="margin-bottom:-0.15em"> <img src="./src/opera.svg" alt="Opera" title="Opera" style="margin-bottom:-0.15em">

#### As package through NPM

```js
import isApng from 'is-apng'

const response = await fetch('image.png')
const buffer = await response.arrayBuffer()

isApng(new Uint8Array(buffer))
// => true
```

#### As old-school global script tag

Url for latest version: `https://unpkg.com/is-apng`<br>
Url for specific version: `https://unpkg.com/is-apng@1.1.4/dist/index.js`

```html
<script src="https://unpkg.com/is-apng" type="text/javascript"></script>

<script type="text/javascript">
  console.log(typeof isApng);
  // isApng(...)
</script>
```

#### As module

Url for latest version: `https://unpkg.com/is-apng/dist/index.mjs`<br>
Url for specific version: `https://unpkg.com/is-apng@1.1.4/dist/index.mjs`

```html
<script type="module">
  import isApng from 'https://unpkg.com/is-apng/dist/index.mjs'

  console.log(typeof isApng);
  // isApng(...)
</script>
```

or

```html
<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

<script type="importmap">
  {
    "imports": {
      "is-apng": "https://unpkg.com/is-apng/dist/index.mjs"
    }
  }
</script>

<script type="module">
  import isApng from 'is-apng'

  console.log(typeof isApng);
  // isApng(...)
</script>
```

## API

### isApng(buffer)

Accepts a Buffer (Node.js) or Uint8Array. Returns a `boolean` of whether `buffer` is a APNG image.

#### buffer

The buffer to check.

## Based on

- [**is-png**](https://github.com/sindresorhus/is-png) - Check if a Buffer/Uint8Array is a PNG image<br>
  by [Sindre Sorhus](https://github.com/sindresorhus)

## License

MIT © [Philip van Heemstra](https://github.com/vheemstra)

[release-url]: https://github.com/vHeemstra/is-apng/releases
[release-image]: https://img.shields.io/github/v/release/vHeemstra/is-apng?sort=semver&logo=github&logoColor=959DA5&labelColor=444D56

[npm-url]: https://www.npmjs.com/package/is-apng
[npm-image]: https://img.shields.io/npm/v/is-apng.svg?color=cb0000&labelColor=444D56&logo=data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjOTU5REE1IiBkPSJNMS43NjMgMEMuNzg2IDAgMCAuNzg2IDAgMS43NjN2MjAuNDc0QzAgMjMuMjE0Ljc4NiAyNCAxLjc2MyAyNGgyMC40NzRjLjk3NyAwIDEuNzYzLS43ODYgMS43NjMtMS43NjNWMS43NjNDMjQgLjc4NiAyMy4yMTQgMCAyMi4yMzcgMHpNNS4xMyA1LjMyM2wxMy44MzcuMDE5LS4wMDkgMTMuODM2aC0zLjQ2NGwuMDEtMTAuMzgyaC0zLjQ1NkwxMi4wNCAxOS4xN0g1LjExM3oiPjwvcGF0aD48L3N2Zz4=

[ci-url]: https://github.com/vHeemstra/is-apng/actions/workflows/publish_on_release.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/vHeemstra/is-apng/publish_on_release.yml?label=lint%20%26%20test&logo=github&logoColor=959DA5&labelColor=444D56

[coverage-url]: https://coveralls.io/github/vHeemstra/is-apng?branch=main
[coverage-image]: https://img.shields.io/coveralls/github/vHeemstra/is-apng?logo=coveralls&logoColor=959DA5&labelColor=444D56
[coverage-image_]: https://coveralls.io/repos/github/vHeemstra/is-apng/badge.svg?branch=main

[coverage-url2]: https://codecov.io/gh/vHeemstra/is-apng
[coverage-image2]: https://codecov.io/gh/vHeemstra/is-apng/branch/main/graph/badge.svg?token=sZaKGStMXg

[deps-url]: https://libraries.io/npm/is-apng
[deps-image]: https://img.shields.io/librariesio/release/npm/is-apng?logo=libraries.io&logoColor=959DA5&labelColor=444D56
[deps-image2]: https://img.shields.io/librariesio/github/vHeemstra/is-apng?logo=libraries.io&logoColor=959DA5&labelColor=444D56

[downloads-image]: https://img.shields.io/npm/dm/is-apng.svg?labelColor=444D56&logo=data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjOTU5REE1IiBkPSJNMS43NjMgMEMuNzg2IDAgMCAuNzg2IDAgMS43NjN2MjAuNDc0QzAgMjMuMjE0Ljc4NiAyNCAxLjc2MyAyNGgyMC40NzRjLjk3NyAwIDEuNzYzLS43ODYgMS43NjMtMS43NjNWMS43NjNDMjQgLjc4NiAyMy4yMTQgMCAyMi4yMzcgMHpNNS4xMyA1LjMyM2wxMy44MzcuMDE5LS4wMDkgMTMuODM2aC0zLjQ2NGwuMDEtMTAuMzgyaC0zLjQ1NkwxMi4wNCAxOS4xN0g1LjExM3oiPjwvcGF0aD48L3N2Zz4=
