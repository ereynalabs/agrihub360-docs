#!/usr/bin/env node
// The language floor for the guides. Fails the build on what a reader would
// notice: an em-dash, a How Do I page missing one of its parts, a sentence
// over thirty words on a task page. Warns on a sentence over twenty. Run: node scripts/lint-guides.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const HARD = 30, SOFT = 20
let errors = 0, warnings = 0

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (p.endsWith('.mdx')) out.push(p)
  }
  return out
}
function prose(src) {
  return src
    .replace(/^---[\s\S]*?---\n/, '')           // frontmatter
    .replace(/```[\s\S]*?```/g, ' ')            // code
    .replace(/<[^>]+>/g, ' ')                   // tags
    .replace(/\|[^\n]*\|/g, ' ')                // table rows
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')    // links
    .replace(/^\s*[-*]\s.*$/gm, ' ')           // list items are not sentences
    .replace(/^#.*$/gm, ' ')                    // headings
    .replace(/[*_`>]/g, ' ')
}
for (const file of walk(ROOT)) {
  const rel = file.slice(ROOT.length)
  const src = readFileSync(file, 'utf8')
  if (/—/.test(src)) { console.log(`✖ ${rel}: em-dash`); errors++ }
  if (rel.startsWith('how-do-i/') && !rel.endsWith('overview.mdx')) {
    for (const part of ['<Steps>', '<Frame', '## What You See Next', '## If It Does Not', 'Related:']) {
      if (!src.includes(part)) { console.log(`✖ ${rel}: missing ${part}`); errors++ }
    }
    const steps = (src.match(/<Step /g) ?? []).length
    if (steps < 3 || steps > 5) { console.log(`✖ ${rel}: ${steps} steps, wants 3 to 5`); errors++ }
  }
  // The sentence floor holds on the pages a farmer reads with a job in hand.
  // The feature and model pages are the second read and may run longer.
  if (!rel.startsWith('how-do-i/') && !rel.startsWith('start-here/')) continue
  const text = prose(src)
  for (const sentence of text.split(/(?<=[.!?])\s+(?=[A-Z])|\n\s*\n/)) {
    const words = sentence.trim().split(/\s+/).filter(Boolean).length
    if (words > HARD) { console.log(`✖ ${rel}: ${words} words: "${sentence.trim().slice(0, 80)}…"`); errors++ }
    else if (words > SOFT && rel.startsWith('how-do-i/')) { warnings++ }
  }
}
console.log(`${errors} error(s), ${warnings} sentence(s) over ${SOFT} words on How Do I pages`)
process.exit(errors ? 1 : 0)
