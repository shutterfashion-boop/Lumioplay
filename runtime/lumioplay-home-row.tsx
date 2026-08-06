import { useEffect, useMemo, useState } from 'react'
import { getPluginHomeRowTrackClass, useLang, type HomeRowProps } from '@/lib/plugin-sdk'
import {
  canLaunchGame,
  canLaunchLibretro,
  launchGameWithRetroArch,
  launchLibretroGameEmbedded,
} from './lumioplay-launcher'
import { startHomeInputSession } from './lumioplay-home-input'
import type { LumioplayLang } from './lumioplay-i18n'
import { getGameDisplayTitle } from './lumioplay-metadata'
import { getEffectivePlatform, getPlatformLabel, getStoredGames, markGameLaunched } from './lumioplay-storage'
import type { LumioplayGame } from './lumioplay-types'

const actionButtonClass =
  'flex h-9 items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white'

function sortFavoriteGames(games: LumioplayGame[], lang: LumioplayLang): LumioplayGame[] {
  return games
    .filter((game) => game.favorite && !game.missing)
    .slice()
    .sort((left, right) => {
      const leftPlayed = left.lastPlayedAt ?? ''
      const rightPlayed = right.lastPlayedAt ?? ''
      if (leftPlayed !== rightPlayed) return rightPlayed.localeCompare(leftPlayed)
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), lang)
    })
}

export function LumioplayFavoritesHomeRow({
  onNavigate,
  layout = 'slider',
  count = 16,
  sliderCardWidth = 'calc((100% - 3 * 0.75rem) / 4)',
}: HomeRowProps) {
  const { lang, t } = useLang()
  const [games, setGames] = useState<LumioplayGame[]>(() => sortFavoriteGames(getStoredGames(), lang))
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null)
  const [launchError, setLaunchError] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setGames(sortFavoriteGames(getStoredGames(), lang))
    sync()
    const intervalId = window.setInterval(sync, 2500)
    const handleFocus = () => sync()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') sync()
    }
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [lang])

  const visibleGames = useMemo(() => games.slice(0, Math.max(1, count)), [games, count])

  async function handlePlay(game: LumioplayGame): Promise<void> {
    setLaunchError(null)
    if (!canLaunchLibretro(game) && !canLaunchGame(game)) {
      onNavigate({ pageId: 'lumioplay-library' })
      return
    }

    setLaunchingGameId(game.id)
    try {
      if (canLaunchLibretro(game)) {
        await launchLibretroGameEmbedded(game)
        startHomeInputSession()
      } else {
        await launchGameWithRetroArch(game)
      }
      setGames(sortFavoriteGames(markGameLaunched(game.id), lang))
    } catch (error) {
      const message = error instanceof Error ? error.message : t('launchFailed')
      setLaunchError(message)
      onNavigate({ pageId: 'lumioplay-library' })
    } finally {
      setLaunchingGameId(null)
    }
  }

  if (visibleGames.length === 0) return null

  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{t('homeRowFavoritesTitle')}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t('homeRowFavoritesSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate({ pageId: 'lumioplay-library' })}
          className={actionButtonClass}
        >
          {t('showAll')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className={getPluginHomeRowTrackClass(layout)}>
        {visibleGames.map((game) => {
          const coverUrl = game.coverUrl ?? game.metadata?.coverUrl ?? null
          const platformLabel = getPlatformLabel(getEffectivePlatform(game), t)
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => void handlePlay(game)}
              className={`group cursor-pointer overflow-hidden bg-transparent text-left transition-all duration-300 hover:-translate-y-1 ${layout === 'slider' ? 'flex-none' : 'w-full'}`}
              style={layout === 'slider' ? { width: sliderCardWidth } : undefined}
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={getGameDisplayTitle(game)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
                  <span className="rounded-full border border-white/[0.08] bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm">
                    {platformLabel}
                  </span>
                  <span className="rounded-full border border-accent-400/50 bg-accent-400/10 px-2 py-1 text-[10px] text-accent-300 backdrop-blur-sm">
                    ★
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-black/65">
                    {launchingGameId === game.id ? (
                      <span className="text-[10px] uppercase tracking-[0.14em]">...</span>
                    ) : (
                      <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-300/60">
                  {game.lastPlayedAt ? t('lastPlayed') : t('favorite')}
                </p>
                <h3 className="mt-0.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-white">
                  {getGameDisplayTitle(game)}
                </h3>
              </div>
            </button>
          )
        })}
      </div>
      {launchError ? <p className="mt-2 text-xs text-rose-300">{launchError}</p> : null}
    </section>
  )
}
