'use client'

import { useMemo, useState } from 'react'
import { isPluginDesktopHost, pickPluginFiles, pickPluginFolder } from '@/lib/plugin-sdk'
import {
  getAutoSyncEnabled,
  getAutoSyncIntervalSeconds,
  getRetroArchCoresPath,
  getRetroArchPath,
  getRomFolders,
  LUMIOPLAY_PLATFORMS,
  setAutoSyncEnabled,
  setAutoSyncIntervalSeconds,
  setRetroArchCoresPath,
  setRetroArchPath,
  setRomFolders,
} from './lumioplay-storage'
import { getSuggestedRetroArchSetup, validateRetroArchSetup } from './lumioplay-launcher'

const pillClass =
  'rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
const activePillClass =
  'rounded-full border border-accent-400/50 bg-accent-400/10 px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-accent-300 transition-all'

export function LumioplaySettingsSection() {
  const [retroArchPath, setRetroArchPathState] = useState(() => getRetroArchPath())
  const [retroArchCoresPath, setRetroArchCoresPathState] = useState(() => getRetroArchCoresPath())
  const [romFoldersText, setRomFoldersText] = useState(() => getRomFolders().join('\n'))
  const [autoSyncEnabled, setAutoSyncEnabledState] = useState(() => getAutoSyncEnabled())
  const [autoSyncIntervalSeconds, setAutoSyncIntervalSecondsState] = useState(() => getAutoSyncIntervalSeconds())
  const [saved, setSaved] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [validationBusy, setValidationBusy] = useState(false)

  const suggestedSetup = useMemo(() => getSuggestedRetroArchSetup(), [])

  function handleSave() {
    setRetroArchPath(retroArchPath.trim())
    setRetroArchCoresPath(retroArchCoresPath.trim())
    setRomFolders(
      romFoldersText
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
    )
    setAutoSyncEnabled(autoSyncEnabled)
    setAutoSyncIntervalSeconds(autoSyncIntervalSeconds)
    setSaved(true)
    setStatusMessage('Inställningarna sparades.')
    window.setTimeout(() => setSaved(false), 1800)
  }

  async function handlePickRetroArch() {
    const paths = await pickPluginFiles([
      { name: 'RetroArch', extensions: ['app', 'exe'] },
    ])
    const picked = paths?.[0]
    if (!picked) return
    setRetroArchPathState(picked)
    setStatusMessage('RetroArch-sökvägen uppdaterades.')
  }

  async function handlePickCoresFolder() {
    const picked = await pickPluginFolder()
    if (!picked) return
    setRetroArchCoresPathState(picked)
    setStatusMessage('Core-mappen uppdaterades.')
  }

  async function handleValidateSetup() {
    setValidationBusy(true)
    setValidationMessage(null)
    try {
      const result = await validateRetroArchSetup(retroArchPath, retroArchCoresPath)
      setValidationMessage(result.details.join(' '))
      if (result.ok) {
        setRetroArchPathState(result.executablePath || retroArchPath)
        setRetroArchCoresPathState(result.coresPath || retroArchCoresPath)
      }
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Kunde inte validera RetroArch-inställningarna.')
    } finally {
      setValidationBusy(false)
    }
  }

  function applySuggestedDefaults() {
    setRetroArchPathState(suggestedSetup.retroArchPath)
    setRetroArchCoresPathState(suggestedSetup.retroArchCoresPath)
    setStatusMessage(`${suggestedSetup.label} lades in som förslag.`)
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">RetroArch</p>
        <h2 className="text-xl font-semibold text-white">Lumioplay</h2>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-slate-400">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Vad behövs?</p>
        <div className="mt-3 space-y-2">
          <p>
            Lumioplay kräver{' '}
            <a
              href="https://www.retroarch.com/index.php?page=platforms"
              target="_blank"
              rel="noreferrer"
              className="text-accent-400 underline underline-offset-2 hover:text-accent-300"
            >
              RetroArch
            </a>
            {' '}och minst en libretro-core installerad på din dator.
          </p>
          <p>
            Kärnor laddas enklast ner inifrån RetroArch via{' '}
            <span className="text-slate-300">Main Menu → Load Core → Download a Core</span>.
            Alternativt finns de på{' '}
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

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={applySuggestedDefaults} className={pillClass}>
            Använd standardvägar
          </button>
          <button
            type="button"
            onClick={() => void handleValidateSetup()}
            className={validationBusy ? activePillClass : pillClass}
          >
            {validationBusy ? 'Validerar...' : 'Validera setup'}
          </button>
          {saved ? <span className="text-xs text-emerald-400">Sparad</span> : null}
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Förslag för den här plattformen: {suggestedSetup.retroArchPath}
        </p>
        {validationMessage ? <p className="mt-2 text-sm text-slate-300">{validationMessage}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-slate-500">RetroArch path</label>
        <div className="flex gap-3">
          <input
            value={retroArchPath}
            onChange={(event) => setRetroArchPathState(event.target.value)}
            placeholder="/Applications/RetroArch.app"
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
          />
          {isPluginDesktopHost() ? (
            <button
              type="button"
              onClick={() => void handlePickRetroArch()}
              className={pillClass}
            >
              Välj
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-slate-500">RetroArch cores path</label>
        <div className="flex gap-3">
          <input
            value={retroArchCoresPath}
            onChange={(event) => setRetroArchCoresPathState(event.target.value)}
            placeholder="/Applications/RetroArch.app/Contents/Resources/cores"
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className={activePillClass}
        >
          Spara
        </button>
      </div>
      {statusMessage ? <p className="text-sm text-emerald-300">{statusMessage}</p> : null}

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-400">
        <p className="font-medium text-white">Autodetektering</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {LUMIOPLAY_PLATFORMS.filter((platform) => platform.id !== 'all').map((platform) => (
            <div
              key={platform.id}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                {platform.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {platform.extensions.join(', ')} {'->'} {platform.coreId ?? 'Ingen core'}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Launch använder `retroarch -L &lt;core&gt; &lt;rom&gt;` via Lumio-hostens desktop-SDK och låter dig skriva över både konsol och core per spel.
        </p>
      </div>
    </div>
  )
}

