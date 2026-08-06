'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  getScopedStorageItem,
  isPluginDesktopHost,
  pickPluginFiles,
  pickPluginFolder,
  scanPluginDirectory,
  setScopedStorageItem,
  useLang,
} from '@/lib/plugin-sdk'
import type { LumioplayLang } from './lumioplay-i18n'
import {
  buildCoverCandidates,
  getGameDisplayTitle,
  getRegionLabel,
  resolveFirstReachableCoverUrl,
} from './lumioplay-metadata'
import {
  createImportedGame,
  getAutoSyncEnabled,
  getAutoSyncIntervalSeconds,
  getEffectiveCoreId,
  getEffectivePlatform,
  getGamepadExitCombo,
  getGamepadMapping,
  getPlatformLabel,
  getRomFolders,
  getStoredGames,
  IMPORTABLE_ROM_EXTENSIONS,
  LUMIOPLAY_PLATFORMS,
  markGameLaunched,
  setGameCoreOverride,
  setGameCoversBatch,
  setGamePlatformOverride,
  setRomFolders,
  syncFolderGames,
  toggleFavorite,
  upsertImportedGames,
} from './lumioplay-storage'
import {
  canLaunchGame,
  canLaunchLibretro,
  launchGameWithRetroArch,
  launchLibretroGameEmbedded,
  onLibretroStopped,
  sendLibretroInput,
  setLibretroBounds,
  stopLibretroGame,
} from './lumioplay-launcher'
import type { BrowsePageProps, HomeOverrideProps } from '@/lib/plugin-sdk'
import type { LumioplayConsoleId, LumioplayGame, LumioplayPlatformId } from './lumioplay-types'

const neutralPillClass =
  'border-white/10 bg-white/5 text-slate-200 hover:border-accent-400/30 hover:bg-white/10 hover:text-white'
const activePillClass =
  'border-accent-400/50 bg-accent-400/10 text-accent-300'
const cardButtonClass =
  'flex h-9 items-center rounded-full border px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] transition-all'
const GAME_OVERLAY_TOP_OVERSCAN = 56
const KEYBOARD_TO_JOYPAD: Record<string, number> = {
  KeyZ: 0,
  KeyA: 1,
  ShiftRight: 2,
  Enter: 3,
  ArrowUp: 4,
  ArrowDown: 5,
  ArrowLeft: 6,
  ArrowRight: 7,
  KeyX: 8,
  KeyS: 9,
  KeyQ: 10,
  KeyW: 11,
}
const JOYPAD_BUTTON_COUNT = 16
function isMappingPressed(mappingValue: string | undefined, pad: Gamepad): boolean {
  if (!mappingValue) return false
  if (/^\d+$/.test(mappingValue)) {
    const buttonIndex = Number(mappingValue)
    return Boolean(pad.buttons[buttonIndex]?.pressed)
  }
  const axisMatch = mappingValue.match(/^axis:(\d+):([+-]1)$/)
  if (!axisMatch) return false
  const axisIndex = Number(axisMatch[1])
  const direction = axisMatch[2]
  const axisValue = pad.axes[axisIndex] ?? 0
  return direction === '-1' ? axisValue <= -0.5 : axisValue >= 0.5
}
const POSTER_SYNC_CONCURRENCY = 3
const POSTER_SYNC_BATCH_SIZE = 20
const POSTER_SYNC_AUTO_LIMIT = 10
const POSTER_SYNC_MISS_CACHE_KEY = 'lumioplay_poster_miss_cache_v3'
const POSTER_SYNC_MISS_TTL_MS = 45 * 60 * 1000
const POSTER_SYNC_MAX_MISS_ENTRIES = 2500
const POSTER_INDEX_CACHE_TTL_MS = 24 * 60 * 60 * 1000
// Grouping id for browser folder uploads that expose no directory name. Never
// displayed, so it stays language independent.
const WEB_FOLDER_SOURCE_ID = 'selected-folder'

function formatFileSize(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function getPlatformOptions(): LumioplayConsoleId[] {
  return LUMIOPLAY_PLATFORMS
    .filter((platform): platform is (typeof LUMIOPLAY_PLATFORMS)[number] & { id: LumioplayConsoleId } => platform.id !== 'all')
    .map((platform) => platform.id)
}

function getCoreSuggestions(): string[] {
  return Array.from(
    new Set(
      LUMIOPLAY_PLATFORMS
        .map((platform) => platform.coreId)
        .filter((value): value is string => Boolean(value)),
    ),
  )
}

const SYSTEM_NAME_BY_PLATFORM: Record<LumioplayConsoleId, string> = {
  nes: 'Nintendo - Nintendo Entertainment System',
  snes: 'Nintendo - Super Nintendo Entertainment System',
  gb: 'Nintendo - Game Boy',
  gbc: 'Nintendo - Game Boy Color',
  gba: 'Nintendo - Game Boy Advance',
  genesis: 'Sega - Mega Drive - Genesis',
  n64: 'Nintendo - Nintendo 64',
  ps1: 'Sony - PlayStation',
}

function stripLikelyFileExtension(value: string): string {
  return value.replace(/\.[a-z0-9]{1,8}$/i, '')
}

function systemNameToLibretroRepoSlug(systemName: string): string {
  return systemName
    .trim()
    .replace(/\s*-\s*/g, '_-_')
    .replace(/\s+/g, '_')
}

function normalizePosterLookupValue(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/%[0-9a-f]{2}/gi, '')
    .replace(/\.png$/i, '')
    .replace(/\bg\.?\s*i\.?\b/gi, ' gi ')
    .replace(/\bm\.?\s*s\.?\b/gi, ' ms ')
    .replace(/\bjr\.\b/gi, ' jr ')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized
}

function buildPosterLookupTokens(value: string): string[] {
  const prioritizedShortTokens = new Set(['gi', 'ms', 'jr'])
  return Array.from(
    new Set(
      normalizePosterLookupValue(value)
        .split(' ')
        .map((token) => token.trim())
        .filter((token) => {
          if (!token) return false
          if (prioritizedShortTokens.has(token)) return true
          return token.length > 2
        }),
    ),
  )
}

