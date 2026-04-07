import type { LumioplayConsoleId, LumioplayGame, LumioplayGameMetadata } from './lumioplay-types'

const REGION_BY_TOKEN: Record<string, string> = {
  usa: 'USA',
  europe: 'Europe',
  eur: 'Europe',
  japan: 'Japan',
  jap: 'Japan',
  world: 'World',
  asia: 'Asia',
  pal: 'PAL',
  ntsc: 'NTSC',
}

const LIBRETRO_SYSTEMS: Record<LumioplayConsoleId, string> = {
  nes: 'Nintendo - Nintendo Entertainment System',
  snes: 'Nintendo - Super Nintendo Entertainment System',
  gb: 'Nintendo - Game Boy',
  gbc: 'Nintendo - Game Boy Color',
  gba: 'Nintendo - Game Boy Advance',
  genesis: 'Sega - Mega Drive - Genesis',
  n64: 'Nintendo - Nintendo 64',
  ps1: 'Sony - PlayStation',
}

function trimNoiseTokens(value: string): string {
  return value
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\([^)]*\b(?:rev|beta|proto|sample|hack|demo)\b[^)]*\)/gi, ' ')
    .replace(/\b(?:v\d+(?:\.\d+)?)\b/gi, ' ')
    .replace(/\b(?:usa|europe|eur|japan|jpn|world|asia|pal|ntsc|en|eng|fr|de|es|it)\b/gi, ' ')
    .replace(/\(\s*\)/g, ' ')
    .replace(/\[\s*\]/g, ' ')
    .replace(/[_+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeTitleForLookup(value: string): string {
  return value
    .replace(/[/:]/g, ' - ')
    .replace(/[?*"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function createSortTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '')
    .trim()
}

function createSearchTitle(value: string, fileName: string): string {
  return `${value} ${fileName}`
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[_+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractReleaseYear(fileName: string): number | null {
  const match = fileName.match(/\b(19\d{2}|20\d{2})\b/)
  return match ? Number(match[1]) : null
}

function extractRegion(fileName: string): string | null {
  const lower = fileName.toLowerCase()
  for (const [token, label] of Object.entries(REGION_BY_TOKEN)) {
    if (lower.includes(token)) return label
  }
  return null
}

function createTitleVariants(baseTitle: string): string[] {
  const variants = new Set<string>()
  const normalized = normalizeTitleForLookup(baseTitle)
  if (normalized) variants.add(normalized)
  const withoutParenthetical = normalized.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
  if (withoutParenthetical) variants.add(withoutParenthetical)
  const withoutEdition = normalized.replace(/\b(?:disc|disk|side)\s*[a-z0-9]+\b/gi, '').trim()
  if (withoutEdition) variants.add(withoutEdition)
  const collapsed = normalized.replace(/\s*-\s*/g, ': ').trim()
  if (collapsed) variants.add(collapsed)
  const withoutSubtitleSuffix = normalized.replace(/\s*[-:]\s.*$/, '').trim()
  if (withoutSubtitleSuffix) variants.add(withoutSubtitleSuffix)
  return Array.from(variants)
}

export function buildCoverCandidates(platform: LumioplayConsoleId, title: string): string[] {
  const systemName = LIBRETRO_SYSTEMS[platform]
  const titleVariants = createTitleVariants(title)
  return titleVariants.map((variant) => {
    const encodedSystem = encodeURIComponent(systemName)
    const encodedTitle = encodeURIComponent(variant)
    return `https://thumbnails.libretro.com/${encodedSystem}/Named_Boxarts/${encodedTitle}.png`
  })
}

export function buildMetadataFromFileName(fileName: string, _platform: LumioplayConsoleId): LumioplayGameMetadata {
  const basename = fileName.replace(/\.[^/.]+$/, '')
  const cleanedTitle = trimNoiseTokens(basename)
  const displayTitle = cleanedTitle || basename
  const coverCandidates: string[] = []
  return {
    displayTitle,
    sortTitle: createSortTitle(displayTitle),
    searchTitle: createSearchTitle(displayTitle, fileName),
    releaseYear: extractReleaseYear(fileName),
    region: extractRegion(fileName),
    tags: [],
    coverUrl: null,
    coverCandidates,
  }
}

export async function resolveFirstReachableCoverUrl(
  candidateUrls: string[],
  options?: { timeoutMs?: number; maxCandidates?: number },
): Promise<string | null> {
  const timeoutMs = Math.max(500, options?.timeoutMs ?? 2500)
  const maxCandidates = Math.max(1, options?.maxCandidates ?? 6)
  const limited = candidateUrls.filter(Boolean).slice(0, maxCandidates)
  for (const url of limited) {
    const resolved = await new Promise<string | null>((resolve) => {
      const image = new Image()
      const cleanup = () => {
        image.onload = null
        image.onerror = null
      }
      const timer = window.setTimeout(() => {
        cleanup()
        resolve(null)
      }, timeoutMs)
      image.onload = () => {
        window.clearTimeout(timer)
        cleanup()
        resolve(url)
      }
      image.onerror = () => {
        window.clearTimeout(timer)
        cleanup()
        resolve(null)
      }
      image.src = url
    })
    if (resolved) return resolved
  }
  return null
}

export function getGameDisplayTitle(game: LumioplayGame): string {
  return game.metadata?.displayTitle?.trim() || game.title
}
