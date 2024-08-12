function convertToInt(bytes: Uint8Array) {
  return bytes.reduce((value, byte) => (value << 8) + byte)
}

function isEqual(first, second) {
  return (
    first[0] === second[0] &&
    first[1] === second[1] &&
    first[2] === second[2] &&
    first[3] === second[3]
  )
}

const encoder = new TextEncoder()
const chunkTypes = {
  animationControl: encoder.encode('acTL'),
  imageData: encoder.encode('IDAT'),
}

/**
 * @see http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html
 */
const headerSizes = {
  /** Number of bytes reserved for PNG signature */
  SIGNATURE: 8,
  /** Number of bytes reserved for chunk type */
  LENGTH: 4,
  /** Number of bytes reserved for chunk type */
  TYPE: 4,
  /** Number of bytes reserved for chunk CRC */
  CRC: 4,
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

  buffer = buffer.subarray(headerSizes.SIGNATURE)

  const minBufferSize = headerSizes.LENGTH + headerSizes.TYPE
  while (buffer.length >= minBufferSize) {
    const chunkLength = convertToInt(buffer.subarray(0, headerSizes.LENGTH))
    const chunkType = buffer.subarray(
      headerSizes.LENGTH,
      headerSizes.LENGTH + headerSizes.TYPE,
    )

    if (isEqual(chunkType, chunkTypes.animationControl)) {
      return true
    }

    if (isEqual(chunkType, chunkTypes.imageData)) {
      return false
    }

    const nextChunkPosition =
      headerSizes.LENGTH + headerSizes.TYPE + chunkLength + headerSizes.CRC

    buffer = buffer.subarray(nextChunkPosition)
  }

  return false
}
