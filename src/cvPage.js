// Draws one CV page onto a 2D canvas, which the hologram sheet uses as its
// texture. Everything is laid out from a single y cursor, so adding a block to
// `cvContent.js` just pushes the rest of the page down — no coordinates to keep
// in sync.
//
// Colours are written straight to the canvas and sampled raw by the hologram
// shader (the texture stays in the default colour space), so what you pick here
// is what shows up on screen.
//
// Chart rules followed here (they're what keep it from looking like clip-art):
//  · one hue for every bar — bar length already encodes the value, so shading
//    them by size would say the same thing twice
//  · bars are thin (≤ 24px) with a 4px rounded data-end, square at the baseline
//  · gridlines are solid hairlines, one step off the surface, never dashed
//  · values ride the tip of their own bar instead of needing a value axis

import { CV_NAME, CV_ROLE, CV_SITE } from './cvContent.js'

export const PAGE_W = 1024
export const PAGE_H = 1448 // A4-ish portrait (1 : √2)

const PAD = 74 // page margin
const INK = '#e4fbff' // body text
const ACCENT = '#5fe6ff' // headings, rules, and every data mark
const DIM = '#8dc3d6' // dates, captions, secondary text
const PAPER = 'rgba(3, 27, 40, 0.7)' // the "sheet" itself
const GLOW = 'rgba(95, 230, 255, 0.55)'
const TRACK = 'rgba(95, 230, 255, 0.15)' // the unfilled part of a meter
const GRID = 'rgba(95, 230, 255, 0.16)' // hairline gridlines

const font = (weight, size) => `${weight} ${size}px 'Inter', system-ui, -apple-system, sans-serif`

// ------------------------------------------------------------------- basics
// Split `text` into lines that fit `maxW` at the current ctx font.
function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (ctx.measureText(next).width <= maxW || !line) line = next
    else {
      lines.push(line)
      line = w
    }
  }
  if (line) lines.push(line)
  return lines
}

function glow(ctx, colour, blur) {
  ctx.shadowColor = colour
  ctx.shadowBlur = blur
}
const noGlow = (ctx) => {
  ctx.shadowBlur = 0
}

// Rounded rectangle with per-corner radii ([tl, tr, br, bl]) — a bar gets a
// rounded data-end and square corners at its baseline.
function roundRect(ctx, x, y, w, h, r) {
  const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r]
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, [tl, tr, br, bl])
  else {
    ctx.moveTo(x + tl, y)
    ctx.lineTo(x + w - tr, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
    ctx.lineTo(x + w, y + h - br)
    ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
    ctx.lineTo(x + bl, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
    ctx.lineTo(x, y + tl)
    ctx.quadraticCurveTo(x, y, x + tl, y)
  }
  ctx.closePath()
}

function hairline(ctx, x1, y1, x2, y2, colour = GRID) {
  ctx.strokeStyle = colour
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x1, Math.round(y1) + 0.5)
  ctx.lineTo(x2, Math.round(y2) + 0.5)
  ctx.stroke()
}

// A run of text laid out from (x, y), returning the y just past it.
function paragraph(ctx, text, x, y, maxW, { size = 25, weight = 400, colour = INK, lh = 1.45 }) {
  ctx.font = font(weight, size)
  ctx.fillStyle = colour
  const lines = wrap(ctx, text, maxW)
  for (const l of lines) {
    ctx.fillText(l, x, y)
    y += size * lh
  }
  return y
}

// Small caps-ish section label above a chart or group.
function caption(ctx, text, x, y, colour = DIM, size = 18) {
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
  ctx.font = font(700, size)
  ctx.fillStyle = colour
  ctx.fillText(text.toUpperCase(), x, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  return y + size * 1.3
}

// ------------------------------------------------------------------ portrait
// The photo is loaded once and cached; the hologram repaints when it arrives.
let portrait = null
let portraitLoad = null
export function loadPortrait(src) {
  if (portraitLoad) return portraitLoad
  portraitLoad = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      portrait = img
      resolve(img)
    }
    img.onerror = () => resolve(null) // no photo is fine — the frame just stays empty
    img.src = src
  })
  return portraitLoad
}

