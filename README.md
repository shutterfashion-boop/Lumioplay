# Lumioplay

Lumioplay is an external emulator plugin for Lumio, built around RetroArch + libretro cores.

## Requirements

Lumioplay requires RetroArch and at least one libretro core to launch games on desktop.

### RetroArch

Download and install RetroArch for your platform:

- **macOS**: [https://buildbot.libretro.com/stable/](https://buildbot.libretro.com/stable/) — pick the latest macOS build, or install via Homebrew: `brew install retroarch`
- **Windows**: [https://www.retroarch.com/index.php?page=platforms](https://www.retroarch.com/index.php?page=platforms) — download the Windows installer
- **Linux**: Available via most package managers (`apt install retroarch`, `pacman -S retroarch`) or from the site above

After installing, open RetroArch at least once so it creates its config folder.

### Libretro cores

Cores are emulation modules that handle specific consoles. The easiest way to install them is through RetroArch's built-in downloader:

1. Open RetroArch
2. Go to **Main Menu → Load Core → Download a Core**
3. Install the core for each console you want:

| Console | Recommended core |
|---------|-----------------|
| NES | `fceumm` or `nestopia` |
| SNES | `snes9x` |
| Game Boy / GBC | `gambatte` |
| Game Boy Advance | `mgba` |
| Mega Drive / Genesis | `genesis_plus_gx` |
| Nintendo 64 | `mupen64plus_next` |
| PlayStation 1 | `pcsx_rearmed` or `beetle_psx` |

Cores are `.dylib` (macOS), `.dll` (Windows), or `.so` (Linux) files located inside the RetroArch cores folder (usually `~/Library/Application Support/RetroArch/cores` on macOS or `C:\RetroArch\cores` on Windows).

### Setup in Lumioplay

Once RetroArch and cores are installed, open Lumio → Lumioplay → Settings and point Lumioplay to:

- **RetroArch path** — the RetroArch binary (e.g. `/Applications/RetroArch.app/Contents/MacOS/RetroArch`)
- **Cores folder** — the folder containing your `.dylib`/`.dll`/`.so` core files

## Status

The repo is now locally scaffolded and buildable.

Current state:

- Lumio plugin manifest and runtime entry are in place
- local ROM import works through browser file selection and desktop file picking
- ROM folders can be kept in sync automatically while the library page is open in desktop mode
- console auto-detection is implemented from file extensions, with manual per-game platform override
- the library view has search, console chips, favorites, cover art lookups, and a Lumio-style game grid
- per-game libretro core reassignment is available directly in the grid
- RetroArch launch is wired for imported desktop ROMs when the Lumio host exposes the needed desktop bridge
- RetroArch path, cores path, ROM folders, and auto-sync preferences are stored in plugin-scoped storage
- RetroArch setup can be validated and seeded with platform-aware defaults
- a local build step outputs `dist/runtime.js`

This is now a fuller desktop launcher slice rather than only a scaffold. The main gaps are deeper metadata sources beyond filename enrichment, richer artwork fallback chains, and long-running desktop folder watching outside the open library view.

## Vision

Lumioplay should let you:

- import ROMs by file upload
- add one or more ROM folders
- auto-detect platform from file extension when possible
- browse games in a Lumio-style grid
- switch platform with console chips such as `NES`, `SNES`, `GBA`, `N64`, and `PS1`
- search across the local game library
- launch a game through RetroArch with a mapped libretro core

## Chosen emulator engine

`RetroArch + libretro cores`

Why this stack:

- one launcher path for many systems
- mature controller and save-state support
- well-suited to a desktop Lumio host
- easy to model as `console -> core -> rom`

## Planned first systems

- NES
- SNES
- Game Boy
- Game Boy Color
- Game Boy Advance
- Mega Drive / Genesis
- Nintendo 64
- PlayStation 1

## Repo layout

- `plugin.json`: Lumio plugin metadata
- `runtime/`: plugin runtime source
- `docs/`: architecture notes and implementation plan
- `runtime-host/`: local SDK shims for standalone plugin work
- `scripts/build-runtime.mjs`: runtime bundler that outputs `dist/runtime.js`
- `scripts/package-release.mjs`: creates a release ZIP that Lumio can import
- `.github/workflows/release.yml`: builds and uploads a release ZIP asset on GitHub releases

## Current features

- upload ROM files directly from the library page
- import ROMs through the desktop file picker
- choose one or more ROM folders from the library page
- keep saved ROM folders in sync automatically while the library is open in desktop mode
- auto-detect supported consoles from file extension
- override console and libretro core per game
- enrich library entries with parsed filename metadata and libretro thumbnail cover lookups
- mark games as favorites and keep launch/play counters in local storage
- browse imported games in a Lumio-style grid
- filter with console chips and search
- launch imported desktop ROMs through RetroArch
- save RetroArch path, cores path, ROM folders, and auto-sync preferences locally

Notes:

- browser uploads are still useful for UI prototyping, but only desktop-imported ROMs have absolute file paths for launch
- auto-sync currently works as periodic folder re-indexing while the library page is mounted; native filesystem event watching can be layered on later
- metadata is currently enriched from filenames and libretro thumbnail naming rather than a dedicated game database provider
- the standalone repo uses a local SDK shim, but the intended production contract is Lumio core's plugin SDK

## Local development

1. Run `npm install`
2. Run `npm run typecheck`
3. Run `npm run build`
4. Run `npm run package:release` to create a Lumio-importable ZIP in `release/`

The runtime bundle is generated at `dist/runtime.js`.

## Distribution

This repository is intended to be distributed as a GitHub release ZIP or as a manually uploaded ZIP in Lumio.

Release ZIP contents:

- `plugin.json`
- `README.md`
- `CHANGELOG.md`
- `dist/runtime.js`

The GitHub Actions release workflow builds that ZIP automatically when a GitHub release is published.

## Host integration

Lumioplay is designed to stay on the plugin side of the boundary and use whatever desktop helpers the Lumio host exposes for plugins.

Expected host capabilities:

- `isPluginDesktopHost()`
- `pickPluginFolder()`
- `pickPluginFiles(filters?)`
- `scanPluginDirectory(directory, extensions?)`
- `executePluginDesktopCommand(...)`
- `spawnPluginDesktopCommand(...)`

That keeps emulator launching, file picking, and future desktop-only behavior behind a stable host API instead of hard-coupling the plugin to app internals.

## Next implementation steps

1. Add optional native filesystem watching so folder changes are detected even when the library page is not open.
2. Add a richer external metadata provider path for descriptions, alternate titles, and better artwork coverage.
3. Expand supported systems and let users map multiple preferred cores per console.
4. Add save-state and last-session resume hooks through RetroArch.
