# Changelog

## 0.3.34

- Home row cards for `Lumioplay favorites` now launch games directly on click (no details hop first)
- Added centered play affordance on game cards in the favorites row
- Updated favorites row slider container to use app-native `thin-slider-scrollbar` styling for visual consistency

## 0.3.33

- Added a plugin-native custom Home source: `Lumioplay favorites`
- Added a new Home row contribution that renders favorite-marked games with full support for Home layout/count/slider override from app settings
- No app-core patch needed: the row is now exposed via plugin SDK (`home-rows`) and selectable in Custom Home Rows

## 0.3.32

- Added CORS-safe poster index fallback via libretro-thumbnails GitHub tree when direct `thumbnails.libretro.com` directory fetch fails in browser/runtime
- Improved filename-derived title variants for punctuation/revision-heavy ROM names and increased direct candidate budget
- This makes difficult NES names (e.g. `Rev`, dotted initials, subtitle variants) resolve more reliably without title-specific hardcoding

## 0.3.31

- Version bump for plugin distribution/update flow in app

## 0.3.30

- Added two-stage index fallback for poster sync: strict shortlist first, then relaxed shortlist if strict returns no viable candidates
- Added safe retry window that can probe top index candidates even when miss-cache filtering would otherwise empty the candidate list
- Increased index probe depth/timeout in fallback mode to reduce false negatives on punctuation-heavy or metadata-heavy ROM filenames

## 0.3.29

- Improved generic poster matching for complex ROM filenames without title-specific hardcoding
- Added broader punctuation/initialism normalization and iterative trailing-metadata stripping for resilient lookup
- Relaxed long-title shortlist filtering and rotated poster miss-cache key to re-test previously missed candidates

## 0.3.28

- Replaced temporary title-specific fallback with a fully dynamic canonical title matcher
- Canonical matching now ignores noisy metadata tokens (region/revision/publisher/version language markers)
- Index fallback now prioritizes canonical equivalence so future title variants resolve without hardcoded aliases

## 0.3.27

- Fixed index-fallback boxart URL building to always path-encode entry names before fetch
- This resolves poster misses caused by special characters in titles (for example `&`, dots, punctuation-heavy names)

## 0.3.26

- Added manual `force-resync` mode on `Synka posters` that ignores stale miss-cache entries for the current run
- Added targeted miss-cache cleanup for the games being synced so previously missed NES titles can be retried deterministically
- Added strict exact-title index match pass before scored fallback to improve hit-rate for stubborn poster misses

## 0.3.25

- Fixed HTML entity decoding for thumbnail index entries (`&amp;`, `&#39;`, etc.), improving match/fetch reliability for titles like `Track & Field`
- Increased direct cover candidate probe window so clean title variants are less likely to be cut off for tricky ROM names
- Increased index fallback probe depth (`maxCandidates`) to improve recovery for the last unmatched games

## 0.3.24

- Improved poster token matching for short but meaningful NES title tokens (`jr`, `ms`, `gi`) that were previously filtered out
- Added stronger normalization for abbreviation-heavy titles (`G.I.`, `Ms.`, `Jr.`) to improve matches for games like `G.I. Joe`, `Ms. Pac-Man`, and `Donkey Kong Jr.`
- Tuned index probe-term generation to use the same robust tokenization path as ranking, improving difficult-name lookup consistency

## 0.3.23

- Improved poster lookup robustness for tricky ROM names by regenerating fresh cover candidates at sync-time (while still keeping existing saved candidates)
- Added safer thumbnail index decoding and normalized shortlist filtering so malformed index entries no longer break poster resolution for a game
- Expanded title variant normalization (`Kung-Fu`/`Kung Fu`, revision suffix cleanup, stronger `Bros`/`Bros.` handling) to improve hit-rate for titles like `Super Mario Bros` and `Yie Ar Kung-Fu`

## 0.3.22

- Reordered poster title variants to prioritize canonical short names before subtitle-heavy ROM variants
- Increased per-game direct poster candidate probe limit (24) to catch valid boxarts like `Super Mario Bros. (World)`
- Keeps sync stability safeguards while improving difficult NES title hit-rate

## 0.3.21

- Fixed stale poster miss-cache poisoning by rotating miss-cache key and shortening miss TTL
- Direct poster candidate checks now always retry instead of being blocked by old cached misses
- Added extra region candidate suffixes like `(Japan) (En)` to improve NES hit-rate (for example `Yie Ar Kung-Fu`)

## 0.3.20

- Improved poster match hit-rate for classics like `Super Mario Bros` by adding safer title variants (`Bros`/`Bros.`)
- Added region-aware poster candidate suffixes (`(World)`, `(USA)`, `(Japan)`, `(Europe)`) based on ROM filename hints
- Kept candidate generation capped to avoid sync overload while improving difficult-name matches

## 0.3.19

