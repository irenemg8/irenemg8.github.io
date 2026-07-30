// Draws one CV page onto a 2D canvas, which the hologram sheet uses as its
// texture.
//
// LAYOUT. Every block renderer has the same shape — (ctx, block, y, x, w) →
// next y — so a block doesn't know or care how wide it is. That's what makes
// the `columns` block possible: it hands its children half the width and runs
// them side by side. Blocks stack from a single y cursor, so adding one to
// `cvContent.js` just pushes the rest down; there are no coordinates to keep in
// sync anywhere.
//
// TYPE & SPACE. Everything picks a step from the T (type) and S (space) scales
// below. If something needs a size that isn't in there, the answer is almost
// always the nearest step, not a new number — that's what keeps eleven kinds of
// block looking like one document.
//
// CHARTS. Rules worth not breaking:
//  · one hue for every mark — bar length already encodes the value, so shading
//    bars by size would say the same thing twice
//  · bars ≤ 24px thick, 4px rounded data-end, square at the baseline
//  · gridlines are solid hairlines one step off the surface, never dashed
//  · values ride the tip of their own bar, so no value axis is needed
//  · anything self-assessed says so on the page

import { CV_NAME, CV_ROLE, CV_SITE } from './cvContent.js'

export const PAGE_W = 1024
export const PAGE_H = 1448 // A4-ish portrait (1 : √2)

const PAD = 60 // page margin
const COL_GAP = 34 // gutter between columns

// Colours. The sheet is monochrome by design — it's a hologram — so magnitude
// is carried by length, and emphasis by brightness.
const INK = '#e4fbff' // body text
const ACCENT = '#5fe6ff' // headings, rules, and every data mark
const DIM = '#8dc3d6' // dates, captions, secondary text
const PAPER = 'rgba(3, 27, 40, 0.72)' // the "sheet" itself
const GLOW = 'rgba(95, 230, 255, 0.55)'
const TRACK = 'rgba(95, 230, 255, 0.14)' // the unfilled part of a meter
const GRID = 'rgba(95, 230, 255, 0.15)' // hairline gridlines
const PANEL = 'rgba(95, 230, 255, 0.05)' // card fill
const PANEL_EDGE = 'rgba(95, 230, 255, 0.18)'

// Type scale — [weight, size].
const T = {
  name: [600, 42],
  role: [500, 20],
  title: [600, 34],
  cap: [700, 17], // small-caps section caption
  h: [600, 23], // card / entry heading
  org: [500, 19],
  meta: [500, 18],
  body: [400, 21],
  small: [400, 16],
  stat: [600, 44],
  chip: [400, 18],
}
// Space scale.
const S = { xs: 4, sm: 8, md: 16, lg: 24, xl: 34, xxl: 48 }

const font = ([weight, size]) => `${weight} ${size}px 'Inter', system-ui, -apple-system, sans-serif`
const sizeOf = (t) => t[1]

// ------------------------------------------------------------------- basics
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

function glow(ctx, colour = GLOW, blur = 14) {
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

function hairline(ctx, x1, y1, x2, y2, colour = GRID, width = 1) {
  ctx.strokeStyle = colour
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, Math.round(y1) + 0.5)
  ctx.lineTo(x2, Math.round(y1) === Math.round(y2) ? Math.round(y1) + 0.5 : y2)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

// A run of text laid out from (x, y), returning the y just past it.
function paragraph(ctx, text, x, y, maxW, { t = T.body, colour = INK, lh = 1.45 } = {}) {
  ctx.font = font(t)
  ctx.fillStyle = colour
  for (const l of wrap(ctx, text, maxW)) {
    ctx.fillText(l, x, y)
    y += sizeOf(t) * lh
  }
  return y
}
const measureLines = (ctx, text, maxW, t) => {
  ctx.font = font(t)
  return wrap(ctx, text, maxW).length
}

// Small-caps label above a chart or group, with a hairline rule under it.
// Carries its own space ABOVE, because a block is handed the y where the last
// one stopped — without this every caption would sit on the previous block's
// last line.
function caption(ctx, text, x, y, w) {
  const cy = y + S.lg
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px'
  ctx.font = font(T.cap)
  ctx.fillStyle = ACCENT
  ctx.fillText(String(text).toUpperCase(), x, cy)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  hairline(ctx, x, cy + 10, x + w, cy + 10, 'rgba(95, 230, 255, 0.2)')
  return cy + S.lg
}

// ------------------------------------------------------------------ portrait
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
    img.onerror = () => resolve(null) // no photo is fine — the frame stays empty
    img.src = src
  })
  return portraitLoad
}

