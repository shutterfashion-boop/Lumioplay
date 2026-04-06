'use client'

import { useState } from 'react'
import { isPluginDesktopHost, pickPluginFiles, pickPluginFolder } from '@/lib/plugin-sdk'
import {
  getRetroArchCoresPath,
  getRetroArchPath,
  getRomFolders,
  LUMIOPLAY_PLATFORMS,
  setRetroArchCoresPath,
  setRetroArchPath,
  setRomFolders,
} from './lumioplay-storage'

export function LumioplaySettingsSection() {
  const [retroArchPath, setRetroArchPathState] = useState(() => getRetroArchPath())
  const [retroArchCoresPath, setRetroArchCoresPathState] = useState(() => getRetroArchCoresPath())
  const [romFoldersText, setRomFoldersText] = useState(() => getRomFolders().join('\n'))
  const [saved, setSaved] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  function handleSave() {
    setRetroArchPath(retroArchPath.trim())
    setRetroArchCoresPath(retroArchCoresPath.trim())
    setRomFolders(
      romFoldersText
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean),
    )
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

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">RetroArch</p>
        <h2 className="text-xl font-semibold text-white">Lumioplay</h2>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.16em] text-slate-500">RetroArch path</label>
        <div className="flex gap-3">
          <input
            value={retroArchPath}
            onChange={(event) => setRetroArchPathState(event.target.value)}
            placeholder="/Applications/RetroArch.app"
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none"
          />
          {isPluginDesktopHost() ? (
            <button
              type="button"
              onClick={() => void handlePickRetroArch()}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-medium uppercase tracking-[0.16em] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
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
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none"
          />
          {isPluginDesktopHost() ? (
            <button
              type="button"
              onClick={() => void handlePickCoresFolder()}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-medium uppercase tracking-[0.16em] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
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
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-950 transition hover:bg-slate-200"
        >
          Save
        </button>
        {saved ? <span className="text-xs text-emerald-400">Saved</span> : null}
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
          Launch använder `retroarch -L &lt;core&gt; &lt;rom&gt;` via Lumio-hostens desktop-SDK när appen körs i desktopläge.
        </p>
      </div>
    </div>
  )
}
