import {
  executePluginDesktopCommand,
  isPluginDesktopHost,
  spawnPluginDesktopCommand,
} from '@/lib/plugin-sdk'
import {
  getRetroArchCoresPath,
  getRetroArchPath,
  LUMIOPLAY_PLATFORMS,
} from './lumioplay-storage'
import type { LumioplayGame } from './lumioplay-types'

function isAbsolutePath(path: string): boolean {
  return path.startsWith('/') || /^[A-Za-z]:[\\/]/.test(path)
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/[\\/]+$/, '')
}

function getPlatformCoreId(platformId: LumioplayGame['platform']): string | null {
  return LUMIOPLAY_PLATFORMS.find((platform) => platform.id === platformId)?.coreId ?? null
}

function inferRetroArchExecutablePath(inputPath: string): string {
  const trimmed = trimTrailingSlashes(inputPath.trim())
  if (!trimmed) return ''
  if (trimmed.endsWith('.app')) {
    return `${trimmed}/Contents/MacOS/RetroArch`
  }
  return trimmed
}

function inferRetroArchCoresPath(inputPath: string): string {
  const trimmed = trimTrailingSlashes(inputPath.trim())
  if (!trimmed) return ''
  if (trimmed.endsWith('.app')) {
    return `${trimmed}/Contents/Resources/cores`
  }
  if (trimmed.includes('/Contents/MacOS/')) {
    return trimmed.replace('/Contents/MacOS/RetroArch', '/Contents/Resources/cores')
  }
  const separator = trimmed.includes('\\') ? '\\' : '/'
  const lastSeparator = trimmed.lastIndexOf(separator)
  if (lastSeparator < 0) return ''
  return `${trimmed.slice(0, lastSeparator)}${separator}cores`
}

function getCoreLibraryExtension(): string {
  if (typeof navigator === 'undefined') return '.dylib'
  const platform = navigator.userAgent.toLowerCase()
  if (platform.includes('windows')) return '.dll'
  if (platform.includes('linux')) return '.so'
  return '.dylib'
}

function isWindowsHost(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('windows')
}

function buildCorePath(coreId: string, coresDirectory: string): string {
  const normalizedDirectory = trimTrailingSlashes(coresDirectory)
  return `${normalizedDirectory}/${coreId}${getCoreLibraryExtension()}`
}

export function canLaunchGame(game: LumioplayGame): boolean {
  return isPluginDesktopHost() && isAbsolutePath(game.romPath) && Boolean(game.coreId || getPlatformCoreId(game.platform))
}

export interface RetroArchLaunchConfig {
  executablePath: string
  coresPath: string
  corePath: string
}

export function getRetroArchLaunchConfig(game: LumioplayGame): RetroArchLaunchConfig | null {
  const configuredExecutable = inferRetroArchExecutablePath(getRetroArchPath())
  if (!configuredExecutable) return null
  const coreId = game.coreId ?? getPlatformCoreId(game.platform)
  if (!coreId) return null
  const configuredCoresPath = trimTrailingSlashes(getRetroArchCoresPath()) || inferRetroArchCoresPath(getRetroArchPath())
  if (!configuredCoresPath) return null
  return {
    executablePath: configuredExecutable,
    coresPath: configuredCoresPath,
    corePath: buildCorePath(coreId, configuredCoresPath),
  }
}

async function verifyLaunchConfig(config: RetroArchLaunchConfig): Promise<void> {
  if (isWindowsHost()) return

  const executableCheck = await executePluginDesktopCommand({
    program: '/bin/test',
    args: ['-x', config.executablePath],
  })
  if (executableCheck.code !== 0) {
    throw new Error('RetroArch-binären kunde inte hittas. Kontrollera sökvägen i inställningarna.')
  }

  const coreCheck = await executePluginDesktopCommand({
    program: '/bin/test',
    args: ['-f', config.corePath],
  })
  if (coreCheck.code !== 0) {
    throw new Error('Libretro-coren kunde inte hittas. Kontrollera core-mappen i inställningarna.')
  }
}

export async function launchGameWithRetroArch(game: LumioplayGame): Promise<void> {
  if (!isPluginDesktopHost()) {
    throw new Error('RetroArch-launch är bara tillgänglig i desktop-appen.')
  }
  if (!isAbsolutePath(game.romPath)) {
    throw new Error('Det här spelet har ingen lokal filväg ännu. Importera ROM:en via desktop file picker.')
  }

  const config = getRetroArchLaunchConfig(game)
  if (!config) {
    throw new Error('Ställ in RetroArch-sökväg och core-mapp först.')
  }

  await verifyLaunchConfig(config)
  await spawnPluginDesktopCommand({
    program: config.executablePath,
    args: ['-L', config.corePath, game.romPath],
  })
}