// Cover-fitted into a framed box, graded toward the hologram's cyan and
// scanlined, so it reads as part of the projection rather than a sticker.
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

    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(138, 214, 245, 0.7)'
    ctx.fillRect(x, y, w, h)
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = 'rgba(12, 62, 88, 0.16)'
    ctx.fillRect(x, y, w, h)
    ctx.globalCompositeOperation = 'source-over'

    ctx.fillStyle = 'rgba(0, 18, 28, 0.11)'
    for (let sy = y; sy < y + h; sy += 4) ctx.fillRect(x, sy, w, 2)
  }
  ctx.restore()

  roundRect(ctx, x, y, w, h, 12)
  ctx.strokeStyle = 'rgba(95, 230, 255, 0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  glow(ctx, GLOW, 12)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 4
  const c = 24
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

  ctx.strokeStyle = 'rgba(95, 230, 255, 0.055)'
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

  ctx.strokeStyle = 'rgba(95, 230, 255, 0.28)'
  ctx.lineWidth = 3
  ctx.strokeRect(16, 16, PAGE_W - 32, PAGE_H - 32)

  glow(ctx, GLOW, 18)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 5
  const c = 52
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
  const py = 92
  const pw = 252
  const ph = 315
  drawPortrait(ctx, px, py, pw, ph)

  const tx = px + pw + S.xl
  const tw = PAGE_W - PAD - tx
  let y = py + 52

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px'
  glow(ctx, GLOW, 22)
  ctx.font = font(T.name)
  ctx.fillStyle = INK
  for (const line of wrap(ctx, CV_NAME.toUpperCase(), tw)) {
    ctx.fillText(line, tx, y)
    y += 48
  }
  noGlow(ctx)

  if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'
  ctx.font = font(T.role)
  ctx.fillStyle = ACCENT
  for (const line of wrap(ctx, CV_ROLE.toUpperCase(), tw)) {
    ctx.fillText(line, tx, y + S.xs)
    y += 27
  }
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  y += S.md
  hairline(ctx, tx, y, tx + 140, y, ACCENT, 3)
  y += S.xl

  for (const [label, value] of page.contact ?? []) {
    ctx.font = font([600, 18])
    ctx.fillStyle = DIM
    ctx.fillText(label, tx, y)
    ctx.font = font([400, 18])
    ctx.fillStyle = INK
    // URLs are stored in full so they stay copy-pasteable; the sheet shows the
    // readable half.
    ctx.fillText(String(value).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), tx + 104, y)
    y += 29
  }

  ctx.textAlign = 'right'
  ctx.font = font(T.meta)
  ctx.fillStyle = DIM
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, PAGE_W - PAD, py - 20)
  ctx.textAlign = 'left'

  return Math.max(py + ph, y) + S.xl
}

