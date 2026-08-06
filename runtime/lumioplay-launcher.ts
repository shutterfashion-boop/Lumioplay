import {
  checkPluginPathExists,
  isPluginDesktopHost,
  launchLibretroGame,
  launchPluginProgram,
  onLibretroStopped,
  sendLibretroInput,
  setLibretroBounds,
  stopLibretroGame,
  tr,
} from '@/lib/plugin-sdk'
import type { LumioplayStringKey } from './lumioplay-i18n'
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

export type RetroArchValidationStatus = 'ok' | 'ok_cores_only' | 'not_verified' | 'invalid'

export interface RetroArchValidationResult {
  // Derived from `status`, never from the (translated) `details` text.
  ok: boolean
  status: RetroArchValidationStatus
  executablePath: string
  coresPath: string
  detailKeys: LumioplayStringKey[]
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
      label: tr('launcherSetupWindows'),
    }
  }
  if (os === 'linux') {
    return {
      retroArchPath: '/usr/bin/retroarch',
      retroArchCoresPath: '/usr/lib/libretro',
      label: tr('launcherSetupLinux'),
    }
  }
  return {
    retroArchPath: '/Applications/RetroArch.app',
    retroArchCoresPath: '/Applications/RetroArch.app/Contents/Resources/cores',
    label: tr('launcherSetupMacos'),
  }
}

async function pathExists(path: string): Promise<boolean> {
  if (getHostOs() === 'windows') return true
  return checkPluginPathExists(path)
}

function buildValidationResult(
  status: RetroArchValidationStatus,
  executablePath: string,
  coresPath: string,
  detailKeys: LumioplayStringKey[],
): RetroArchValidationResult {
  return {
    ok: status !== 'invalid',
    status,
    executablePath,
    coresPath,
    detailKeys,
    details: detailKeys.map((key) => tr(key)),
  }
}

export async function validateRetroArchSetup(
  inputRetroArchPath: string,
  inputRetroArchCoresPath: string,
): Promise<RetroArchValidationResult> {
  const executablePath = inferRetroArchExecutablePath(inputRetroArchPath)
  const coresPath = trimTrailingSlashes(inputRetroArchCoresPath) || inferRetroArchCoresPath(inputRetroArchPath)
  const problems: LumioplayStringKey[] = []

  if (!coresPath) {
    problems.push('launcherValidationCoresMissing')
  }

  // Path checks need the desktop host; in the browser nothing deeper than the
  // configured-or-not check above can be verified.
  if (!isPluginDesktopHost()) {
    if (problems.length > 0) {
      return buildValidationResult('invalid', executablePath, coresPath, problems)
    }
    return buildValidationResult('not_verified', executablePath, coresPath, ['launcherValidationDesktopRequired'])
  }

  if (executablePath && !(await pathExists(executablePath))) {
    problems.push('launcherValidationRetroArchNotFound')
  }
  if (coresPath && !(await pathExists(coresPath))) {
    problems.push('launcherValidationCoresNotFound')
  }

  if (problems.length > 0) {
    return buildValidationResult('invalid', executablePath, coresPath, problems)
  }

  const status: RetroArchValidationStatus = executablePath ? 'ok' : 'ok_cores_only'
  return buildValidationResult(status, executablePath, coresPath, [
    status === 'ok' ? 'launcherValidationOk' : 'launcherValidationOkCoresOnly',
  ])
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
    throw new Error(tr('launcherRetroArchBinaryMissing'))
  }

  const coreExists = await pathExists(config.corePath)
  if (!coreExists) {
    throw new Error(tr('launcherCoreMissing'))
  }
}

export async function launchRetroArch(executablePath: string): Promise<void> {
  if (!isPluginDesktopHost()) {
    throw new Error(tr('launcherRetroArchDesktopOnly'))
  }
  const resolved = inferRetroArchExecutablePath(executablePath)
  if (!resolved) throw new Error(tr('launcherRetroArchPathRequired'))
  await launchPluginProgram(resolved, [])
}

export async function launchGameWithRetroArch(game: LumioplayGame): Promise<void> {
  if (!isPluginDesktopHost()) {
    throw new Error(tr('launcherRetroArchDesktopOnly'))
  }
  if (game.missing) {
    throw new Error(tr('launcherRomMissingAfterSync'))
  }
  if (!isAbsolutePath(game.romPath)) {
    throw new Error(tr('launcherRomNoLocalPath'))
  }

  const config = getRetroArchLaunchConfig(game)
  if (!config) {
    throw new Error(tr('launcherRetroArchSetupRequired'))
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
    throw new Error(tr('launcherLibretroDesktopOnly'))
  }
  if (game.missing) {
    throw new Error(tr('launcherRomMissing'))
  }
  if (!isAbsolutePath(game.romPath)) {
    throw new Error(tr('launcherGameNoLocalPath'))
  }

  const coreId = getEffectiveCoreId(game)
  if (!coreId) {
    throw new Error(tr('launcherNoCoreSelected'))
  }

  const configuredCoresPath = trimTrailingSlashes(getRetroArchCoresPath()) || inferRetroArchCoresPath(getRetroArchPath())
  if (!configuredCoresPath) {
    throw new Error(tr('launcherCoresPathRequired'))
  }

  const corePath = buildCorePath(coreId, configuredCoresPath)
  if (!(await pathExists(corePath))) {
    throw new Error(tr('launcherCoreNotFoundAtPath').replace('{path}', corePath))
  }
  await launchLibretroGame(corePath, game.romPath)
}

// Re-export SDK helpers so the browser component can import from one place
export { setLibretroBounds, sendLibretroInput, onLibretroStopped, stopLibretroGame }