function extractCanonicalTokens(value: string): string[] {
  return normalizePosterCanonicalValue(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
}

function hasNumericOrRomanToken(value: string): boolean {
  const tokens = normalizePosterLookupValue(value).split(' ').filter(Boolean)
  return tokens.some((token) => /^\d+$/.test(token) || /^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(token))
}

function safeDecodePosterEntry(value: string): string {
  const unescaped = value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
  try {
    return decodeURIComponent(unescaped)
  } catch {
    return unescaped
  }
}

function buildNamedBoxartUrl(systemName: string, entry: string): string {
  const decodedEntry = safeDecodePosterEntry(entry).replace(/^\/+/, '').replace(/\.png$/i, '')
  const encodedEntry = `${encodeURIComponent(decodedEntry)}.png`
  return `https://thumbnails.libretro.com/${encodeURIComponent(systemName)}/Named_Boxarts/${encodedEntry}`
}

function normalizePosterCanonicalValue(value: string): string {
  const ignoredTokens = new Set([
    'rev', 'revision', 'ver', 'version', 'v',
    'beta', 'proto', 'sample', 'demo', 'unl', 'hack',
    'usa', 'us', 'japan', 'jp', 'europe', 'eu', 'world', 'pal', 'ntsc',
    'en', 'eng', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'zh', 'sv',
    'nintendo', 'konami', 'capcom', 'namco', 'tengen', 'taxan', 'kemco',
    'playchoice', 'edition', 'gamecube', 'ereader', 'prg',
    'two', 'player',
  ])

  const tokens = normalizePosterLookupValue(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .filter((token) => {
      if (ignoredTokens.has(token)) return false
      if (/^\d+$/.test(token)) return false
      if (/^\d{4}$/.test(token)) return false
      return true
    })
  return tokens.join(' ').trim()
}

function buildCanonicalGameKeys(game: LumioplayGame): string[] {
  const fileBase = stripLikelyFileExtension(game.fileName)
  const rawCandidates = [
    getGameDisplayTitle(game),
    fileBase,
    fileBase.replace(/\s*-\s*.*$/, '').trim(),
    fileBase.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim(),
  ]

  const keys = rawCandidates
    .map((value) => normalizePosterCanonicalValue(value))
    .filter(Boolean)
  return Array.from(new Set(keys))
}

function getPreferredRegionTokens(region?: string | null): string[] {
  if (!region) return []
  const normalized = region.toLowerCase()
  if (normalized.includes('usa') || normalized.includes('us')) return ['(us)', '(usa)', '(jp-us)']
  if (normalized.includes('japan') || normalized.includes('jp')) return ['(jp)', '(japan)']
  if (normalized.includes('europe') || normalized.includes('eur')) return ['(eu)', '(europe)']
  if (normalized.includes('world')) return ['(world)', '(jp-us)', '(us)', '(usa)']
  return []
}

function sortGames(
  games: LumioplayGame[],
  platform: LumioplayPlatformId,
  query: string,
  lang: LumioplayLang,
): LumioplayGame[] {
  const normalizedQuery = query.trim().toLowerCase()
  return games
    .filter((game) => {
      const matchesPlatform = platform === 'all' || getEffectivePlatform(game) === platform
      const haystack = `${getGameDisplayTitle(game)} ${game.fileName} ${game.metadata?.searchTitle ?? ''}`.toLowerCase()
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
      return matchesPlatform && matchesQuery
    })
    .sort((left, right) => {
      if (!!left.favorite !== !!right.favorite) return left.favorite ? -1 : 1
      if (!!left.missing !== !!right.missing) return left.missing ? 1 : -1
      const leftPlayed = left.lastPlayedAt ?? ''
      const rightPlayed = right.lastPlayedAt ?? ''
      if (leftPlayed !== rightPlayed) return rightPlayed.localeCompare(leftPlayed)
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), lang)
    })
}

// Cover art proportions differ per console: SNES/GBA boxes are landscape,
// NES/Genesis/PS1 are portrait, N64/Game Boy are near-square. Forcing every
// grid cell to a single portrait ratio squishes the landscape art.
//
// Applied as INLINE STYLES, not Tailwind classes: the plugin runtime is
// built separately from the host app, so the app's Tailwind pass never sees
// these class names and arbitrary utilities like `aspect-[4/3]` would have
// no CSS rule at all. Inline styles are self-contained.
//
// `aspectRatio` = width / height of the cover. `minColWidth` drives a
// responsive auto-fill grid — wider art gets a larger minimum so fewer,
// bigger cells fit per row.
type GridProfile = {
  aspectRatio: number
  minColWidth: number
}

const DEFAULT_GRID_PROFILE: GridProfile = { aspectRatio: 2 / 3, minColWidth: 150 }

const GRID_PROFILE_BY_PLATFORM: Record<LumioplayConsoleId, GridProfile> = {
  nes: { aspectRatio: 0.71, minColWidth: 150 },       // portrait box
  snes: { aspectRatio: 4 / 3, minColWidth: 240 },     // landscape box
  gb: { aspectRatio: 0.90, minColWidth: 165 },        // small near-square box
  gbc: { aspectRatio: 0.90, minColWidth: 165 },
  gba: { aspectRatio: 3 / 2, minColWidth: 235 },      // landscape box
  genesis: { aspectRatio: 0.72, minColWidth: 150 },   // tall VHS-style box
  n64: { aspectRatio: 0.92, minColWidth: 185 },       // near-square box
  ps1: { aspectRatio: 0.69, minColWidth: 150 },       // portrait jewel case
}

function getGridProfileForPlatform(platform: LumioplayPlatformId): GridProfile {
  if (platform === 'all') return DEFAULT_GRID_PROFILE
  return GRID_PROFILE_BY_PLATFORM[platform] ?? DEFAULT_GRID_PROFILE
}

function gridContainerStyle(profile: GridProfile): CSSProperties {
  return {
    display: 'grid',
    gap: '0.75rem',
    gridTemplateColumns: `repeat(auto-fill, minmax(${profile.minColWidth}px, 1fr))`,
  }
}

function PlatformChips({
  active,
  onChange,
  games,
}: {
  active: LumioplayPlatformId
  onChange: (value: LumioplayPlatformId) => void
  games: LumioplayGame[]
}) {
  const availablePlatformIds = Array.from(new Set(games.map((game) => getEffectivePlatform(game))))
  const availablePlatforms = LUMIOPLAY_PLATFORMS.filter(
    (platform) => platform.id !== 'all' && availablePlatformIds.includes(platform.id),
  )

  if (availablePlatforms.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {availablePlatforms.map((platform) => {
        const selected = platform.id === active
        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onChange(platform.id)}
            className={`h-9 rounded-full border px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] whitespace-nowrap transition-all ${
              selected
                ? activePillClass
                : neutralPillClass
            }`}
          >
            {platform.label}
          </button>
        )
      })}
    </div>
  )
}

