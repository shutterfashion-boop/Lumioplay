import {
  checkPluginPathExists,
  isPluginDesktopHost,
  launchLibretroGame,
  launchPluginProgram,
  onLibretroStopped,
  sendLibretroInput,
  setLibretroBounds,
  stopLibretroGame,
} from '@/lib/plugin-sdk'
import {
  getEffectiveCoreId,
  getEffectivePlatform,
  getRetroArchCoresPath,
  getRetroArchPath,
} from './lumioplay-storage'
import type { LumioplayGame } from './lumioplay-types'

function isAbsolutePath(path: string): boolean {
  return path.startsWith('/') || /^[A-Za-z]:[\\/]/.test(path)
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/[\\/]+$/, '')
}

function getHostOs(): 'macos' | 'windows' | 'linux' {
  if (typeof navigator === 'undefined') return 'macos'
  const platform = navigator.userAgent.toLowerCase()
  if (platform.includes('windows')) return 'windows'
  if (platform.includes('linux')) return 'linux'
  return 'macos'
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
  if (trimmed.toLowerCase().endsWith('\\retroarch.exe')) {
    return `${trimmed.slice(0, -'retroarch.exe'.length)}cores`
  }
  return trimmed
}

function getCoreLibraryExtension(): string {
  const os = getHostOs()
  if (os === 'windows') return '.dll'
  if (os === 'linux') return '.so'
  return '.dylib'
}

function buildCorePath(coreId: string, coresDirectory: string): string {
  const normalizedDirectory = trimTrailingSlashes(coresDirectory)
  const separator = normalizedDirectory.includes('\\') ? '\\' : '/'
  return `${normalizedDirectory}${separator}${coreId}${getCoreLibraryExtension()}`
}

export interface RetroArchLaunchConfig {
  executablePath: string
  coresPath: string
  corePath: string
}

export interface RetroArchValidationResult {
  ok: boolean
  executablePath: string
  coresPath: string
  details: string[]
}

export interface RetroArchSuggestedSetup {
  retroArchPath: string
  retroArchCoresPath: string
  label: string
}

export function getSuggestedRetroArchSetup(): RetroArchSuggestedSetup {
  const os = getHostOs()
  if (os === 'windows') {
    return {
      retroArchPath: 'C:\\Program Files\\RetroArch\\retroarch.exe',
      retroArchCoresPath: 'C:\\Program Files\\RetroArch\\cores',
      label: 'RetroArch standardinstallering för Windows',
    }
  }
  if (os === 'linux') {
    return {
      retroArchPath: '/usr/bin/retroarch',
      retroArchCoresPath: '/usr/lib/libretro',
      label: 'Vanlig RetroArch-installering för Linux',
    }
  }
  return {
    retroArchPath: '/Applications/RetroArch.app',
    retroArchCoresPath: '/Applications/RetroArch.app/Contents/Resources/cores',
    label: 'RetroArch standardinstallering för macOS',
  }
}

async function pathExists(path: string): Promise<boolean> {
  if (getHostOs() === 'windows') return true
  return checkPluginPathExists(path)
}

export async function validateRetroArchSetup(
  inputRetroArchPath: string,
  inputRetroArchCoresPath: string,
): Promise<RetroArchValidationResult> {
  const executablePath = inferRetroArchExecutablePath(inputRetroArchPath)
  const coresPath = trimTrailingSlashes(inputRetroArchCoresPath) || inferRetroArchCoresPath(inputRetroArchPath)
  const details: string[] = []

  if (!executablePath) {
    details.push('RetroArch-sökvägen saknas.')
  }
  if (!coresPath) {
    details.push('Core-mappen saknas.')
  }

  if (!isPluginDesktopHost()) {
    return {
      ok: details.length === 0,
      executablePath,
      coresPath,
      details: details.length > 0 ? details : ['Validering i detalj kräver desktop-appen.'],
    }
  }

  if (executablePath && !(await pathExists(executablePath))) {
    details.push('RetroArch-binären kunde inte hittas på den angivna sökvägen.')
  }
  if (coresPath && !(await pathExists(coresPath))) {
    details.push('Libretro core-mappen kunde inte hittas på den angivna sökvägen.')
  }

  if (details.length === 0) {
    details.push('RetroArch-konfigurationen ser giltig ut.')
  }

  return {
    ok: details.length === 1 && details[0] === 'RetroArch-konfigurationen ser giltig ut.',
    executablePath,
    coresPath,
    details,
  }
}

