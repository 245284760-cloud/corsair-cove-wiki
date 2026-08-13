import type { ReadonlyGuideMetadata } from '@/content/guides'

const DAY_MS = 86_400_000
const weeklySlugs = new Set(['updates', 'troubleshooting', 'platforms', 'price', 'system-requirements'])
const biweeklySlugs = new Set(['ships', 'resources', 'production-chains', 'exploration', 'discovery-events'])

function parseIsoDateUtc(value: string): number {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

function formatIsoDateUtc(value: number): string {
  return new Date(value).toISOString().slice(0, 10)
}

export function getReviewCadenceDays(meta: ReadonlyGuideMetadata): number {
  if (weeklySlugs.has(meta.slug)) return 7
  if (biweeklySlugs.has(meta.slug)) return 14
  return 30
}

export function getContentFreshness(meta: ReadonlyGuideMetadata, today = new Date()) {
  const verifiedAt = parseIsoDateUtc(meta.verifiedOn)
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const cadenceDays = getReviewCadenceDays(meta)
  const ageDays = Math.floor((todayUtc - verifiedAt) / DAY_MS)

  return {
    ageDays,
    cadenceDays,
    nextReviewOn: formatIsoDateUtc(verifiedAt + cadenceDays * DAY_MS),
    stale: ageDays > cadenceDays,
  }
}