// Draw the portrait cover-fitted into a framed box, graded toward the hologram's
// cyan and scanlined, so it reads as part of the projection rather than a sticker.
function drawPortrait(ctx, x, y, w, h) {
  ctx.save()
  roundRect(ctx, x, y, w, h, 12)
  ctx.clip()

  ctx.fillStyle = 'rgba(95, 230, 255, 0.08)'
  ctx.fillRect(x, y, w, h)

  if (portrait) {
    const k = Math.max(w / portrait.width, h / portrait.height) // cover
    const dw = portrait.width * k
    const dh = portrait.height * k
    ctx.drawImage(portrait, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)

    // cyan grade + a wash toward the bottom so the frame sits in the sheet
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(138, 214, 245, 0.7)'
    ctx.fillRect(x, y, w, h)
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = 'rgba(12, 62, 88, 0.16)' // just enough lift to sit on the sheet
    ctx.fillRect(x, y, w, h)
    ctx.globalCompositeOperation = 'source-over'

    // scanlines
    ctx.fillStyle = 'rgba(0, 18, 28, 0.11)'
    for (let sy = y; sy < y + h; sy += 4) ctx.fillRect(x, sy, w, 2)
  }
  ctx.restore()

  // frame + corner brackets
  roundRect(ctx, x, y, w, h, 12)
  ctx.strokeStyle = 'rgba(95, 230, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  glow(ctx, GLOW, 12)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 4
  const c = 26
  for (const [cx, cy, sx, sy] of [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ]) {
    ctx.beginPath()
    ctx.moveTo(cx + sx * c, cy)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx, cy + sy * c)
    ctx.stroke()
  }
  noGlow(ctx)
}

// ------------------------------------------------------------------ chrome
function drawFrame(ctx) {
  ctx.clearRect(0, 0, PAGE_W, PAGE_H)

  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, PAGE_W, PAGE_H)

  // faint engineering grid
  ctx.strokeStyle = 'rgba(95, 230, 255, 0.06)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0; x <= PAGE_W; x += 64) {
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, PAGE_H)
  }
  for (let y = 0; y <= PAGE_H; y += 64) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(PAGE_W, y + 0.5)
  }
  ctx.stroke()

  // border + corner brackets
  ctx.strokeStyle = 'rgba(95, 230, 255, 0.3)'
  ctx.lineWidth = 3
  ctx.strokeRect(16, 16, PAGE_W - 32, PAGE_H - 32)

  glow(ctx, GLOW, 18)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 5
  const c = 54
  for (const [cx, cy, sx, sy] of [
    [16, 16, 1, 1],
    [PAGE_W - 16, 16, -1, 1],
    [16, PAGE_H - 16, 1, -1],
    [PAGE_W - 16, PAGE_H - 16, -1, -1],
  ]) {
    ctx.beginPath()
    ctx.moveTo(cx + sx * c, cy)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx, cy + sy * c)
    ctx.stroke()
  }
  noGlow(ctx)
}

