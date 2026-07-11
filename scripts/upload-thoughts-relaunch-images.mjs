/**
 * upload-thoughts-relaunch-images.mjs
 *
 * Lädt die 5 vorbereiteten Screenshots aus /Users/yusefbach/Portfolio/
 * in den Supabase-Storage-Bucket "thoughts-media" für den v3-Relaunch-Post.
 * Gibt am Ende die öffentlichen URLs aus (werden danach in den Post-Text
 * eingesetzt).
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  for (const p of [resolve(__dir, '../.env.local'), resolve(__dir, '../../portfolio-admin/.env.local')]) {
    try {
      for (const line of readFileSync(p, 'utf-8').split('\n')) {
        const t = line.trim(); if (!t || t.startsWith('#')) continue
        const i = t.indexOf('='); if (i === -1) continue
        const k = t.slice(0, i).trim(), v = t.slice(i + 1).trim()
        if (k && !process.env[k]) process.env[k] = v
      }
      return
    } catch { }
  }
}
if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) loadEnvLocal()

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SB_URL || !SB_KEY) { console.error('❌  SUPABASE env fehlt.'); process.exit(1) }

const POST_ID = '1066de9f-a20e-49f8-97e0-493a3b3ba77b'
const SRC_DIR = '/Users/yusefbach/Portfolio'
const BUCKET = 'thoughts-media'

const FILES = [
  { name: 'cover.png', slot: 'cover' },
  { name: 'ar_rtl.png', slot: 'img1' },
  { name: 'chatbox.png', slot: 'img2' },
  { name: 'admindashboard.png', slot: 'img3' },
  { name: 'adminlogin.png', slot: 'img4' },
]

async function upload(filename) {
  const filePath = resolve(SRC_DIR, filename)
  const buf = readFileSync(filePath)
  const storagePath = `thoughts/${POST_ID}/${filename}`

  const res = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
    },
    body: buf,
  })
  if (!res.ok) throw new Error(`Upload ${filename}: ${res.status} ${await res.text()}`)

  return `${SB_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
}

async function main() {
  console.log('→ Lade 5 Bilder in Supabase Storage hoch\n')
  const urls = {}
  for (const f of FILES) {
    const url = await upload(f.name)
    urls[f.slot] = url
    console.log(`   ✓ ${f.name} → ${f.slot}`)
  }
  console.log('\n✅  Fertig. URLs:')
  console.log(JSON.stringify(urls, null, 2))
}

main().catch(e => { console.error('❌ ', e.message); process.exit(1) })