function drawHeader(ctx, page, index, total) {
  const maxW = PAGE_W - PAD * 2
  let y = 108

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px'
  ctx.font = font([600, 26])
  ctx.fillStyle = DIM
  ctx.fillText(CV_NAME.toUpperCase(), PAD, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  y += S.lg
  hairline(ctx, PAD, y, PAD + maxW, y, 'rgba(95, 230, 255, 0.3)')
  glow(ctx, GLOW, 14)
  hairline(ctx, PAD, y, PAD + 160, y, ACCENT, 4)
  noGlow(ctx)

  y += S.xxl
  glow(ctx, GLOW, 16)
  ctx.font = font(T.title)
  ctx.fillStyle = ACCENT
  ctx.fillText(page.title, PAD, y)
  noGlow(ctx)

  ctx.textAlign = 'right'
  ctx.font = font(T.meta)
  ctx.fillStyle = DIM
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, PAGE_W - PAD, y)
  ctx.textAlign = 'left'

  return y + S.xxl
}

function drawFooter(ctx, index, total) {
  const y = PAGE_H - 62
  hairline(ctx, PAD, y - 22, PAGE_W - PAD, y - 22, 'rgba(95, 230, 255, 0.2)')
  ctx.font = font(T.small)
  ctx.fillStyle = DIM
  ctx.textAlign = 'left'
  ctx.fillText(CV_SITE, PAD, y)
  ctx.textAlign = 'right'
  ctx.fillText(`page ${index + 1} of ${total}`, PAGE_W - PAD, y)
  ctx.textAlign = 'left'
}

// ------------------------------------------------------------------ blocks
function drawLead(ctx, b, y, x, w) {
  return paragraph(ctx, b.text, x, y, w, { t: [400, 24], lh: 1.52 }) + S.lg
}

function drawNote(ctx, b, y, x, w) {
  const start = y + S.lg // its own clearance, same as a caption's
  const end = paragraph(ctx, b.text, x + S.lg, start, w - S.lg, { t: T.small, colour: DIM, lh: 1.4 })
  glow(ctx, GLOW, 10)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x + 2, start - 16)
  ctx.lineTo(x + 2, end - 14)
  ctx.stroke()
  noGlow(ctx)
  return end + S.md
}

function drawRow(ctx, b, y0, x, w) {
  const y = y0 + S.lg // its own clearance, same as a caption's
  ctx.font = font([600, 20])
  ctx.fillStyle = ACCENT
  ctx.fillText(b.label, x, y)
  const labelW = ctx.measureText(b.label).width + S.md
  ctx.font = font([400, 20])
  if (labelW + ctx.measureText(b.value).width <= w) {
    ctx.fillStyle = INK
    ctx.fillText(b.value, x + labelW, y)
    return y + S.xl
  }
  return paragraph(ctx, b.value, x + S.md, y + 28, w - S.md, { t: [400, 20], lh: 1.4 }) + S.sm
}

// A full entry with bullets — for the one or two things worth the room.
function drawEntry(ctx, b, y, x, w) {
  ctx.font = font(T.meta)
  const metaW = b.meta ? ctx.measureText(b.meta).width + S.lg : 0

  ctx.font = font([600, 25])
  ctx.fillStyle = INK
  let ry = y
  for (const l of wrap(ctx, b.role, w - metaW)) {
    ctx.fillText(l, x, ry)
    ry += 30
  }
  if (b.meta) {
    ctx.textAlign = 'right'
    ctx.font = font(T.meta)
    ctx.fillStyle = DIM
    ctx.fillText(b.meta, x + w, y)
    ctx.textAlign = 'left'
  }
  y = ry + 2
  if (b.org) y = paragraph(ctx, b.org, x, y, w, { t: T.org, colour: ACCENT, lh: 1.3 })

  for (const t of b.bullets ?? []) {
    ctx.font = font([500, 20])
    ctx.fillStyle = ACCENT
    ctx.fillText('▸', x + 2, y + S.xs)
    y = paragraph(ctx, t, x + 26, y + S.xs, w - 26, { t: [400, 20], lh: 1.38 })
  }
  return y + S.md
}

