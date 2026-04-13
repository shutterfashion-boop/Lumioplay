import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { PluginHeroProps } from '@/lib/plugin-sdk'
import { canLaunchGame, canLaunchLibretro, launchGameWithRetroArch, launchLibretroGameEmbedded } from './lumioplay-launcher'
import { startHomeInputSession } from './lumioplay-home-input'
import { getGameDisplayTitle } from './lumioplay-metadata'
import { getEffectivePlatform, getHeroEnabled, getHeroMode, getStoredGames, LUMIOPLAY_PLATFORMS, markGameLaunched } from './lumioplay-storage'
import type { LumioplayConsoleId, LumioplayGame } from './lumioplay-types'
import defaultLumioplayHeroBackdrop from './assets/lumioplay-hero-default.jpg'

function getPlatformLabel(platformId: LumioplayConsoleId): string {
  return LUMIOPLAY_PLATFORMS.find((platform) => platform.id === platformId)?.label ?? platformId.toUpperCase()
}

function pickHeroGame(games: LumioplayGame[], mode: 'last_played' | 'random'): LumioplayGame | null {
  const playable = games.filter((game) => !game.missing)
  if (playable.length === 0) return null
  if (mode === 'random') {
    return playable[Math.floor(Math.random() * playable.length)] ?? playable[0] ?? null
  }
  const sorted = playable
    .slice()
    .sort((left, right) => {
      const leftPlayed = left.lastPlayedAt ?? ''
      const rightPlayed = right.lastPlayedAt ?? ''
      if (leftPlayed !== rightPlayed) return rightPlayed.localeCompare(leftPlayed)
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), 'sv')
    })
  return sorted[0] ?? null
}

function pickRandomHeroId(games: LumioplayGame[], excludeGameId?: string | null): string | null {
  const playable = games.filter((game) => !game.missing && game.id !== excludeGameId)
  if (playable.length === 0) return null
  return playable[Math.floor(Math.random() * playable.length)]?.id ?? null
}

function truncateSummary(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

function cleanSummaryText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripLikelyFileExtension(value: string): string {
  return value.replace(/\.[a-z0-9]{1,8}$/i, '')
}

function buildWikipediaTitleCandidates(game: LumioplayGame): string[] {
  const candidates = new Set<string>()
  const rawValues = [
    getGameDisplayTitle(game),
    game.title,
    game.metadata?.searchTitle?.split(' ').slice(0, 8).join(' ') ?? '',
    stripLikelyFileExtension(game.fileName),
  ]

  for (const rawValue of rawValues) {
    const value = rawValue.trim().replace(/\s+/g, ' ')
    if (!value) continue
    candidates.add(`${value} (video game)`)
    candidates.add(value)

    const withoutParens = value.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
    if (withoutParens) {
      candidates.add(`${withoutParens} (video game)`)
      candidates.add(withoutParens)
    }

    const beforeSubtitle = value.replace(/\s*[-:]\s.*$/, '').trim()
    if (beforeSubtitle) {
      candidates.add(`${beforeSubtitle} (video game)`)
      candidates.add(beforeSubtitle)
    }
  }

  return Array.from(candidates)
}

async function fetchWikipediaSummaryByTitle(candidate: string): Promise<string | null> {
  const encoded = encodeURIComponent(candidate.replace(/\s+/g, ' '))
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return null
    const payload = (await response.json()) as { extract?: string; type?: string }
    if (payload.type === 'disambiguation') return null
    const extract = typeof payload.extract === 'string' ? cleanSummaryText(payload.extract) : ''
    if (extract.length === 0) return null
    return truncateSummary(extract, 220)
  } catch {
    return null
  }
}

