'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  isPluginDesktopHost,
  pickPluginFiles,
  pickPluginFolder,
  scanPluginDirectory,
} from '@/lib/plugin-sdk'
import { getGameDisplayTitle, resolveFirstReachableCoverUrl } from './lumioplay-metadata'
import {
  createImportedGame,
  getAutoSyncEnabled,
  getAutoSyncIntervalSeconds,
  getEffectiveCoreId,
  getEffectivePlatform,
  getRomFolders,
  getStoredGames,
  IMPORTABLE_ROM_EXTENSIONS,
  LUMIOPLAY_PLATFORMS,
  markGameLaunched,
  setGameCoreOverride,
  setGameCover,
  setGamePlatformOverride,
  setRomFolders,
  syncFolderGames,
  toggleFavorite,
  upsertImportedGames,
} from './lumioplay-storage'
import {
  canLaunchGame,
  launchGameWithRetroArch,
} from './lumioplay-launcher'
import type { BrowsePageProps } from '@/lib/plugin-sdk'
import type { LumioplayConsoleId, LumioplayGame, LumioplayPlatformId } from './lumioplay-types'

const neutralPillClass =
  'border-white/10 bg-white/5 text-slate-200 hover:border-accent-400/30 hover:bg-white/10 hover:text-white'
const activePillClass =
  'border-accent-400/50 bg-accent-400/10 text-accent-300'
const cardButtonClass =
  'flex h-9 items-center rounded-full border px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] transition-all'

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

