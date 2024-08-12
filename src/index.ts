function convertToInt(bytes: Uint8Array) {
  return bytes.reduce((value, byte) => (value << 8) + byte)
}

function isEqual(
  first: Uint8Array | number[],
  second: Uint8Array | number[],
  length = 4,
) {
  while (length > 0) {
    length--
    if (first[length] !== second[length]) {
      return false
    }
  }
  return true
}

/**
 * @see https://www.w3.org/TR/png/#5DataRep
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

const chunkTypes = {
  signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  animationControl: [0x61, 0x63, 0x54, 0x4c], // 'acTL'
  imageData: [0x49, 0x44, 0x41, 0x54], // 'IDAT'
}

export default function isApng(buffer: Uint8Array): boolean {
  const minChunkSize = headerSizes.LENGTH + headerSizes.TYPE + headerSizes.CRC

  if (
    !buffer ||
    !(buffer instanceof Uint8Array) ||
    buffer.length < headerSizes.SIGNATURE + minChunkSize
  ) {
    return false
  }

  /** Check for PNG signature */
  if (!isEqual(buffer, chunkTypes.signature, headerSizes.SIGNATURE)) {
    return false
  }

  buffer = buffer.subarray(headerSizes.SIGNATURE)

  /**
   * APNGs have an animation control (acTL) chunk preceding any image data (IDAT) chunks.
   * @see: https://www.w3.org/TR/png/#5ChunkOrdering
   */

  while (buffer.length >= minChunkSize) {
    const chunkType = buffer.subarray(
      headerSizes.LENGTH,
      headerSizes.LENGTH + headerSizes.TYPE,
    )

    if (isEqual(chunkType, chunkTypes.animationControl, headerSizes.TYPE)) {
      return true
    }

    if (isEqual(chunkType, chunkTypes.imageData, headerSizes.TYPE)) {
      return false
    }

    const nextChunkPosition =
      minChunkSize + convertToInt(buffer.subarray(0, headerSizes.LENGTH))

    buffer = buffer.subarray(nextChunkPosition)
  }

  return false
}
