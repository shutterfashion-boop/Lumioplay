import { getScopedStorageItem, setScopedStorageItem } from './plugin-sdk'

const KEY = 'custom_home_override_plugin'
const EVENT = 'lumio-home-override-changed'

function emitChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function getHomeOverridePluginId(): string | null {
  if (typeof window === 'undefined') return null
  const value = getScopedStorageItem(KEY)?.trim() ?? ''
  return value || null
}

export function setHomeOverridePluginId(pluginId: string): void {
  const normalized = pluginId.trim()
  if (!normalized) return
  setScopedStorageItem(KEY, normalized)
  emitChanged()
}

export function clearHomeOverridePluginId(): void {
  setScopedStorageItem(KEY, '')
  emitChanged()
}

export function disableHomeOverridePlugin(pluginId: string): void {
  if (getHomeOverridePluginId() !== pluginId) return
  clearHomeOverridePluginId()
}

export function tryEnableHomeOverridePlugin(
  pluginId: string,
): { ok: true } | { ok: false; activePluginId: string } {
  const normalized = pluginId.trim()
  if (!normalized) return { ok: true }
  const current = getHomeOverridePluginId()
  if (current && current !== normalized) {
    return { ok: false, activePluginId: current }
  }
  setHomeOverridePluginId(normalized)
  return { ok: true }
}

export function onHomeOverridePluginChanged(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const wrapped = () => listener()
  window.addEventListener(EVENT, wrapped)
  return () => window.removeEventListener(EVENT, wrapped)
}