function LibraryToolbar({
  onUploadRoms,
  onChooseFolder,
  onRescanFolders,
  onSyncPosters,
  desktopReady,
  hasSavedFolders,
  syncing,
  syncingPosters,
}: {
  onUploadRoms: () => void
  onChooseFolder: () => void
  onRescanFolders: () => void
  onSyncPosters: () => void
  desktopReady: boolean
  hasSavedFolders: boolean
  syncing: boolean
  syncingPosters: boolean
}) {
  const { t } = useLang()
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onUploadRoms}
        className={`${cardButtonClass} ${activePillClass}`}
      >
        {desktopReady ? t('browserImportRoms') : t('browserUploadRoms')}
      </button>
      <button
        type="button"
        onClick={onChooseFolder}
        className={`${cardButtonClass} ${neutralPillClass}`}
      >
        {t('browserChooseFolder')}
      </button>
      {desktopReady && hasSavedFolders ? (
        <button
          type="button"
          onClick={onRescanFolders}
          className={`${cardButtonClass} ${syncing ? activePillClass : neutralPillClass}`}
        >
          {syncing ? t('browserSyncing') : t('browserSyncNow')}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSyncPosters}
        className={`${cardButtonClass} ${syncingPosters ? activePillClass : neutralPillClass}`}
      >
        {syncingPosters ? t('browserCancelPosterSync') : t('browserSyncPosters')}
      </button>
    </div>
  )
}

