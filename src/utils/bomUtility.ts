export function randomSerialNumber (): string {
  const b = [
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF),
    // UUID version 4
    Math.round(Math.random() * 0x0FFF) | 0x4000,
    // UUID version 4 variant 1
    Math.round(Math.random() * 0x3FFF) | 0x8000,
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF)
  ].map(n => n.toString(16).padStart(4, '0'))
  return `urn:uuid:${b[0]}${b[1]}-${b[2]}-${b[3]}-${b[4]}-${b[5]}${b[6]}${b[7]}`
}
