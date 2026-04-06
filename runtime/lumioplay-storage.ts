import { getScopedStorageItem, setScopedStorageItem } from '@/lib/plugin-sdk'
import type { LumioplayGame, LumioplayPlatformDefinition } from './lumioplay-types'

const KEY_GAMES = 'lumioplay_games'
const KEY_ROM_FOLDERS = 'lumioplay_rom_folders'
const KEY_RETROARCH_PATH = 'lumioplay_retroarch_path'
const KEY_RETROARCH_CORES_PATH = 'lumioplay_retroarch_cores_path'

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

export function createImportedGame(params: {
  fileName: string
  romPath: string
  source: 'upload' | 'folder'
  fileSizeBytes?: number | null
}): LumioplayGame | null {
  const platform = detectPlatformByFileName(params.fileName)
  if (!platform || platform.id === 'all') return null
  const extension = normalizeExtension(params.fileName)
  return {
    id: buildGameId(params.romPath, params.fileName),
    title: createGameTitle(params.fileName),
    platform: platform.id,
    romPath: params.romPath,
    fileName: params.fileName,
    extension,
    coreId: platform.coreId,
    source: params.source,
    fileSizeBytes: params.fileSizeBytes ?? null,
    importedAt: new Date().toISOString(),
    coverUrl: null,
    lastPlayedAt: null,
    playCount: 0,
  }
}

export function upsertImportedGames(nextGames: LumioplayGame[]): LumioplayGame[] {
  const existing = getStoredGames()
  const merged = new Map(existing.map((game) => [game.id, game]))
  nextGames.forEach((game) => {
    merged.set(game.id, game)
  })
  const values = Array.from(merged.values())
  values.sort((left, right) => left.title.localeCompare(right.title, 'sv'))
  setStoredGames(values)
  return values
}

export function getStoredGames(): LumioplayGame[] {
  try {
    const raw = getScopedStorageItem(KEY_GAMES)
    return raw ? JSON.parse(raw) as LumioplayGame[] : []
  } catch {
    return []
  }
}

export function setStoredGames(games: LumioplayGame[]): void {
  setScopedStorageItem(KEY_GAMES, JSON.stringify(games))
}

export function getRomFolders(): string[] {
  try {
    const raw = getScopedStorageItem(KEY_ROM_FOLDERS)
    return raw ? JSON.parse(raw) as string[] : []
  } catch {
    return []
  }
}

export function setRomFolders(paths: string[]): void {
  setScopedStorageItem(KEY_ROM_FOLDERS, JSON.stringify(paths))
}

export function getRetroArchPath(): string {
  return getScopedStorageItem(KEY_RETROARCH_PATH) ?? ''
}

export function setRetroArchPath(path: string): void {
  setScopedStorageItem(KEY_RETROARCH_PATH, path)
}

export function getRetroArchCoresPath(): string {
  return getScopedStorageItem(KEY_RETROARCH_CORES_PATH) ?? ''
}

export function setRetroArchCoresPath(path: string): void {
  setScopedStorageItem(KEY_RETROARCH_CORES_PATH, path)
}

export function markGameLaunched(gameId: string): LumioplayGame[] {
  const games = getStoredGames()
  const updated = games.map((game) => {
    if (game.id !== gameId) return game
    return {
      ...game,
      lastPlayedAt: new Date().toISOString(),
      playCount: (game.playCount ?? 0) + 1,
    }
  })
  setStoredGames(updated)
  return updated
}