// A grid of compact cards — the workhorse. Cards in a row share the tallest
// height so the grid stays on a baseline instead of ragging.
// The date sits on its own line above the title rather than beside it: in a
// half-width card a right-aligned date squeezes the title into three ragged
// lines, and — worse — the height measured here disagreed with the width the
// title was actually wrapped to, so long cards overflowed their own panel.
// Both now measure and draw against the same `inner`.
const CARD_TOP = S.sm + 16 // top padding to the first baseline
const CARD_BOT = 14
const CARD_TITLE = 27
const CARD_ORG_LH = 1.32
const CARD_TEXT = [400, 18]
const CARD_TEXT_LH = 1.33

// Width the title actually gets, once the date has taken its corner.
function cardTitleWidth(ctx, it, inner) {
  if (!it.meta) return inner
  ctx.font = font([500, 16])
  return Math.max(inner * 0.5, inner - (ctx.measureText(it.meta).width + 20))
}

function cardHeight(ctx, it, w) {
  const inner = w - S.lg * 2
  let h = CARD_TOP
  h += measureLines(ctx, it.title, cardTitleWidth(ctx, it, inner), T.h) * CARD_TITLE
  if (it.org) h += measureLines(ctx, it.org, inner, T.org) * sizeOf(T.org) * CARD_ORG_LH
  if (it.text) h += S.sm + measureLines(ctx, it.text, inner, CARD_TEXT) * sizeOf(CARD_TEXT) * CARD_TEXT_LH
  return h + CARD_BOT
}

function drawCard(ctx, it, y, x, w, h) {
  roundRect(ctx, x, y, w, h, 12)
  ctx.fillStyle = PANEL
  ctx.fill()
  ctx.strokeStyle = PANEL_EDGE
  ctx.lineWidth = 1
  ctx.stroke()

  // a lit tick on the left edge — the only ink that isn't type
  glow(ctx, GLOW, 8)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x + 1.5, y + S.md)
  ctx.lineTo(x + 1.5, y + h - S.md)
  ctx.stroke()
  noGlow(ctx)

  const ix = x + S.lg
  const inner = w - S.lg * 2
  let cy = y + CARD_TOP

  if (it.meta) {
    ctx.textAlign = 'right'
    ctx.font = font([500, 16])
    ctx.fillStyle = DIM
    ctx.fillText(it.meta, x + w - S.md, cy - 2)
    ctx.textAlign = 'left'
  }
  const titleW = cardTitleWidth(ctx, it, inner)
  ctx.font = font(T.h)
  ctx.fillStyle = INK
  for (const l of wrap(ctx, it.title, titleW)) {
    ctx.fillText(l, ix, cy)
    cy += CARD_TITLE
  }
  if (it.org) cy = paragraph(ctx, it.org, ix, cy, inner, { t: T.org, colour: ACCENT, lh: CARD_ORG_LH })
  if (it.text) paragraph(ctx, it.text, ix, cy + S.sm, inner, { t: CARD_TEXT, colour: DIM, lh: CARD_TEXT_LH })
}

function drawCards(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w)
  const cols = b.cols ?? 2
  const cw = (w - COL_GAP * (cols - 1)) / cols
  for (let i = 0; i < b.items.length; i += cols) {
    const row = b.items.slice(i, i + cols)
    const h = Math.max(...row.map((it) => cardHeight(ctx, it, cw)))
    row.forEach((it, j) => drawCard(ctx, it, cy, x + j * (cw + COL_GAP), cw, h))
    cy += h + S.sm + S.xs
  }
  return cy + S.xs
}