function StarButton({
  active,
  onClick,
}: {
  active: boolean
  onClick: () => void
}) {
  const { t } = useLang()
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-all ${
        active
          ? 'border-accent-400/50 bg-accent-400/10 text-accent-300'
          : 'border-white/10 bg-black/25 text-slate-400 hover:border-white/20 hover:text-white'
      }`}
      aria-label={active ? t('browserRemoveFavorite') : t('browserAddFavorite')}
    >
      ★
    </button>
  )
}

function GamesGrid({
  games,
  activePlatform,
  launchState,
  editingGameId,
  onEditGame,
  onToggleFavorite,
  onLaunch,
  onPlatformOverrideChange,
  onCoreOverrideChange,
}: {
  games: LumioplayGame[]
  activePlatform: LumioplayPlatformId
  launchState: { gameId: string | null; message: string | null }
  editingGameId: string | null
  onEditGame: (gameId: string | null) => void
  onToggleFavorite: (gameId: string) => void
  onLaunch: (game: LumioplayGame) => void
  onPlatformOverrideChange: (gameId: string, platform: LumioplayConsoleId | null) => void
  onCoreOverrideChange: (gameId: string, coreId: string | null) => void
}) {
  const { t } = useLang()
  const platformOptions = getPlatformOptions()
  const coreSuggestions = getCoreSuggestions()
  const gridProfile = getGridProfileForPlatform(activePlatform)

  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-sm text-slate-400">
        {t('browserEmptyLibrary')}
      </div>
    )
  }

  return (
    <div style={gridContainerStyle(gridProfile)}>
      {games.map((game) => {
        const effectivePlatform = getEffectivePlatform(game)
        const effectiveCore = getEffectiveCoreId(game)
        const editing = editingGameId === game.id
        const displayCoverUrl = game.coverUrl ?? game.metadata?.coverUrl ?? null
        const posterAspectRatio = getGridProfileForPlatform(effectivePlatform).aspectRatio
        const regionLabel = getRegionLabel(game.metadata?.region, t)

        return (
          <div
            key={game.id}
            className={`group w-full cursor-pointer bg-transparent text-left transition-all duration-300 hover:-translate-y-1 ${game.missing ? 'opacity-70' : ''}`}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" style={{ aspectRatio: String(posterAspectRatio) }}>
              {displayCoverUrl ? (
                <img
                  src={displayCoverUrl}
                  alt={getGameDisplayTitle(game)}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
                <span className="rounded-full border border-white/[0.08] bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm">
                  {getPlatformLabel(effectivePlatform, t)}
                </span>
                <StarButton active={Boolean(game.favorite)} onClick={() => onToggleFavorite(game.id)} />
              </div>
              {game.missing ? (
                <div className="absolute bottom-2 left-2">
                  <span className="rounded-full bg-rose-500/80 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">{t('browserMissing')}</span>
                </div>
              ) : null}
            </div>
            <div className="p-2.5">
              <p className="text-[9px] uppercase tracking-[0.22em] text-slate-300/60">
                {effectiveCore ?? t('browserNoCore')}
                {formatFileSize(game.fileSizeBytes) ? ` · ${formatFileSize(game.fileSizeBytes)}` : ''}
              </p>
              <h3 className="mt-0.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-white">
                {getGameDisplayTitle(game)}
              </h3>
              {regionLabel ? (
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-400">{regionLabel}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLaunch(game)}
                  disabled={!canLaunchGame(game) || launchState.gameId === game.id}
                  className={`${cardButtonClass} ${
                    canLaunchGame(game)
                      ? 'border-accent-500/40 bg-accent-500/90 text-white hover:bg-accent-500'
                      : `cursor-not-allowed ${neutralPillClass} opacity-50`
                  }`}
                >
                  {launchState.gameId === game.id ? t('starting') : t('browserPlay')}
                </button>
                <button
                  type="button"
                  onClick={() => onEditGame(editing ? null : game.id)}
                  className={`${cardButtonClass} ${neutralPillClass}`}
                >
                  {editing ? t('browserDone') : t('browserCustomize')}
                </button>
              </div>
              {!canLaunchGame(game) && !game.missing ? (
                <p className="mt-1 text-[11px] text-slate-500">
                  {isPluginDesktopHost() ? t('browserImportHint') : t('browserDesktopRequired')}
                </p>
              ) : null}
              {editing ? (
                <div className="mt-3 space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('browserConsole')}</label>
                    <select
                      value={game.platformOverride ?? ''}
                      onChange={(event) =>
                        onPlatformOverrideChange(
                          game.id,
                          event.target.value ? (event.target.value as LumioplayConsoleId) : null,
                        )
                      }
                      className="h-10 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white outline-none"
                    >
                      <option value="">
                        {t('browserAutoDetect').replace('{platform}', getPlatformLabel(game.platform, t))}
                      </option>
                      {platformOptions.map((platform) => (
                        <option key={platform} value={platform}>
                          {getPlatformLabel(platform, t)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('browserLibretroCore')}</label>
                    <input
                      list={`core-suggestions-${game.id}`}
                      value={game.coreOverride ?? ''}
                      onChange={(event) => onCoreOverrideChange(game.id, event.target.value || null)}
                      placeholder={effectiveCore ?? t('browserCoreIdPlaceholder')}
                      className="h-10 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white placeholder:text-slate-500 outline-none"
                    />
                    <datalist id={`core-suggestions-${game.id}`}>
                      {coreSuggestions.map((coreId) => (
                        <option key={coreId} value={coreId} />
                      ))}
                    </datalist>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function LumioplayBrowsePage(_props: BrowsePageProps) {
  const { lang, t } = useLang()
  const [games, setGames] = useState<LumioplayGame[]>(() => getStoredGames())
  const [platform, setPlatform] = useState<LumioplayPlatformId>('all')
  const [query, setQuery] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [launchState, setLaunchState] = useState<{ gameId: string | null; message: string | null }>({
    gameId: null,
    message: null,
  })
  const [editingGameId, setEditingGameId] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [desktopReady, setDesktopReady] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)
  const gameContainerRef = useRef<HTMLDivElement | null>(null)
  const syncInFlightRef = useRef(false)
  const keyboardStateRef = useRef<boolean[]>(Array(JOYPAD_BUTTON_COUNT).fill(false))
  const gamepadStateRef = useRef<boolean[]>(Array(JOYPAD_BUTTON_COUNT).fill(false))
  const lastSentStateRef = useRef<boolean[]>(Array(JOYPAD_BUTTON_COUNT).fill(false))
  const savedFolders = getRomFolders()
  const autoSyncEnabled = getAutoSyncEnabled()
  const autoSyncIntervalSeconds = getAutoSyncIntervalSeconds()

  useEffect(() => {
    setDesktopReady(isPluginDesktopHost())
  }, [])

  function mergeInputStates(): boolean[] {
    return Array.from({ length: JOYPAD_BUTTON_COUNT }, (_, index) => {
      return Boolean(keyboardStateRef.current[index] || gamepadStateRef.current[index])
    })
  }

  function pushInputState() {
    const merged = mergeInputStates()
    const changed = merged.some((pressed, index) => pressed !== lastSentStateRef.current[index])
    if (!changed) return
    lastSentStateRef.current = merged
    void sendLibretroInput([...merged])
  }

  function stopActiveGame() {
    void stopLibretroGame()
    keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
    gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
    lastSentStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
    void sendLibretroInput(Array(JOYPAD_BUTTON_COUNT).fill(false))
    setGameActive(false)
  }

  useEffect(() => {
    if (!gameActive) return

    function onKeyDown(event: KeyboardEvent) {
      event.preventDefault()
      if (event.code === 'Escape') {
        stopActiveGame()
        return
      }
      const index = KEYBOARD_TO_JOYPAD[event.code]
      if (index !== undefined && !keyboardStateRef.current[index]) {
        keyboardStateRef.current[index] = true
        pushInputState()
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      const index = KEYBOARD_TO_JOYPAD[event.code]
      if (index !== undefined && keyboardStateRef.current[index]) {
        keyboardStateRef.current[index] = false
        pushInputState()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    gameContainerRef.current?.focus()
    return () => {
      keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      pushInputState()
    }
  }, [gameActive])

  useEffect(() => {
    if (!gameActive) return
    let rafId = 0
    let comboHeld = false
    const gamepadMapping = getGamepadMapping()
    const exitCombo = getGamepadExitCombo()

    function onFrame() {
      const pad = navigator.getGamepads?.().find((entry) => Boolean(entry)) ?? null
      const nextState = Array(JOYPAD_BUTTON_COUNT).fill(false)

      if (pad) {
        Object.entries(gamepadMapping).forEach(([joypadIndexRaw, gamepadButtonRaw]) => {
          const joypadIndex = Number(joypadIndexRaw)
          if (!Number.isFinite(joypadIndex)) return
          if (joypadIndex < 0 || joypadIndex >= JOYPAD_BUTTON_COUNT) return
          const pressed = isMappingPressed(String(gamepadButtonRaw), pad)
          nextState[joypadIndex] = pressed
        })

        const comboPressed =
          exitCombo.length > 0 &&
          exitCombo.every((buttonIndex) => Boolean(pad.buttons[buttonIndex]?.pressed))

        if (comboPressed && !comboHeld) {
          comboHeld = true
          stopActiveGame()
          return
        }
        if (!comboPressed) {
          comboHeld = false
        }
      }

      gamepadStateRef.current = nextState
      pushInputState()
      rafId = window.requestAnimationFrame(onFrame)
    }

    rafId = window.requestAnimationFrame(onFrame)
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
      pushInputState()
    }
  }, [gameActive])

  useEffect(() => {
    if (!gameActive) return
    const unlisten = onLibretroStopped(() => {
      setGameActive(false)
      keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
      gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
      lastSentStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
    })
    return unlisten
  }, [gameActive])

  useEffect(() => {
    if (!gameActive || !gameContainerRef.current) return

    function syncBounds() {
      const element = gameContainerRef.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const overscanTop = Math.min(GAME_OVERLAY_TOP_OVERSCAN, rect.top)
      void setLibretroBounds(
        rect.left,
        rect.top - overscanTop,
        rect.width,
        rect.height + overscanTop,
        window.innerHeight,
        window.devicePixelRatio,
      )
    }

    syncBounds()
    gameContainerRef.current.focus()
    const resizeObserver = new ResizeObserver(syncBounds)
    resizeObserver.observe(gameContainerRef.current)
    window.addEventListener('resize', syncBounds)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', syncBounds)
    }
  }, [gameActive])
  const availablePlatformIds = Array.from(new Set(games.map((game) => getEffectivePlatform(game))))
  const resolvedPlatform =
    platform !== 'all' && availablePlatformIds.includes(platform as LumioplayConsoleId)
      ? platform
      : (availablePlatformIds[0] ?? 'all')

  const filteredGames = useMemo(
    () => sortGames(games, resolvedPlatform, query, lang),
    [games, resolvedPlatform, query, lang],
  )

  function refreshGames() {
    setGames(getStoredGames())
  }

  const [syncingPosters, setSyncingPosters] = useState(false)
  const [posterSyncProgress, setPosterSyncProgress] = useState<{ processed: number; total: number; resolved: number } | null>(null)
  const posterSyncInFlightRef = useRef(false)
  const posterSyncCancelRequestedRef = useRef(false)
  const posterSyncMissCacheRef = useRef(new Map<string, number>())
  const posterSyncMissCacheDirtyRef = useRef(false)
  const posterIndexCacheRef = useRef(
    new Map<LumioplayConsoleId, { fetchedAt: number; entries: string[] }>(),
  )

  function loadPosterMissCache() {
    try {
      const raw = getScopedStorageItem(POSTER_SYNC_MISS_CACHE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Record<string, number>
      const now = Date.now()
      const next = new Map<string, number>()
      Object.entries(parsed).forEach(([url, expiresAt]) => {
        if (!url || !Number.isFinite(expiresAt)) return
        if (expiresAt > now) next.set(url, expiresAt)
      })
      posterSyncMissCacheRef.current = next
      posterSyncMissCacheDirtyRef.current = false
    } catch {
      posterSyncMissCacheRef.current = new Map<string, number>()
      posterSyncMissCacheDirtyRef.current = false
    }
  }

  function savePosterMissCache() {
    if (!posterSyncMissCacheDirtyRef.current) return
    const now = Date.now()
    const entries = Array.from(posterSyncMissCacheRef.current.entries())
      .filter(([, expiresAt]) => expiresAt > now)
      .sort((a, b) => b[1] - a[1])
      .slice(0, POSTER_SYNC_MAX_MISS_ENTRIES)
    const payload: Record<string, number> = {}
    entries.forEach(([url, expiresAt]) => {
      payload[url] = expiresAt
    })
    setScopedStorageItem(POSTER_SYNC_MISS_CACHE_KEY, JSON.stringify(payload))
    posterSyncMissCacheRef.current = new Map(entries)
    posterSyncMissCacheDirtyRef.current = false
  }

  function isMissCached(url: string): boolean {
    const expiresAt = posterSyncMissCacheRef.current.get(url)
    if (!expiresAt) return false
    if (expiresAt > Date.now()) return true
    posterSyncMissCacheRef.current.delete(url)
    posterSyncMissCacheDirtyRef.current = true
    return false
  }

  function markMissCached(url: string) {
    posterSyncMissCacheRef.current.set(url, Date.now() + POSTER_SYNC_MISS_TTL_MS)
    posterSyncMissCacheDirtyRef.current = true
  }

  function clearMissCached(url: string) {
    if (!posterSyncMissCacheRef.current.has(url)) return
    posterSyncMissCacheRef.current.delete(url)
    posterSyncMissCacheDirtyRef.current = true
  }

  useEffect(() => {
    loadPosterMissCache()
  }, [])

  function getPosterCandidates(game: LumioplayGame): string[] {
    const existing = Array.isArray(game.metadata?.coverCandidates) ? game.metadata?.coverCandidates ?? [] : []
    const generated = buildCoverCandidates(getEffectivePlatform(game), getGameDisplayTitle(game), game.fileName)
    return Array.from(new Set([...generated, ...existing])).slice(0, 48)
  }

  async function getPosterIndexEntries(platform: LumioplayConsoleId): Promise<string[]> {
    const cached = posterIndexCacheRef.current.get(platform)
    if (cached && Date.now() - cached.fetchedAt < POSTER_INDEX_CACHE_TTL_MS) {
      return cached.entries
    }

    const systemName = SYSTEM_NAME_BY_PLATFORM[platform]
    if (!systemName) return []
    const indexUrl = `https://thumbnails.libretro.com/${encodeURIComponent(systemName)}/Named_Boxarts/`
    let entries: string[] = []
    try {
      const response = await fetch(indexUrl, { cache: 'no-store' })
      if (response.ok) {
        const html = await response.text()
        const matches = html.match(/href="([^"]+\.png)"/gi) ?? []
        entries = Array.from(
          new Set(
            matches
              .map((raw) => safeDecodePosterEntry(raw.replace(/^href="/i, '').replace(/"$/i, '')))
              .filter(Boolean),
          ),
        )
      }
    } catch {
      // Fallback below.
    }

    // Browser CORS can block direct directory fetches from thumbnails.libretro.com.
    // Fallback to libretro-thumbnails GitHub tree (CORS-friendly) to build the same index.
    if (entries.length === 0) {
      const repoSlug = systemNameToLibretroRepoSlug(systemName)
      const treeUrl = `https://api.github.com/repos/libretro-thumbnails/${repoSlug}/git/trees/master?recursive=1`
      try {
        const treeResponse = await fetch(treeUrl, {
          cache: 'no-store',
          headers: { Accept: 'application/vnd.github+json' },
        })
        if (treeResponse.ok) {
          const payload = (await treeResponse.json()) as {
            tree?: Array<{ path?: string; type?: string }>
          }
          entries = Array.from(
            new Set(
              (payload.tree ?? [])
                .filter((node) => node.type === 'blob' && typeof node.path === 'string')
                .map((node) => node.path as string)
                .filter((path) => path.startsWith('Named_Boxarts/') && path.toLowerCase().endsWith('.png'))
                .map((path) => path.slice('Named_Boxarts/'.length))
                .filter(Boolean),
            ),
          )
        }
      } catch {
        // Keep empty on failure.
      }
    }

    posterIndexCacheRef.current.set(platform, { fetchedAt: Date.now(), entries })
    return entries
  }

