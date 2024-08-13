function bytesToInt(bytes: Uint8Array): number {
  return bytes.reduce((value, byte) => (value << 8) + byte, 0)
}

function chunkTypeToInt(bytes: Uint8Array | number[]): number {
  if (bytes.length !== headerSizes.TYPE) {
    throw new Error(`Invalid chunk type size ${bytes.length}`)
  }

  let value = 0
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]

    if (!(byte >= 0x41 && byte <= 0x5a) && !(byte >= 0x61 && byte <= 0x7a)) {
      const bytesText = Array.from(bytes)
        .map((byte) => `0x${byte.toString(16)}`)
        .join()
      throw new Error(`Invalid chunk type ${bytesText}`)
    }

    value = (value << 8) + bytes[i]
  }

  return value
}

function isEqual(
  first: Uint8Array | number[],
  second: Uint8Array | number[],
  length,
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
  /** `IHDR` chunk type */
  imageHeader: chunkTypeToInt([0x49, 0x48, 0x44, 0x52]),
  /** `PLTE` chunk type */
  palette: chunkTypeToInt([0x50, 0x4c, 0x54, 0x45]),
  /** `acTL` chunk type */
  animationControl: chunkTypeToInt([0x61, 0x63, 0x54, 0x4c]),
  /** `IDAT` chunk type */
  imageData: chunkTypeToInt([0x49, 0x44, 0x41, 0x54]),
  /** `IEND` chunk type */
  imageEnd: chunkTypeToInt([0x49, 0x45, 0x4e, 0x44]),
}

const knownCriticalChunkTypes = new Set<number>([
  chunkTypes.imageHeader,
  chunkTypes.palette,
  chunkTypes.imageData,
  chunkTypes.imageEnd,
])

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
    const chunkType = chunkTypeToInt(
      buffer.subarray(
        headerSizes.LENGTH,
        headerSizes.LENGTH + headerSizes.TYPE,
      ),
    )

    // Sixth bit of the first byte of the chunk type is critical property
    // (0 - critical, 1 - not)
    const isCriticalChunk = !(chunkType & 0x20000000)
    if (isCriticalChunk && !knownCriticalChunkTypes.has(chunkType)) {
      return false
    }

    switch (chunkType) {
      case chunkTypes.animationControl:
        return true
      case chunkTypes.imageData:
        return false
    }

    const nextChunkPosition =
      minChunkSize + bytesToInt(buffer.subarray(0, headerSizes.LENGTH))

    buffer = buffer.subarray(nextChunkPosition)
  }

  return false
}
