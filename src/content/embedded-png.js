const prefix = 'data:image/png;base64,'
const maxEncodedLength = 2 * 1024 * 1024
const maxDimension = 4096

function readUint32(bytes, start) {
  return (
    bytes.charCodeAt(start) * 2 ** 24 +
    bytes.charCodeAt(start + 1) * 2 ** 16 +
    bytes.charCodeAt(start + 2) * 2 ** 8 +
    bytes.charCodeAt(start + 3)
  )
}

export function embeddedPngDimensions(source) {
  if (!source?.startsWith(prefix)) return null

  const encoded = source.slice(prefix.length)
  if (
    encoded.length < 44 ||
    encoded.length > maxEncodedLength ||
    encoded.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)
  ) {
    return null
  }

  const header = atob(encoded.slice(0, 32))
  if (
    !header.startsWith('\x89PNG\r\n\x1a\n') ||
    readUint32(header, 8) !== 13 ||
    header.slice(12, 16) !== 'IHDR'
  ) {
    return null
  }

  const width = readUint32(header, 16)
  const height = readUint32(header, 20)
  if (width < 1 || width > maxDimension || height < 1 || height > maxDimension) return null

  return { width, height }
}
