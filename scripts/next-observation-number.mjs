#!/usr/bin/env node
/**
 * Prints the next free observation number and suggested filename.
 * Usage: node scripts/next-observation-number.mjs
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const dir = join(process.cwd(), 'content/observations')
const files = readdirSync(dir).filter(f => /^\d{4}\.md$/.test(f))
const used = new Set(files.map(f => Number.parseInt(f.slice(0, 4), 10)))
let next = 1
while (used.has(next) && next <= 1000)
  next++
if (next > 1000) {
  console.error('All 1000 slots are taken.')
  process.exit(1)
}
const id = String(next).padStart(4, '0')
console.log(`Next number: #${id}`)
console.log(`Create: content/observations/${id}.md`)
