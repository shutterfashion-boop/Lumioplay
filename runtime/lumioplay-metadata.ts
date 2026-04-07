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

function normalizeDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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

function addVariant(variants: Set<string>, value: string) {
  const normalized = normalizeTitleForLookup(value)
  if (!normalized) return
  variants.add(normalized)

  const withoutParens = normalized.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
  if (withoutParens) variants.add(withoutParens)

  const withoutEdition = normalized.replace(/\b(?:disc|disk|side)\s*[a-z0-9]+\b/gi, '').replace(/\s+/g, ' ').trim()
  if (withoutEdition) variants.add(withoutEdition)

  const hyphenToColon = normalized.replace(/\s*-\s*/g, ': ').replace(/\s+/g, ' ').trim()
  if (hyphenToColon) variants.add(hyphenToColon)

  const colonToHyphen = normalized.replace(/\s*:\s*/g, ' - ').replace(/\s+/g, ' ').trim()
  if (colonToHyphen) variants.add(colonToHyphen)

  const withoutSubtitleSuffix = normalized.replace(/\s*[-:]\s.*$/, '').trim()
  if (withoutSubtitleSuffix) variants.add(withoutSubtitleSuffix)

  const compactPunctuation = normalized.replace(/['".,!]/g, '').replace(/\s+/g, ' ').trim()
  if (compactPunctuation) variants.add(compactPunctuation)

  if (normalized.includes('&')) {
    variants.add(normalized.replace(/\s*&\s*/g, ' and ').replace(/\s+/g, ' ').trim())
  }
  if (/\band\b/i.test(normalized)) {
    variants.add(normalized.replace(/\band\b/gi, '&').replace(/\s+/g, ' ').trim())
  }

  const leadingArticle = normalized.match(/^(the|a|an)\s+(.+)$/i)
  if (leadingArticle) {
    variants.add(`${leadingArticle[2]}, ${leadingArticle[1].slice(0, 1).toUpperCase()}${leadingArticle[1].slice(1).toLowerCase()}`)
  }

  const trailingArticle = normalized.match(/^(.+),\s*(the|a|an)$/i)
  if (trailingArticle) {
    variants.add(`${trailingArticle[2]} ${trailingArticle[1]}`)
  }

  const withoutDiacritics = normalizeDiacritics(normalized)
  if (withoutDiacritics) variants.add(withoutDiacritics)
}

function createTitleVariants(baseTitle: string, fileName?: string): string[] {
  const variants = new Set<string>()
  addVariant(variants, baseTitle)

  const fromFileName = fileName
    ?.replace(/\.[^/.]+$/, '')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\([^)]*\b(?:rev|beta|proto|sample|hack|demo)\b[^)]*\)/gi, ' ')
    .replace(/[_+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (fromFileName) {
    addVariant(variants, fromFileName)
  }

  return Array.from(variants)
}

export function buildCoverCandidates(platform: LumioplayConsoleId, title: string, fileName?: string): string[] {
  const systemName = LIBRETRO_SYSTEMS[platform]
  const titleVariants = createTitleVariants(title, fileName)
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
  const coverCandidates = buildCoverCandidates(_platform, displayTitle, fileName)
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
