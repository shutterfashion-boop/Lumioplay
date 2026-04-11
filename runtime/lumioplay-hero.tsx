import { useEffect, useMemo, useState } from 'react'
import type { PluginHeroProps } from '@/lib/plugin-sdk'
import { canLaunchGame, canLaunchLibretro, launchGameWithRetroArch, launchLibretroGameEmbedded } from './lumioplay-launcher'
import { startHomeInputSession } from './lumioplay-home-input'
import { getGameDisplayTitle } from './lumioplay-metadata'
import { getEffectivePlatform, getHeroMode, getStoredGames, LUMIOPLAY_PLATFORMS, markGameLaunched } from './lumioplay-storage'
import type { LumioplayConsoleId, LumioplayGame } from './lumioplay-types'

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

export function LumioplayHero({ onNavigate, onActiveChange, onBackdropChange }: PluginHeroProps) {
  const [games, setGames] = useState<LumioplayGame[]>(() => getStoredGames())
  const [launching, setLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)
  const [randomSeed, setRandomSeed] = useState(() => Date.now())
  const mode = getHeroMode()

  useEffect(() => {
    const sync = () => {
      setGames(getStoredGames())
      if (getHeroMode() === 'random') setRandomSeed(Date.now())
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

  const heroGame = useMemo(() => {
    if (mode === 'random') {
      void randomSeed
    }
    return pickHeroGame(games, mode)
  }, [games, mode, randomSeed])

  useEffect(() => {
    const active = Boolean(heroGame)
    onActiveChange(active)
    onBackdropChange(heroGame?.coverUrl ?? heroGame?.metadata?.coverUrl ?? null)
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

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-[#0a1533]/95 to-[#050a1a]/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      {coverUrl ? (
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <img src={coverUrl} alt="" className="h-full w-full object-cover blur-2xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040914] via-[#040914]/70 to-[#040914]/90" />
        </div>
      ) : null}
      <div className="relative z-10 grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.8fr)]">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Lumioplay Hero</p>
          <h2 className="text-3xl font-semibold leading-tight text-white">{title}</h2>
          <p className="text-sm text-slate-300">
            {mode === 'random' ? 'Slumpat spel från ditt bibliotek' : 'Senast spelade spelet från ditt bibliotek'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
              {platform}
            </span>
            {heroGame.lastPlayedAt ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Senast spelat
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => void handlePlay()}
              disabled={launching}
              className="rounded-full border border-accent-400/40 bg-accent-500/90 px-5 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-white transition hover:bg-accent-500 disabled:opacity-60"
            >
              {launching ? 'Startar...' : 'Spela nu'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ pageId: 'lumioplay-library' })}
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              Öppna bibliotek
            </button>
          </div>
          {launchError ? <p className="text-xs text-rose-300">{launchError}</p> : null}
        </div>
        <div className="flex items-end justify-end">
          <div className="relative w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
            {coverUrl ? (
              <img src={coverUrl} alt={title} className="aspect-[2/3] w-full object-cover" />
            ) : (
              <div className="aspect-[2/3] w-full bg-gradient-to-br from-slate-800 to-slate-950" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
