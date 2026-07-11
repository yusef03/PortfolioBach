/**
 * build-github-activity.mjs
 *
 * Holt echte GitHub-Aktivitätsdaten und schreibt sie als statische Datei:
 *   js/github-activity-data.js   →   const githubActivity = { … }
 *
 * EINE GraphQL-Query liefert alles: Contribution-Kalender, Follower,
 * Account-Alter, öffentliche Repo-Anzahl, Stars-Summe und Sprachen.
 *
 * Wird von der GitHub Action build-github-activity.yml aufgerufen
 * (geplant täglich + manuell). Benötigt Env-Var:
 *   GH_STATS_TOKEN  (classic PAT, Scope: read:user)  — oder GITHUB_TOKEN
 *
 * Lokal testen (aus BETAPortfolioBach/):
 *   GH_STATS_TOKEN=ghp_xxx node scripts/build-github-activity.mjs
 *
 * WICHTIG: Schreibt die Datei nur, wenn ALLE Daten erfolgreich geholt wurden —
 * bei Fehler bleibt die letzte gültige Version stehen (kein kaputter Commit).
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir    = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = resolve(__dir, '../website/js/github-activity-data.js')

const USER  = 'yusef03'
const TOKEN = process.env.GH_STATS_TOKEN || process.env.GITHUB_TOKEN

if (!TOKEN) {
  console.error('❌  GH_STATS_TOKEN (oder GITHUB_TOKEN) muss gesetzt sein.')
  process.exit(1)
}

// ─── GraphQL: alles in einem Call ──────────────────────────────────────────────
const QUERY = `
  query($login: String!) {
    user(login: $login) {
      createdAt
      followers { totalCount }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount weekday }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
        totalCount
        nodes {
          stargazerCount
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name } }
          }
        }
      }
    }
  }
`

async function fetchGraphQL() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'yusefbach-portfolio-build',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
  })

  if (!res.ok) {
    throw new Error(`GitHub GraphQL HTTP ${res.status}: ${await res.text()}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(`GitHub GraphQL Fehler: ${JSON.stringify(json.errors)}`)
  }
  if (!json.data?.user) {
    throw new Error('GraphQL: user nicht gefunden / leere Antwort.')
  }
  return json.data.user
}

// ─── Intensitätsstufe (0–4) aus Tages-Counts via Quartile ──────────────────────
function buildLevelFn(allCounts) {
  const nonzero = allCounts.filter(c => c > 0).sort((a, b) => a - b)
  if (nonzero.length === 0) return () => 0

  const q = p => {
    const idx = Math.min(nonzero.length - 1, Math.floor((p / 100) * nonzero.length))
    return nonzero[idx]
  }
  const q1 = q(25), q2 = q(50), q3 = q(75)

  return count => {
    if (count <= 0) return 0
    if (count <= q1) return 1
    if (count <= q2) return 2
    if (count <= q3) return 3
    return 4
  }
}

// ─── Kalender normalisieren: jede Woche exakt 7 Slots (Pad = date:null) ─────────
function buildCalendar(calendar) {
  const rawWeeks = calendar.weeks
  const allCounts = rawWeeks.flatMap(w => w.contributionDays.map(d => d.contributionCount))
  const levelOf = buildLevelFn(allCounts)

  const weeks = rawWeeks.map(week => {
    const slots = Array.from({ length: 7 }, () => ({ date: null, count: 0, level: 0 }))
    for (const d of week.contributionDays) {
      // weekday: 0 = Sonntag … 6 = Samstag → Zeile im 7er-Grid
      slots[d.weekday] = {
        date: d.date,
        count: d.contributionCount,
        level: levelOf(d.contributionCount),
      }
    }
    return slots
  })

  // Monats-Labels: erste Woche eines neuen Monats markieren
  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, weekIndex) => {
    const firstReal = week.find(d => d.date)
    if (!firstReal) return
    const month = new Date(firstReal.date).getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ label: String(month), date: firstReal.date, weekIndex })
      lastMonth = month
    }
  })

  return { weeks, monthLabels }
}

// ─── Sprachen aggregieren (Bytes → Prozent, Top 5 + "Other") ───────────────────
function buildLanguages(repoNodes) {
  const bytes = {}
  for (const repo of repoNodes) {
    for (const edge of repo.languages?.edges ?? []) {
      bytes[edge.node.name] = (bytes[edge.node.name] || 0) + edge.size
    }
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0)
  if (total === 0) return []

  const sorted = Object.entries(bytes).sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, 5)
  const restBytes = sorted.slice(5).reduce((a, [, b]) => a + b, 0)

  const langs = top.map(([name, b]) => ({
    name,
    percent: Math.round((b / total) * 1000) / 10,
  }))
  if (restBytes > 0) {
    langs.push({ name: 'Other', percent: Math.round((restBytes / total) * 1000) / 10 })
  }
  return langs
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Hole GitHub-Aktivität für @${USER}…`)
  const user = await fetchGraphQL()

  const cal = user.contributionsCollection.contributionCalendar
  const repoNodes = user.repositories.nodes ?? []

  const data = {
    generatedAt: new Date().toISOString(),
    user: USER,
    totalContributions: cal.totalContributions,
    calendar: buildCalendar(cal),
    stats: {
      publicRepos: user.repositories.totalCount,
      totalStars: repoNodes.reduce((a, r) => a + (r.stargazerCount || 0), 0),
      followers: user.followers.totalCount,
      codingSince: new Date(user.createdAt).getFullYear(),
    },
    languages: buildLanguages(repoNodes),
  }

  const header =
    '// AUTO-GENERIERT via scripts/build-github-activity.mjs — NICHT manuell editieren!\n' +
    `// Letzte Aktualisierung: ${data.generatedAt}\n\n`

  writeFileSync(OUT_PATH, header + `const githubActivity = ${JSON.stringify(data, null, 2)};\n`, 'utf-8')

  console.log(`✅  js/github-activity-data.js geschrieben:`)
  console.log(`    ${data.totalContributions} Beiträge · ${data.stats.publicRepos} Repos · ` +
              `${data.stats.totalStars} Stars · ${data.stats.followers} Follower · ` +
              `${data.languages.length} Sprachen`)
}

main().catch(err => {
  console.error('❌  Build fehlgeschlagen — Datei NICHT überschrieben.')
  console.error(err.message)
  process.exit(1)
})
