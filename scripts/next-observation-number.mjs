#!/usr/bin/env node
/**
 * Prints the next free site number and the directory to create.
 * Usage: node scripts/next-observation-number.mjs
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const dir = join(process.cwd(), 'content/sites')
const ids = readdirSync(dir).filter(name => /^\d{4}$/.test(name))
const used = new Set(ids.map(id => Number.parseInt(id, 10)))
let next = 1
while (used.has(next) && next <= 1000)
  next++
if (next > 1000) {
  console.error('All 1000 slots are taken.')
  process.exit(1)
}
const id = String(next).padStart(4, '0')
console.log(`Next number: #${id}`)
console.log(`Create: content/sites/${id}/index.md`)