- Fixed poster sync unhandled promise rejection paths so failed cover fetches no longer crash the Lumioplay webview
- Added defensive per-game poster resolve fallback (`null` on fetch failure) during chunked sync
- Added explicit error reporting in poster sync status instead of bubbling unhandled rejections

## 0.3.18

- Added poster sync progress indicator (`processed/total` + resolved hits) in the library status area
- Added safe cancel support for poster sync via the same toolbar button while syncing
- Kept existing crash-avoidance limits (batched writes, capped concurrency, per-request timeout)

## 0.3.17

- Made the in-game exit control persistent in a fixed top overlay so it is always visible above gameplay
- Added safe poster sync with strict limits: manual trigger, capped concurrency, timeout per request, batched storage writes
- Added lightweight auto poster sync only for newly imported/synced games (small capped batch, no startup full-library sweep)

## 0.3.16

- Removed poster sync from the library flow to stabilize startup and folder import on desktop
- Removed remote libretro cover candidate generation from metadata (no background cover fetch/load)
- Kept ROM import, folder sync, launch, and controller mapping/exit combo intact

## 0.3.15

- Added controller mapping settings so gamepad button indices can be customized per libretro button
- Added configurable gamepad exit combo (default Select + Start) to always leave an active game
- Simplified setup copy by removing RetroArch path and autodetection sections while keeping the core download link

## 0.3.9

- Fixed unhandled errors in the settings-side folder pickers so choosing a core folder or RetroArch app no longer crashes the Lumioplay webview

## 0.3.8

- Recut release to verify Lumio installs a fresh plugin bundle instead of a cached older runtime

## 0.3.7

- Fixed an unhandled folder-picker error path so choosing a ROM folder no longer crashes the Lumioplay webview
- Added safer UI error handling around ROM import, folder sync, and poster sync

## 0.3.6

- Fixed embedded libretro compositing so the game surface shows through the Lumio webview instead of appearing behind it
- Refreshed legacy game metadata during sync so older libraries can resolve poster candidates again
- Removed rounded corners from game posters to match the flatter library card look

## 0.3.5

- Fixed embedded libretro overlay so the game view is no longer covered by an opaque black layer
- Expanded bounds sync slightly upward to hide the top gap above the game surface
- Improved poster syncing feedback and fallback rendering from metadata cover URLs
- Updated Lumioplay copy and settings so libretro core folders are primary and RetroArch is optional

## 0.3.3

- Fixed card border-radius: removed conflicting `overflow-hidden` from outer wrapper so poster corners render correctly
- Poster auto-sync now fetches all games on load, not just the first 12
- Added "Synka posters" button to manually trigger a full poster refresh for the whole library

## 0.3.2

- Fixed desktop detection: `isPluginDesktopHost()` now evaluates after mount so the SDK bridge is guaranteed to be ready, fixing "Desktop krävs" showing incorrectly and the missing sync button
- Fixed game launch crash: path checking and program launch now use Rust-side Tauri commands instead of the shell plugin, bypassing scope validation errors
- Added "Öppna RetroArch" button in settings → launches RetroArch directly so you can download cores via its built-in Load Core → Download a Core menu

## 0.3.1

- Redesigned game cards to match Lumio's movie grid — transparent background, no card border, poster-first with info below using the same minimal style as media cards
- Title, region, and meta info moved below the poster instead of overlaid; matches the movie card text layout exactly
- Removed separate dark info panel — the section below the poster is now fully transparent

## 0.3.0

- Updated game grid cards to match Lumio's visual theme — lighter borders, subtle translucent background, cleaner hover states
- Play button now uses Lumio's solid accent colour instead of an outlined tint
- Poster art scales slightly on hover, consistent with other Lumio grids
- Added a requirements panel in settings with direct links to RetroArch and the libretro buildbot
- Updated README with a full setup guide covering RetroArch download, core installation, and recommended cores per console

## 0.2.2

- Fixed ROM folder scans from the Lumio desktop app by normalizing file payloads from the host bridge.
- Hardened library import and storage reads so invalid file entries no longer crash Lumioplay during startup or sync.

## 0.2.1

- Fixed the external plugin host bridge so Lumioplay can detect the Lumio desktop app and use desktop-only helpers
- Refined ROM sync merging so fresh metadata and cleaner titles replace stale imported names
- Improved cover-art candidate generation for libretro thumbnails with cleaner title variants
- Softened search and card borders to better match Lumio's darker visual theme

## 0.2.0

- Added a richer local library model with favorites, manual platform overrides, manual core overrides, and persisted metadata
- Added background ROM-folder sync so saved folders stay updated without relying only on manual rescans
- Added metadata enrichment from filenames plus libretro thumbnail cover lookups for supported systems
- Added per-game customization controls directly in the library grid
- Added RetroArch setup validation, auto-sync settings, and platform-aware default path suggestions

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
