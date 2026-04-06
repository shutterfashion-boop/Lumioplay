# Changelog

## 0.1.3

- Removed the topbar and home-row integration so Lumioplay only appears in the main menu
- Aligned browse-page pills and action buttons with Lumio's existing filter and menu styling
- Moved search to a smaller inline field next to the platform chips
- Reduced import and launch status messages to lightweight inline text
- Only show platform chips for consoles that actually exist in the current library

## 0.1.0

- Initial Lumioplay plugin scaffold
- Chosen emulator stack: RetroArch + libretro cores
- Added runtime skeleton and architecture notes
- Added local build pipeline with `npm run typecheck` and `npm run build`
- Added ROM import shell with platform auto-detection
- Added searchable Lumio-style library grid and console chips
- Added plugin-scoped settings for RetroArch path, cores path, and ROM folders
- Added desktop ROM import and recursive ROM-folder scanning
- Added RetroArch launch flow for desktop-imported ROMs
- Updated docs for Lumio host integration and current launcher status
