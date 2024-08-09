// import { Buffer } from 'node:buffer'

/**
 * Returns the index of the first occurrence of a sequence in an typed array, or -1 if it is not present.
 *
 * Works similar to `Array.prototype.indexOf()`, but it searches for a sequence of array values (bytes).
 * The bytes in the `haystack` array are decoded (UTF-8) and then used to search for `needle`.
 *
 * @param buffer
 * Array to search in.
 *
 * @param searchSequence
 * The value to locate in the array.
 *
 * @param fromIndex
 * The array index at which to begin the search.
 *
 * @param stopSequence
 * Byte sequence to stop search
 *
 * @returns boolean
 * Whether the array holds Animated PNG data.
 */
function hasSequence(
  buffer: Buffer | Uint8Array,
  searchSequence: Uint8Array,
  fromIndex: number,
  stopSequence: Uint8Array,
): boolean {
  function validateSequence(sequence: Uint8Array): void {
    if (!sequence.length) {
      throw new Error('Sequence is empty')
    }

    // Search only unique symbols to simplify the algorithm
    if (new Set(sequence).size !== sequence.length) {
      throw new Error('Sequence must consist of unique symbols')
    }
  }

  validateSequence(searchSequence)
  validateSequence(stopSequence)

  if (fromIndex >= buffer.length) {
    return false
  }
  buffer = buffer.subarray(fromIndex)

  let matchSearchIndex = 0
  let matchStopIndex = 0
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === searchSequence[matchSearchIndex]) {
      matchSearchIndex++
      if (matchSearchIndex === searchSequence.length) {
        return true
      }
    } else {
      matchSearchIndex = 0
    }

    if (buffer[i] === stopSequence[matchStopIndex]) {
      matchStopIndex++
      if (matchStopIndex === stopSequence.length) {
        return false
      }
    } else {
      matchStopIndex = 0
    }
  }

  return false
}

const encoder = new TextEncoder()
const sequences = {
  animationControlChunk: encoder.encode('acTL'),
  imageDataChunk: encoder.encode('IDAT'),
}

export default function isApng(buffer: Buffer | Uint8Array): boolean {
  if (
    !buffer ||
    !(
      (typeof Buffer !== 'undefined' && Buffer.isBuffer(buffer)) ||
      buffer instanceof Uint8Array
    ) ||
    buffer.length < 16
  ) {
    return false
  }

  const isPNG =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a

  if (!isPNG) {
    return false
  }

  // APNGs have an animation control chunk ('acTL') preceding the IDATs.
  // See: https://en.wikipedia.org/wiki/APNG#File_format
  return hasSequence(
    buffer,
    sequences.animationControlChunk,
    8,
    sequences.imageDataChunk,
  )
}

// globalThis.isApng = isApng

// const idatIdx = buffer.indexOf('IDAT')
// const actlIdx = buffer.indexOf('acTL')
