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

export interface LumioplayGame {
  id: string
  title: string
  platform: LumioplayPlatformId
  romPath: string
  fileName: string
  extension: string
  coreId?: string
  source: 'upload' | 'folder'
  fileSizeBytes?: number | null
  importedAt?: string | null
  coverUrl?: string | null
  lastPlayedAt?: string | null
  playCount?: number
}

export interface LumioplayPlatformDefinition {
  id: LumioplayPlatformId
  label: string
  extensions: string[]
  coreId?: string
}
