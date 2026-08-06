import type React from 'react'
import { useEffect, useState } from 'react'
import {
  translate,
  type LumioplayLang,
  type LumioplayStringKey,
} from '../../runtime/lumioplay-i18n'

export type PluginText = string | Partial<Record<'en' | 'sv', string>>

export interface PluginFileDialogFilter {
  name: string
  extensions: string[]
}

export interface PluginDesktopCommandOptions {
  program: string
  args?: string[]
  cwd?: string
  env?: Record<string, string>
}

export interface PluginDesktopCommandResult {
  code: number | null
  signal: number | null
  stdout: string
  stderr: string
}

export interface PluginDesktopSpawnResult {
  pid: number
}

export interface PluginIndexedFile {
  path: string
  fileName: string
  sizeBytes?: number | null
}

type PluginIndexedFilePayload = PluginIndexedFile & {
  file_name?: string
  size_bytes?: number | null
}

export interface BrowsePageTarget {
  pageId: string
  params?: Record<string, string>
}

export interface BrowsePageProps {
  pageId: string
  params?: Record<string, string>
  onNavigate: (target: BrowsePageTarget) => void
}

export interface HomeRowProps {
  onNavigate: (target: BrowsePageTarget) => void
  layout?: 'slider' | 'grid' | 'full'
  count?: number
  sliderCardWidth?: string
}

export const PLUGIN_HOME_ROW_SLIDER_TRACK_CLASS =
  'thin-slider-scrollbar flex gap-3 overflow-x-auto pb-3'

export const PLUGIN_HOME_ROW_GRID_TRACK_CLASS =
  'grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

export function getPluginHomeRowTrackClass(
  layout: HomeRowProps['layout'],
  options?: { gridClassName?: string },
): string {
  if (layout === 'slider') return PLUGIN_HOME_ROW_SLIDER_TRACK_CLASS
  return options?.gridClassName?.trim() || PLUGIN_HOME_ROW_GRID_TRACK_CLASS
}

export interface SettingsSection {
  id: string
  label: PluginText
  Section: React.ComponentType
  pluginId?: string
}

export interface HomeRowContribution {
  id: string
  title: PluginText
  position?: 'top' | 'bottom'
  showOnHome?: boolean
  Row: React.ComponentType<HomeRowProps>
}

export interface HomeSourceContribution {
  id: string
  label: PluginText
  rowId: string
}

export interface PluginHeroProps {
  onNavigate: (target: BrowsePageTarget) => void
  onActiveChange: (active: boolean) => void
  onBackdropChange: (backdropUrl: string | null) => void
}

export interface PluginHeroContribution {
  id: string
  Hero: React.ComponentType<PluginHeroProps>
  blocksNativeHero?: boolean
}

export interface HomeOverrideProps {
  onNavigate: (target: BrowsePageTarget) => void
  onOpenDetails: (item: unknown) => void
}

export interface HomeOverrideContribution {
  id: string
  label?: PluginText
  pluginId?: string
  View: React.ComponentType<HomeOverrideProps>
}

export interface BrowsePageContribution {
  id: string
  label: PluginText
  Page: React.ComponentType<BrowsePageProps>
}

export interface NavigationItemContribution {
  id: string
  label: PluginText
  target: BrowsePageTarget
  defaultEnabled?: boolean
}

export interface PluginContext {
  registerSettingsSection(section: SettingsSection): void
  registerHomeRow(row: HomeRowContribution): void
  registerHomeSource(source: HomeSourceContribution): void
  registerHero(hero: PluginHeroContribution): void
  registerHomeOverride(homeOverride: HomeOverrideContribution): void
  registerBrowsePage(page: BrowsePageContribution): void
  registerMainMenuItem(item: NavigationItemContribution): void
  registerTopbarItem(item: NavigationItemContribution): void
}