// The cover: photo on the left, name and contact on the right.
function drawCoverHeader(ctx, page, index, total) {
  const px = PAD
  const py = 108
  const pw = 236
  const ph = 295
  drawPortrait(ctx, px, py, pw, ph)

  const tx = px + pw + 40
  const tw = PAGE_W - PAD - tx
  let y = py + 52

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px'
  glow(ctx, GLOW, 22)
  ctx.font = font(600, 44)
  ctx.fillStyle = INK
  for (const line of wrap(ctx, CV_NAME.toUpperCase(), tw)) {
    ctx.fillText(line, tx, y)
    y += 50
  }
  noGlow(ctx)

  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
  ctx.font = font(500, 21)
  ctx.fillStyle = ACCENT
  for (const line of wrap(ctx, CV_ROLE.toUpperCase(), tw)) {
    ctx.fillText(line, tx, y + 4)
    y += 28
  }
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  y += 16
  hairline(ctx, tx, y, tx + 150, y, ACCENT)
  y += 30

  for (const [label, value] of page.contact ?? []) {
    ctx.font = font(600, 20)
    ctx.fillStyle = DIM
    ctx.fillText(label, tx, y)
    ctx.font = font(400, 20)
    ctx.fillStyle = INK
    ctx.fillText(value, tx + 108, y)
    y += 30
  }

  ctx.textAlign = 'right'
  ctx.font = font(500, 20)
  ctx.fillStyle = DIM
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, PAGE_W - PAD, py - 22)
  ctx.textAlign = 'left'

  return Math.max(py + ph, y) + 54
}

function drawHeader(ctx, page, index, total) {
  const maxW = PAGE_W - PAD * 2
  let y = 130

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'
  glow(ctx, GLOW, 22)
  ctx.font = font(600, 46)
  ctx.fillStyle = INK
  ctx.fillText(CV_NAME.toUpperCase(), PAD, y)
  noGlow(ctx)

  y += 36
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
  ctx.font = font(500, 22)
  ctx.fillStyle = DIM
  ctx.fillText(CV_ROLE.toUpperCase(), PAD, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  // header rule with a lit segment
  y += 30
  hairline(ctx, PAD, y, PAD + maxW, y, 'rgba(95, 230, 255, 0.35)')
  glow(ctx, GLOW, 14)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(PAD, y + 0.5)
  ctx.lineTo(PAD + 190, y + 0.5)
  ctx.stroke()
  noGlow(ctx)

  // section title + page counter
  y += 66
  glow(ctx, GLOW, 16)
  ctx.font = font(600, 36)
  ctx.fillStyle = ACCENT
  ctx.fillText(page.title, PAD, y)
  noGlow(ctx)

  ctx.textAlign = 'right'
  ctx.font = font(500, 24)
  ctx.fillStyle = DIM
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, PAGE_W - PAD, y)
  ctx.textAlign = 'left'

  return y + 46
}

function drawFooter(ctx, index, total) {
  const y = PAGE_H - 74
  hairline(ctx, PAD, y - 26, PAGE_W - PAD, y - 26, 'rgba(95, 230, 255, 0.22)')

  ctx.font = font(500, 21)
  ctx.fillStyle = DIM
  ctx.textAlign = 'left'
  ctx.fillText(CV_SITE, PAD, y)

  ctx.textAlign = 'right'
  ctx.fillText(`page ${index + 1} of ${total}`, PAGE_W - PAD, y)
  ctx.textAlign = 'left'
}

// ------------------------------------------------------------------ blocks
function drawEntry(ctx, b, y, maxW) {
  ctx.font = font(500, 23)
  ctx.fillStyle = DIM
  const metaW = b.meta ? ctx.measureText(b.meta).width + 24 : 0

  ctx.font = font(600, 28)
  ctx.fillStyle = INK
  const roleLines = wrap(ctx, b.role, maxW - metaW)
  let ry = y
  for (const l of roleLines) {
    ctx.fillText(l, PAD, ry)
    ry += 32
  }
  if (b.meta) {
    ctx.textAlign = 'right'
    ctx.font = font(500, 23)
    ctx.fillStyle = DIM
    ctx.fillText(b.meta, PAGE_W - PAD, y)
    ctx.textAlign = 'left'
  }
  y = ry + 4

  if (b.org) y = paragraph(ctx, b.org, PAD, y, maxW, { size: 23, weight: 500, colour: ACCENT, lh: 1.35 })

  for (const t of b.bullets ?? []) {
    ctx.font = font(500, 22)
    ctx.fillStyle = ACCENT
    ctx.fillText('▸', PAD + 4, y + 4)
    y = paragraph(ctx, t, PAD + 30, y + 4, maxW - 30, { size: 22, weight: 400, colour: INK, lh: 1.38 })
  }
  return y + 18
}

