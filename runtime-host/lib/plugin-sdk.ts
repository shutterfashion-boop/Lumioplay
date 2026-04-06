import type React from 'react'

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
  return getRuntimeSdk()?.scanPluginDirectory(directory, extensions) ?? null
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