export interface LumioPlugin {
  id: string
  name: PluginText
  version: string
  description?: PluginText
  preinstalled?: boolean
  visibility?: {
    hideOnLanClient?: boolean
  }
  register(ctx: PluginContext): void
}

type PluginRuntimeSdk = {
  getScopedStorageItem(key: string): string | null
  setScopedStorageItem(key: string, value: string): void
  isPluginDesktopHost(): boolean
  pickPluginFolder(): Promise<string | null>
  pickPluginFiles(filters?: PluginFileDialogFilter[]): Promise<string[] | null>
  scanPluginDirectory(directory: string, extensions?: string[]): Promise<PluginIndexedFile[] | null>
  executePluginDesktopCommand(options: PluginDesktopCommandOptions): Promise<PluginDesktopCommandResult>
  spawnPluginDesktopCommand(options: PluginDesktopCommandOptions): Promise<PluginDesktopSpawnResult>
  checkPluginPathExists(path: string): Promise<boolean>
  launchPluginProgram(program: string, args: string[]): Promise<number>
  launchLibretroGame(corePath: string, romPath: string): Promise<void>
  stopLibretroGame(): Promise<void>
  setLibretroBounds(x: number, y: number, w: number, h: number, windowHeight: number, scale: number): Promise<void>
  sendLibretroInput(buttons: boolean[]): Promise<void>
  onLibretroStopped(handler: () => void): () => void
}

declare global {
  interface Window {
    __lumioPluginRuntime?: {
      sdk?: PluginRuntimeSdk
    }
  }
}

function getRuntimeSdk(): PluginRuntimeSdk | null {
  if (typeof window === 'undefined') return null
  return window.__lumioPluginRuntime?.sdk ?? null
}

export function getScopedStorageItem(key: string): string | null {
  const sdk = getRuntimeSdk()
  if (sdk) return sdk.getScopedStorageItem(key)
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(`lumioplay:${key}`)
}

export function setScopedStorageItem(key: string, value: string): void {
  const sdk = getRuntimeSdk()
  if (sdk) {
    sdk.setScopedStorageItem(key, value)
    return
  }
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`lumioplay:${key}`, value)
}

// The host persists the picked language per profile under `app_lang` and fires
// `lumio-app-lang-changed` so detached copies of its i18n module can follow the
// picker live. The plugin bundle is one of those detached copies (it resolves
// `@/lib/plugin-sdk` to this shim, not to the host), so we mirror the same
// read + subscribe behaviour instead of reaching for the host's LangProvider.
const LANG_STORAGE_KEY = 'app_lang'
const LANG_CHANGED_EVENT = 'lumio-app-lang-changed'
const PROFILE_CHANGED_EVENT = 'lumio-profile-changed'
const DEFAULT_LANG: LumioplayLang = 'en'

// Falls back to the legacy unscoped `app_lang` so installs from before
// per-profile scoping keep their setting, then to the English default.
export function getActiveLang(): LumioplayLang {
  if (typeof window === 'undefined') return DEFAULT_LANG
  try {
    const scoped = getScopedStorageItem(LANG_STORAGE_KEY)
    const legacy = window.localStorage.getItem(LANG_STORAGE_KEY)
    const value = scoped ?? legacy
    if (value === 'sv' || value === 'en') return value
  } catch {
    // storage unavailable — fall through to the default
  }
  return DEFAULT_LANG
}

// Translation for module-scope callers (launcher/storage helpers) that cannot
// use the hook. Resolves the active language at call time.
export function tr(key: LumioplayStringKey): string {
  return translate(getActiveLang(), key)
}

