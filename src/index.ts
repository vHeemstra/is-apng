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

  // APNGs have an animation control chunk (acTL) preceding any IDAT(s).
  // See: https://en.wikipedia.org/wiki/APNG#File_format

  buffer = buffer.subarray(8)

  let firstIndex = 0
  let secondIndex = 0
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== sequences.animationControlChunk[firstIndex]) {
      firstIndex = 0
    }

    if (buffer[i] === sequences.animationControlChunk[firstIndex]) {
      firstIndex++
      if (firstIndex === sequences.animationControlChunk.length) {
        return true
      }
    }

    if (buffer[i] !== sequences.imageDataChunk[secondIndex]) {
      secondIndex = 0
    }

    if (buffer[i] === sequences.imageDataChunk[secondIndex]) {
      secondIndex++
      if (secondIndex === sequences.imageDataChunk.length) {
        return false
      }
    }
  }

  return false
}