function getPlatformLabel(platform: LumioplayPlatformId): string {
  return LUMIOPLAY_PLATFORMS.find((entry) => entry.id === platform)?.label ?? platform.toUpperCase()
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

function sortGames(games: LumioplayGame[], platform: LumioplayPlatformId, query: string): LumioplayGame[] {
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
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), 'sv')
    })
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
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onUploadRoms}
        className={`${cardButtonClass} ${activePillClass}`}
      >
        {desktopReady ? 'Importera ROMs' : 'Ladda upp ROMs'}
      </button>
      <button
        type="button"
        onClick={onChooseFolder}
        className={`${cardButtonClass} ${neutralPillClass}`}
      >
        Välj mapp
      </button>
      {desktopReady && hasSavedFolders ? (
        <button
          type="button"
          onClick={onRescanFolders}
          className={`${cardButtonClass} ${syncing ? activePillClass : neutralPillClass}`}
        >
          {syncing ? 'Synkar...' : 'Synka nu'}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSyncPosters}
        disabled={syncingPosters}
        className={`${cardButtonClass} ${syncingPosters ? activePillClass : neutralPillClass}`}
      >
        {syncingPosters ? 'Hämtar posters...' : 'Synka posters'}
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-all ${
        active
          ? 'border-accent-400/50 bg-accent-400/10 text-accent-300'
          : 'border-white/10 bg-black/25 text-slate-400 hover:border-white/20 hover:text-white'
      }`}
      aria-label={active ? 'Ta bort favorit' : 'Markera som favorit'}
    >
      ★
    </button>
  )
}

function GamesGrid({
  games,
  launchState,
  editingGameId,
  onEditGame,
  onToggleFavorite,
  onLaunch,
  onPlatformOverrideChange,
  onCoreOverrideChange,
}: {
  games: LumioplayGame[]
  launchState: { gameId: string | null; message: string | null }
  editingGameId: string | null
  onEditGame: (gameId: string | null) => void
  onToggleFavorite: (gameId: string) => void
  onLaunch: (game: LumioplayGame) => void
  onPlatformOverrideChange: (gameId: string, platform: LumioplayConsoleId | null) => void
  onCoreOverrideChange: (gameId: string, coreId: string | null) => void
}) {
  const platformOptions = getPlatformOptions()
  const coreSuggestions = getCoreSuggestions()

  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-sm text-slate-400">
        Inga spel hittades ännu. Lägg till ROM-filer eller välj en ROM-mapp i inställningarna.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {games.map((game) => {
        const effectivePlatform = getEffectivePlatform(game)
        const effectiveCore = getEffectiveCoreId(game)
        const editing = editingGameId === game.id

        return (
          <div
            key={game.id}
            className={`group w-full cursor-pointer bg-transparent text-left transition-all duration-300 hover:-translate-y-1 ${game.missing ? 'opacity-70' : ''}`}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
              {game.coverUrl ? (
                <img
                  src={game.coverUrl}
                  alt={getGameDisplayTitle(game)}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
                <span className="rounded-full border border-white/[0.08] bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm">
                  {getPlatformLabel(effectivePlatform)}
                </span>
                <StarButton active={Boolean(game.favorite)} onClick={() => onToggleFavorite(game.id)} />
              </div>
              {game.missing ? (
                <div className="absolute bottom-2 left-2">
                  <span className="rounded-full bg-rose-500/80 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">Saknas</span>
                </div>
              ) : null}
            </div>
            <div className="p-2.5">
              <p className="text-[9px] uppercase tracking-[0.22em] text-slate-300/60">
                {effectiveCore ?? 'Ingen core'}
                {formatFileSize(game.fileSizeBytes) ? ` · ${formatFileSize(game.fileSizeBytes)}` : ''}
              </p>
              <h3 className="mt-0.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-white">
                {getGameDisplayTitle(game)}
              </h3>
              {game.metadata?.region ? (
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-400">{game.metadata.region}</p>
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
                  {launchState.gameId === game.id ? 'Startar...' : 'Spela'}
                </button>
                <button
                  type="button"
                  onClick={() => onEditGame(editing ? null : game.id)}
                  className={`${cardButtonClass} ${neutralPillClass}`}
                >
                  {editing ? 'Klar' : 'Anpassa'}
                </button>
              </div>
              {!canLaunchGame(game) && !game.missing ? (
                <p className="mt-1 text-[11px] text-slate-500">
                  {isPluginDesktopHost()
                    ? 'Importera via desktop picker eller välj en lokal mapp.'
                    : 'Desktop krävs för att starta spel.'}
                </p>
              ) : null}
              {editing ? (
                <div className="mt-3 space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Konsol</label>
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
                      <option value="">Autodetektering ({getPlatformLabel(game.platform)})</option>
                      {platformOptions.map((platform) => (
                        <option key={platform} value={platform}>
                          {getPlatformLabel(platform)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Libretro-core</label>
                    <input
                      list={`core-suggestions-${game.id}`}
                      value={game.coreOverride ?? ''}
                      onChange={(event) => onCoreOverrideChange(game.id, event.target.value || null)}
                      placeholder={effectiveCore ?? 'Ange core-id'}
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
  const uploadInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)
  const syncInFlightRef = useRef(false)
  const savedFolders = getRomFolders()
  const autoSyncEnabled = getAutoSyncEnabled()
  const autoSyncIntervalSeconds = getAutoSyncIntervalSeconds()

  useEffect(() => {
    setDesktopReady(isPluginDesktopHost())
  }, [])
  const availablePlatformIds = Array.from(new Set(games.map((game) => getEffectivePlatform(game))))
  const resolvedPlatform =
    platform !== 'all' && availablePlatformIds.includes(platform as LumioplayConsoleId)
      ? platform
      : (availablePlatformIds[0] ?? 'all')

  const filteredGames = useMemo(() => sortGames(games, resolvedPlatform, query), [games, resolvedPlatform, query])

  function refreshGames() {
    setGames(getStoredGames())
  }

  function persistImportedGames(nextGames: LumioplayGame[], sourceLabel: string) {
    if (nextGames.length === 0) {
      setStatusMessage(`Inga stödda ROM-filer hittades i ${sourceLabel}.`)
      return
    }
    const merged = upsertImportedGames(nextGames)
    setGames(merged)
    setStatusMessage(`${nextGames.length} spel importerades från ${sourceLabel}.`)
  }

  async function importIndexedDirectory(directory: string) {
    const indexedFiles = await scanPluginDirectory(
      directory,
      IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace('.', '')),
    )
    if (!indexedFiles?.length) {
      setStatusMessage(`Inga stödda ROM-filer hittades i ${directory}.`)
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
    setStatusMessage(`${importedGames.length} spel synkades från ${directory}.`)
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
      if (!silent) {
        setStatusMessage(
          totalFound > 0
            ? `${totalFound} spel synkades från sparade ROM-mappar.`
            : 'Inga stödda ROM-filer hittades i sparade ROM-mappar.',
        )
      }
    } finally {
      syncInFlightRef.current = false
      setSyncing(false)
    }
  }

  async function handleNativeImport() {
    const paths = await pickPluginFiles([
      { name: 'ROM files', extensions: IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace('.', '')) },
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
    persistImportedGames(importedGames, 'desktopimport')
  }

  async function handleNativeFolderPick() {
    const folder = await pickPluginFolder()
    if (!folder) return
    const existingFolders = new Set(getRomFolders())
    existingFolders.add(folder)
    setRomFolders(Array.from(existingFolders))
    await importIndexedDirectory(folder)
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
            ? (file.webkitRelativePath.includes('/') ? file.webkitRelativePath.split('/')[0] : 'vald mapp')
            : null,
          fileSizeBytes: file.size,
        }),
      )
      .filter((game): game is LumioplayGame => Boolean(game))
    persistImportedGames(importedGames, source === 'folder' ? 'vald mapp' : 'uppladdning')
  }

  async function handleLaunch(game: LumioplayGame) {
    setLaunchState({ gameId: game.id, message: null })
    try {
      await launchGameWithRetroArch(game)
      const updated = markGameLaunched(game.id)
      setGames(updated)
      setStatusMessage(`Startade ${getGameDisplayTitle(game)} i RetroArch.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'RetroArch kunde inte startas.'
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

  const [syncingPosters, setSyncingPosters] = useState(false)
  const posterSyncCancelRef = useRef(false)

  async function syncAllPosters(force = false) {
    if (syncingPosters) return
    const gamesNeedingCover = getStoredGames().filter(
      (game) => (force || (game.artworkStatus !== 'missing' && !game.coverUrl)) && game.metadata?.coverCandidates?.length,
    )
    if (gamesNeedingCover.length === 0) return
    posterSyncCancelRef.current = false
    setSyncingPosters(true)
    try {
      for (const game of gamesNeedingCover) {
        if (posterSyncCancelRef.current) break
        const resolvedCover = await resolveFirstReachableCoverUrl(game.metadata?.coverCandidates ?? [])
        setGameCover(game.id, resolvedCover)
        refreshGames()
      }
    } finally {
      setSyncingPosters(false)
    }
  }

  useEffect(() => {
    void syncAllPosters(false)
    return () => {
      posterSyncCancelRef.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Lumioplay</p>
          <h1 className="text-3xl font-semibold text-white">Spelbibliotek</h1>
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
          onSyncPosters={() => void syncAllPosters(true)}
          desktopReady={desktopReady}
          hasSavedFolders={savedFolders.length > 0}
          syncing={syncing}
          syncingPosters={syncingPosters}
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök spel"
            className="h-9 w-full max-w-xs rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-[0.8rem] text-white placeholder:text-slate-500 outline-none transition-all focus:border-accent-400/30 focus:bg-white/[0.07]"
          />
          <PlatformChips active={resolvedPlatform} onChange={setPlatform} games={games} />
        </div>
        {statusMessage ? <p className="text-sm text-slate-400">{statusMessage}</p> : null}
        {launchState.message ? <p className="text-sm text-rose-300">{launchState.message}</p> : null}
      </div>
      <GamesGrid
        games={filteredGames}
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
    </div>
  )
}