function drawRow(ctx, b, y, maxW) {
  ctx.font = font(600, 23)
  ctx.fillStyle = ACCENT
  ctx.fillText(b.label, PAD, y)
  const labelW = ctx.measureText(b.label).width + 22
  // Short values sit on the same line as their label; long ones wrap underneath.
  ctx.font = font(400, 23)
  if (labelW + ctx.measureText(b.value).width <= maxW) {
    ctx.fillStyle = INK
    ctx.fillText(b.value, PAD + labelW, y)
    return y + 40
  }
  const end = paragraph(ctx, b.value, PAD + 22, y + 32, maxW - 22, {
    size: 23,
    weight: 400,
    colour: INK,
    lh: 1.4,
  })
  return end + 12
}

function drawNote(ctx, b, y, maxW) {
  const start = y
  const end = paragraph(ctx, b.text, PAD + 26, y + 6, maxW - 34, {
    size: 22,
    weight: 400,
    colour: DIM,
    lh: 1.42,
  })
  glow(ctx, GLOW, 10)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(PAD + 2, start - 16)
  ctx.lineTo(PAD + 2, end - 18)
  ctx.stroke()
  noGlow(ctx)
  return end + 22
}

// A row of headline numbers. These are counts, not a chart — a number IS the
// right form for a single value, so no one-bar bar charts here.
function drawStats(ctx, b, y, maxW) {
  const items = b.items
  const gap = 18
  const w = (maxW - gap * (items.length - 1)) / items.length
  items.forEach((it, i) => {
    const x = PAD + i * (w + gap)
    hairline(ctx, x, y - 4, x + w, y - 4, 'rgba(95, 230, 255, 0.35)')
    glow(ctx, GLOW, 14)
    ctx.font = font(600, 46)
    ctx.fillStyle = INK
    ctx.fillText(it.value, x, y + 50)
    noGlow(ctx)
    ctx.font = font(500, 17)
    ctx.fillStyle = DIM
    let ly = y + 78
    for (const line of wrap(ctx, it.label, w)) {
      ctx.fillText(line, x, ly)
      ly += 21
    }
  })
  const labelLines = Math.max(...items.map((it) => {
    ctx.font = font(500, 17)
    return wrap(ctx, it.label, w).length
  }))
  return y + 78 + labelLines * 21 + 40
}

// Horizontal bars, one hue, value at the tip — no value axis needed.
const BAR_H = 16
function drawBars(ctx, b, y, maxW) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, PAD, cy) + 12

  const items = b.items
  const max = Math.max(...items.map((i) => i.value))
  ctx.font = font(500, 21)
  const labelW = Math.min(300, Math.max(...items.map((i) => ctx.measureText(i.label).width)) + 22)
  const valueW = 54
  const plotW = maxW - labelW - valueW
  const rowH = 38

  for (const it of items) {
    const bx = PAD + labelW
    const by = cy + (rowH - BAR_H) / 2
    const w = Math.max(3, (it.value / max) * plotW)

    ctx.font = font(500, 21)
    ctx.fillStyle = INK
    ctx.fillText(it.label, PAD, cy + rowH / 2 + 7)

    // track, then the bar: square where it starts, rounded at the data end
    roundRect(ctx, bx, by, plotW, BAR_H, 3)
    ctx.fillStyle = TRACK
    ctx.fill()
    roundRect(ctx, bx, by, w, BAR_H, [0, 4, 4, 0])
    ctx.fillStyle = ACCENT
    ctx.fill()

    ctx.font = font(600, 21)
    ctx.fillStyle = DIM
    ctx.fillText(String(it.display ?? it.value), bx + plotW + 16, cy + rowH / 2 + 7)
    cy += rowH
  }
  if (b.note) {
    ctx.font = font(400, 17)
    ctx.fillStyle = DIM
    ctx.fillText(b.note, PAD, cy + 18)
    cy += 24
  }
  return cy + 18
}