export function useLang(): {
  lang: LumioplayLang
  setLang: (next: LumioplayLang) => void
  t: (key: LumioplayStringKey) => string
} {
  const [lang, setLangState] = useState<LumioplayLang>(DEFAULT_LANG)

  // Hydrate after mount, then re-read on picker changes and on profile
  // switches (language is per-profile). `storage` covers other windows.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const sync = () => setLangState(getActiveLang())
    sync()
    window.addEventListener(LANG_CHANGED_EVENT, sync)
    window.addEventListener(PROFILE_CHANGED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(LANG_CHANGED_EVENT, sync)
      window.removeEventListener(PROFILE_CHANGED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return {
    lang,
    setLang: (next: LumioplayLang) => {
      setScopedStorageItem(LANG_STORAGE_KEY, next)
      setLangState(next)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(LANG_CHANGED_EVENT))
      }
    },
    t: (key: LumioplayStringKey) => translate(lang, key),
  }
}

export function isPluginDesktopHost(): boolean {
  const sdk = getRuntimeSdk()
  if (sdk) return sdk.isPluginDesktopHost()
  return false
}

export async function pickPluginFolder(): Promise<string | null> {
  return getRuntimeSdk()?.pickPluginFolder() ?? null
}

export async function pickPluginFiles(filters?: PluginFileDialogFilter[]): Promise<string[] | null> {
  return getRuntimeSdk()?.pickPluginFiles(filters) ?? null
}

export async function scanPluginDirectory(
  directory: string,
  extensions?: string[],
): Promise<PluginIndexedFile[] | null> {
  const files = await (getRuntimeSdk()?.scanPluginDirectory(directory, extensions) ?? null)
  return (files as PluginIndexedFilePayload[] | null)?.map((file) => ({
    path: file.path,
    fileName: file.fileName ?? file.file_name ?? '',
    sizeBytes: file.sizeBytes ?? file.size_bytes ?? null,
  })) ?? null
}

export async function executePluginDesktopCommand(
  options: PluginDesktopCommandOptions,
): Promise<PluginDesktopCommandResult> {
  const sdk = getRuntimeSdk()
  if (!sdk) {
    throw new Error('Desktop command execution is only available in the Lumio desktop host.')
  }
  return sdk.executePluginDesktopCommand(options)
}

export async function spawnPluginDesktopCommand(
  options: PluginDesktopCommandOptions,
): Promise<PluginDesktopSpawnResult> {
  const sdk = getRuntimeSdk()
  if (!sdk) {
    throw new Error('Desktop command execution is only available in the Lumio desktop host.')
  }
  return sdk.spawnPluginDesktopCommand(options)
}

export async function checkPluginPathExists(path: string): Promise<boolean> {
  return getRuntimeSdk()?.checkPluginPathExists(path) ?? false
}

export async function launchPluginProgram(program: string, args: string[]): Promise<number> {
  const sdk = getRuntimeSdk()
  if (!sdk) {
    throw new Error('Program launch is only available in the Lumio desktop host.')
  }
  return sdk.launchPluginProgram(program, args)
}

export async function launchLibretroGame(corePath: string, romPath: string): Promise<void> {
  const sdk = getRuntimeSdk()
  if (!sdk) {
    throw new Error('Libretro embedding is only available in the Lumio desktop host.')
  }
  return sdk.launchLibretroGame(corePath, romPath)
}

export async function stopLibretroGame(): Promise<void> {
  const sdk = getRuntimeSdk()
  if (!sdk) return
  return sdk.stopLibretroGame()
}

export async function setLibretroBounds(
  x: number,
  y: number,
  w: number,
  h: number,
  windowHeight: number,
  scale: number,
): Promise<void> {
  const sdk = getRuntimeSdk()
  if (!sdk) return
  return sdk.setLibretroBounds(x, y, w, h, windowHeight, scale)
}

export async function sendLibretroInput(buttons: boolean[]): Promise<void> {
  const sdk = getRuntimeSdk()
  if (!sdk) return
  return sdk.sendLibretroInput(buttons)
}

export function onLibretroStopped(handler: () => void): () => void {
  const sdk = getRuntimeSdk()
  if (!sdk) return () => {}
  return sdk.onLibretroStopped(handler)
}