// A row of headline numbers. A number IS the right form for a single value —
// no one-bar bar charts.
function drawStats(ctx, b, y, x, w) {
  const items = b.items
  const cw = (w - S.md * (items.length - 1)) / items.length
  let labelLines = 1
  items.forEach((it, i) => {
    const cx = x + i * (cw + S.md)
    hairline(ctx, cx, y - 2, cx + cw, y - 2, 'rgba(95, 230, 255, 0.35)', 2)
    glow(ctx, GLOW, 14)
    ctx.font = font(T.stat)
    ctx.fillStyle = INK
    ctx.fillText(it.value, cx, y + 50)
    noGlow(ctx)
    ctx.font = font([500, 16])
    ctx.fillStyle = DIM
    const lines = wrap(ctx, it.label, cw)
    labelLines = Math.max(labelLines, lines.length)
    let ly = y + 76
    for (const l of lines) {
      ctx.fillText(l, cx, ly)
      ly += 20
    }
  })
  return y + 76 + labelLines * 20 + S.lg
}

// Horizontal bars, one hue, value at the tip — no value axis needed.
const BAR_H = 15
function drawBars(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w)

  const items = b.items
  const max = Math.max(...items.map((i) => i.value))
  ctx.font = font([500, 19])
  const labelW = Math.min(w * 0.42, Math.max(...items.map((i) => ctx.measureText(i.label).width)) + S.md)
  const valueW = 40
  const plotW = w - labelW - valueW
  const rowH = 32

  for (const it of items) {
    const bx = x + labelW
    const by = cy + (rowH - BAR_H) / 2
    ctx.font = font([500, 19])
    ctx.fillStyle = INK
    ctx.fillText(it.label, x, cy + rowH / 2 + 6)

    roundRect(ctx, bx, by, plotW, BAR_H, 3)
    ctx.fillStyle = TRACK
    ctx.fill()
    roundRect(ctx, bx, by, Math.max(3, (it.value / max) * plotW), BAR_H, [0, 4, 4, 0])
    ctx.fillStyle = ACCENT
    ctx.fill()

    ctx.font = font([600, 19])
    ctx.fillStyle = DIM
    ctx.fillText(String(it.display ?? it.value), bx + plotW + S.sm + 4, cy + rowH / 2 + 6)
    cy += rowH
  }
  if (b.note) {
    ctx.font = font([400, 15])
    ctx.fillStyle = DIM
    for (const l of wrap(ctx, b.note, w)) {
      cy += 20
      ctx.fillText(l, x, cy)
    }
    cy += S.sm
  }
  return cy + S.md
}

