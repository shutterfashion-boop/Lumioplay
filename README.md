# Lumioplay

Lumioplay is an external emulator plugin for Lumio, built around RetroArch + libretro cores.

## Status

The repo is now locally scaffolded and buildable.

Current state:

- Lumio plugin manifest and runtime entry are in place
- local ROM import works through browser file selection and desktop file picking
- console auto-detection is implemented from file extensions
- the library view has search, console chips, and a Lumio-style game grid
- saved ROM folders can be scanned recursively in desktop mode
- RetroArch launch is wired for imported desktop ROMs when the Lumio host exposes the needed desktop bridge
- RetroArch path, cores path, and ROM folders are stored in plugin-scoped storage
- a local build step outputs `dist/runtime.js`

This is the first working launcher slice. What is still missing is richer library metadata, real folder watching, manual platform overrides, and a more polished launch/settings flow.

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

## Current features

- upload ROM files directly from the library page
- import ROMs through the desktop file picker
- choose a ROM folder from the library page
- rescan saved ROM folders in desktop mode
- auto-detect supported consoles from file extension
- browse imported games in a Lumio-style grid
- filter with console chips and search
- launch imported desktop ROMs through RetroArch
- save RetroArch path, cores path, and ROM folder preferences locally

Notes:

- browser uploads are still useful for UI prototyping, but only desktop-imported ROMs have absolute file paths for launch
- folder selection is native in desktop mode, but background watching is not built yet
- artwork and metadata are still placeholders
- the standalone repo uses a local SDK shim, but the intended production contract is Lumio core's plugin SDK

## Local development

1. Run `npm install`
2. Run `npm run typecheck`
3. Run `npm run build`

The runtime bundle is generated at `dist/runtime.js`.

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

1. Add folder watching / re-index sync instead of manual rescan only.
2. Persist a richer local ROM library database with artwork, favorites, and platform overrides.
3. Add manual console/core reassignment per game.
4. Add metadata enrichment and cover art.
5. Polish the RetroArch setup UX with validation and platform-specific defaults.
