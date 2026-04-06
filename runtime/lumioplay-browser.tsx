'use client'

import { useRef, useState } from 'react'
import {
  isPluginDesktopHost,
  pickPluginFiles,
  pickPluginFolder,
  scanPluginDirectory,
} from '@/lib/plugin-sdk'
import {
  createImportedGame,
  getRetroArchPath,
  getStoredGames,
  IMPORTABLE_ROM_EXTENSIONS,
  LUMIOPLAY_PLATFORMS,
  markGameLaunched,
  getRomFolders,
  setRomFolders,
  upsertImportedGames,
} from './lumioplay-storage'
import {
  canLaunchGame,
  launchGameWithRetroArch,
} from './lumioplay-launcher'
import type { BrowsePageProps, HomeRowProps } from '@/lib/plugin-sdk'
import type { LumioplayGame, LumioplayPlatformId } from './lumioplay-types'

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

function sortGames(games: LumioplayGame[], platform: LumioplayPlatformId, query: string): LumioplayGame[] {
  const normalizedQuery = query.trim().toLowerCase()
  return games.filter((game) => {
    const matchesPlatform = platform === 'all' || game.platform === platform
    const haystack = `${game.title} ${game.fileName}`.toLowerCase()
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
    return matchesPlatform && matchesQuery
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
  const availablePlatformIds = Array.from(new Set(games.map((game) => game.platform)))
  const availablePlatforms = LUMIOPLAY_PLATFORMS.filter(
    (platform) => platform.id !== 'all' && availablePlatformIds.includes(platform.id),
  )

  if (availablePlatforms.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-2">
      {availablePlatforms.map((platform) => {
        const selected = platform.id === active
        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onChange(platform.id)}
            className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
              selected
                ? 'bg-cyan-300 text-slate-950'
                : 'border border-slate-700 bg-slate-900/70 text-slate-300 hover:border-cyan-300/30 hover:text-white'
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
  desktopReady,
  hasSavedFolders,
}: {
  onUploadRoms: () => void
  onChooseFolder: () => void
  onRescanFolders: () => void
  desktopReady: boolean
  hasSavedFolders: boolean
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onUploadRoms}
        className="rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
      >
        {desktopReady ? 'Importera ROMs' : 'Ladda upp ROMs'}
      </button>
      <button
        type="button"
        onClick={onChooseFolder}
        className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-300/30 hover:bg-slate-900"
      >
        Välj mapp
      </button>
      {desktopReady && hasSavedFolders ? (
        <button
          type="button"
          onClick={onRescanFolders}
          className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-300/30 hover:bg-slate-900"
        >
          Skanna mappar
        </button>
      ) : null}
    </div>
  )
}

function GamesGrid({
  games,
  launchState,
  onLaunch,
}: {
  games: LumioplayGame[]
  launchState: { gameId: string | null; message: string | null }
  onLaunch: (game: LumioplayGame) => void
}) {
  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-sm text-slate-400">
        Inga spel hittades ännu. Lägg till ROM-filer eller välj en ROM-mapp i inställningarna.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {games.map((game) => (
        <div
          key={game.id}
          className="group overflow-hidden rounded-[24px] border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(7,12,24,0.98))] text-left shadow-[0_12px_40px_rgba(2,6,23,0.45)] transition hover:border-cyan-300/25 hover:shadow-[0_18px_50px_rgba(34,211,238,0.08)]"
        >
          <div className="aspect-[3/4] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,1))] p-3">
            <div className="flex h-full flex-col justify-between rounded-[18px] bg-black/10 p-3">
              <span className="w-fit rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                {getPlatformLabel(game.platform)}
              </span>
              <div className="space-y-1">
                <p className="line-clamp-3 text-base font-semibold text-white">{game.title}</p>
                <p className="line-clamp-1 text-xs text-slate-400">{game.fileName}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{game.coreId ?? 'Ingen core'}</p>
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                {game.source === 'folder' ? 'Mapp' : 'Upload'}
              </span>
            </div>
            <p className="line-clamp-1 text-xs text-slate-500">{formatFileSize(game.fileSizeBytes) ?? game.extension}</p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onLaunch(game)}
                disabled={!canLaunchGame(game) || launchState.gameId === game.id}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  canLaunchGame(game)
                    ? 'bg-cyan-300 text-slate-950 hover:bg-cyan-200'
                    : 'cursor-not-allowed border border-slate-700 bg-slate-900/70 text-slate-500'
                }`}
              >
                {launchState.gameId === game.id ? 'Startar...' : 'Spela'}
              </button>
              {!canLaunchGame(game) ? (
                <span className="text-[10px] text-slate-500">
                  {isPluginDesktopHost() ? 'Importera via desktop picker' : 'Desktop krävs'}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
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
  const uploadInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)
  const desktopReady = isPluginDesktopHost()
  const savedFolders = getRomFolders()
  const availablePlatformIds = Array.from(new Set(games.map((game) => game.platform)))
  const resolvedPlatform =
    platform !== 'all' && availablePlatformIds.includes(platform)
      ? platform
      : (availablePlatformIds[0] ?? 'all')

  const filteredGames = sortGames(games, resolvedPlatform, query)

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
          fileSizeBytes: file.sizeBytes ?? null,
        }),
      )
      .filter((game): game is LumioplayGame => Boolean(game))

    persistImportedGames(importedGames, directory)
  }

  async function handleRescanFolders() {
    if (!savedFolders.length) {
      setStatusMessage('Inga sparade ROM-mappar att skanna ännu.')
      return
    }

    let totalImported = 0
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
            fileSizeBytes: file.sizeBytes ?? null,
          }),
        )
        .filter((game): game is LumioplayGame => Boolean(game))
      totalImported += importedGames.length
      if (importedGames.length > 0) {
        const merged = upsertImportedGames(importedGames)
        setGames(merged)
      }
    }

    setStatusMessage(
      totalImported > 0
        ? `${totalImported} spel hittades i sparade ROM-mappar.`
        : 'Inga stödda ROM-filer hittades i sparade ROM-mappar.',
    )
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
          fileSizeBytes: file.size,
        }),
      )
      .filter((game): game is LumioplayGame => Boolean(game))
    persistImportedGames(importedGames, source === 'folder' ? 'vald mapp' : 'uppladdning')
  }

  async function handleLaunch(game: LumioplayGame) {
    setLaunchState({ gameId: game.id, message: null })
    try {
      if (!getRetroArchPath().trim()) {
        throw new Error('Lägg in RetroArch-sökväg i inställningarna först.')
      }
      await launchGameWithRetroArch(game)
      const updated = markGameLaunched(game.id)
      setGames(updated)
      setStatusMessage(`Startade ${game.title} i RetroArch.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'RetroArch kunde inte startas.'
      setLaunchState({ gameId: null, message })
      setStatusMessage(message)
      return
    }
    setLaunchState({ gameId: null, message: null })
  }

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
            void handleRescanFolders()
          }}
          desktopReady={desktopReady}
          hasSavedFolders={savedFolders.length > 0}
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sök spel"
          className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300/30"
        />
        <PlatformChips active={resolvedPlatform} onChange={setPlatform} games={games} />
        {statusMessage ? (
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {statusMessage}
          </div>
        ) : null}
      </div>
      <GamesGrid games={filteredGames} launchState={launchState} onLaunch={(game) => void handleLaunch(game)} />
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

export function LumioplayHomeRow(_props: HomeRowProps) {
  const recentGames = getStoredGames()
    .slice()
    .sort((left, right) =>
      (right.lastPlayedAt ?? right.importedAt ?? '').localeCompare(left.lastPlayedAt ?? left.importedAt ?? ''),
    )
    .slice(0, 6)

  if (recentGames.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
        Lumioplay kommer att visa senaste spel här när ROM-biblioteket är indexerat.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {recentGames.map((game) => (
        <div
          key={game.id}
          className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300"
        >
          <p className="line-clamp-2 font-medium text-white">{game.title}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">{getPlatformLabel(game.platform)}</p>
        </div>
      ))}
    </div>
  )
}
