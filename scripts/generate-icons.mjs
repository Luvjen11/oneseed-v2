import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('public/oneseed-logo-trans.png')
const OUT_DIR = path.resolve('public/icons')

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function parseHex(hex) {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return { r, g, b, alpha: 1 }
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return { r, g, b, alpha: 1 }
  }
  return { r: 255, g: 255, b: 255, alpha: 1 }
}

async function makeIcon(size, outName, paddingPct = 0.1, bgColor = '#ffffff') {
  const bg = parseHex(bgColor)
  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
  const padding = Math.round(size * paddingPct)
  const inner = size - padding * 2
  const resized = await sharp(SRC)
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  await canvas
    .composite([{ input: resized, left: padding, top: padding }])
    .png()
    .toFile(path.join(OUT_DIR, outName))
}

async function run() {
  // CLI: node scripts/generate-icons.mjs --bg #16a34a
  const bgArgIdx = process.argv.indexOf('--bg')
  const bgColor = bgArgIdx !== -1 ? (process.argv[bgArgIdx + 1] || '#ffffff') : '#ffffff'

  if (!fs.existsSync(SRC)) {
    console.error(`Source image not found: ${SRC}`)
    process.exit(1)
  }
  ensureDir(OUT_DIR)

  // Regular icons (safe padding ~10%)
  await makeIcon(192, 'icon-192.png', 0.1, bgColor)
  await makeIcon(512, 'icon-512.png', 0.1, bgColor)

  // Maskable icons (more padding ~20% to respect mask safe area)
  await makeIcon(192, 'icon-192-maskable.png', 0.2, bgColor)
  await makeIcon(512, 'icon-512-maskable.png', 0.2, bgColor)

  console.log('Icons generated in public/icons')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})