async function fetchWikipediaSummary(game: LumioplayGame): Promise<string | null> {
  const candidates = buildWikipediaTitleCandidates(game)
  for (const candidate of candidates) {
    const summary = await fetchWikipediaSummaryByTitle(candidate)
    if (summary) return summary
  }

  const primaryTitle = getGameDisplayTitle(game).trim() || stripLikelyFileExtension(game.fileName).trim()
  if (!primaryTitle) return null

  try {
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=${encodeURIComponent(primaryTitle)}`,
    )
    if (!searchResponse.ok) return null
    const payload = (await searchResponse.json()) as [string, string[]?]
    const matchedTitle = payload[1]?.[0]?.trim()
    if (!matchedTitle) return null
    return await fetchWikipediaSummaryByTitle(matchedTitle)
  } catch {
    return null
  }
}

export function LumioplayHero({ onNavigate, onActiveChange, onBackdropChange }: PluginHeroProps) {
  const [games, setGames] = useState<LumioplayGame[]>(() => getStoredGames())
  const [launching, setLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [heroEnabled, setHeroEnabledFlag] = useState(() => getHeroEnabled())
  const [randomHeroId, setRandomHeroId] = useState<string | null>(null)
  const mode = getHeroMode()

  useEffect(() => {
    const sync = () => {
      setGames(getStoredGames())
      setHeroEnabledFlag(getHeroEnabled())
    }
    sync()
    const intervalId = window.setInterval(sync, 3000)
    const onFocus = () => sync()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') sync()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (!heroEnabled || mode !== 'random') {
      setRandomHeroId(null)
      return
    }

    const nextRandomHeroId = pickRandomHeroId(games)
    if (!nextRandomHeroId) {
      setRandomHeroId(null)
      return
    }

    const currentStillPlayable = games.some((game) => !game.missing && game.id === randomHeroId)
    if (currentStillPlayable) return

    setRandomHeroId(nextRandomHeroId)
  }, [games, heroEnabled, mode, randomHeroId])

  const heroGame = useMemo(() => {
    if (!heroEnabled) return null
    if (mode === 'random') return games.find((game) => game.id === randomHeroId && !game.missing) ?? null
    return pickHeroGame(games, mode)
  }, [games, heroEnabled, mode, randomHeroId])

  useEffect(() => {
    let cancelled = false
    if (!heroGame) {
      setSummary(null)
      return
    }
    setSummary(null)
    void fetchWikipediaSummary(heroGame).then((nextSummary) => {
      if (cancelled) return
      setSummary(nextSummary)
    })
    return () => {
      cancelled = true
    }
  }, [heroGame?.id])

  useEffect(() => {
    const active = Boolean(heroGame)
    onActiveChange(active)
    onBackdropChange(active ? defaultLumioplayHeroBackdrop : null)
    return () => {
      onActiveChange(false)
      onBackdropChange(null)
    }
  }, [heroGame, onActiveChange, onBackdropChange])

  async function handlePlay() {
    if (!heroGame) return
    setLaunchError(null)
    setLaunching(true)
    try {
      if (canLaunchLibretro(heroGame)) {
        await launchLibretroGameEmbedded(heroGame)
        startHomeInputSession()
      } else if (canLaunchGame(heroGame)) {
        await launchGameWithRetroArch(heroGame)
      } else {
        onNavigate({ pageId: 'lumioplay-library' })
        return
      }
      const updated = markGameLaunched(heroGame.id)
      setGames(updated)
      if (mode === 'random') {
        setRandomHeroId(pickRandomHeroId(updated, heroGame.id))
      }
    } catch (error) {
      setLaunchError(error instanceof Error ? error.message : 'Kunde inte starta spelet.')
      onNavigate({ pageId: 'lumioplay-library' })
    } finally {
      setLaunching(false)
    }
  }

  if (!heroGame) return null

  const title = getGameDisplayTitle(heroGame)
  const platform = getPlatformLabel(getEffectivePlatform(heroGame))
  const coverUrl = heroGame.coverUrl ?? heroGame.metadata?.coverUrl ?? null
  const releaseYear = heroGame.metadata?.releaseYear ?? null
  const region = heroGame.metadata?.region ?? null
  const playCount = heroGame.playCount ?? 0
  const coverShellStyle = {
    width: '233px',
    borderRadius: '16px',
  } satisfies CSSProperties

  return (
    <section className="py-4">
      <div className="flex items-start gap-8">
        <div className="shrink-0 overflow-hidden bg-slate-900/35" style={coverShellStyle}>
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="aspect-[2/3] w-full object-cover" />
          ) : (
            <div className="aspect-[2/3] w-full bg-gradient-to-br from-slate-800 to-slate-950" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3 pt-2">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Lumioplay Hero</p>
          <h2 className="text-[1.95rem] font-semibold leading-tight text-white">{title}</h2>
          <p className="max-w-[62ch] text-[1rem] leading-8 text-slate-300">
            {summary ?? (mode === 'random' ? 'Slumpat spel från ditt bibliotek.' : 'Senast spelade spelet från ditt bibliotek.')}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
              {platform}
            </span>
            {releaseYear ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                {releaseYear}
              </span>
            ) : null}
            {region ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                {region}
              </span>
            ) : null}
            {playCount > 0 ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Spelat {playCount}x
              </span>
            ) : null}
            {heroGame.lastPlayedAt ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Senast spelat
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => void handlePlay()}
              disabled={launching}
              className="rounded-full border border-accent-400/40 bg-accent-500/90 px-6 py-2.5 text-[0.6rem] font-normal uppercase tracking-[0.2em] text-white transition hover:bg-accent-500 disabled:opacity-60"
            >
              {launching ? 'Startar...' : 'Spela nu'}
            </button>
          </div>
          {launchError ? <p className="text-xs text-rose-300">{launchError}</p> : null}
        </div>
      </div>
    </section>
  )
}
