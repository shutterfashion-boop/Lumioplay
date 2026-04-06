export type LumioplayPlatformId =
  | 'all'
  | 'nes'
  | 'snes'
  | 'gb'
  | 'gbc'
  | 'gba'
  | 'genesis'
  | 'n64'
  | 'ps1'

export type LumioplayConsoleId = Exclude<LumioplayPlatformId, 'all'>

export interface LumioplayGameMetadata {
  displayTitle: string
  sortTitle: string
  searchTitle: string
  releaseYear?: number | null
  region?: string | null
  tags?: string[]
  coverUrl?: string | null
  coverCandidates?: string[]
}

export interface LumioplayGame {
  id: string
  title: string
  platform: LumioplayConsoleId
  romPath: string
  fileName: string
  extension: string
  coreId?: string
  coreOverride?: string | null
  platformOverride?: LumioplayConsoleId | null
  source: 'upload' | 'folder'
  sourceFolder?: string | null
  fileSizeBytes?: number | null
  importedAt?: string | null
  coverUrl?: string | null
  lastPlayedAt?: string | null
  playCount?: number
  lastIndexedAt?: string | null
  favorite?: boolean
  missing?: boolean
  artworkStatus?: 'idle' | 'resolved' | 'missing'
  metadata?: LumioplayGameMetadata | null
}

export interface LumioplayPlatformDefinition {
  id: LumioplayConsoleId | 'all'
  label: string
  extensions: string[]
  coreId?: string
}

export interface LumioplayLibrarySettings {
  retroArchPath: string
  retroArchCoresPath: string
  romFolders: string[]
  autoSyncEnabled: boolean
  autoSyncIntervalSeconds: number
}

export interface LumioplayLibraryDatabase {
  version: number
  games: LumioplayGame[]
  settings: LumioplayLibrarySettings
  updatedAt: string
}
