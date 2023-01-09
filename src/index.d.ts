/**
Check if a Buffer/Uint8Array is a [Animated PNG / APNG](https://en.wikipedia.org/wiki/APNG) image.

@param buffer - The buffer to check.
@returns Whether `buffer` contains a APNG image.

@example
```
// Node.js:
import { readFile } from 'node:fs/promises';
import isApng from 'is-apng';

const buffer = await readFile('image.png');

isApng(buffer);
// => true
```

@example
```
import isApng from 'is-apng';

// Browser:
const response = await fetch('image.png');
const buffer = await response.arrayBuffer();

isApng(new Uint8Array(buffer));
// => true
```
*/
export default function isApng(buffer: Uint8Array | Buffer): boolean
