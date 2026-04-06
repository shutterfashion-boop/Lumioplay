import { getScopedStorageItem, setScopedStorageItem } from '@/lib/plugin-sdk'
import { buildMetadataFromFileName } from './lumioplay-metadata'
import type {
  LumioplayConsoleId,
  LumioplayGame,
  LumioplayLibraryDatabase,
  LumioplayLibrarySettings,
  LumioplayPlatformDefinition,
} from './lumioplay-types'

const KEY_LIBRARY = 'lumioplay_library_v2'
const KEY_GAMES = 'lumioplay_games'
const KEY_ROM_FOLDERS = 'lumioplay_rom_folders'
const KEY_RETROARCH_PATH = 'lumioplay_retroarch_path'
const KEY_RETROARCH_CORES_PATH = 'lumioplay_retroarch_cores_path'

const DEFAULT_SETTINGS: LumioplayLibrarySettings = {
  retroArchPath: '',
  retroArchCoresPath: '',
  romFolders: [],
  autoSyncEnabled: true,
  autoSyncIntervalSeconds: 45,
}

export const LUMIOPLAY_PLATFORMS: LumioplayPlatformDefinition[] = [
  { id: 'all', label: 'Alla', extensions: [] },
  { id: 'nes', label: 'NES', extensions: ['.nes'], coreId: 'fceumm_libretro' },
  { id: 'snes', label: 'SNES', extensions: ['.sfc', '.smc'], coreId: 'snes9x_libretro' },
  { id: 'gb', label: 'GB', extensions: ['.gb'], coreId: 'gambatte_libretro' },
  { id: 'gbc', label: 'GBC', extensions: ['.gbc'], coreId: 'gambatte_libretro' },
  { id: 'gba', label: 'GBA', extensions: ['.gba'], coreId: 'mgba_libretro' },
  { id: 'genesis', label: 'Genesis', extensions: ['.gen', '.md', '.bin'], coreId: 'genesis_plus_gx_libretro' },
  { id: 'n64', label: 'N64', extensions: ['.n64', '.z64', '.v64'], coreId: 'mupen64plus_next_libretro' },
  { id: 'ps1', label: 'PS1', extensions: ['.cue', '.chd', '.pbp', '.iso'], coreId: 'pcsx_rearmed_libretro' },
]

export const IMPORTABLE_ROM_EXTENSIONS = Array.from(
  new Set(
    LUMIOPLAY_PLATFORMS.flatMap((platform) =>
      platform.id === 'all' ? [] : platform.extensions,
    ),
  ),
)

function nowIso(): string {
  return new Date().toISOString()
}

function createEmptyLibrary(): LumioplayLibraryDatabase {
  return {
    version: 2,
    games: [],
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: nowIso(),
  }
}

function normalizeLibrarySettings(value?: Partial<LumioplayLibrarySettings> | null): LumioplayLibrarySettings {
  return {
    retroArchPath: value?.retroArchPath?.trim() ?? DEFAULT_SETTINGS.retroArchPath,
    retroArchCoresPath: value?.retroArchCoresPath?.trim() ?? DEFAULT_SETTINGS.retroArchCoresPath,
    romFolders: Array.isArray(value?.romFolders) ? value!.romFolders.filter(Boolean) : DEFAULT_SETTINGS.romFolders,
    autoSyncEnabled: value?.autoSyncEnabled ?? DEFAULT_SETTINGS.autoSyncEnabled,
    autoSyncIntervalSeconds: Math.max(15, Math.min(300, Number(value?.autoSyncIntervalSeconds ?? DEFAULT_SETTINGS.autoSyncIntervalSeconds))),
  }
}

function normalizeExtension(fileName: string): string {
  const lowerName = fileName.toLowerCase()
  const match = IMPORTABLE_ROM_EXTENSIONS
    .slice()
    .sort((left, right) => right.length - left.length)
    .find((extension) => lowerName.endsWith(extension))
  if (match) return match
  const dotIndex = lowerName.lastIndexOf('.')
  return dotIndex >= 0 ? lowerName.slice(dotIndex) : ''
}