export function canLaunchGame(game: LumioplayGame): boolean {
  return (
    isPluginDesktopHost() &&
    !game.missing &&
    isAbsolutePath(game.romPath) &&
    Boolean(getEffectiveCoreId(game)) &&
    Boolean(getEffectivePlatform(game))
  )
}

export function getRetroArchLaunchConfig(game: LumioplayGame): RetroArchLaunchConfig | null {
  const configuredExecutable = inferRetroArchExecutablePath(getRetroArchPath())
  if (!configuredExecutable) return null
  const coreId = getEffectiveCoreId(game)
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
  if (getHostOs() === 'windows') return

  const executableExists = await pathExists(config.executablePath)
  if (!executableExists) {
    throw new Error('RetroArch-binären kunde inte hittas. Kontrollera sökvägen i inställningarna.')
  }

  const coreExists = await pathExists(config.corePath)
  if (!coreExists) {
    throw new Error('Libretro-coren kunde inte hittas. Kontrollera core-mappen eller välj en annan core för spelet.')
  }
}

export async function launchRetroArch(executablePath: string): Promise<void> {
  if (!isPluginDesktopHost()) {
    throw new Error('RetroArch-launch är bara tillgänglig i desktop-appen.')
  }
  const resolved = inferRetroArchExecutablePath(executablePath)
  if (!resolved) throw new Error('Ställ in RetroArch-sökväg i inställningarna först.')
  await launchPluginProgram(resolved, [])
}

export async function launchGameWithRetroArch(game: LumioplayGame): Promise<void> {
  if (!isPluginDesktopHost()) {
    throw new Error('RetroArch-launch är bara tillgänglig i desktop-appen.')
  }
  if (game.missing) {
    throw new Error('ROM-filen kunde inte hittas vid senaste synken. Synka mappen igen eller välj en ny mapp.')
  }
  if (!isAbsolutePath(game.romPath)) {
    throw new Error('Det här spelet har ingen lokal filväg ännu. Importera ROM:en via desktop file picker.')
  }

  const config = getRetroArchLaunchConfig(game)
  if (!config) {
    throw new Error('Ställ in RetroArch-sökväg och core-mapp först.')
  }

  await verifyLaunchConfig(config)
  await launchPluginProgram(config.executablePath, ['-L', config.corePath, game.romPath])
}

export function canLaunchLibretro(game: LumioplayGame): boolean {
  return (
    isPluginDesktopHost() &&
    !game.missing &&
    isAbsolutePath(game.romPath) &&
    Boolean(getEffectiveCoreId(game)) &&
    Boolean(getEffectivePlatform(game))
  )
}

export async function launchLibretroGameEmbedded(game: LumioplayGame): Promise<void> {
  if (!isPluginDesktopHost()) {
    throw new Error('Libretro-launch är bara tillgänglig i desktop-appen.')
  }
  if (game.missing) {
    throw new Error('ROM-filen kunde inte hittas. Synka mappen igen.')
  }
  if (!isAbsolutePath(game.romPath)) {
    throw new Error('Spelet saknar lokal filväg. Importera ROM:en via desktop file picker.')
  }

  const coreId = getEffectiveCoreId(game)
  if (!coreId) {
    throw new Error('Ingen core vald för spelet. Välj en core i spelets inställningar.')
  }

  const configuredCoresPath = trimTrailingSlashes(getRetroArchCoresPath()) || inferRetroArchCoresPath(getRetroArchPath())
  if (!configuredCoresPath) {
    throw new Error('Ställ in core-mapp i inställningarna först.')
  }

  const corePath = buildCorePath(coreId, configuredCoresPath)
  await launchLibretroGame(corePath, game.romPath)
}

// Re-export SDK helpers so the browser component can import from one place
export { setLibretroBounds, sendLibretroInput, onLibretroStopped, stopLibretroGame }