// A Gantt of real date ranges — the one genuinely quantitative thing on a CV.
// `from` / `to` are decimal years; `to: null` = ongoing.
function drawTimeline(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w) + S.sm

  const rows = b.items
  const from = b.from ?? Math.floor(Math.min(...rows.map((r) => r.from)))
  const to = b.to ?? Math.ceil(Math.max(...rows.map((r) => r.to ?? b.now ?? from + 1)))
  ctx.font = font([500, 19])
  const labelW = Math.min(w * 0.36, Math.max(...rows.map((r) => ctx.measureText(r.label).width)) + S.md)
  const plotX = x + labelW
  const plotW = w - labelW
  const span = to - from
  const at = (yr) => plotX + ((yr - from) / span) * plotW

  const rowH = 30
  const height = rows.length * rowH + S.sm
  ctx.font = font([500, 15])
  ctx.fillStyle = DIM
  ctx.textAlign = 'center'
  for (let yr = from; yr <= to; yr++) {
    const tx = at(yr)
    ctx.fillText(String(yr), Math.min(tx, x + w - 12), cy - 8)
    hairline(ctx, tx, cy, tx, cy + height, GRID)
  }
  ctx.textAlign = 'left'

  let ry = cy + S.sm
  const barH = 13
  for (const r of rows) {
    const x1 = at(r.from)
    const x2 = at(r.to ?? b.now ?? to)
    ctx.font = font([500, 19])
    ctx.fillStyle = INK
    ctx.fillText(r.label, x, ry + barH + 3)

    roundRect(ctx, x1, ry + 2, Math.max(6, x2 - x1), barH, barH / 2) // an interval: both ends rounded
    ctx.fillStyle = ACCENT
    ctx.fill()
    if (r.to == null) {
      const g = ctx.createLinearGradient(x2, 0, Math.min(x2 + 32, plotX + plotW), 0)
      g.addColorStop(0, ACCENT)
      g.addColorStop(1, 'rgba(95, 230, 255, 0)')
      roundRect(ctx, x2 - 2, ry + 2, 34, barH, barH / 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    ry += rowH
  }
  return cy + height + S.lg
}

// Milestones down a lit spine — a different shape from the Gantt, and the right
// one for things that happen at a moment rather than over a stretch.
function drawSpine(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w) + S.sm

  const sx = x + 7
  const top = cy + 4
  const gaps = []
  ctx.font = font([600, 20])
  for (const it of b.items) {
    let h = 26
    if (it.org) h += measureLines(ctx, it.org, w - 40, T.org) * 24
    gaps.push(h + S.md)
  }
  const total = gaps.reduce((a, g) => a + g, 0)

  ctx.strokeStyle = 'rgba(95, 230, 255, 0.28)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sx, top)
  ctx.lineTo(sx, top + total - S.md)
  ctx.stroke()

  b.items.forEach((it, i) => {
    // dot: filled, with a surface ring so it reads over the spine
    ctx.beginPath()
    ctx.arc(sx, cy + 12, 6.5, 0, Math.PI * 2)
    ctx.fillStyle = PAPER
    ctx.fill()
    glow(ctx, GLOW, 10)
    ctx.beginPath()
    ctx.arc(sx, cy + 12, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = ACCENT
    ctx.fill()
    noGlow(ctx)

    const tx = x + 30
    const tw = w - 30
    if (it.meta) {
      ctx.textAlign = 'right'
      ctx.font = font([500, 16])
      ctx.fillStyle = DIM
      ctx.fillText(it.meta, x + w, cy + 16)
      ctx.textAlign = 'left'
    }
    ctx.font = font([600, 20])
    ctx.fillStyle = INK
    const titleW = it.meta ? tw - (ctx.measureText(it.meta).width + 24) : tw
    ctx.fillText(wrap(ctx, it.title, titleW)[0], tx, cy + 18)
    if (it.org) paragraph(ctx, it.org, tx, cy + 42, tw, { t: T.org, colour: DIM, lh: 1.3 })
    cy += gaps[i]
  })
  return cy + S.sm
}

// Language level on the real CEFR scale — a meter against a published limit,
// rather than a made-up percentage.
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
function drawLevels(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w) + S.sm

  for (const it of b.items) {
    ctx.font = font([600, 20])
    ctx.fillStyle = INK
    ctx.fillText(it.label, x, cy + 16)
    ctx.textAlign = 'right'
    ctx.font = font([500, 17])
    ctx.fillStyle = DIM
    ctx.fillText(it.caption, x + w, cy + 16)
    ctx.textAlign = 'left'

    const seg = (w - 5 * 4) / 6 // six steps, 4px surface gap between them
    for (let i = 0; i < 6; i++) {
      const bx = x + i * (seg + 4)
      roundRect(ctx, bx, cy + 28, seg, 14, 3)
      ctx.fillStyle = i < it.level ? ACCENT : TRACK
      ctx.fill()
      ctx.font = font([500, 13])
      ctx.fillStyle = DIM
      ctx.textAlign = 'center'
      ctx.fillText(CEFR[i], bx + seg / 2, cy + 60)
      ctx.textAlign = 'left'
    }
    cy += 78
  }
  return cy
}