// A Gantt of real date ranges — the one genuinely quantitative thing on a CV.
// `from` / `to` are decimal years (2025.75 = Oct 2025); `to: null` = ongoing.
function drawTimeline(ctx, b, y, maxW) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, PAD, cy) + 14

  const rows = b.items
  // `from` / `to` can be pinned on the block so two stacked timelines share one
  // scale — a bar means the same width on both, which is the point of a Gantt.
  const from = b.from ?? Math.floor(Math.min(...rows.map((r) => r.from)))
  const to = b.to ?? Math.ceil(Math.max(...rows.map((r) => r.to ?? b.now ?? from + 1)))
  ctx.font = font(500, 20)
  const labelW = Math.min(340, Math.max(...rows.map((r) => ctx.measureText(r.label).width)) + 20)
  const plotX = PAD + labelW
  const plotW = maxW - labelW
  const span = to - from
  const at = (yr) => plotX + ((yr - from) / span) * plotW

  // year axis along the top, hairline ticks running the full height
  const rowH = 40
  const height = rows.length * rowH + 8
  ctx.font = font(500, 17)
  ctx.fillStyle = DIM
  ctx.textAlign = 'center'
  for (let yr = from; yr <= to; yr++) {
    const x = at(yr)
    ctx.fillText(String(yr), Math.min(x, PAGE_W - PAD - 14), cy - 6)
    hairline(ctx, x, cy + 4, x, cy + height, GRID)
  }
  ctx.textAlign = 'left'

  let ry = cy + 12
  const barH = 14
  for (const r of rows) {
    const x1 = at(r.from)
    const x2 = at(r.to ?? b.now ?? to)
    ctx.font = font(500, 20)
    ctx.fillStyle = INK
    ctx.fillText(r.label, PAD, ry + barH + 4)

    // an interval has two data ends, so both are rounded
    roundRect(ctx, x1, ry + 2, Math.max(6, x2 - x1), barH, barH / 2)
    ctx.fillStyle = ACCENT
    ctx.fill()
    // still going: a soft tail past the bar's end
    if (r.to == null) {
      const g = ctx.createLinearGradient(x2, 0, Math.min(x2 + 34, plotX + plotW), 0)
      g.addColorStop(0, ACCENT)
      g.addColorStop(1, 'rgba(95, 230, 255, 0)')
      roundRect(ctx, x2 - 2, ry + 2, 36, barH, barH / 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    ry += rowH
  }
  return cy + height + 26
}

// Language level on the real CEFR scale — a meter against a named limit, so the
// "how much" is an actual published scale rather than a made-up percentage.
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
function drawLevels(ctx, b, y, maxW) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, PAD, cy) + 14

  ctx.font = font(600, 22)
  const labelW = Math.max(...b.items.map((i) => ctx.measureText(i.label).width)) + 26
  const x0 = PAD + labelW
  const w = maxW - labelW - 210
  const seg = (w - 5 * 4) / 6 // 6 steps with a 4px surface gap between them

  for (const it of b.items) {
    ctx.font = font(600, 22)
    ctx.fillStyle = INK
    ctx.fillText(it.label, PAD, cy + 22)

    for (let i = 0; i < 6; i++) {
      const x = x0 + i * (seg + 4)
      roundRect(ctx, x, cy + 8, seg, 16, 3)
      ctx.fillStyle = i < it.level ? ACCENT : TRACK
      ctx.fill()
      ctx.font = font(500, 14)
      ctx.fillStyle = DIM
      ctx.textAlign = 'center'
      ctx.fillText(CEFR[i], x + seg / 2, cy + 44)
      ctx.textAlign = 'left'
    }
    ctx.font = font(500, 20)
    ctx.fillStyle = DIM
    ctx.fillText(it.caption, x0 + w + 18, cy + 24)
    cy += 66
  }
  return cy + 8
}

