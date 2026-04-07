'use client'

import { useState } from 'react'
import { isPluginDesktopHost, pickPluginFolder } from '@/lib/plugin-sdk'
import {
  getAutoSyncEnabled,
  getAutoSyncIntervalSeconds,
  getGamepadExitCombo,
  getGamepadMapping,
  LUMIOPLAY_JOYPAD_BINDINGS,
  getRetroArchCoresPath,
  getRomFolders,
  setAutoSyncEnabled,
  setAutoSyncIntervalSeconds,
  setGamepadExitCombo,
  setGamepadMapping,
  setRetroArchCoresPath,
  setRomFolders,
} from './lumioplay-storage'

const pillClass =
  'rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
const activePillClass =
  'rounded-full border border-accent-400/50 bg-accent-400/10 px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-accent-300 transition-all'

export function LumioplaySettingsSection() {
  const [retroArchCoresPath, setRetroArchCoresPathState] = useState(() => getRetroArchCoresPath())
  const [romFoldersText, setRomFoldersText] = useState(() => getRomFolders().join('\n'))
  const [autoSyncEnabled, setAutoSyncEnabledState] = useState(() => getAutoSyncEnabled())
  const [autoSyncIntervalSeconds, setAutoSyncIntervalSecondsState] = useState(() => getAutoSyncIntervalSeconds())
  const [gamepadMapping, setGamepadMappingState] = useState<Record<number, number>>(() => getGamepadMapping())
  const [exitComboText, setExitComboText] = useState(() => getGamepadExitCombo().join(', '))
  const [saved, setSaved] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

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
    setGamepadMapping(gamepadMapping)
    setGamepadExitCombo(parsedExitCombo)
    setSaved(true)
    setStatusMessage('Inställningarna sparades.')
    window.setTimeout(() => setSaved(false), 1800)
  }

  async function handlePickCoresFolder() {
    const picked = await pickPluginFolder()
    if (!picked) return
    setRetroArchCoresPathState(picked)
    setStatusMessage('Libretro core-mappen uppdaterades.')
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

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Auto-sync</p>
            <p className="text-sm text-slate-400">Skannar sparade mappar i bakgrunden medan biblioteket är öppet.</p>
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
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <p className="text-sm font-medium text-white">Handkontroll</p>
        <p className="mt-1 text-sm text-slate-400">
          Ställ in vilken gamepad-knapp (index) som ska styra varje libretro-knapp.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {LUMIOPLAY_JOYPAD_BINDINGS.map((binding) => (
            <label key={binding.index} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-300">{binding.label}</span>
              <input
                type="number"
                min={0}
                value={gamepadMapping[binding.index] ?? 0}
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setGamepadMappingState((current) => ({
                    ...current,
                    [binding.index]: Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0,
                  }))
                }}
                className="h-9 w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-accent-400/30"
              />
            </label>
          ))}
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
      </div>

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