function createGameTitle(fileName: string): string {
  const normalized = fileName.replace(/\.[^/.]+$/, '')
  return normalized
    .replace(/[_+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function detectPlatformByFileName(fileName: string): LumioplayPlatformDefinition | null {
  const extension = normalizeExtension(fileName)
  if (!extension) return null
  return (
    LUMIOPLAY_PLATFORMS.find(
      (platform) => platform.id !== 'all' && platform.extensions.includes(extension),
    ) ?? null
  )
}

function buildGameId(sourcePath: string, fileName: string): string {
  const seed = `${sourcePath}:${fileName}`.toLowerCase()
  return seed.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function mergeImportedGameWithExisting(nextGame: LumioplayGame, existing?: LumioplayGame): LumioplayGame {
  if (!existing) return nextGame
  const baseMetadata = nextGame.metadata ?? buildMetadataFromFileName(nextGame.fileName, nextGame.platform)
  return {
    ...existing,
    ...nextGame,
    title: nextGame.title,
    coverUrl: existing.coverUrl ?? nextGame.coverUrl ?? null,
    favorite: existing.favorite ?? false,
    platformOverride: existing.platformOverride ?? null,
    coreOverride: existing.coreOverride ?? null,
    importedAt: existing.importedAt ?? nextGame.importedAt,
    playCount: existing.playCount ?? 0,
    lastPlayedAt: existing.lastPlayedAt ?? null,
    metadata: {
      ...baseMetadata,
      coverCandidates: baseMetadata.coverCandidates ?? [],
      coverUrl: existing.coverUrl ?? null,
    },
    missing: false,
    artworkStatus: existing.artworkStatus ?? (existing.coverUrl ? 'resolved' : 'idle'),
    lastIndexedAt: nowIso(),
  }
}

function normalizeGames(games: LumioplayGame[]): LumioplayGame[] {
  return games
    .slice()
    .sort((left, right) => {
      const leftTitle = left.metadata?.sortTitle ?? left.title
      const rightTitle = right.metadata?.sortTitle ?? right.title
      return leftTitle.localeCompare(rightTitle, 'sv')
    })
}

function migrateLegacyLibrary(): LumioplayLibraryDatabase {
  const rawGames = getScopedStorageItem(KEY_GAMES)
  const rawFolders = getScopedStorageItem(KEY_ROM_FOLDERS)
  const retroArchPath = getScopedStorageItem(KEY_RETROARCH_PATH) ?? ''
  const retroArchCoresPath = getScopedStorageItem(KEY_RETROARCH_CORES_PATH) ?? ''

  const games = rawGames ? (JSON.parse(rawGames) as LumioplayGame[]) : []
  const romFolders = rawFolders ? (JSON.parse(rawFolders) as string[]) : []

  return {
    version: 2,
    games: normalizeGames(
      games.map((game) => ({
        ...game,
        coreOverride: game.coreId ?? null,
        platformOverride: null,
        sourceFolder: game.source === 'folder'
          ? game.romPath.slice(0, Math.max(0, game.romPath.length - game.fileName.length)).replace(/[\\/]+$/, '')
          : null,
        favorite: false,
        missing: false,
        artworkStatus: game.coverUrl ? 'resolved' : 'idle',
        lastIndexedAt: game.importedAt ?? nowIso(),
        metadata: game.metadata ?? buildMetadataFromFileName(game.fileName, game.platform),
        coverUrl: game.coverUrl ?? null,
      })),
    ),
    settings: normalizeLibrarySettings({
      retroArchPath,
      retroArchCoresPath,
      romFolders,
    }),
    updatedAt: nowIso(),
  }
}

export function getLibrary(): LumioplayLibraryDatabase {
  try {
    const raw = getScopedStorageItem(KEY_LIBRARY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LumioplayLibraryDatabase>
      return {
        version: 2,
        games: normalizeGames((parsed.games ?? []).map((game) => ({
          ...game,
          favorite: game.favorite ?? false,
          missing: game.missing ?? false,
          artworkStatus: game.artworkStatus ?? (game.coverUrl ? 'resolved' : 'idle'),
          coreOverride: game.coreOverride ?? null,
          platformOverride: game.platformOverride ?? null,
          sourceFolder: game.sourceFolder ?? null,
          lastIndexedAt: game.lastIndexedAt ?? game.importedAt ?? null,
          metadata: game.metadata ?? buildMetadataFromFileName(game.fileName, game.platform),
          coverUrl: game.coverUrl ?? null,
        }))),
        settings: normalizeLibrarySettings(parsed.settings),
        updatedAt: parsed.updatedAt ?? nowIso(),
      }
    }
  } catch {
    return createEmptyLibrary()
  }

  const migrated = migrateLegacyLibrary()
  setLibrary(migrated)
  return migrated
}

export function setLibrary(library: LumioplayLibraryDatabase): LumioplayLibraryDatabase {
  const normalized: LumioplayLibraryDatabase = {
    version: 2,
    games: normalizeGames(library.games),
    settings: normalizeLibrarySettings(library.settings),
    updatedAt: nowIso(),
  }
  setScopedStorageItem(KEY_LIBRARY, JSON.stringify(normalized))
  return normalized
}

function updateLibrary(mutator: (library: LumioplayLibraryDatabase) => LumioplayLibraryDatabase): LumioplayLibraryDatabase {
  const nextLibrary = mutator(getLibrary())
  return setLibrary(nextLibrary)
}

export function getDefaultCoreId(platformId: LumioplayConsoleId): string | null {
  return LUMIOPLAY_PLATFORMS.find((platform) => platform.id === platformId)?.coreId ?? null
}

export function getEffectivePlatform(game: LumioplayGame): LumioplayConsoleId {
  return game.platformOverride ?? game.platform
}

export function getEffectiveCoreId(game: LumioplayGame): string | null {
  return game.coreOverride?.trim() || getDefaultCoreId(getEffectivePlatform(game))
}

export function createImportedGame(params: {
  fileName: string
  romPath: string
  source: 'upload' | 'folder'
  fileSizeBytes?: number | null
  sourceFolder?: string | null
}): LumioplayGame | null {
  const platform = detectPlatformByFileName(params.fileName)
  if (!platform || platform.id === 'all') return null
  const extension = normalizeExtension(params.fileName)
  const metadata = buildMetadataFromFileName(params.fileName, platform.id)
  return {
    id: buildGameId(params.romPath, params.fileName),
    title: metadata.displayTitle || createGameTitle(params.fileName),
    platform: platform.id,
    romPath: params.romPath,
    fileName: params.fileName,
    extension,
    coreId: platform.coreId,
    coreOverride: null,
    platformOverride: null,
    source: params.source,
    sourceFolder: params.sourceFolder ?? null,
    fileSizeBytes: params.fileSizeBytes ?? null,
    importedAt: nowIso(),
    lastIndexedAt: nowIso(),
    coverUrl: null,
    lastPlayedAt: null,
    playCount: 0,
    favorite: false,
    missing: false,
    artworkStatus: 'idle',
    metadata,
  }
}

export function getStoredGames(): LumioplayGame[] {
  return getLibrary().games
}

export function setStoredGames(games: LumioplayGame[]): LumioplayGame[] {
  return setLibrary({
    ...getLibrary(),
    games,
  }).games
}

export function upsertImportedGames(nextGames: LumioplayGame[]): LumioplayGame[] {
  const library = getLibrary()
  const merged = new Map(library.games.map((game) => [game.id, game]))
  nextGames.forEach((game) => {
    merged.set(game.id, mergeImportedGameWithExisting(game, merged.get(game.id)))
  })
  return setLibrary({
    ...library,
    games: Array.from(merged.values()),
  }).games
}

export function syncFolderGames(directory: string, indexedGames: LumioplayGame[]): LumioplayGame[] {
  const library = getLibrary()
  const merged = new Map(library.games.map((game) => [game.id, game]))
  const syncedIds = new Set<string>()

  indexedGames.forEach((game) => {
    syncedIds.add(game.id)
    merged.set(game.id, mergeImportedGameWithExisting({
      ...game,
      source: 'folder',
      sourceFolder: directory,
      missing: false,
      lastIndexedAt: nowIso(),
    }, merged.get(game.id)))
  })

  library.games.forEach((game) => {
    if (game.source !== 'folder' || game.sourceFolder !== directory) return
    if (syncedIds.has(game.id)) return
    merged.set(game.id, {
      ...game,
      missing: true,
      lastIndexedAt: nowIso(),
    })
  })

  return setLibrary({
    ...library,
    games: Array.from(merged.values()),
  }).games
}

export function updateGame(gameId: string, updater: (game: LumioplayGame) => LumioplayGame): LumioplayGame[] {
  const library = getLibrary()
  return setLibrary({
    ...library,
    games: library.games.map((game) => (game.id === gameId ? updater(game) : game)),
  }).games
}

export function toggleFavorite(gameId: string): LumioplayGame[] {
  return updateGame(gameId, (game) => ({
    ...game,
    favorite: !game.favorite,
  }))
}

export function setGamePlatformOverride(gameId: string, platformOverride: LumioplayConsoleId | null): LumioplayGame[] {
  return updateGame(gameId, (game) => {
    const nextPlatform = platformOverride ?? game.platform
    const nextMetadata = buildMetadataFromFileName(game.fileName, nextPlatform)
    return {
      ...game,
      platformOverride,
      coverUrl: null,
      artworkStatus: 'idle',
      metadata: {
        ...nextMetadata,
        ...game.metadata,
        coverCandidates: nextMetadata.coverCandidates,
        coverUrl: null,
      },
    }
  })
}

export function setGameCoreOverride(gameId: string, coreOverride: string | null): LumioplayGame[] {
  return updateGame(gameId, (game) => ({
    ...game,
    coreOverride: coreOverride?.trim() ? coreOverride.trim() : null,
  }))
}

export function setGameCover(gameId: string, coverUrl: string | null): LumioplayGame[] {
  return updateGame(gameId, (game) => ({
    ...game,
    coverUrl,
    artworkStatus: coverUrl ? 'resolved' : 'missing',
    metadata: {
      ...game.metadata,
      displayTitle: game.metadata?.displayTitle ?? game.title,
      sortTitle: game.metadata?.sortTitle ?? game.title.toLowerCase(),
      searchTitle: game.metadata?.searchTitle ?? `${game.title} ${game.fileName}`.toLowerCase(),
      coverUrl,
      coverCandidates: game.metadata?.coverCandidates ?? [],
    },
  }))
}

export function markGameLaunched(gameId: string): LumioplayGame[] {
  return updateGame(gameId, (game) => ({
    ...game,
    lastPlayedAt: nowIso(),
    playCount: (game.playCount ?? 0) + 1,
  }))
}

export function getRomFolders(): string[] {
  return getLibrary().settings.romFolders
}

export function setRomFolders(paths: string[]): void {
  updateLibrary((library) => ({
    ...library,
    settings: {
      ...library.settings,
      romFolders: paths.map((value) => value.trim()).filter(Boolean),
    },
  }))
}

export function getRetroArchPath(): string {
  return getLibrary().settings.retroArchPath
}

export function setRetroArchPath(path: string): void {
  updateLibrary((library) => ({
    ...library,
    settings: {
      ...library.settings,
      retroArchPath: path.trim(),
    },
  }))
}

export function getRetroArchCoresPath(): string {
  return getLibrary().settings.retroArchCoresPath
}

export function setRetroArchCoresPath(path: string): void {
  updateLibrary((library) => ({
    ...library,
    settings: {
      ...library.settings,
      retroArchCoresPath: path.trim(),
    },
  }))
}

export function getAutoSyncEnabled(): boolean {
  return getLibrary().settings.autoSyncEnabled
}

export function setAutoSyncEnabled(value: boolean): void {
  updateLibrary((library) => ({
    ...library,
    settings: {
      ...library.settings,
      autoSyncEnabled: value,
    },
  }))
}

export function getAutoSyncIntervalSeconds(): number {
  return getLibrary().settings.autoSyncIntervalSeconds
}

export function setAutoSyncIntervalSeconds(value: number): void {
  updateLibrary((library) => ({
    ...library,
    settings: {
      ...library.settings,
      autoSyncIntervalSeconds: Math.max(15, Math.min(300, Math.round(value))),
    },
  }))
}