// The classic CV proficiency bars. Self-assessed, and the page says so.
function drawMeters(ctx, b, y, maxW) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, PAD, cy) + 12

  ctx.font = font(500, 22)
  const labelW = Math.min(330, Math.max(...b.items.map((i) => ctx.measureText(i.label).width)) + 24)
  const x0 = PAD + labelW
  const w = maxW - labelW - 60
  const rowH = 42

  for (const it of b.items) {
    ctx.font = font(500, 22)
    ctx.fillStyle = INK
    ctx.fillText(it.label, PAD, cy + 24)

    roundRect(ctx, x0, cy + 9, w, BAR_H, 3)
    ctx.fillStyle = TRACK
    ctx.fill()
    roundRect(ctx, x0, cy + 9, Math.max(6, (it.value / 100) * w), BAR_H, [0, 4, 4, 0])
    ctx.fillStyle = ACCENT
    ctx.fill()
    cy += rowH
  }
  if (b.note) {
    ctx.font = font(400, 17)
    ctx.fillStyle = DIM
    ctx.fillText(b.note, PAD, cy + 16)
    cy += 26
  }
  return cy + 26
}

// Tool names as chips, grouped by what they're for. `core` chips read brighter —
// emphasis, so the eye lands on what she actually leads with.
function drawChips(ctx, b, y, maxW) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, PAD, cy) + 10

  for (const group of b.groups) {
    // a single unlabelled group (the cover's "what I work on") skips the heading
    if (group.label) {
      ctx.font = font(600, 20)
      ctx.fillStyle = ACCENT
      ctx.fillText(group.label, PAD, cy + 16)
      cy += 30
    }

    let x = PAD
    const h = 32
    for (const item of group.items) {
      const name = typeof item === 'string' ? item : item.name
      const core = typeof item === 'object' && item.core
      ctx.font = font(core ? 600 : 400, 19)
      const w = ctx.measureText(name).width + 26
      if (x + w > PAD + maxW) {
        x = PAD
        cy += h + 8
      }
      roundRect(ctx, x, cy, w, h, 16)
      ctx.fillStyle = core ? 'rgba(95, 230, 255, 0.22)' : 'rgba(95, 230, 255, 0.07)'
      ctx.fill()
      ctx.strokeStyle = core ? 'rgba(95, 230, 255, 0.75)' : 'rgba(95, 230, 255, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = core ? INK : DIM
      ctx.fillText(name, x + 13, cy + 21)
      x += w + 8
    }
    cy += h + 22
  }
  return cy
}

// ------------------------------------------------------------------ page
const BLOCKS = {
  entry: drawEntry,
  row: drawRow,
  note: drawNote,
  stats: drawStats,
  bars: drawBars,
  timeline: drawTimeline,
  levels: drawLevels,
  meters: drawMeters,
  chips: drawChips,
}

export function drawPage(ctx, pages, index) {
  const page = pages[index]
  const maxW = PAGE_W - PAD * 2
  drawFrame(ctx)
  let y = page.cover ? drawCoverHeader(ctx, page, index, pages.length) : drawHeader(ctx, page, index, pages.length)

  for (const b of page.blocks) {
    if (b.kind === 'lead') {
      y = paragraph(ctx, b.text, PAD, y, maxW, { size: 26, weight: 400, colour: INK, lh: 1.5 })
      y += 20
    } else {
      const draw = BLOCKS[b.kind]
      if (draw) y = draw(ctx, b, y, maxW)
    }
  }

  drawFooter(ctx, index, pages.length)

  if (import.meta.env.DEV && y > PAGE_H - 110) {
    console.warn(`[cv] page ${index + 1} ("${page.title}") overflows: ${Math.round(y)} > ${PAGE_H - 110}`)
  }
}
