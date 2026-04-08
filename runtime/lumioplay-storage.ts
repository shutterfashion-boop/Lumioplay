import { getScopedStorageItem, setScopedStorageItem } from '@/lib/plugin-sdk'
import { buildMetadataFromFileName } from './lumioplay-metadata'
import type {
  LumioplayConsoleId,
  LumioplayGame,
  LumioplayGameMetadata,
  LumioplayLibraryDatabase,
  LumioplayLibrarySettings,
  LumioplayPlatformDefinition,
} from './lumioplay-types'

const KEY_LIBRARY = 'lumioplay_library_v2'
const KEY_GAMES = 'lumioplay_games'
const KEY_ROM_FOLDERS = 'lumioplay_rom_folders'
const KEY_RETROARCH_PATH = 'lumioplay_retroarch_path'
const KEY_RETROARCH_CORES_PATH = 'lumioplay_retroarch_cores_path'
const KEY_GAMEPAD_MAPPING = 'lumioplay_gamepad_mapping_v1'
const KEY_GAMEPAD_EXIT_COMBO = 'lumioplay_gamepad_exit_combo_v1'

const DEFAULT_SETTINGS: LumioplayLibrarySettings = {
  retroArchPath: '',
  retroArchCoresPath: '',
  romFolders: [],
  autoSyncEnabled: false,
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

export const LUMIOPLAY_JOYPAD_BINDINGS: Array<{ index: number; label: string }> = [
  { index: 0, label: 'B' },
  { index: 1, label: 'Y' },
  { index: 2, label: 'Select' },
  { index: 3, label: 'Start' },
  { index: 4, label: 'Up' },
  { index: 5, label: 'Down' },
  { index: 6, label: 'Left' },
  { index: 7, label: 'Right' },
  { index: 8, label: 'A' },
  { index: 9, label: 'X' },
  { index: 10, label: 'L' },
  { index: 11, label: 'R' },
]

const DEFAULT_GAMEPAD_MAPPING: Record<number, number> = {
  0: 1,   // B
  1: 2,   // Y
  2: 8,   // Select
  3: 9,   // Start
  4: 12,  // Up
  5: 13,  // Down
  6: 14,  // Left
  7: 15,  // Right
  8: 0,   // A
  9: 3,   // X
  10: 4,  // L
  11: 5,  // R
}

const DEFAULT_GAMEPAD_EXIT_COMBO = [8, 9] // Select + Start

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

function normalizeExtension(fileName?: string | null): string {
  if (typeof fileName !== 'string') return ''
  const trimmedFileName = fileName.trim()
  if (!trimmedFileName) return ''
  const lowerName = trimmedFileName.toLowerCase()
  const match = IMPORTABLE_ROM_EXTENSIONS
    .slice()
    .sort((left, right) => right.length - left.length)
    .find((extension) => lowerName.endsWith(extension))
  if (match) return match
  const dotIndex = lowerName.lastIndexOf('.')
  return dotIndex >= 0 ? lowerName.slice(dotIndex) : ''
}

function createGameTitle(fileName?: string | null): string {
  if (typeof fileName !== 'string') return ''
  const normalized = fileName.replace(/\.[^/.]+$/, '')
  return normalized
    .replace(/[_+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function detectPlatformByFileName(fileName?: string | null): LumioplayPlatformDefinition | null {
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

function normalizeGameMetadata(game: {
  fileName: string
  platform: LumioplayConsoleId
  platformOverride?: LumioplayConsoleId | null
  title: string
  coverUrl?: string | null
  metadata?: Partial<LumioplayGameMetadata> | null
}): LumioplayGame['metadata'] {
  const effectivePlatform = game.platformOverride ?? game.platform
  const baseMetadata = buildMetadataFromFileName(game.fileName, effectivePlatform)
  const existingMetadata = game.metadata ?? null

  const normalizedMetadata: LumioplayGameMetadata = {
    displayTitle: existingMetadata?.displayTitle?.trim() || baseMetadata.displayTitle || game.title,
    sortTitle: existingMetadata?.sortTitle?.trim() || baseMetadata.sortTitle,
    searchTitle: existingMetadata?.searchTitle?.trim() || baseMetadata.searchTitle,
    releaseYear: existingMetadata?.releaseYear ?? baseMetadata.releaseYear ?? null,
    region: existingMetadata?.region ?? baseMetadata.region ?? null,
    tags: Array.isArray(existingMetadata?.tags) ? existingMetadata.tags : (baseMetadata.tags ?? []),
    coverUrl: game.coverUrl ?? existingMetadata?.coverUrl ?? baseMetadata.coverUrl ?? null,
    coverCandidates: Array.from(
      new Set([...(baseMetadata.coverCandidates ?? []), ...((Array.isArray(existingMetadata?.coverCandidates)
        ? existingMetadata?.coverCandidates
        : []) ?? [])]),
    ),
  }
  return normalizedMetadata
}

function mergeImportedGameWithExisting(nextGame: LumioplayGame, existing?: LumioplayGame): LumioplayGame {
  if (!existing) return nextGame
  const mergedCoverUrl = existing.coverUrl ?? nextGame.coverUrl ?? null
  return {
    ...existing,
    ...nextGame,
    title: nextGame.title,
    coverUrl: mergedCoverUrl,
    favorite: existing.favorite ?? false,
    platformOverride: existing.platformOverride ?? null,
    coreOverride: existing.coreOverride ?? null,
    importedAt: existing.importedAt ?? nextGame.importedAt,
    playCount: existing.playCount ?? 0,
    lastPlayedAt: existing.lastPlayedAt ?? null,
    metadata: normalizeGameMetadata({
      ...nextGame,
      platformOverride: existing.platformOverride ?? nextGame.platformOverride ?? null,
      title: nextGame.title,
      coverUrl: mergedCoverUrl,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(nextGame.metadata ?? {}),
      },
    }),
    missing: false,
    artworkStatus: existing.artworkStatus ?? (mergedCoverUrl ? 'resolved' : 'idle'),
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
        metadata: normalizeGameMetadata({
          ...game,
          title: game.title,
          platformOverride: null,
          coverUrl: game.coverUrl ?? null,
        }),
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
      const normalizedGames = (parsed.games ?? [])
        .filter((game): game is LumioplayGame => {
          if (!game || typeof game !== 'object') return false
          if (typeof game.fileName !== 'string' || !game.fileName.trim()) return false
          if (typeof game.romPath !== 'string' || !game.romPath.trim()) return false
          return detectPlatformByFileName(game.fileName) != null
        })
        .map((game) => {
          const normalizedGame: LumioplayGame = {
            ...game,
            favorite: game.favorite ?? false,
            missing: game.missing ?? false,
            artworkStatus: game.artworkStatus ?? (game.coverUrl ? 'resolved' : 'idle'),
            coreOverride: game.coreOverride ?? null,
            platformOverride: game.platformOverride ?? null,
            sourceFolder: game.sourceFolder ?? null,
            lastIndexedAt: game.lastIndexedAt ?? game.importedAt ?? null,
            coverUrl: game.coverUrl ?? null,
          }
          return {
            ...normalizedGame,
            metadata: normalizeGameMetadata({
              ...normalizedGame,
              title: normalizedGame.title,
            }),
          }
        })
      return {
        version: 2,
        games: normalizeGames(normalizedGames),
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
  const safeFileName = typeof params.fileName === 'string' ? params.fileName.trim() : ''
  const safeRomPath = typeof params.romPath === 'string' ? params.romPath.trim() : ''
  if (!safeFileName || !safeRomPath) return null
  const platform = detectPlatformByFileName(safeFileName)
  if (!platform || platform.id === 'all') return null
  const extension = normalizeExtension(safeFileName)
  const metadata = buildMetadataFromFileName(safeFileName, platform.id)
  return {
    id: buildGameId(safeRomPath, safeFileName),
    title: metadata.displayTitle || createGameTitle(safeFileName),
    platform: platform.id,
    romPath: safeRomPath,
    fileName: safeFileName,
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
    return {
      ...game,
      platformOverride,
      coverUrl: null,
      artworkStatus: 'idle',
      metadata: normalizeGameMetadata({
        ...game,
        platformOverride,
        coverUrl: null,
        metadata: {
          ...(game.metadata ?? {}),
          coverUrl: null,
          coverCandidates: buildMetadataFromFileName(game.fileName, nextPlatform).coverCandidates,
        },
      }),
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

export function setGameCoversBatch(updates: Array<{ gameId: string; coverUrl: string | null }>): LumioplayGame[] {
  if (updates.length === 0) return getStoredGames()
  const updateMap = new Map<string, string | null>()
  for (const entry of updates) {
    if (!entry.gameId) continue
    updateMap.set(entry.gameId, entry.coverUrl ?? null)
  }
  if (updateMap.size === 0) return getStoredGames()

  const library = getLibrary()
  return setLibrary({
    ...library,
    games: library.games.map((game) => {
      if (!updateMap.has(game.id)) return game
      const coverUrl = updateMap.get(game.id) ?? null
      return {
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
      }
    }),
  }).games
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

function normalizeGamepadMapping(raw: unknown): Record<number, number> {
  const next: Record<number, number> = { ...DEFAULT_GAMEPAD_MAPPING }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return next

  for (const binding of LUMIOPLAY_JOYPAD_BINDINGS) {
    const value = Number((raw as Record<string, unknown>)[String(binding.index)])
    if (Number.isFinite(value) && value >= 0) {
      next[binding.index] = Math.floor(value)
    }
  }
  return next
}

function normalizeExitCombo(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [...DEFAULT_GAMEPAD_EXIT_COMBO]
  const values = raw
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0)
    .map((value) => Math.floor(value))
  return values.length > 0 ? Array.from(new Set(values)).slice(0, 4) : [...DEFAULT_GAMEPAD_EXIT_COMBO]
}

export function getGamepadMapping(): Record<number, number> {
  try {
    const raw = getScopedStorageItem(KEY_GAMEPAD_MAPPING)
    if (!raw) return { ...DEFAULT_GAMEPAD_MAPPING }
    return normalizeGamepadMapping(JSON.parse(raw) as unknown)
  } catch {
    return { ...DEFAULT_GAMEPAD_MAPPING }
  }
}

export function setGamepadMapping(mapping: Record<number, number>): void {
  const normalized = normalizeGamepadMapping(mapping)
  setScopedStorageItem(KEY_GAMEPAD_MAPPING, JSON.stringify(normalized))
}

export function getGamepadExitCombo(): number[] {
  try {
    const raw = getScopedStorageItem(KEY_GAMEPAD_EXIT_COMBO)
    if (!raw) return [...DEFAULT_GAMEPAD_EXIT_COMBO]
    return normalizeExitCombo(JSON.parse(raw) as unknown)
  } catch {
    return [...DEFAULT_GAMEPAD_EXIT_COMBO]
  }
}

export function setGamepadExitCombo(combo: number[]): void {
  const normalized = normalizeExitCombo(combo)
  setScopedStorageItem(KEY_GAMEPAD_EXIT_COMBO, JSON.stringify(normalized))
}