function rankPosterEntryForGame(entry: string, game: LumioplayGame): number {
  const decoded = safeDecodePosterEntry(entry)
  const normalizedEntry = normalizePosterLookupValue(decoded)
  if (!normalizedEntry) return -1000

    const displayTitle = normalizePosterLookupValue(getGameDisplayTitle(game))
    const fileTitle = normalizePosterLookupValue(stripLikelyFileExtension(game.fileName))
    const titleTokens = Array.from(
      new Set(
        [...buildPosterLookupTokens(displayTitle), ...buildPosterLookupTokens(fileTitle)].filter(
          (token) => !['the', 'and', 'for', 'with'].includes(token),
        ),
      ),
    )
    if (titleTokens.length === 0) return -1000

    const normalizedEntryCanonical = normalizePosterCanonicalValue(decoded)
    const displayCanonical = normalizePosterCanonicalValue(getGameDisplayTitle(game))
    const fileCanonical = normalizePosterCanonicalValue(stripLikelyFileExtension(game.fileName))

    let score = 0
    if (normalizedEntry.startsWith(displayTitle)) score += 80
    if (displayTitle && normalizedEntry.includes(displayTitle)) score += 40
    if (fileTitle && normalizedEntry.includes(fileTitle)) score += 30
    if (displayCanonical && normalizedEntryCanonical === displayCanonical) score += 120
    if (fileCanonical && normalizedEntryCanonical === fileCanonical) score += 80

    const tokenHits = titleTokens.reduce((hits, token) => hits + (normalizedEntry.includes(token) ? 1 : 0), 0)
    score += tokenHits * 8
    score -= Math.max(0, titleTokens.length - tokenHits) * 6

    const wantedCanonicalTokens = Array.from(
      new Set([...extractCanonicalTokens(getGameDisplayTitle(game)), ...extractCanonicalTokens(game.fileName)]),
    )
    if (wantedCanonicalTokens.length > 0) {
      const entryCanonicalTokens = new Set(extractCanonicalTokens(decoded))
      const overlapCount = wantedCanonicalTokens.reduce(
        (hits, token) => hits + (entryCanonicalTokens.has(token) ? 1 : 0),
        0,
      )
      const overlapRatio = overlapCount / wantedCanonicalTokens.length
      score += overlapCount * 10
      score += Math.round(overlapRatio * 30)
      if (overlapCount === 0) score -= 60
    }

    const gameHasSequenceToken = hasNumericOrRomanToken(getGameDisplayTitle(game)) || hasNumericOrRomanToken(game.fileName)
    const entryHasSequenceToken = hasNumericOrRomanToken(decoded)
    if (!gameHasSequenceToken && entryHasSequenceToken) score -= 22

    if (/\[(h|b|t|p)/i.test(decoded)) score -= 45
    if (/\(19xx\)|\(-\)/i.test(decoded)) score -= 30
    if (/\(nintendo\)|\(konami\)|\(capcom\)|\(sega\)|\(namco\)/i.test(decoded)) score += 8

    const regionHints = getPreferredRegionTokens(game.metadata?.region)
    if (regionHints.length > 0) {
      const lower = decoded.toLowerCase()
      if (regionHints.some((token) => lower.includes(token))) score += 18
    }

    return score
  }

  function clearMissCacheForGames(gamesToClear: LumioplayGame[]) {
    if (gamesToClear.length === 0) return
    const missMap = posterSyncMissCacheRef.current
    if (missMap.size === 0) return
    let changed = false

    gamesToClear.forEach((game) => {
      getPosterCandidates(game).forEach((url) => {
        if (missMap.delete(url)) changed = true
      })

      const platform = getEffectivePlatform(game)
      const systemName = SYSTEM_NAME_BY_PLATFORM[platform]
      if (!systemName) return
      const systemPath = `/${encodeURIComponent(systemName)}/Named_Boxarts/`
      const displayTitle = normalizePosterLookupValue(getGameDisplayTitle(game))
      const fileTitle = normalizePosterLookupValue(stripLikelyFileExtension(game.fileName))
      const probeTerms = Array.from(new Set([...buildPosterLookupTokens(displayTitle), ...buildPosterLookupTokens(fileTitle)]))

      Array.from(missMap.keys()).forEach((url) => {
        if (!url.includes(systemPath)) return
        const entry = safeDecodePosterEntry((url.split('/').pop() ?? '').replace(/\.png$/i, ''))
        const normalizedEntry = normalizePosterLookupValue(entry)
        const matchesByTerm = probeTerms.length === 0 || probeTerms.some((term) => normalizedEntry.includes(term))
        if (matchesByTerm && missMap.delete(url)) changed = true
      })
    })

    if (changed) posterSyncMissCacheDirtyRef.current = true
  }

  async function resolvePosterFromIndex(game: LumioplayGame, options?: { forceRefresh?: boolean }): Promise<string | null> {
    const platform = getEffectivePlatform(game)
    const entries = await getPosterIndexEntries(platform)
    if (entries.length === 0) return null

    const displayTitle = normalizePosterLookupValue(getGameDisplayTitle(game))
    const fileTitle = normalizePosterLookupValue(stripLikelyFileExtension(game.fileName))
    const probeTerms = Array.from(new Set([...buildPosterLookupTokens(displayTitle), ...buildPosterLookupTokens(fileTitle)]))
    const strictLookupKeys = new Set(buildCanonicalGameKeys(game))

    const exactMatch = entries.find((entry) => {
      const normalizedEntry = normalizePosterCanonicalValue(safeDecodePosterEntry(entry).replace(/\.png$/i, ''))
      return normalizedEntry.length > 0 && strictLookupKeys.has(normalizedEntry)
    })
    if (exactMatch) {
      const systemName = SYSTEM_NAME_BY_PLATFORM[platform]
      const exactUrl = buildNamedBoxartUrl(systemName, exactMatch)
      if (options?.forceRefresh || !isMissCached(exactUrl)) {
        const resolvedExact = await resolveFirstReachableCoverUrl([exactUrl], { timeoutMs: 2500, maxCandidates: 1 })
        if (resolvedExact) return resolvedExact
        markMissCached(exactUrl)
      }
    }

    const buildShortlist = (relaxed: boolean): Array<{ entry: string; score: number }> =>
      entries
        .filter((entry) => {
          const normalizedEntry = normalizePosterLookupValue(safeDecodePosterEntry(entry))
          const canonicalEntry = normalizePosterCanonicalValue(safeDecodePosterEntry(entry))
          if (canonicalEntry.length > 0 && strictLookupKeys.has(canonicalEntry)) return true
          if (probeTerms.length === 0) return true
          const termHits = probeTerms.reduce((hits, term) => hits + (normalizedEntry.includes(term) ? 1 : 0), 0)
          const requiredHits = relaxed
            ? 1
            : probeTerms.length >= 5
              ? 1
              : Math.min(2, Math.max(1, probeTerms.length))
          return termHits >= requiredHits
        })
        .map((entry) => ({ entry, score: rankPosterEntryForGame(entry, game) }))
        .filter((candidate) => candidate.score > (relaxed ? -40 : -8))
        .sort((left, right) => right.score - left.score)
        .slice(0, relaxed ? 120 : 40)

    let shortlist = buildShortlist(false)
    if (shortlist.length === 0) {
      shortlist = buildShortlist(true)
    }

    if (shortlist.length === 0) return null

    const systemName = SYSTEM_NAME_BY_PLATFORM[platform]
    const urls = shortlist.map((candidate) => buildNamedBoxartUrl(systemName, candidate.entry))
    const filteredUrls = options?.forceRefresh ? urls : urls.filter((url) => !isMissCached(url))
    const retryUrls = filteredUrls.length > 0 ? filteredUrls : urls.slice(0, 30)
    if (retryUrls.length === 0) return null
    // Index entries come from the upstream directory listing, so we can trust they exist.
    // Returning the top-ranked URL directly avoids false negatives from image-probe timeouts.
    return retryUrls[0]
  }

  async function resolvePosterCoverForGame(game: LumioplayGame, options?: { forceRefresh?: boolean }): Promise<string | null> {
    const candidates = getPosterCandidates(game)
    const allowedCandidates = options?.forceRefresh ? candidates : candidates.filter((url) => !isMissCached(url))
    if (allowedCandidates.length > 0) {
      const resolvedDirect = await resolveFirstReachableCoverUrl(allowedCandidates, { timeoutMs: 2500, maxCandidates: 24 })
      if (resolvedDirect) {
        clearMissCached(resolvedDirect)
        return resolvedDirect
      }
      allowedCandidates.forEach((url) => markMissCached(url))
    }

    const resolvedFromIndex = await resolvePosterFromIndex(game, options)
    if (resolvedFromIndex) clearMissCached(resolvedFromIndex)
    return resolvedFromIndex
  }

  async function syncPostersForGames(
    sourceGames: LumioplayGame[],
    options?: { limit?: number; silent?: boolean; onlyMissing?: boolean; forceRefresh?: boolean },
  ): Promise<void> {
    if (posterSyncInFlightRef.current) return
    posterSyncInFlightRef.current = true
    posterSyncCancelRequestedRef.current = false
    setSyncingPosters(true)
    try {
      loadPosterMissCache()
      const onlyMissing = options?.onlyMissing ?? true
      const candidates = sourceGames.filter((game) => {
        if (game.missing) return false
        if (!onlyMissing) return true
        return !game.coverUrl
      })
      const limited = candidates.slice(0, Math.max(0, options?.limit ?? candidates.length))
      if (limited.length === 0) {
        if (!options?.silent) setStatusMessage(t('browserNoMissingPosters'))
        return
      }
      if (options?.forceRefresh) {
        clearMissCacheForGames(limited)
      }

      let resolvedCount = 0
      let processedCount = 0
      let cancelled = false
      setPosterSyncProgress({ processed: 0, total: limited.length, resolved: 0 })

      for (let start = 0; start < limited.length; start += POSTER_SYNC_BATCH_SIZE) {
        if (posterSyncCancelRequestedRef.current) {
          cancelled = true
          break
        }
        const batch = limited.slice(start, start + POSTER_SYNC_BATCH_SIZE)
        const updates: Array<{ gameId: string; coverUrl: string | null }> = []

        for (let idx = 0; idx < batch.length; idx += POSTER_SYNC_CONCURRENCY) {
          if (posterSyncCancelRequestedRef.current) {
            cancelled = true
            break
          }
          const chunk = batch.slice(idx, idx + POSTER_SYNC_CONCURRENCY)
          const chunkResults = await Promise.all(
            chunk.map(async (game) => ({
              gameId: game.id,
              coverUrl: await resolvePosterCoverForGame(game, { forceRefresh: options?.forceRefresh }).catch(() => null),
            })),
          )
          chunkResults.forEach((result) => {
            processedCount += 1
            if (result.coverUrl) {
              resolvedCount += 1
              updates.push(result)
            }
          })
          setPosterSyncProgress({ processed: processedCount, total: limited.length, resolved: resolvedCount })
        }

        if (updates.length > 0) {
          setGameCoversBatch(updates)
          refreshGames()
        }
        if (cancelled) break
        await new Promise((resolve) => window.setTimeout(resolve, 180))
      }

      if (!options?.silent) {
        const unmatchedCount = Math.max(0, processedCount - resolvedCount)
        const key = cancelled
          ? 'browserPosterSyncCancelled'
          : options?.forceRefresh
            ? 'browserPosterSyncForced'
            : 'browserPosterSyncDone'
        setStatusMessage(
          t(key)
            .replace('{resolved}', String(resolvedCount))
            .replace('{processed}', String(processedCount))
            .replace('{unmatched}', String(unmatchedCount)),
        )
      }
    } catch (error) {
      if (!options?.silent) {
        const message = error instanceof Error ? error.message : t('browserPosterSyncFailed')
        setStatusMessage(message || t('browserPosterSyncFailed'))
      }
    } finally {
      savePosterMissCache()
      posterSyncInFlightRef.current = false
      posterSyncCancelRequestedRef.current = false
      setSyncingPosters(false)
      window.setTimeout(() => setPosterSyncProgress(null), 1800)
    }
  }

  function persistImportedGames(nextGames: LumioplayGame[], sourceLabel: string) {
    if (nextGames.length === 0) {
      setStatusMessage(t('browserNoSupportedRoms').replace('{source}', sourceLabel))
      return
    }
    const merged = upsertImportedGames(nextGames)
    setGames(merged)
    setStatusMessage(
      t('browserImportedGames')
        .replace('{count}', String(nextGames.length))
        .replace('{source}', sourceLabel),
    )
    void syncPostersForGames(nextGames, { limit: POSTER_SYNC_AUTO_LIMIT, silent: true, onlyMissing: true })
  }

  async function importIndexedDirectory(directory: string) {
    const indexedFiles = await scanPluginDirectory(
      directory,
      IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace('.', '')),
    )
    if (!indexedFiles?.length) {
      setStatusMessage(t('browserNoSupportedRoms').replace('{source}', directory))
      return
    }

    const importedGames = indexedFiles
      .map((file) =>
        createImportedGame({
          fileName: file.fileName,
          romPath: file.path,
          source: 'folder',
          sourceFolder: directory,
          fileSizeBytes: file.sizeBytes ?? null,
        }),
      )
      .filter((game): game is LumioplayGame => Boolean(game))

    const merged = syncFolderGames(directory, importedGames)
    setGames(merged)
    setStatusMessage(
      t('browserSyncedGames')
        .replace('{count}', String(importedGames.length))
        .replace('{source}', directory),
    )
    void syncPostersForGames(importedGames, { limit: POSTER_SYNC_AUTO_LIMIT, silent: true, onlyMissing: true })
  }

  async function syncSavedFolders(silent = false) {
    if (!desktopReady || !savedFolders.length || syncInFlightRef.current) return
    syncInFlightRef.current = true
    setSyncing(true)
    let totalFound = 0

    try {
      for (const folder of savedFolders) {
        const indexedFiles = await scanPluginDirectory(
          folder,
          IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace('.', '')),
        )

        const importedGames = (indexedFiles ?? [])
          .map((file) =>
            createImportedGame({
              fileName: file.fileName,
              romPath: file.path,
              source: 'folder',
              sourceFolder: folder,
              fileSizeBytes: file.sizeBytes ?? null,
            }),
          )
          .filter((game): game is LumioplayGame => Boolean(game))

        totalFound += importedGames.length
        syncFolderGames(folder, importedGames)
      }

      refreshGames()
      if (totalFound > 0) {
        const currentGames = getStoredGames()
        void syncPostersForGames(currentGames, { limit: POSTER_SYNC_AUTO_LIMIT, silent: true, onlyMissing: true })
      }
      if (!silent) {
        setStatusMessage(
          totalFound > 0
            ? t('browserSyncedFromSavedFolders').replace('{count}', String(totalFound))
            : t('browserNoRomsInSavedFolders'),
        )
      }
    } finally {
      syncInFlightRef.current = false
      setSyncing(false)
    }
  }

  async function handleNativeImport() {
    const paths = await pickPluginFiles([
      { name: t('browserRomFilesFilter'), extensions: IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace('.', '')) },
    ])
    if (!paths?.length) return
    const importedGames = paths
      .map((romPath) => {
        const fileName = romPath.split(/[\\/]/).pop() ?? romPath
        return createImportedGame({
          fileName,
          romPath,
          source: 'upload',
        })
      })
      .filter((game): game is LumioplayGame => Boolean(game))
    persistImportedGames(importedGames, t('browserSourceDesktopImport'))
  }

  async function handleNativeFolderPick() {
    try {
      const folder = await pickPluginFolder()
      if (!folder) return
      const existingFolders = new Set(getRomFolders())
      existingFolders.add(folder)
      setRomFolders(Array.from(existingFolders))
      await importIndexedDirectory(folder)
    } catch (error) {
      const message = error instanceof Error ? error.message : t('browserAddFolderFailed')
      setStatusMessage(message)
    }
  }

  function handleFilesSelected(fileList: FileList | null, source: 'upload' | 'folder') {
    const files = Array.from(fileList ?? [])
    const importedGames = files
      .map((file) =>
        createImportedGame({
          fileName: file.name,
          romPath: source === 'folder' ? file.webkitRelativePath || file.name : file.name,
          source,
          sourceFolder: source === 'folder'
            ? (file.webkitRelativePath.includes('/') ? file.webkitRelativePath.split('/')[0] : WEB_FOLDER_SOURCE_ID)
            : null,
          fileSizeBytes: file.size,
        }),
      )
      .filter((game): game is LumioplayGame => Boolean(game))
    persistImportedGames(
      importedGames,
      source === 'folder' ? t('browserSourceSelectedFolder') : t('browserSourceUpload'),
    )
  }

  async function handleLaunch(game: LumioplayGame) {
    setLaunchState({ gameId: game.id, message: null })
    try {
      if (canLaunchLibretro(game)) {
        await launchLibretroGameEmbedded(game)
        const updated = markGameLaunched(game.id)
        setGames(updated)
        setGameActive(true)
        keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
        gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
        lastSentStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false)
        setStatusMessage(t('browserStartedInLumio').replace('{title}', getGameDisplayTitle(game)))
      } else if (canLaunchGame(game)) {
        await launchGameWithRetroArch(game)
        const updated = markGameLaunched(game.id)
        setGames(updated)
        setStatusMessage(t('browserStartedInRetroArch').replace('{title}', getGameDisplayTitle(game)))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('browserLaunchFailed')
      setLaunchState({ gameId: null, message })
      setStatusMessage(message)
      return
    }
    setLaunchState({ gameId: null, message: null })
  }

  useEffect(() => {
    if (!desktopReady || !autoSyncEnabled || savedFolders.length === 0) return

    void syncSavedFolders(true)

    const intervalId = window.setInterval(() => {
      void syncSavedFolders(true)
    }, autoSyncIntervalSeconds * 1000)

    const handleFocus = () => {
      refreshGames()
      void syncSavedFolders(true)
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshGames()
        void syncSavedFolders(true)
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [desktopReady, autoSyncEnabled, autoSyncIntervalSeconds, savedFolders.join('|')])

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Lumioplay</p>
          <h1 className="text-3xl font-semibold text-white">{t('browserTitle')}</h1>
        </div>
        <LibraryToolbar
          onUploadRoms={() => {
            if (desktopReady) {
              void handleNativeImport()
              return
            }
            uploadInputRef.current?.click()
          }}
          onChooseFolder={() => {
            if (desktopReady) {
              void handleNativeFolderPick()
              return
            }
            folderInputRef.current?.click()
          }}
          onRescanFolders={() => {
            void syncSavedFolders(false)
          }}
          onSyncPosters={() => {
            if (syncingPosters) {
              posterSyncCancelRequestedRef.current = true
              setStatusMessage(t('browserCancellingPosterSync'))
              return
            }
            void syncPostersForGames(getStoredGames(), { onlyMissing: true, forceRefresh: true })
          }}
          desktopReady={desktopReady}
          hasSavedFolders={savedFolders.length > 0}
          syncing={syncing}
          syncingPosters={syncingPosters}
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('browserSearchPlaceholder')}
            className="h-9 w-full max-w-xs rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-[0.8rem] text-white placeholder:text-slate-500 outline-none transition-all focus:border-accent-400/30 focus:bg-white/[0.07]"
          />
          <PlatformChips active={resolvedPlatform} onChange={setPlatform} games={games} />
        </div>
        {statusMessage ? <p className="text-sm text-slate-400">{statusMessage}</p> : null}
        {posterSyncProgress ? (
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            {t('browserPosterSyncProgress')} {posterSyncProgress.processed}/{posterSyncProgress.total}
            {' · '}
            {t('browserPosterSyncHits')} {posterSyncProgress.resolved}
          </p>
        ) : null}
        {launchState.message ? <p className="text-sm text-rose-300">{launchState.message}</p> : null}
      </div>
      <GamesGrid
        games={filteredGames}
        activePlatform={resolvedPlatform}
        launchState={launchState}
        editingGameId={editingGameId}
        onEditGame={setEditingGameId}
        onToggleFavorite={(gameId) => {
          setGames(toggleFavorite(gameId))
        }}
        onLaunch={(game) => void handleLaunch(game)}
        onPlatformOverrideChange={(gameId, nextPlatform) => {
          setGames(setGamePlatformOverride(gameId, nextPlatform))
        }}
        onCoreOverrideChange={(gameId, nextCoreId) => {
          setGames(setGameCoreOverride(gameId, nextCoreId))
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        multiple
        accept={IMPORTABLE_ROM_EXTENSIONS.join(',')}
        className="hidden"
        onChange={(event) => handleFilesSelected(event.target.files, 'upload')}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => handleFilesSelected(event.target.files, 'folder')}
        {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
      />
      {gameActive && (
        <div
          ref={gameContainerRef}
          className="fixed inset-0 z-50"
          tabIndex={-1}
          style={{
            outline: 'none',
            top: `-${GAME_OVERLAY_TOP_OVERSCAN}px`,
            height: `calc(100vh + ${GAME_OVERLAY_TOP_OVERSCAN}px)`,
            background: 'transparent',
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-transparent" />
          <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-center p-3">
            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/20 bg-black/65 px-3 py-2 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
              <button
                type="button"
                className={`${cardButtonClass} border border-white/30 bg-white/10 text-white hover:bg-white/20`}
                onClick={() => {
                  stopActiveGame()
                }}
              >
                {t('browserExitGame')}
              </button>
              <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/70 whitespace-nowrap">
                {t('browserExitHint')}
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-widest text-white/30">
            {t('browserExitHint')} · {t('browserExit')}
          </div>
        </div>
      )}
    </div>
  )
}

export function LumioplayHomeOverride({ onNavigate }: HomeOverrideProps) {
  return (
    <LumioplayBrowsePage
      pageId="lumioplay-library"
      onNavigate={onNavigate}
    />
  )
}
