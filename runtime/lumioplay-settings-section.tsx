'use client'

import { useEffect, useState } from 'react'
import { isPluginDesktopHost, pickPluginFolder } from '@/lib/plugin-sdk'
import {
  disableHomeOverridePlugin,
  getHomeOverridePluginId,
  onHomeOverridePluginChanged,
  tryEnableHomeOverridePlugin,
} from '@/lib/home-override-settings'
import {
  getAutoSyncEnabled,
  getAutoSyncIntervalSeconds,
  getHeroEnabled,
  getHeroMode,
  getGamepadExitCombo,
  getGamepadMapping,
  LUMIOPLAY_JOYPAD_BINDINGS,
  getRetroArchCoresPath,
  getRomFolders,
  setAutoSyncEnabled,
  setAutoSyncIntervalSeconds,
  setHeroEnabled,
  setHeroMode,
  setGamepadExitCombo,
  setGamepadMapping,
  setRetroArchCoresPath,
  setRomFolders,
} from './lumioplay-storage'

const pillClass =
  'rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
const activePillClass =
  'rounded-full border border-accent-400/50 bg-accent-400/10 px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-accent-300 transition-all'
const HOME_OVERRIDE_PLUGIN_ID = 'com.lumio.lumioplay'

function CollapsibleSettingsCard({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string
  description: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        <span
          className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}

export function LumioplaySettingsSection() {
  const [retroArchCoresPath, setRetroArchCoresPathState] = useState(() => getRetroArchCoresPath())
  const [romFoldersText, setRomFoldersText] = useState(() => getRomFolders().join('\n'))
  const [autoSyncEnabled, setAutoSyncEnabledState] = useState(() => getAutoSyncEnabled())
  const [autoSyncIntervalSeconds, setAutoSyncIntervalSecondsState] = useState(() => getAutoSyncIntervalSeconds())
  const [heroEnabled, setHeroEnabledState] = useState(() => getHeroEnabled())
  const [heroMode, setHeroModeState] = useState<'last_played' | 'random'>(() => getHeroMode())
  const [gamepadMapping, setGamepadMappingState] = useState<Record<number, string>>(() => getGamepadMapping())
  const [exitComboText, setExitComboText] = useState(() => getGamepadExitCombo().join(', '))
  const [learningBinding, setLearningBinding] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [homeOverrideEnabled, setHomeOverrideEnabled] = useState(false)
  const [homeOverrideError, setHomeOverrideError] = useState<string | null>(null)
  const [autoSyncExpanded, setAutoSyncExpanded] = useState(false)
  const [gamepadExpanded, setGamepadExpanded] = useState(false)

  useEffect(() => {
    if (learningBinding === null) return
    let rafId = 0
    let cancelled = false

    const onFrame = () => {
      if (cancelled) return
      const pad = navigator.getGamepads?.().find((entry) => Boolean(entry)) ?? null
      if (pad) {
        const pressedIndex = pad.buttons.findIndex((button) => Boolean(button?.pressed))
        if (pressedIndex >= 0) {
          setGamepadMappingState((current) => ({ ...current, [learningBinding]: String(pressedIndex) }))
          setLearningBinding(null)
          setStatusMessage(`Mappade ${LUMIOPLAY_JOYPAD_BINDINGS.find((b) => b.index === learningBinding)?.label ?? learningBinding} till gamepad-index ${pressedIndex}.`)
          return
        }
        const axisIndex = pad.axes.findIndex((axis) => Math.abs(axis ?? 0) > 0.5)
        if (axisIndex >= 0) {
          const axisValue = pad.axes[axisIndex] ?? 0
          const direction = axisValue < 0 ? '-1' : '+1'
          const mappingValue = `axis:${axisIndex}:${direction}`
          setGamepadMappingState((current) => ({ ...current, [learningBinding]: mappingValue }))
          setLearningBinding(null)
          setStatusMessage(`Mappade ${LUMIOPLAY_JOYPAD_BINDINGS.find((b) => b.index === learningBinding)?.label ?? learningBinding} till ${mappingValue}.`)
          return
        }
      }
      rafId = window.requestAnimationFrame(onFrame)
    }

    rafId = window.requestAnimationFrame(onFrame)
    return () => {
      cancelled = true
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [learningBinding])

  useEffect(() => {
    const sync = () => {
      setHomeOverrideEnabled(getHomeOverridePluginId() === HOME_OVERRIDE_PLUGIN_ID)
      setHomeOverrideError(null)
    }
    sync()
    return onHomeOverridePluginChanged(sync)
  }, [])

  function handleSave() {
    const parsedExitCombo = exitComboText
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value) && value >= 0)
      .map((value) => Math.floor(value))

    setRetroArchCoresPath(retroArchCoresPath.trim())
    setRomFolders(
      romFoldersText
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
    )
    setAutoSyncEnabled(autoSyncEnabled)
    setAutoSyncIntervalSeconds(autoSyncIntervalSeconds)
    setHeroEnabled(heroEnabled)
    setHeroMode(heroMode)
    setGamepadMapping(gamepadMapping)
    setGamepadExitCombo(parsedExitCombo)
    setSaved(true)
    setStatusMessage('Inställningarna sparades.')
    window.setTimeout(() => setSaved(false), 1800)
  }

  async function handlePickCoresFolder() {
    try {
      const picked = await pickPluginFolder()
      if (!picked) return
      setRetroArchCoresPathState(picked)
      setStatusMessage('Libretro core-mappen uppdaterades.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kunde inte välja mapp.'
      setStatusMessage(message)
    }
  }

  function handleHomeOverrideToggle(checked: boolean) {
    setHomeOverrideError(null)
    if (!checked) {
      disableHomeOverridePlugin(HOME_OVERRIDE_PLUGIN_ID)
      return
    }
    const result = tryEnableHomeOverridePlugin(HOME_OVERRIDE_PLUGIN_ID)
    if (!result.ok) {
      setHomeOverrideError('Det finns redan en egen startsida satt. Avmarkera den forst innan du valjer en annan plugin.')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Libretro</p>
        <h2 className="text-xl font-semibold text-white">Lumioplay</h2>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-slate-400">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Vad behövs?</p>
        <div className="mt-3 space-y-2">
          <p>
            Lumioplay startar spel direkt i Lumio via inbäddade libretro-kärnor. Det enda som krävs är en fungerande{' '}
            <span className="text-slate-300">libretro core-mapp</span>.
          </p>
          <p>
            Kärnor finns på{' '}
            <a
              href="https://buildbot.libretro.com/stable/"
              target="_blank"
              rel="noreferrer"
              className="text-accent-400 underline underline-offset-2 hover:text-accent-300"
            >
              buildbot.libretro.com
            </a>
            .
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <label className="flex items-center gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={homeOverrideEnabled}
            onChange={(event) => handleHomeOverrideToggle(event.target.checked)}
            className="h-4 w-4 accent-accent-400"
          />
          <span>Anvand som startsida</span>
        </label>
        <p className="mt-2 text-xs text-slate-500">
          Ersatter vanliga Home-rader med Lumioplay-vyn men behaller hero och resten av startsidan.
        </p>
        {homeOverrideError ? <p className="mt-2 text-xs text-rose-300">{homeOverrideError}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-slate-500">Libretro core-mapp</label>
        <div className="flex gap-3">
          <input
            value={retroArchCoresPath}
            onChange={(event) => setRetroArchCoresPathState(event.target.value)}
            placeholder="/Users/jerry/Documents/games/cores"
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
          />
          {isPluginDesktopHost() ? (
            <button
              type="button"
              onClick={() => void handlePickCoresFolder()}
              className={pillClass}
            >
              Välj
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-slate-500">ROM folders</label>
        <textarea
          value={romFoldersText}
          onChange={(event) => setRomFoldersText(event.target.value)}
          placeholder={"/Users/jerry/Games/ROMs/NES\n/Users/jerry/Games/ROMs/SNES"}
          rows={6}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
        />
      </div>

      <CollapsibleSettingsCard
        title="Auto-sync"
        description="Skannar sparade mappar i bakgrunden medan biblioteket är öppet."
        open={autoSyncExpanded}
        onToggle={() => setAutoSyncExpanded((value) => !value)}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Status</p>
            <p className="mt-1 text-sm text-slate-300">{autoSyncEnabled ? 'Aktiverad' : 'Avstängd'}</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoSyncEnabledState((value) => !value)}
            className={autoSyncEnabled ? activePillClass : pillClass}
          >
            {autoSyncEnabled ? 'På' : 'Av'}
          </button>
        </div>
        <div className="mt-4 max-w-xs space-y-2">
          <label className="text-xs uppercase tracking-[0.16em] text-slate-500">Syncintervall i sekunder</label>
          <input
            type="number"
            min={15}
            max={300}
            step={15}
            value={autoSyncIntervalSeconds}
            onChange={(event) => setAutoSyncIntervalSecondsState(Number(event.target.value))}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-accent-400/30"
          />
        </div>
      </CollapsibleSettingsCard>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Lumioplay Hero</p>
            <p className="mt-1 text-sm text-slate-400">Visa ett spel högst upp på startsidan. Avstängt som standard.</p>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={heroEnabled}
              onChange={(event) => setHeroEnabledState(event.target.checked)}
              className="h-4 w-4 accent-accent-400"
            />
            <span className="text-xs uppercase tracking-[0.16em] text-slate-300">Aktivera</span>
          </label>
        </div>
        {heroEnabled ? (
          <div className="mt-4 max-w-sm space-y-2">
            <label className="text-xs uppercase tracking-[0.16em] text-slate-500">Hero-läge</label>
            <select
              value={heroMode}
              onChange={(event) => setHeroModeState(event.target.value === 'random' ? 'random' : 'last_played')}
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-accent-400/30"
            >
              <option value="last_played">Senast spelat</option>
              <option value="random">Random spel</option>
            </select>
          </div>
        ) : null}
      </div>

      <CollapsibleSettingsCard
        title="Handkontroll"
        description="Ställ in vilken gamepad-knapp eller axel som ska styra varje libretro-knapp."
        open={gamepadExpanded}
        onToggle={() => setGamepadExpanded((value) => !value)}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {LUMIOPLAY_JOYPAD_BINDINGS.map((binding) => (
            <div
              key={binding.index}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
            >
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                {binding.label}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gamepadMapping[binding.index] ?? '0'}
                  onChange={(event) => {
                    const value = event.target.value.trim()
                    setGamepadMappingState((current) => ({
                      ...current,
                      [binding.index]: value || '0',
                    }))
                  }}
                  placeholder="0 eller axis:1:-1"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-accent-400/30"
                />
                <button
                  type="button"
                  onClick={() => setLearningBinding((current) => (current === binding.index ? null : binding.index))}
                  className={`${learningBinding === binding.index ? activePillClass : pillClass} h-10 shrink-0 px-4 text-[0.6rem]`}
                >
                  {learningBinding === binding.index ? 'Tryck knapp...' : 'Lär'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-xs text-slate-500">`Lär` stödjer både knappar och styrkors som axlar, t.ex. `axis:0:-1`.</p>
        </div>
        <div className="mt-4 space-y-2">
          <label className="text-xs uppercase tracking-[0.16em] text-slate-500">Avsluta-spel kombination (gamepad-index, komma-separerat)</label>
          <input
            value={exitComboText}
            onChange={(event) => setExitComboText(event.target.value)}
            placeholder="8, 9"
            className="h-11 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
          />
          <p className="text-xs text-slate-500">Standard är 8, 9 (Select + Start).</p>
        </div>
      </CollapsibleSettingsCard>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className={activePillClass}
        >
          Spara
        </button>
        {saved ? <span className="text-xs text-emerald-400">Sparad</span> : null}
      </div>
      {statusMessage ? <p className="text-sm text-emerald-300">{statusMessage}</p> : null}
    </div>
  )
}