// The classic CV proficiency bars. Self-assessed, and the page says so.
function drawMeters(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w) + S.sm

  ctx.font = font([500, 19])
  const labelW = Math.min(w * 0.5, Math.max(...b.items.map((i) => ctx.measureText(i.label).width)) + S.md)
  const x0 = x + labelW
  const bw = w - labelW
  const rowH = 31

  for (const it of b.items) {
    ctx.font = font([500, 19])
    ctx.fillStyle = INK
    ctx.fillText(it.label, x, cy + 20)
    roundRect(ctx, x0, cy + 7, bw, BAR_H, 3)
    ctx.fillStyle = TRACK
    ctx.fill()
    roundRect(ctx, x0, cy + 7, Math.max(6, (it.value / 100) * bw), BAR_H, [0, 4, 4, 0])
    ctx.fillStyle = ACCENT
    ctx.fill()
    cy += rowH
  }
  if (b.note) {
    ctx.font = font([400, 15])
    ctx.fillStyle = DIM
    for (const l of wrap(ctx, b.note, w)) {
      cy += 19
      ctx.fillText(l, x, cy)
    }
  }
  return cy + S.lg
}

// Tool names as chips, grouped by what they're for. `core` chips read brighter —
// emphasis, so the eye lands on what she leads with.
function drawChips(ctx, b, y, x, w) {
  let cy = y
  if (b.caption) cy = caption(ctx, b.caption, x, cy, w) + S.xs

  for (const group of b.groups) {
    if (group.label) {
      ctx.font = font([600, 18])
      ctx.fillStyle = ACCENT
      ctx.fillText(group.label, x, cy + 14)
      cy += 26
    }
    let cx = x
    const h = 28
    for (const item of group.items) {
      const name = typeof item === 'string' ? item : item.name
      const core = typeof item === 'object' && item.core
      ctx.font = font(core ? [600, 18] : T.chip)
      const cwid = ctx.measureText(name).width + S.lg
      if (cx + cwid > x + w) {
        cx = x
        cy += h + 6
      }
      roundRect(ctx, cx, cy, cwid, h, 15)
      ctx.fillStyle = core ? 'rgba(95, 230, 255, 0.22)' : 'rgba(95, 230, 255, 0.07)'
      ctx.fill()
      ctx.strokeStyle = core ? 'rgba(95, 230, 255, 0.7)' : 'rgba(95, 230, 255, 0.22)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = core ? INK : DIM
      ctx.fillText(name, cx + 12, cy + 19)
      cx += cwid + 6
    }
    cy += h + S.md
  }
  return cy
}

// Two stacks side by side. This is what buys the page count back: a column of
// cards next to a column of charts holds about twice what one column does.
function drawColumns(ctx, b, y, x, w) {
  const ratio = b.ratio ?? 0.5
  const lw = Math.round((w - COL_GAP) * ratio)
  const rw = w - COL_GAP - lw
  let ly = y
  for (const child of b.left ?? []) ly = drawBlock(ctx, child, ly, x, lw)
  let ry = y
  for (const child of b.right ?? []) ry = drawBlock(ctx, child, ry, x + lw + COL_GAP, rw)
  return Math.max(ly, ry)
}

// ------------------------------------------------------------------ page
const BLOCKS = {
  lead: drawLead,
  entry: drawEntry,
  row: drawRow,
  note: drawNote,
  cards: drawCards,
  stats: drawStats,
  bars: drawBars,
  timeline: drawTimeline,
  spine: drawSpine,
  levels: drawLevels,
  meters: drawMeters,
  chips: drawChips,
  columns: drawColumns,
}

function drawBlock(ctx, b, y, x, w) {
  const draw = BLOCKS[b.kind]
  return draw ? draw(ctx, b, y, x, w) : y
}

export function drawPage(ctx, pages, index) {
  const page = pages[index]
  const w = PAGE_W - PAD * 2
  drawFrame(ctx)
  let y = page.cover ? drawCoverHeader(ctx, page, index, pages.length) : drawHeader(ctx, page, index, pages.length)
  for (const b of page.blocks) y = drawBlock(ctx, b, y, PAD, w)
  drawFooter(ctx, index, pages.length)

  if (import.meta.env.DEV && y > PAGE_H - 100) {
    console.warn(`[cv] page ${index + 1} ("${page.title}") overflows: ${Math.round(y)} > ${PAGE_H - 100}`)
  }
}
