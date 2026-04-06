# RetroArch Architecture

## Goal

Use Lumio as the frontend and RetroArch as the emulator launcher.

## Layers

### 1. Library layer

Responsible for:

- indexing ROM files
- watching selected ROM folders
- reading file extension and path hints
- assigning platform automatically when possible
- storing overrides when the user changes platform manually

Suggested storage model:

- `romId`
- `name`
- `filePath`
- `folderPath`
- `platformId`
- `coreId`
- `fileExtension`
- `boxArtUrl`
- `lastPlayedAt`
- `playCount`

### 2. Platform/core layer

Maps a ROM to a RetroArch core.

Examples:

- `.nes` -> `fceumm_libretro`
- `.sfc`, `.smc` -> `snes9x_libretro`
- `.gb` -> `gambatte_libretro`
- `.gbc` -> `gambatte_libretro`
- `.gba` -> `mgba_libretro`
- `.gen`, `.md` -> `genesis_plus_gx_libretro`
- `.n64`, `.z64` -> `mupen64plus_next_libretro`
- `.cue`, `.chd`, `.pbp`, `.bin` -> `pcsx_rearmed_libretro`

### 3. Launcher layer

Desktop-only launch path:

- verify RetroArch binary path
- verify core path for selected platform
- build command:
  - `retroarch -L <core-path> <rom-path>`
- launch through Lumio core's plugin host helpers, not direct Tauri imports inside the plugin

Preferred host contract:

- `isPluginDesktopHost()`
- `pickPluginFolder()`
- `pickPluginFiles(filters?)`
- `executePluginDesktopCommand(...)`
- `spawnPluginDesktopCommand(...)`

This keeps native process launch and file dialogs centralized in the host app.

### 4. Lumio UI layer

Plugin UI should feel native to Lumio:

- console chips above the grid
- search input
- game cards in a grid or slider row
- recent games row on home
- settings section for ROM folders, RetroArch path, core mapping

## Important decisions

### Auto-detection

Auto-detect platform by extension first.

Fallback heuristics:

- parent folder name
- file naming hints

Manual override must always win over auto-detection.

### Covers and metadata

Phase 1:

- use filename and platform only
- keep cards lightweight and browse-first

Phase 2:

- fetch cover art from a metadata source
- cache artwork locally

### Current scaffold snapshot

Already implemented:

- platform auto-detection from file extension
- local ROM import from browser selection and desktop file picking
- recursive folder scanning for saved ROM directories
- searchable grid browser with console chips
- plugin-scoped storage for games, ROM folders, and RetroArch path
- RetroArch launch through the host SDK using `retroarch -L <core> <rom>`

Still missing:

- folder watching / automatic re-indexing
- richer path validation and platform defaults
- metadata/artwork pipeline

### Save states

Handled by RetroArch itself first.

Later we can expose:

- resume last played
- open RetroArch save folder
- per-game quick actions
