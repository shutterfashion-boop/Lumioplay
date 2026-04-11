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

  const dottedAsSpace = normalized.replace(/\./g, ' ').replace(/\s+/g, ' ').trim()
  if (dottedAsSpace) variants.add(dottedAsSpace)

  const withoutDots = normalized.replace(/\./g, '').replace(/\s+/g, ' ').trim()
  if (withoutDots) variants.add(withoutDots)

  const collapsedInitialisms = normalized
    .replace(/\b(?:[a-z]\s*\.\s*){2,}[a-z]?\b/gi, (match) => match.replace(/[.\s]+/g, '').toUpperCase())
    .replace(/\s+/g, ' ')
    .trim()
  if (collapsedInitialisms) variants.add(collapsedInitialisms)

  const hyphenAsSpace = normalized.replace(/\s*-\s*/g, ' ').replace(/\s+/g, ' ').trim()
  if (hyphenAsSpace) variants.add(hyphenAsSpace)

  const withRevSuffixRemoved = normalized
    .replace(/\b(?:rev(?:ision)?|ver(?:sion)?|v)\s*[0-9a-z.]+\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (withRevSuffixRemoved) variants.add(withRevSuffixRemoved)

  const collapsedAbbreviations = normalized
    .replace(/\bg\.\s*i\.\b/gi, 'GI')
    .replace(/\bm\.\s*s\.\b/gi, 'Ms')
    .replace(/\bjr\.\b/gi, 'Jr')
    .replace(/\s+/g, ' ')
    .trim()
  if (collapsedAbbreviations) variants.add(collapsedAbbreviations)

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

  if (/\bbros\b/i.test(normalized)) {
    variants.add(normalized.replace(/\bbros\b/gi, 'Bros.').replace(/\s+/g, ' ').trim())
  }
  if (/\bbros\./i.test(normalized)) {
    variants.add(normalized.replace(/\bbros\./gi, 'Bros').replace(/\s+/g, ' ').trim())
  }
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
    let current = fromFileName
    const seen = new Set<string>()
    for (let step = 0; step < 6; step += 1) {
      if (!current || seen.has(current)) break
      seen.add(current)
      addVariant(variants, current)
      const withoutTrailingParens = current.replace(/\s*\([^()]*\)\s*$/, '').replace(/\s+/g, ' ').trim()
      if (!withoutTrailingParens || withoutTrailingParens === current) break
      current = withoutTrailingParens
    }
  }

  const coreTitle = normalizeTitleForLookup(baseTitle).replace(/\s*[-:]\s.*$/, '').trim().toLowerCase()
  const normalizeCore = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  const coreTitleNormalized = normalizeCore(coreTitle)
  return Array.from(variants).sort((left, right) => {
    const normalize = (value: string) => value.trim().toLowerCase()
    const normalizeLoose = (value: string) => normalizeCore(normalize(value))
    const l = normalize(left)
    const r = normalize(right)
    let ls = 0
    let rs = 0

    if (coreTitle && l === coreTitle) ls += 80
    if (coreTitle && r === coreTitle) rs += 80
    if (coreTitleNormalized && normalizeLoose(left) === coreTitleNormalized) ls += 56
    if (coreTitleNormalized && normalizeLoose(right) === coreTitleNormalized) rs += 56
    if (!l.includes(' - ') && !l.includes(':')) ls += 20
    if (!r.includes(' - ') && !r.includes(':')) rs += 20
    if (/\bbros\./i.test(left)) ls += 14
    if (/\bbros\./i.test(right)) rs += 14
    ls -= Math.min(left.length, 140) / 20
    rs -= Math.min(right.length, 140) / 20

    return rs - ls
  })
}

export function buildCoverCandidates(platform: LumioplayConsoleId, title: string, fileName?: string): string[] {
  const systemName = LIBRETRO_SYSTEMS[platform]
  const titleVariants = createTitleVariants(title, fileName)
  const lowerFile = (fileName ?? '').toLowerCase()
  const regionSuffixes =
    lowerFile.includes('world')
      ? ['', ' (World)', ' (USA)', ' (US)', ' (Japan)', ' (Japan) (En)', ' (Europe)']
      : lowerFile.includes('usa') || lowerFile.includes('(us)')
        ? ['', ' (USA)', ' (US)', ' (World)']
        : lowerFile.includes('japan') || lowerFile.includes('(jp)')
          ? ['', ' (Japan)', ' (JP)', ' (Japan) (En)', ' (World)']
          : lowerFile.includes('europe') || lowerFile.includes('(eu)')
            ? ['', ' (Europe)', ' (EU)', ' (World)']
            : ['']

  const encodedSystem = encodeURIComponent(systemName)
  const candidates: string[] = []
  const seen = new Set<string>()

  for (const variant of titleVariants) {
    for (const suffix of regionSuffixes) {
      const withSuffix = `${variant}${suffix}`.trim()
      const encodedTitle = encodeURIComponent(withSuffix)
      const url = `https://thumbnails.libretro.com/${encodedSystem}/Named_Boxarts/${encodedTitle}.png`
      if (!seen.has(url)) {
        seen.add(url)
        candidates.push(url)
      }
      if (candidates.length >= 36) return candidates
    }
  }

  return candidates
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
