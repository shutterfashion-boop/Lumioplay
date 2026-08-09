(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // runtime/index.tsx
  var runtime_exports = {};
  __export(runtime_exports, {
    LumioplayPlugin: () => LumioplayPlugin
  });

  // ../../../../var/folders/lc/1hd2j0b57z10tx5mflylq4r80000gp/T/lumioplay-build-PJrV59/react-shim.ts
  var react = globalThis.__lumioPluginRuntime?.react ?? globalThis.React;
  if (!react) {
    throw new Error("Lumio plugin runtime host has not initialized React.");
  }
  var Fragment = react.Fragment;
  var useEffect = react.useEffect;
  var useMemo = react.useMemo;
  var useRef = react.useRef;
  var useState = react.useState;

  // runtime/lumioplay-i18n.ts
  var en = {
    // Shared labels
    platformAll: "All",
    lastPlayed: "Last played",
    favorite: "Favorite",
    showAll: "Show all",
    starting: "Starting\u2026",
    launchFailed: "Could not start the game.",
    // D-pad directions (the remaining joypad labels are button names, not words)
    dpadUp: "Up",
    dpadDown: "Down",
    dpadLeft: "Left",
    dpadRight: "Right",
    // ROM regions parsed out of file names
    regionEurope: "Europe",
    regionJapan: "Japan",
    regionWorld: "World",
    regionAsia: "Asia",
    // Launcher / RetroArch setup
    launcherSetupWindows: "Standard RetroArch installation for Windows",
    launcherSetupLinux: "Common RetroArch installation for Linux",
    launcherSetupMacos: "Common libretro installation for macOS",
    launcherValidationCoresMissing: "The libretro core folder is missing.",
    launcherValidationDesktopRequired: "Detailed validation requires the desktop app.",
    launcherValidationRetroArchNotFound: "RetroArch could not be found at the given path.",
    launcherValidationCoresNotFound: "The libretro core folder could not be found at the given path.",
    launcherValidationOk: "RetroArch and the core folder look valid.",
    launcherValidationOkCoresOnly: "The core folder looks valid. RetroArch is optional.",
    launcherRetroArchBinaryMissing: "The RetroArch binary could not be found. Check the path in settings.",
    launcherCoreMissing: "The libretro core could not be found. Check the core folder or pick another core for the game.",
    launcherRetroArchDesktopOnly: "Launching RetroArch is only available in the desktop app.",
    launcherRetroArchPathRequired: "Set the RetroArch path in settings first.",
    launcherRomMissingAfterSync: "The ROM file could not be found during the last sync. Sync the folder again or pick a new folder.",
    launcherRomNoLocalPath: "This game has no local file path yet. Import the ROM with the desktop file picker.",
    launcherRetroArchSetupRequired: "Set the RetroArch path and the core folder first.",
    launcherLibretroDesktopOnly: "Launching libretro is only available in the desktop app.",
    launcherRomMissing: "The ROM file could not be found. Sync the folder again.",
    launcherGameNoLocalPath: "The game has no local file path. Import the ROM with the desktop file picker.",
    launcherNoCoreSelected: "No core selected for this game. Pick a core in the game settings.",
    launcherCoresPathRequired: "Set the core folder in settings first.",
    launcherCoreNotFoundAtPath: "The libretro core could not be found: {path}",
    // Hero
    heroRandomSubtitle: "A random pick from your library.",
    heroLastPlayedSubtitle: "The game you played most recently from your library.",
    heroPlayCount: "Played {count}x",
    heroPlayNow: "Play now",
    // Favorites home row
    homeRowFavoritesTitle: "Lumioplay favorites",
    homeRowFavoritesSubtitle: "Games you marked as favorites",
    // Library browser
    browserTitle: "Game library",
    browserSearchPlaceholder: "Search games",
    browserImportRoms: "Import ROMs",
    browserUploadRoms: "Upload ROMs",
    browserChooseFolder: "Choose folder",
    browserSyncing: "Syncing\u2026",
    browserSyncNow: "Sync now",
    browserSyncPosters: "Sync posters",
    browserCancelPosterSync: "Cancel poster sync",
    browserAddFavorite: "Mark as favorite",
    browserRemoveFavorite: "Remove favorite",
    browserEmptyLibrary: "No games found yet. Add ROM files or pick a ROM folder in settings.",
    browserMissing: "Missing",
    browserCardSize: "Card size",
    browserNoCore: "No core",
    browserPlay: "Play",
    browserCustomize: "Customize",
    browserDone: "Done",
    browserImportHint: "Import with the desktop picker or pick a local folder.",
    browserDesktopRequired: "The desktop app is required to launch games.",
    browserConsole: "Console",
    browserAutoDetect: "Auto-detect ({platform})",
    browserLibretroCore: "Libretro core",
    browserCoreIdPlaceholder: "Enter core ID",
    browserNoMissingPosters: "No games are missing a poster right now.",
    browserPosterSyncProgress: "Poster sync",
    browserPosterSyncHits: "hits",
    browserCancellingPosterSync: "Cancelling poster sync\u2026",
    browserPosterSyncCancelled: "Poster sync cancelled ({resolved}/{processed}). {unmatched} games have no matching poster.",
    browserPosterSyncForced: "Force resync done: {resolved}/{processed} posters updated. {unmatched} games have no matching poster.",
    browserPosterSyncDone: "{resolved}/{processed} posters updated. {unmatched} games have no matching poster.",
    browserPosterSyncFailed: "Poster sync failed.",
    browserNoSupportedRoms: "No supported ROM files were found in {source}.",
    browserImportedGames: "{count} games imported from {source}.",
    browserSyncedGames: "{count} games synced from {source}.",
    browserSyncedFromSavedFolders: "{count} games synced from the saved ROM folders.",
    browserNoRomsInSavedFolders: "No supported ROM files were found in the saved ROM folders.",
    browserRomFilesFilter: "ROM files",
    browserSourceDesktopImport: "the desktop import",
    browserSourceSelectedFolder: "the selected folder",
    browserSourceUpload: "the upload",
    browserAddFolderFailed: "Could not add the ROM folder.",
    browserStartedInLumio: "Started {title} in Lumio.",
    browserStartedInRetroArch: "Started {title} in RetroArch.",
    browserLaunchFailed: "The game could not be started.",
    browserExitGame: "Exit game",
    browserExitHint: "Esc or Select + Start",
    browserExit: "Exit",
    // Settings section
    settingsWhatIsNeeded: "What do you need?",
    settingsIntroLead: "Lumioplay launches games straight inside Lumio via embedded libretro cores. All you need is a working",
    settingsIntroCoresFolder: "libretro core folder",
    settingsCoresAvailableAt: "Cores are available at",
    settingsUseAsHome: "Use as home page",
    settingsUseAsHomeDesc: "Replaces the standard home rows with the Lumioplay view but keeps the hero and the rest of the home page.",
    settingsHomeOverrideConflict: "A custom home page is already set. Clear it before you pick another plugin.",
    settingsCoresFolderLabel: "Libretro core folder",
    settingsCoresFolderUpdated: "The libretro core folder was updated.",
    settingsPickFolderFailed: "Could not pick a folder.",
    settingsRomFoldersLabel: "ROM folders",
    settingsChoose: "Choose",
    settingsAutoSyncTitle: "Auto-sync",
    settingsAutoSyncDesc: "Scans the saved folders in the background while the library is open.",
    settingsStatus: "Status",
    settingsEnabled: "Enabled",
    settingsDisabled: "Disabled",
    settingsOn: "On",
    settingsOff: "Off",
    settingsSyncIntervalLabel: "Sync interval in seconds",
    settingsHeroDesc: "Show a game at the top of the home page. Off by default.",
    settingsEnable: "Enable",
    settingsHeroMode: "Hero mode",
    settingsHeroModeRandom: "Random game",
    settingsGamepadTitle: "Gamepad",
    settingsGamepadDesc: "Choose which gamepad button or axis drives each libretro button.",
    settingsMappingPlaceholder: "0 or axis:1:-1",
    settingsLearn: "Learn",
    settingsPressButton: "Press a button\u2026",
    settingsLearnHint: "\u201C{action}\u201D accepts both buttons and D-pads exposed as axes, for example axis:0:-1.",
    settingsMappedToIndex: "Mapped {button} to gamepad index {index}.",
    settingsMappedToValue: "Mapped {button} to {value}.",
    settingsExitComboLabel: "Exit-game combination (gamepad indices, comma separated)",
    settingsExitComboHint: "The default is 8, 9 (Select + Start).",
    settingsSave: "Save",
    settingsSavedBadge: "Saved",
    settingsSaved: "Settings saved."
  };
  var sv = {
    // Delade etiketter
    platformAll: "Alla",
    lastPlayed: "Senast spelat",
    favorite: "Favorit",
    showAll: "Visa alla",
    starting: "Startar\u2026",
    launchFailed: "Kunde inte starta spelet.",
    // Styrkorsets riktningar
    dpadUp: "Upp",
    dpadDown: "Ner",
    dpadLeft: "V\xE4nster",
    dpadRight: "H\xF6ger",
    // ROM-regioner som läses ut ur filnamnet
    regionEurope: "Europa",
    regionJapan: "Japan",
    regionWorld: "V\xE4rlden",
    regionAsia: "Asien",
    // Start och RetroArch-uppsättning
    launcherSetupWindows: "Standardinstallation av RetroArch f\xF6r Windows",
    launcherSetupLinux: "Vanlig RetroArch-installation f\xF6r Linux",
    launcherSetupMacos: "Vanlig libretro-installation f\xF6r macOS",
    launcherValidationCoresMissing: "Libretro core-mappen saknas.",
    launcherValidationDesktopRequired: "Detaljerad validering kr\xE4ver skrivbordsappen.",
    launcherValidationRetroArchNotFound: "RetroArch kunde inte hittas p\xE5 den angivna s\xF6kv\xE4gen.",
    launcherValidationCoresNotFound: "Libretro core-mappen kunde inte hittas p\xE5 den angivna s\xF6kv\xE4gen.",
    launcherValidationOk: "RetroArch och core-mappen ser giltiga ut.",
    launcherValidationOkCoresOnly: "Core-mappen ser giltig ut. RetroArch \xE4r valfritt.",
    launcherRetroArchBinaryMissing: "RetroArch-bin\xE4ren kunde inte hittas. Kontrollera s\xF6kv\xE4gen i inst\xE4llningarna.",
    launcherCoreMissing: "Libretro-coren kunde inte hittas. Kontrollera core-mappen eller v\xE4lj en annan core f\xF6r spelet.",
    launcherRetroArchDesktopOnly: "Det g\xE5r bara att starta RetroArch i skrivbordsappen.",
    launcherRetroArchPathRequired: "St\xE4ll in s\xF6kv\xE4gen till RetroArch i inst\xE4llningarna f\xF6rst.",
    launcherRomMissingAfterSync: "ROM-filen kunde inte hittas vid senaste synkningen. Synka mappen igen eller v\xE4lj en ny mapp.",
    launcherRomNoLocalPath: "Det h\xE4r spelet har ingen lokal filv\xE4g \xE4nnu. Importera ROM:en med skrivbordets filv\xE4ljare.",
    launcherRetroArchSetupRequired: "St\xE4ll in s\xF6kv\xE4gen till RetroArch och core-mappen f\xF6rst.",
    launcherLibretroDesktopOnly: "Det g\xE5r bara att starta libretro i skrivbordsappen.",
    launcherRomMissing: "ROM-filen kunde inte hittas. Synka mappen igen.",
    launcherGameNoLocalPath: "Spelet saknar lokal filv\xE4g. Importera ROM:en med skrivbordets filv\xE4ljare.",
    launcherNoCoreSelected: "Ingen core \xE4r vald f\xF6r spelet. V\xE4lj en core i spelets inst\xE4llningar.",
    launcherCoresPathRequired: "St\xE4ll in core-mappen i inst\xE4llningarna f\xF6rst.",
    launcherCoreNotFoundAtPath: "Libretro-coren kunde inte hittas: {path}",
    // Hero
    heroRandomSubtitle: "Ett slumpat spel ur ditt bibliotek.",
    heroLastPlayedSubtitle: "Det spel du spelade senast ur ditt bibliotek.",
    heroPlayCount: "Spelat {count}x",
    heroPlayNow: "Spela nu",
    // Favoritraden på startsidan
    homeRowFavoritesTitle: "Lumioplay favoriter",
    homeRowFavoritesSubtitle: "Favoritmarkerade spel",
    // Spelbiblioteket
    browserTitle: "Spelbibliotek",
    browserSearchPlaceholder: "S\xF6k spel",
    browserImportRoms: "Importera ROM:ar",
    browserUploadRoms: "Ladda upp ROM:ar",
    browserChooseFolder: "V\xE4lj mapp",
    browserSyncing: "Synkar\u2026",
    browserSyncNow: "Synka nu",
    browserSyncPosters: "Synka posters",
    browserCancelPosterSync: "Avbryt postersynk",
    browserAddFavorite: "Markera som favorit",
    browserRemoveFavorite: "Ta bort favorit",
    browserEmptyLibrary: "Inga spel hittades \xE4nnu. L\xE4gg till ROM-filer eller v\xE4lj en ROM-mapp i inst\xE4llningarna.",
    browserMissing: "Saknas",
    browserCardSize: "Kortstorlek",
    browserNoCore: "Ingen core",
    browserPlay: "Spela",
    browserCustomize: "Anpassa",
    browserDone: "Klar",
    browserImportHint: "Importera med skrivbordets filv\xE4ljare eller v\xE4lj en lokal mapp.",
    browserDesktopRequired: "Skrivbordsappen kr\xE4vs f\xF6r att starta spel.",
    browserConsole: "Konsol",
    browserAutoDetect: "Autodetektering ({platform})",
    browserLibretroCore: "Libretro-core",
    browserCoreIdPlaceholder: "Ange core-id",
    browserNoMissingPosters: "Inga spel saknar poster just nu.",
    browserPosterSyncProgress: "Postersynk",
    browserPosterSyncHits: "tr\xE4ffar",
    browserCancellingPosterSync: "Avbryter postersynk\u2026",
    browserPosterSyncCancelled: "Postersynken avbr\xF6ts ({resolved}/{processed}). {unmatched} spel saknar matchande poster.",
    browserPosterSyncForced: "Tvingad omsynk klar: {resolved}/{processed} posters uppdaterades. {unmatched} spel saknar matchande poster.",
    browserPosterSyncDone: "{resolved}/{processed} posters uppdaterades. {unmatched} spel saknar matchande poster.",
    browserPosterSyncFailed: "Postersynken misslyckades.",
    browserNoSupportedRoms: "Inga ROM-filer som st\xF6ds hittades i {source}.",
    browserImportedGames: "{count} spel importerades fr\xE5n {source}.",
    browserSyncedGames: "{count} spel synkades fr\xE5n {source}.",
    browserSyncedFromSavedFolders: "{count} spel synkades fr\xE5n de sparade ROM-mapparna.",
    browserNoRomsInSavedFolders: "Inga ROM-filer som st\xF6ds hittades i de sparade ROM-mapparna.",
    browserRomFilesFilter: "ROM-filer",
    browserSourceDesktopImport: "skrivbordsimporten",
    browserSourceSelectedFolder: "den valda mappen",
    browserSourceUpload: "uppladdningen",
    browserAddFolderFailed: "Kunde inte l\xE4gga till ROM-mappen.",
    browserStartedInLumio: "Startade {title} i Lumio.",
    browserStartedInRetroArch: "Startade {title} i RetroArch.",
    browserLaunchFailed: "Spelet kunde inte startas.",
    browserExitGame: "Avsluta spel",
    browserExitHint: "Esc eller Select + Start",
    browserExit: "Avsluta",
    // Inställningar
    settingsWhatIsNeeded: "Vad beh\xF6vs?",
    settingsIntroLead: "Lumioplay startar spel direkt i Lumio via inb\xE4ddade libretro-k\xE4rnor. Det enda som kr\xE4vs \xE4r en fungerande",
    settingsIntroCoresFolder: "libretro core-mapp",
    settingsCoresAvailableAt: "K\xE4rnor finns p\xE5",
    settingsUseAsHome: "Anv\xE4nd som startsida",
    settingsUseAsHomeDesc: "Ers\xE4tter de vanliga hemraderna med Lumioplay-vyn men beh\xE5ller hero och resten av startsidan.",
    settingsHomeOverrideConflict: "En egen startsida \xE4r redan vald. Avmarkera den f\xF6rst innan du v\xE4ljer en annan plugin.",
    settingsCoresFolderLabel: "Libretro core-mapp",
    settingsCoresFolderUpdated: "Libretro core-mappen uppdaterades.",
    settingsPickFolderFailed: "Kunde inte v\xE4lja mapp.",
    settingsRomFoldersLabel: "ROM-mappar",
    settingsChoose: "V\xE4lj",
    settingsAutoSyncTitle: "Autosynk",
    settingsAutoSyncDesc: "Skannar de sparade mapparna i bakgrunden medan biblioteket \xE4r \xF6ppet.",
    settingsStatus: "Status",
    settingsEnabled: "Aktiverad",
    settingsDisabled: "Avst\xE4ngd",
    settingsOn: "P\xE5",
    settingsOff: "Av",
    settingsSyncIntervalLabel: "Synkintervall i sekunder",
    settingsHeroDesc: "Visa ett spel h\xF6gst upp p\xE5 startsidan. Avst\xE4ngt som standard.",
    settingsEnable: "Aktivera",
    settingsHeroMode: "Hero-l\xE4ge",
    settingsHeroModeRandom: "Slumpat spel",
    settingsGamepadTitle: "Handkontroll",
    settingsGamepadDesc: "St\xE4ll in vilken gamepad-knapp eller axel som ska styra varje libretro-knapp.",
    settingsMappingPlaceholder: "0 eller axis:1:-1",
    settingsLearn: "L\xE4r",
    settingsPressButton: "Tryck p\xE5 en knapp\u2026",
    settingsLearnHint: "\u201D{action}\u201D tar b\xE5de knappar och styrkors som exponeras som axlar, till exempel axis:0:-1.",
    settingsMappedToIndex: "Mappade {button} till gamepad-index {index}.",
    settingsMappedToValue: "Mappade {button} till {value}.",
    settingsExitComboLabel: "Kombination f\xF6r att avsluta spel (gamepad-index, kommaseparerat)",
    settingsExitComboHint: "Standard \xE4r 8, 9 (Select + Start).",
    settingsSave: "Spara",
    settingsSavedBadge: "Sparad",
    settingsSaved: "Inst\xE4llningarna sparades."
  };
  var lumioplayStrings = { en, sv };
  function translate(lang, key) {
    return lumioplayStrings[lang]?.[key] ?? en[key];
  }

  // runtime-host/lib/plugin-sdk.ts
  var PLUGIN_HOME_ROW_SLIDER_TRACK_CLASS = "thin-slider-scrollbar flex gap-3 overflow-x-auto pb-3";
  var PLUGIN_HOME_ROW_GRID_TRACK_CLASS = "grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
  function getPluginHomeRowTrackClass(layout, options) {
    if (layout === "slider") return PLUGIN_HOME_ROW_SLIDER_TRACK_CLASS;
    return options?.gridClassName?.trim() || PLUGIN_HOME_ROW_GRID_TRACK_CLASS;
  }
  function getRuntimeSdk() {
    if (typeof window === "undefined") return null;
    return window.__lumioPluginRuntime?.sdk ?? null;
  }
  function getScopedStorageItem(key) {
    const sdk = getRuntimeSdk();
    if (sdk) return sdk.getScopedStorageItem(key);
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(`lumioplay:${key}`);
  }
  function setScopedStorageItem(key, value) {
    const sdk = getRuntimeSdk();
    if (sdk) {
      sdk.setScopedStorageItem(key, value);
      return;
    }
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`lumioplay:${key}`, value);
  }
  var LANG_STORAGE_KEY = "app_lang";
  var LANG_CHANGED_EVENT = "lumio-app-lang-changed";
  var PROFILE_CHANGED_EVENT = "lumio-profile-changed";
  var DEFAULT_LANG = "en";
  function getActiveLang() {
    if (typeof window === "undefined") return DEFAULT_LANG;
    try {
      const scoped = getScopedStorageItem(LANG_STORAGE_KEY);
      const legacy = window.localStorage.getItem(LANG_STORAGE_KEY);
      const value = scoped ?? legacy;
      if (value === "sv" || value === "en") return value;
    } catch {
    }
    return DEFAULT_LANG;
  }
  function tr(key) {
    return translate(getActiveLang(), key);
  }
  function useLang() {
    const [lang, setLangState] = useState(DEFAULT_LANG);
    useEffect(() => {
      if (typeof window === "undefined") return;
      const sync = () => setLangState(getActiveLang());
      sync();
      window.addEventListener(LANG_CHANGED_EVENT, sync);
      window.addEventListener(PROFILE_CHANGED_EVENT, sync);
      window.addEventListener("storage", sync);
      return () => {
        window.removeEventListener(LANG_CHANGED_EVENT, sync);
        window.removeEventListener(PROFILE_CHANGED_EVENT, sync);
        window.removeEventListener("storage", sync);
      };
    }, []);
    return {
      lang,
      setLang: (next) => {
        setScopedStorageItem(LANG_STORAGE_KEY, next);
        setLangState(next);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(LANG_CHANGED_EVENT));
        }
      },
      t: (key) => translate(lang, key)
    };
  }
  function isPluginDesktopHost() {
    const sdk = getRuntimeSdk();
    if (sdk) return sdk.isPluginDesktopHost();
    return false;
  }
  async function pickPluginFolder() {
    return getRuntimeSdk()?.pickPluginFolder() ?? null;
  }
  async function pickPluginFiles(filters) {
    return getRuntimeSdk()?.pickPluginFiles(filters) ?? null;
  }
  async function scanPluginDirectory(directory, extensions) {
    const files = await (getRuntimeSdk()?.scanPluginDirectory(directory, extensions) ?? null);
    return files?.map((file) => ({
      path: file.path,
      fileName: file.fileName ?? file.file_name ?? "",
      sizeBytes: file.sizeBytes ?? file.size_bytes ?? null
    })) ?? null;
  }
  async function checkPluginPathExists(path) {
    return getRuntimeSdk()?.checkPluginPathExists(path) ?? false;
  }
  async function launchPluginProgram(program, args) {
    const sdk = getRuntimeSdk();
    if (!sdk) {
      throw new Error("Program launch is only available in the Lumio desktop host.");
    }
    return sdk.launchPluginProgram(program, args);
  }
  async function launchLibretroGame(corePath, romPath) {
    const sdk = getRuntimeSdk();
    if (!sdk) {
      throw new Error("Libretro embedding is only available in the Lumio desktop host.");
    }
    return sdk.launchLibretroGame(corePath, romPath);
  }
  async function stopLibretroGame() {
    const sdk = getRuntimeSdk();
    if (!sdk) return;
    return sdk.stopLibretroGame();
  }
  async function setLibretroBounds(x, y, w, h, windowHeight, scale) {
    const sdk = getRuntimeSdk();
    if (!sdk) return;
    return sdk.setLibretroBounds(x, y, w, h, windowHeight, scale);
  }
  async function sendLibretroInput(buttons) {
    const sdk = getRuntimeSdk();
    if (!sdk) return;
    return sdk.sendLibretroInput(buttons);
  }
  function onLibretroStopped(handler) {
    const sdk = getRuntimeSdk();
    if (!sdk) return () => {
    };
    return sdk.onLibretroStopped(handler);
  }

  // runtime/lumioplay-metadata.ts
  var REGION_BY_TOKEN = {
    usa: "USA",
    europe: "Europe",
    eur: "Europe",
    japan: "Japan",
    jap: "Japan",
    world: "World",
    asia: "Asia",
    pal: "PAL",
    ntsc: "NTSC"
  };
  var LIBRETRO_SYSTEMS = {
    nes: "Nintendo - Nintendo Entertainment System",
    snes: "Nintendo - Super Nintendo Entertainment System",
    gb: "Nintendo - Game Boy",
    gbc: "Nintendo - Game Boy Color",
    gba: "Nintendo - Game Boy Advance",
    genesis: "Sega - Mega Drive - Genesis",
    n64: "Nintendo - Nintendo 64",
    ps1: "Sony - PlayStation"
  };
  function trimNoiseTokens(value) {
    return value.replace(/\[[^\]]+\]/g, " ").replace(/\([^)]*\b(?:rev|beta|proto|sample|hack|demo)\b[^)]*\)/gi, " ").replace(/\b(?:v\d+(?:\.\d+)?)\b/gi, " ").replace(/\b(?:usa|europe|eur|japan|jpn|world|asia|pal|ntsc|en|eng|fr|de|es|it)\b/gi, " ").replace(/\(\s*\)/g, " ").replace(/\[\s*\]/g, " ").replace(/[_+.]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function normalizeTitleForLookup(value) {
    return value.replace(/[/:]/g, " - ").replace(/[?*"<>|]/g, "").replace(/\s+/g, " ").trim();
  }
  function normalizeDiacritics(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function stripLikelyFileExtension(value) {
    return value.replace(/\.[a-z0-9]{1,8}$/i, "");
  }
  function createSortTitle(value) {
    return value.toLowerCase().replace(/^(the|a|an)\s+/i, "").trim();
  }
  function createSearchTitle(value, fileName) {
    return `${value} ${fileName}`.toLowerCase().replace(/\.[a-z0-9]{1,8}$/i, "").replace(/[_+.]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function extractReleaseYear(fileName) {
    const match = fileName.match(/\b(19\d{2}|20\d{2})\b/);
    return match ? Number(match[1]) : null;
  }
  function extractRegion(fileName) {
    const lower = fileName.toLowerCase();
    for (const [token, label] of Object.entries(REGION_BY_TOKEN)) {
      if (lower.includes(token)) return label;
    }
    return null;
  }
  function addVariant(variants, value) {
    const normalized = normalizeTitleForLookup(value);
    if (!normalized) return;
    variants.add(normalized);
    const withoutParens = normalized.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
    if (withoutParens) variants.add(withoutParens);
    const withoutEdition = normalized.replace(/\b(?:disc|disk|side)\s*[a-z0-9]+\b/gi, "").replace(/\s+/g, " ").trim();
    if (withoutEdition) variants.add(withoutEdition);
    const hyphenToColon = normalized.replace(/\s*-\s*/g, ": ").replace(/\s+/g, " ").trim();
    if (hyphenToColon) variants.add(hyphenToColon);
    const colonToHyphen = normalized.replace(/\s*:\s*/g, " - ").replace(/\s+/g, " ").trim();
    if (colonToHyphen) variants.add(colonToHyphen);
    const withoutSubtitleSuffix = normalized.replace(/\s*[-:]\s.*$/, "").trim();
    if (withoutSubtitleSuffix) variants.add(withoutSubtitleSuffix);
    const compactPunctuation = normalized.replace(/['".,!]/g, "").replace(/\s+/g, " ").trim();
    if (compactPunctuation) variants.add(compactPunctuation);
    const dottedAsSpace = normalized.replace(/\./g, " ").replace(/\s+/g, " ").trim();
    if (dottedAsSpace) variants.add(dottedAsSpace);
    const withoutDots = normalized.replace(/\./g, "").replace(/\s+/g, " ").trim();
    if (withoutDots) variants.add(withoutDots);
    const collapsedInitialisms = normalized.replace(/\b(?:[a-z]\s*\.\s*){2,}[a-z]?\b/gi, (match) => match.replace(/[.\s]+/g, "").toUpperCase()).replace(/\s+/g, " ").trim();
    if (collapsedInitialisms) variants.add(collapsedInitialisms);
    const hyphenAsSpace = normalized.replace(/\s*-\s*/g, " ").replace(/\s+/g, " ").trim();
    if (hyphenAsSpace) variants.add(hyphenAsSpace);
    const withRevSuffixRemoved = normalized.replace(/\b(?:rev(?:ision)?|ver(?:sion)?|v)\s*[0-9a-z.]+\b/gi, " ").replace(/\s+/g, " ").trim();
    if (withRevSuffixRemoved) variants.add(withRevSuffixRemoved);
    const collapsedAbbreviations = normalized.replace(/\bg\.\s*i\.\b/gi, "GI").replace(/\bm\.\s*s\.\b/gi, "Ms").replace(/\bjr\.\b/gi, "Jr").replace(/\s+/g, " ").trim();
    if (collapsedAbbreviations) variants.add(collapsedAbbreviations);
    if (normalized.includes("&")) {
      variants.add(normalized.replace(/\s*&\s*/g, " and ").replace(/\s+/g, " ").trim());
    }
    if (/\band\b/i.test(normalized)) {
      variants.add(normalized.replace(/\band\b/gi, "&").replace(/\s+/g, " ").trim());
    }
    const leadingArticle = normalized.match(/^(the|a|an)\s+(.+)$/i);
    if (leadingArticle) {
      variants.add(`${leadingArticle[2]}, ${leadingArticle[1].slice(0, 1).toUpperCase()}${leadingArticle[1].slice(1).toLowerCase()}`);
    }
    const trailingArticle = normalized.match(/^(.+),\s*(the|a|an)$/i);
    if (trailingArticle) {
      variants.add(`${trailingArticle[2]} ${trailingArticle[1]}`);
    }
    const withoutDiacritics = normalizeDiacritics(normalized);
    if (withoutDiacritics) variants.add(withoutDiacritics);
    if (/\bbros\b/i.test(normalized)) {
      variants.add(normalized.replace(/\bbros\b/gi, "Bros.").replace(/\s+/g, " ").trim());
    }
    if (/\bbros\./i.test(normalized)) {
      variants.add(normalized.replace(/\bbros\./gi, "Bros").replace(/\s+/g, " ").trim());
    }
  }
  function createTitleVariants(baseTitle, fileName) {
    const variants = /* @__PURE__ */ new Set();
    addVariant(variants, baseTitle);
    const fromFileName = fileName ? stripLikelyFileExtension(fileName).replace(/\[[^\]]+\]/g, " ").replace(/[_+]+/g, " ").replace(/\s+/g, " ").trim() : void 0;
    if (fromFileName) {
      let current = fromFileName;
      const seen = /* @__PURE__ */ new Set();
      for (let step = 0; step < 6; step += 1) {
        if (!current || seen.has(current)) break;
        seen.add(current);
        addVariant(variants, current);
        const withoutTrailingParens = current.replace(/\s*\([^()]*\)\s*$/, "").replace(/\s+/g, " ").trim();
        if (!withoutTrailingParens || withoutTrailingParens === current) break;
        current = withoutTrailingParens;
      }
      const compactFromFileName = fromFileName.replace(/\([^)]*\b(?:beta|proto|sample|hack|demo|unl)\b[^)]*\)/gi, " ").replace(/\s+/g, " ").trim();
      if (compactFromFileName) addVariant(variants, compactFromFileName);
    }
    const coreTitle = normalizeTitleForLookup(baseTitle).replace(/\s*[-:]\s.*$/, "").trim().toLowerCase();
    const normalizeCore = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    const coreTitleNormalized = normalizeCore(coreTitle);
    return Array.from(variants).sort((left, right) => {
      const normalize = (value) => value.trim().toLowerCase();
      const normalizeLoose = (value) => normalizeCore(normalize(value));
      const l = normalize(left);
      const r = normalize(right);
      let ls = 0;
      let rs = 0;
      if (coreTitle && l === coreTitle) ls += 80;
      if (coreTitle && r === coreTitle) rs += 80;
      if (coreTitleNormalized && normalizeLoose(left) === coreTitleNormalized) ls += 56;
      if (coreTitleNormalized && normalizeLoose(right) === coreTitleNormalized) rs += 56;
      if (!l.includes(" - ") && !l.includes(":")) ls += 20;
      if (!r.includes(" - ") && !r.includes(":")) rs += 20;
      if (/\bbros\./i.test(left)) ls += 14;
      if (/\bbros\./i.test(right)) rs += 14;
      ls -= Math.min(left.length, 140) / 20;
      rs -= Math.min(right.length, 140) / 20;
      return rs - ls;
    });
  }
  function buildCoverCandidates(platform, title, fileName) {
    const systemName = LIBRETRO_SYSTEMS[platform];
    const titleVariants = createTitleVariants(title, fileName);
    const lowerFile = (fileName ?? "").toLowerCase();
    const regionSuffixes = lowerFile.includes("world") ? ["", " (World)", " (USA)", " (US)", " (Japan)", " (Japan) (En)", " (Europe)"] : lowerFile.includes("usa") || lowerFile.includes("(us)") ? ["", " (USA)", " (US)", " (World)"] : lowerFile.includes("japan") || lowerFile.includes("(jp)") ? ["", " (Japan)", " (JP)", " (Japan) (En)", " (World)"] : lowerFile.includes("europe") || lowerFile.includes("(eu)") ? ["", " (Europe)", " (EU)", " (World)"] : [""];
    const encodedSystem = encodeURIComponent(systemName);
    const candidates = [];
    const seen = /* @__PURE__ */ new Set();
    for (const variant of titleVariants) {
      for (const suffix of regionSuffixes) {
        const withSuffix = `${variant}${suffix}`.trim();
        const encodedTitle = encodeURIComponent(withSuffix);
        const url = `https://thumbnails.libretro.com/${encodedSystem}/Named_Boxarts/${encodedTitle}.png`;
        if (!seen.has(url)) {
          seen.add(url);
          candidates.push(url);
        }
        if (candidates.length >= 80) return candidates;
      }
    }
    return candidates;
  }
  function buildMetadataFromFileName(fileName, _platform) {
    const basename = stripLikelyFileExtension(fileName);
    const cleanedTitle = trimNoiseTokens(basename);
    const displayTitle = cleanedTitle || basename;
    const coverCandidates = buildCoverCandidates(_platform, displayTitle, fileName);
    return {
      displayTitle,
      sortTitle: createSortTitle(displayTitle),
      searchTitle: createSearchTitle(displayTitle, fileName),
      releaseYear: extractReleaseYear(fileName),
      region: extractRegion(fileName),
      tags: [],
      coverUrl: null,
      coverCandidates
    };
  }
  async function resolveFirstReachableCoverUrl(candidateUrls, options) {
    const timeoutMs = Math.max(500, options?.timeoutMs ?? 2500);
    const maxCandidates = Math.max(1, options?.maxCandidates ?? 6);
    const limited = candidateUrls.filter(Boolean).slice(0, maxCandidates);
    for (const url of limited) {
      const resolved = await new Promise((resolve) => {
        const image = new Image();
        const cleanup = () => {
          image.onload = null;
          image.onerror = null;
        };
        const timer = window.setTimeout(() => {
          cleanup();
          resolve(null);
        }, timeoutMs);
        image.onload = () => {
          window.clearTimeout(timer);
          cleanup();
          resolve(url);
        };
        image.onerror = () => {
          window.clearTimeout(timer);
          cleanup();
          resolve(null);
        };
        image.src = url;
      });
      if (resolved) return resolved;
    }
    return null;
  }
  function getGameDisplayTitle(game) {
    return game.metadata?.displayTitle?.trim() || game.title;
  }
  var REGION_KEY_BY_LABEL = {
    Europe: "regionEurope",
    Japan: "regionJapan",
    World: "regionWorld",
    Asia: "regionAsia"
  };
  function getRegionLabel(region, t) {
    if (!region) return null;
    const key = REGION_KEY_BY_LABEL[region];
    return key ? t(key) : region;
  }

  // runtime/lumioplay-storage.ts
  var KEY_LIBRARY = "lumioplay_library_v2";
  var KEY_GAMES = "lumioplay_games";
  var KEY_ROM_FOLDERS = "lumioplay_rom_folders";
  var KEY_RETROARCH_PATH = "lumioplay_retroarch_path";
  var KEY_RETROARCH_CORES_PATH = "lumioplay_retroarch_cores_path";
  var KEY_GRID_DENSITY = "lumioplay_grid_density_v1";
  var KEY_GAMEPAD_MAPPING = "lumioplay_gamepad_mapping_v2";
  var KEY_GAMEPAD_EXIT_COMBO = "lumioplay_gamepad_exit_combo_v1";
  var DEFAULT_SETTINGS = {
    retroArchPath: "",
    retroArchCoresPath: "",
    romFolders: [],
    autoSyncEnabled: false,
    autoSyncIntervalSeconds: 45,
    heroEnabled: false,
    heroMode: "last_played"
  };
  var LUMIOPLAY_PLATFORMS = [
    { id: "all", label: "All", extensions: [] },
    { id: "nes", label: "NES", extensions: [".nes"], coreId: "fceumm_libretro" },
    { id: "snes", label: "SNES", extensions: [".sfc", ".smc"], coreId: "snes9x_libretro" },
    { id: "gb", label: "GB", extensions: [".gb"], coreId: "gambatte_libretro" },
    { id: "gbc", label: "GBC", extensions: [".gbc"], coreId: "gambatte_libretro" },
    { id: "gba", label: "GBA", extensions: [".gba"], coreId: "mgba_libretro" },
    { id: "genesis", label: "Genesis", extensions: [".gen", ".md", ".bin"], coreId: "genesis_plus_gx_libretro" },
    { id: "n64", label: "N64", extensions: [".n64", ".z64", ".v64"], coreId: "mupen64plus_next_libretro" },
    { id: "ps1", label: "PS1", extensions: [".cue", ".chd", ".pbp", ".iso"], coreId: "pcsx_rearmed_libretro" }
  ];
  var IMPORTABLE_ROM_EXTENSIONS = Array.from(
    new Set(
      LUMIOPLAY_PLATFORMS.flatMap(
        (platform) => platform.id === "all" ? [] : platform.extensions
      )
    )
  );
  var LUMIOPLAY_JOYPAD_BINDINGS = [
    { index: 0, label: "B" },
    { index: 1, label: "Y" },
    { index: 2, label: "Select" },
    { index: 3, label: "Start" },
    { index: 4, label: "Up", labelKey: "dpadUp" },
    { index: 5, label: "Down", labelKey: "dpadDown" },
    { index: 6, label: "Left", labelKey: "dpadLeft" },
    { index: 7, label: "Right", labelKey: "dpadRight" },
    { index: 8, label: "A" },
    { index: 9, label: "X" },
    { index: 10, label: "L" },
    { index: 11, label: "R" }
  ];
  function getJoypadBindingLabel(binding, t) {
    return binding.labelKey ? t(binding.labelKey) : binding.label;
  }
  function getPlatformLabel(platformId, t) {
    if (platformId === "all") return t("platformAll");
    return LUMIOPLAY_PLATFORMS.find((platform) => platform.id === platformId)?.label ?? platformId.toUpperCase();
  }
  var DEFAULT_GAMEPAD_MAPPING = {
    0: "1",
    // B
    1: "2",
    // Y
    2: "8",
    // Select
    3: "9",
    // Start
    4: "12",
    // Up
    5: "13",
    // Down
    6: "14",
    // Left
    7: "15",
    // Right
    8: "0",
    // A
    9: "3",
    // X
    10: "4",
    // L
    11: "5"
    // R
  };
  var DEFAULT_GAMEPAD_EXIT_COMBO = [8, 9];
  function nowIso() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function createEmptyLibrary() {
    return {
      version: 2,
      games: [],
      settings: { ...DEFAULT_SETTINGS },
      updatedAt: nowIso()
    };
  }
  function parseStoredArray(key) {
    const raw = getScopedStorageItem(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function sanitizePersistedLibraryRaw(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      const candidate = parsed;
      if (!Array.isArray(candidate.games) || !candidate.settings || typeof candidate.settings !== "object" || Array.isArray(candidate.settings)) {
        return null;
      }
      if (candidate.settings.autoSyncEnabled === true) {
        return JSON.stringify({
          ...candidate,
          settings: {
            ...candidate.settings,
            autoSyncEnabled: false
          }
        });
      }
      return raw;
    } catch {
      return null;
    }
  }
  function normalizeLibrarySettings(value) {
    return {
      retroArchPath: value?.retroArchPath?.trim() ?? DEFAULT_SETTINGS.retroArchPath,
      retroArchCoresPath: value?.retroArchCoresPath?.trim() ?? DEFAULT_SETTINGS.retroArchCoresPath,
      romFolders: Array.isArray(value?.romFolders) ? value.romFolders.filter(Boolean) : DEFAULT_SETTINGS.romFolders,
      autoSyncEnabled: value?.autoSyncEnabled ?? DEFAULT_SETTINGS.autoSyncEnabled,
      autoSyncIntervalSeconds: Math.max(15, Math.min(300, Number(value?.autoSyncIntervalSeconds ?? DEFAULT_SETTINGS.autoSyncIntervalSeconds))),
      heroEnabled: typeof value?.heroEnabled === "boolean" ? value.heroEnabled : DEFAULT_SETTINGS.heroEnabled,
      heroMode: value?.heroMode === "random" ? "random" : "last_played"
    };
  }
  function normalizeExtension(fileName) {
    if (typeof fileName !== "string") return "";
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) return "";
    const lowerName = trimmedFileName.toLowerCase();
    const match = IMPORTABLE_ROM_EXTENSIONS.slice().sort((left, right) => right.length - left.length).find((extension) => lowerName.endsWith(extension));
    if (match) return match;
    const dotIndex = lowerName.lastIndexOf(".");
    return dotIndex >= 0 ? lowerName.slice(dotIndex) : "";
  }
  function createGameTitle(fileName) {
    if (typeof fileName !== "string") return "";
    const normalized = fileName.replace(/\.[^/.]+$/, "");
    return normalized.replace(/[_+.]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function detectPlatformByFileName(fileName) {
    const extension = normalizeExtension(fileName);
    if (!extension) return null;
    return LUMIOPLAY_PLATFORMS.find(
      (platform) => platform.id !== "all" && platform.extensions.includes(extension)
    ) ?? null;
  }
  function buildGameId(sourcePath, fileName) {
    const seed = `${sourcePath}:${fileName}`.toLowerCase();
    return seed.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function normalizeGameMetadata(game) {
    const effectivePlatform = game.platformOverride ?? game.platform;
    const baseMetadata = buildMetadataFromFileName(game.fileName, effectivePlatform);
    const existingMetadata = game.metadata ?? null;
    const normalizedMetadata = {
      displayTitle: existingMetadata?.displayTitle?.trim() || baseMetadata.displayTitle || game.title,
      sortTitle: existingMetadata?.sortTitle?.trim() || baseMetadata.sortTitle,
      searchTitle: existingMetadata?.searchTitle?.trim() || baseMetadata.searchTitle,
      releaseYear: existingMetadata?.releaseYear ?? baseMetadata.releaseYear ?? null,
      region: existingMetadata?.region ?? baseMetadata.region ?? null,
      tags: Array.isArray(existingMetadata?.tags) ? existingMetadata.tags : baseMetadata.tags ?? [],
      coverUrl: game.coverUrl ?? existingMetadata?.coverUrl ?? baseMetadata.coverUrl ?? null,
      coverCandidates: Array.from(
        /* @__PURE__ */ new Set([...baseMetadata.coverCandidates ?? [], ...(Array.isArray(existingMetadata?.coverCandidates) ? existingMetadata?.coverCandidates : []) ?? []])
      )
    };
    return normalizedMetadata;
  }
  function mergeImportedGameWithExisting(nextGame, existing) {
    if (!existing) return nextGame;
    const mergedCoverUrl = existing.coverUrl ?? nextGame.coverUrl ?? null;
    return {
      ...existing,
      ...nextGame,
      title: nextGame.title,
      coverUrl: mergedCoverUrl,
      favorite: existing.favorite ?? false,
      platformOverride: existing.platformOverride ?? null,
      coreOverride: existing.coreOverride ?? null,
      importedAt: existing.importedAt ?? nextGame.importedAt,
      playCount: existing.playCount ?? 0,
      lastPlayedAt: existing.lastPlayedAt ?? null,
      metadata: normalizeGameMetadata({
        ...nextGame,
        platformOverride: existing.platformOverride ?? nextGame.platformOverride ?? null,
        title: nextGame.title,
        coverUrl: mergedCoverUrl,
        metadata: {
          ...existing.metadata ?? {},
          ...nextGame.metadata ?? {}
        }
      }),
      missing: false,
      artworkStatus: existing.artworkStatus ?? (mergedCoverUrl ? "resolved" : "idle"),
      lastIndexedAt: nowIso()
    };
  }
  function normalizeGames(games) {
    const lang = getActiveLang();
    return games.slice().sort((left, right) => {
      const leftTitle = left.metadata?.sortTitle ?? left.title;
      const rightTitle = right.metadata?.sortTitle ?? right.title;
      return leftTitle.localeCompare(rightTitle, lang);
    });
  }
  function migrateLegacyLibrary() {
    const games = parseStoredArray(KEY_GAMES);
    const romFolders = parseStoredArray(KEY_ROM_FOLDERS).filter(Boolean);
    const retroArchPath = getScopedStorageItem(KEY_RETROARCH_PATH) ?? "";
    const retroArchCoresPath = getScopedStorageItem(KEY_RETROARCH_CORES_PATH) ?? "";
    return {
      version: 2,
      games: normalizeGames(
        games.map((game) => ({
          ...game,
          coreOverride: game.coreId ?? null,
          platformOverride: null,
          sourceFolder: game.source === "folder" ? game.romPath.slice(0, Math.max(0, game.romPath.length - game.fileName.length)).replace(/[\\/]+$/, "") : null,
          favorite: false,
          missing: false,
          artworkStatus: game.coverUrl ? "resolved" : "idle",
          lastIndexedAt: game.importedAt ?? nowIso(),
          metadata: normalizeGameMetadata({
            ...game,
            title: game.title,
            platformOverride: null,
            coverUrl: game.coverUrl ?? null
          }),
          coverUrl: game.coverUrl ?? null
        }))
      ),
      settings: normalizeLibrarySettings({
        retroArchPath,
        retroArchCoresPath,
        romFolders
      }),
      updatedAt: nowIso()
    };
  }
  function getLibrary() {
    try {
      const raw = sanitizePersistedLibraryRaw(getScopedStorageItem(KEY_LIBRARY));
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalizedGames = (parsed.games ?? []).filter((game) => {
          if (!game || typeof game !== "object") return false;
          if (typeof game.fileName !== "string" || !game.fileName.trim()) return false;
          if (typeof game.romPath !== "string" || !game.romPath.trim()) return false;
          return detectPlatformByFileName(game.fileName) != null;
        }).map((game) => {
          const normalizedGame = {
            ...game,
            favorite: game.favorite ?? false,
            missing: game.missing ?? false,
            artworkStatus: game.artworkStatus ?? (game.coverUrl ? "resolved" : "idle"),
            coreOverride: game.coreOverride ?? null,
            platformOverride: game.platformOverride ?? null,
            sourceFolder: game.sourceFolder ?? null,
            lastIndexedAt: game.lastIndexedAt ?? game.importedAt ?? null,
            coverUrl: game.coverUrl ?? null
          };
          return {
            ...normalizedGame,
            metadata: normalizeGameMetadata({
              ...normalizedGame,
              title: normalizedGame.title
            })
          };
        });
        return {
          version: 2,
          games: normalizeGames(normalizedGames),
          settings: normalizeLibrarySettings(parsed.settings),
          updatedAt: parsed.updatedAt ?? nowIso()
        };
      }
    } catch {
      return createEmptyLibrary();
    }
    const migrated = migrateLegacyLibrary();
    setLibrary(migrated);
    return migrated;
  }
  function setLibrary(library) {
    const normalized = {
      version: 2,
      games: normalizeGames(library.games),
      settings: normalizeLibrarySettings(library.settings),
      updatedAt: nowIso()
    };
    setScopedStorageItem(KEY_LIBRARY, JSON.stringify(normalized));
    return normalized;
  }
  function updateLibrary(mutator) {
    const nextLibrary = mutator(getLibrary());
    return setLibrary(nextLibrary);
  }
  function getDefaultCoreId(platformId) {
    return LUMIOPLAY_PLATFORMS.find((platform) => platform.id === platformId)?.coreId ?? null;
  }
  function getEffectivePlatform(game) {
    return game.platformOverride ?? game.platform;
  }
  function getEffectiveCoreId(game) {
    return game.coreOverride?.trim() || getDefaultCoreId(getEffectivePlatform(game));
  }
  function createImportedGame(params) {
    const safeFileName = typeof params.fileName === "string" ? params.fileName.trim() : "";
    const safeRomPath = typeof params.romPath === "string" ? params.romPath.trim() : "";
    if (!safeFileName || !safeRomPath) return null;
    const platform = detectPlatformByFileName(safeFileName);
    if (!platform || platform.id === "all") return null;
    const extension = normalizeExtension(safeFileName);
    const metadata = buildMetadataFromFileName(safeFileName, platform.id);
    return {
      id: buildGameId(safeRomPath, safeFileName),
      title: metadata.displayTitle || createGameTitle(safeFileName),
      platform: platform.id,
      romPath: safeRomPath,
      fileName: safeFileName,
      extension,
      coreId: platform.coreId,
      coreOverride: null,
      platformOverride: null,
      source: params.source,
      sourceFolder: params.sourceFolder ?? null,
      fileSizeBytes: params.fileSizeBytes ?? null,
      importedAt: nowIso(),
      lastIndexedAt: nowIso(),
      coverUrl: null,
      lastPlayedAt: null,
      playCount: 0,
      favorite: false,
      missing: false,
      artworkStatus: "idle",
      metadata
    };
  }
  function getStoredGames() {
    return getLibrary().games;
  }
  function upsertImportedGames(nextGames) {
    const library = getLibrary();
    const merged = new Map(library.games.map((game) => [game.id, game]));
    nextGames.forEach((game) => {
      merged.set(game.id, mergeImportedGameWithExisting(game, merged.get(game.id)));
    });
    return setLibrary({
      ...library,
      games: Array.from(merged.values())
    }).games;
  }
  function syncFolderGames(directory, indexedGames) {
    const library = getLibrary();
    const merged = new Map(library.games.map((game) => [game.id, game]));
    const syncedIds = /* @__PURE__ */ new Set();
    indexedGames.forEach((game) => {
      syncedIds.add(game.id);
      merged.set(game.id, mergeImportedGameWithExisting({
        ...game,
        source: "folder",
        sourceFolder: directory,
        missing: false,
        lastIndexedAt: nowIso()
      }, merged.get(game.id)));
    });
    library.games.forEach((game) => {
      if (game.source !== "folder" || game.sourceFolder !== directory) return;
      if (syncedIds.has(game.id)) return;
      merged.set(game.id, {
        ...game,
        missing: true,
        lastIndexedAt: nowIso()
      });
    });
    return setLibrary({
      ...library,
      games: Array.from(merged.values())
    }).games;
  }
  function updateGame(gameId, updater) {
    const library = getLibrary();
    return setLibrary({
      ...library,
      games: library.games.map((game) => game.id === gameId ? updater(game) : game)
    }).games;
  }
  function toggleFavorite(gameId) {
    return updateGame(gameId, (game) => ({
      ...game,
      favorite: !game.favorite
    }));
  }
  function setGamePlatformOverride(gameId, platformOverride) {
    return updateGame(gameId, (game) => {
      const nextPlatform = platformOverride ?? game.platform;
      return {
        ...game,
        platformOverride,
        coverUrl: null,
        artworkStatus: "idle",
        metadata: normalizeGameMetadata({
          ...game,
          platformOverride,
          coverUrl: null,
          metadata: {
            ...game.metadata ?? {},
            coverUrl: null,
            coverCandidates: buildMetadataFromFileName(game.fileName, nextPlatform).coverCandidates
          }
        })
      };
    });
  }
  function setGameCoreOverride(gameId, coreOverride) {
    return updateGame(gameId, (game) => ({
      ...game,
      coreOverride: coreOverride?.trim() ? coreOverride.trim() : null
    }));
  }
  function setGameCoversBatch(updates) {
    if (updates.length === 0) return getStoredGames();
    const updateMap = /* @__PURE__ */ new Map();
    for (const entry of updates) {
      if (!entry.gameId) continue;
      updateMap.set(entry.gameId, entry.coverUrl ?? null);
    }
    if (updateMap.size === 0) return getStoredGames();
    const library = getLibrary();
    return setLibrary({
      ...library,
      games: library.games.map((game) => {
        if (!updateMap.has(game.id)) return game;
        const coverUrl = updateMap.get(game.id) ?? null;
        return {
          ...game,
          coverUrl,
          artworkStatus: coverUrl ? "resolved" : "missing",
          metadata: {
            ...game.metadata,
            displayTitle: game.metadata?.displayTitle ?? game.title,
            sortTitle: game.metadata?.sortTitle ?? game.title.toLowerCase(),
            searchTitle: game.metadata?.searchTitle ?? `${game.title} ${game.fileName}`.toLowerCase(),
            coverUrl,
            coverCandidates: game.metadata?.coverCandidates ?? []
          }
        };
      })
    }).games;
  }
  function markGameLaunched(gameId) {
    return updateGame(gameId, (game) => ({
      ...game,
      lastPlayedAt: nowIso(),
      playCount: (game.playCount ?? 0) + 1
    }));
  }
  function getRomFolders() {
    return getLibrary().settings.romFolders;
  }
  function setRomFolders(paths) {
    updateLibrary((library) => ({
      ...library,
      settings: {
        ...library.settings,
        romFolders: paths.map((value) => value.trim()).filter(Boolean)
      }
    }));
  }
  function getRetroArchPath() {
    return getLibrary().settings.retroArchPath;
  }
  function getRetroArchCoresPath() {
    return getLibrary().settings.retroArchCoresPath;
  }
  function setRetroArchCoresPath(path) {
    updateLibrary((library) => ({
      ...library,
      settings: {
        ...library.settings,
        retroArchCoresPath: path.trim()
      }
    }));
  }
  function getAutoSyncEnabled() {
    return getLibrary().settings.autoSyncEnabled;
  }
  function setAutoSyncEnabled(value) {
    updateLibrary((library) => ({
      ...library,
      settings: {
        ...library.settings,
        autoSyncEnabled: value
      }
    }));
  }
  function getAutoSyncIntervalSeconds() {
    return getLibrary().settings.autoSyncIntervalSeconds;
  }
  function setAutoSyncIntervalSeconds(value) {
    updateLibrary((library) => ({
      ...library,
      settings: {
        ...library.settings,
        autoSyncIntervalSeconds: Math.max(15, Math.min(300, Math.round(value)))
      }
    }));
  }
  function getHeroEnabled() {
    return getLibrary().settings.heroEnabled;
  }
  function setHeroEnabled(value) {
    updateLibrary((library) => ({
      ...library,
      settings: {
        ...library.settings,
        heroEnabled: Boolean(value)
      }
    }));
  }
  function getHeroMode() {
    return getLibrary().settings.heroMode;
  }
  function setHeroMode(value) {
    updateLibrary((library) => ({
      ...library,
      settings: {
        ...library.settings,
        heroMode: value === "random" ? "random" : "last_played"
      }
    }));
  }
  function normalizeMappingValue(value) {
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      return String(Math.floor(value));
    }
    if (typeof value !== "string") return null;
    const trimmed = value.trim().toLowerCase();
    if (/^\d+$/.test(trimmed)) return trimmed;
    if (/^axis:\d+:[+-]1$/.test(trimmed)) return trimmed;
    return null;
  }
  function normalizeGamepadMapping(raw) {
    const next = { ...DEFAULT_GAMEPAD_MAPPING };
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return next;
    for (const binding of LUMIOPLAY_JOYPAD_BINDINGS) {
      const normalized = normalizeMappingValue(raw[String(binding.index)]);
      if (normalized) next[binding.index] = normalized;
    }
    return next;
  }
  function normalizeExitCombo(raw) {
    if (!Array.isArray(raw)) return [...DEFAULT_GAMEPAD_EXIT_COMBO];
    const values = raw.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value >= 0).map((value) => Math.floor(value));
    return values.length > 0 ? Array.from(new Set(values)).slice(0, 4) : [...DEFAULT_GAMEPAD_EXIT_COMBO];
  }
  function getGamepadMapping() {
    try {
      const raw = getScopedStorageItem(KEY_GAMEPAD_MAPPING);
      if (!raw) return { ...DEFAULT_GAMEPAD_MAPPING };
      return normalizeGamepadMapping(JSON.parse(raw));
    } catch {
      return { ...DEFAULT_GAMEPAD_MAPPING };
    }
  }
  function setGamepadMapping(mapping) {
    const normalized = normalizeGamepadMapping(mapping);
    setScopedStorageItem(KEY_GAMEPAD_MAPPING, JSON.stringify(normalized));
  }
  function getGamepadExitCombo() {
    try {
      const raw = getScopedStorageItem(KEY_GAMEPAD_EXIT_COMBO);
      if (!raw) return [...DEFAULT_GAMEPAD_EXIT_COMBO];
      return normalizeExitCombo(JSON.parse(raw));
    } catch {
      return [...DEFAULT_GAMEPAD_EXIT_COMBO];
    }
  }
  function setGamepadExitCombo(combo) {
    const normalized = normalizeExitCombo(combo);
    setScopedStorageItem(KEY_GAMEPAD_EXIT_COMBO, JSON.stringify(normalized));
  }
  var GRID_DENSITIES = ["compact", "standard", "large", "xl"];
  function getGridDensity() {
    const stored = getScopedStorageItem(KEY_GRID_DENSITY);
    return stored && GRID_DENSITIES.includes(stored) ? stored : "standard";
  }
  function setGridDensity(value) {
    setScopedStorageItem(KEY_GRID_DENSITY, value);
  }

  // runtime/lumioplay-launcher.ts
  function isAbsolutePath(path) {
    return path.startsWith("/") || /^[A-Za-z]:[\\/]/.test(path);
  }
  function trimTrailingSlashes(value) {
    return value.replace(/[\\/]+$/, "");
  }
  function getHostOs() {
    if (typeof navigator === "undefined") return "macos";
    const platform = navigator.userAgent.toLowerCase();
    if (platform.includes("windows")) return "windows";
    if (platform.includes("linux")) return "linux";
    return "macos";
  }
  function inferRetroArchExecutablePath(inputPath) {
    const trimmed = trimTrailingSlashes(inputPath.trim());
    if (!trimmed) return "";
    if (trimmed.endsWith(".app")) {
      return `${trimmed}/Contents/MacOS/RetroArch`;
    }
    return trimmed;
  }
  function inferRetroArchCoresPath(inputPath) {
    const trimmed = trimTrailingSlashes(inputPath.trim());
    if (!trimmed) return "";
    if (trimmed.endsWith(".app")) {
      return `${trimmed}/Contents/Resources/cores`;
    }
    if (trimmed.includes("/Contents/MacOS/")) {
      return trimmed.replace("/Contents/MacOS/RetroArch", "/Contents/Resources/cores");
    }
    if (trimmed.toLowerCase().endsWith("\\retroarch.exe")) {
      return `${trimmed.slice(0, -"retroarch.exe".length)}cores`;
    }
    return trimmed;
  }
  function getCoreLibraryExtension() {
    const os = getHostOs();
    if (os === "windows") return ".dll";
    if (os === "linux") return ".so";
    return ".dylib";
  }
  function buildCorePath(coreId, coresDirectory) {
    const normalizedDirectory = trimTrailingSlashes(coresDirectory);
    const separator = normalizedDirectory.includes("\\") ? "\\" : "/";
    return `${normalizedDirectory}${separator}${coreId}${getCoreLibraryExtension()}`;
  }
  async function pathExists(path) {
    if (getHostOs() === "windows") return true;
    return checkPluginPathExists(path);
  }
  function canLaunchGame(game) {
    return isPluginDesktopHost() && !game.missing && isAbsolutePath(game.romPath) && Boolean(getEffectiveCoreId(game)) && Boolean(getEffectivePlatform(game));
  }
  function getRetroArchLaunchConfig(game) {
    const configuredExecutable = inferRetroArchExecutablePath(getRetroArchPath());
    if (!configuredExecutable) return null;
    const coreId = getEffectiveCoreId(game);
    if (!coreId) return null;
    const configuredCoresPath = trimTrailingSlashes(getRetroArchCoresPath()) || inferRetroArchCoresPath(getRetroArchPath());
    if (!configuredCoresPath) return null;
    return {
      executablePath: configuredExecutable,
      coresPath: configuredCoresPath,
      corePath: buildCorePath(coreId, configuredCoresPath)
    };
  }
  async function verifyLaunchConfig(config) {
    if (getHostOs() === "windows") return;
    const executableExists = await pathExists(config.executablePath);
    if (!executableExists) {
      throw new Error(tr("launcherRetroArchBinaryMissing"));
    }
    const coreExists = await pathExists(config.corePath);
    if (!coreExists) {
      throw new Error(tr("launcherCoreMissing"));
    }
  }
  async function launchGameWithRetroArch(game) {
    if (!isPluginDesktopHost()) {
      throw new Error(tr("launcherRetroArchDesktopOnly"));
    }
    if (game.missing) {
      throw new Error(tr("launcherRomMissingAfterSync"));
    }
    if (!isAbsolutePath(game.romPath)) {
      throw new Error(tr("launcherRomNoLocalPath"));
    }
    const config = getRetroArchLaunchConfig(game);
    if (!config) {
      throw new Error(tr("launcherRetroArchSetupRequired"));
    }
    await verifyLaunchConfig(config);
    await launchPluginProgram(config.executablePath, ["-L", config.corePath, game.romPath]);
  }
  function canLaunchLibretro(game) {
    return isPluginDesktopHost() && !game.missing && isAbsolutePath(game.romPath) && Boolean(getEffectiveCoreId(game)) && Boolean(getEffectivePlatform(game));
  }
  async function launchLibretroGameEmbedded(game) {
    if (!isPluginDesktopHost()) {
      throw new Error(tr("launcherLibretroDesktopOnly"));
    }
    if (game.missing) {
      throw new Error(tr("launcherRomMissing"));
    }
    if (!isAbsolutePath(game.romPath)) {
      throw new Error(tr("launcherGameNoLocalPath"));
    }
    const coreId = getEffectiveCoreId(game);
    if (!coreId) {
      throw new Error(tr("launcherNoCoreSelected"));
    }
    const configuredCoresPath = trimTrailingSlashes(getRetroArchCoresPath()) || inferRetroArchCoresPath(getRetroArchPath());
    if (!configuredCoresPath) {
      throw new Error(tr("launcherCoresPathRequired"));
    }
    const corePath = buildCorePath(coreId, configuredCoresPath);
    if (!await pathExists(corePath)) {
      throw new Error(tr("launcherCoreNotFoundAtPath").replace("{path}", corePath));
    }
    await launchLibretroGame(corePath, game.romPath);
  }

  // ../../../../var/folders/lc/1hd2j0b57z10tx5mflylq4r80000gp/T/lumioplay-build-PJrV59/jsx-runtime-shim.ts
  var runtime = globalThis.__lumioPluginRuntime?.jsxRuntime;
  if (!runtime) {
    throw new Error("Lumio plugin runtime host has not initialized JSX runtime.");
  }
  var Fragment2 = runtime.Fragment;
  var jsx = runtime.jsx;
  var jsxs = runtime.jsxs;
  var jsxDEV = runtime.jsxDEV;

  // runtime/lumioplay-browser.tsx
  var neutralPillClass = "border-white/10 bg-white/5 text-slate-200 hover:border-accent-400/30 hover:bg-white/10 hover:text-white";
  var activePillClass = "border-accent-400/50 bg-accent-400/10 text-accent-300";
  var cardButtonClass = "flex h-9 items-center rounded-full border px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] transition-all";
  var GAME_OVERLAY_TOP_OVERSCAN = 56;
  var KEYBOARD_TO_JOYPAD = {
    KeyZ: 0,
    KeyA: 1,
    ShiftRight: 2,
    Enter: 3,
    ArrowUp: 4,
    ArrowDown: 5,
    ArrowLeft: 6,
    ArrowRight: 7,
    KeyX: 8,
    KeyS: 9,
    KeyQ: 10,
    KeyW: 11
  };
  var JOYPAD_BUTTON_COUNT = 16;
  function isMappingPressed(mappingValue, pad) {
    if (!mappingValue) return false;
    if (/^\d+$/.test(mappingValue)) {
      const buttonIndex = Number(mappingValue);
      return Boolean(pad.buttons[buttonIndex]?.pressed);
    }
    const axisMatch = mappingValue.match(/^axis:(\d+):([+-]1)$/);
    if (!axisMatch) return false;
    const axisIndex = Number(axisMatch[1]);
    const direction = axisMatch[2];
    const axisValue = pad.axes[axisIndex] ?? 0;
    return direction === "-1" ? axisValue <= -0.5 : axisValue >= 0.5;
  }
  var POSTER_SYNC_CONCURRENCY = 3;
  var POSTER_SYNC_BATCH_SIZE = 20;
  var POSTER_SYNC_AUTO_LIMIT = 10;
  var POSTER_SYNC_MISS_CACHE_KEY = "lumioplay_poster_miss_cache_v3";
  var POSTER_SYNC_MISS_TTL_MS = 45 * 60 * 1e3;
  var POSTER_SYNC_MAX_MISS_ENTRIES = 2500;
  var POSTER_INDEX_CACHE_TTL_MS = 24 * 60 * 60 * 1e3;
  var WEB_FOLDER_SOURCE_ID = "selected-folder";
  function formatFileSize(bytes) {
    if (!bytes || bytes <= 0) return null;
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }
  function getPlatformOptions() {
    return LUMIOPLAY_PLATFORMS.filter((platform) => platform.id !== "all").map((platform) => platform.id);
  }
  function getCoreSuggestions() {
    return Array.from(
      new Set(
        LUMIOPLAY_PLATFORMS.map((platform) => platform.coreId).filter((value) => Boolean(value))
      )
    );
  }
  var SYSTEM_NAME_BY_PLATFORM = {
    nes: "Nintendo - Nintendo Entertainment System",
    snes: "Nintendo - Super Nintendo Entertainment System",
    gb: "Nintendo - Game Boy",
    gbc: "Nintendo - Game Boy Color",
    gba: "Nintendo - Game Boy Advance",
    genesis: "Sega - Mega Drive - Genesis",
    n64: "Nintendo - Nintendo 64",
    ps1: "Sony - PlayStation"
  };
  function stripLikelyFileExtension2(value) {
    return value.replace(/\.[a-z0-9]{1,8}$/i, "");
  }
  function systemNameToLibretroRepoSlug(systemName) {
    return systemName.trim().replace(/\s*-\s*/g, "_-_").replace(/\s+/g, "_");
  }
  function normalizePosterLookupValue(value) {
    const normalized = value.toLowerCase().replace(/%[0-9a-f]{2}/gi, "").replace(/\.png$/i, "").replace(/\bg\.?\s*i\.?\b/gi, " gi ").replace(/\bm\.?\s*s\.?\b/gi, " ms ").replace(/\bjr\.\b/gi, " jr ").replace(/\s*&\s*/g, " and ").replace(/\([^)]*\)/g, " ").replace(/\[[^\]]*\]/g, " ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    return normalized;
  }
  function buildPosterLookupTokens(value) {
    const prioritizedShortTokens = /* @__PURE__ */ new Set(["gi", "ms", "jr"]);
    return Array.from(
      new Set(
        normalizePosterLookupValue(value).split(" ").map((token) => token.trim()).filter((token) => {
          if (!token) return false;
          if (prioritizedShortTokens.has(token)) return true;
          return token.length > 2;
        })
      )
    );
  }
  function extractCanonicalTokens(value) {
    return normalizePosterCanonicalValue(value).split(" ").map((token) => token.trim()).filter((token) => token.length > 0);
  }
  function hasNumericOrRomanToken(value) {
    const tokens = normalizePosterLookupValue(value).split(" ").filter(Boolean);
    return tokens.some((token) => /^\d+$/.test(token) || /^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(token));
  }
  function safeDecodePosterEntry(value) {
    const unescaped = value.replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&#x27;/gi, "'");
    try {
      return decodeURIComponent(unescaped);
    } catch {
      return unescaped;
    }
  }
  function buildNamedBoxartUrl(systemName, entry) {
    const decodedEntry = safeDecodePosterEntry(entry).replace(/^\/+/, "").replace(/\.png$/i, "");
    const encodedEntry = `${encodeURIComponent(decodedEntry)}.png`;
    return `https://thumbnails.libretro.com/${encodeURIComponent(systemName)}/Named_Boxarts/${encodedEntry}`;
  }
  function normalizePosterCanonicalValue(value) {
    const ignoredTokens = /* @__PURE__ */ new Set([
      "rev",
      "revision",
      "ver",
      "version",
      "v",
      "beta",
      "proto",
      "sample",
      "demo",
      "unl",
      "hack",
      "usa",
      "us",
      "japan",
      "jp",
      "europe",
      "eu",
      "world",
      "pal",
      "ntsc",
      "en",
      "eng",
      "fr",
      "de",
      "es",
      "it",
      "pt",
      "ru",
      "zh",
      "sv",
      "nintendo",
      "konami",
      "capcom",
      "namco",
      "tengen",
      "taxan",
      "kemco",
      "playchoice",
      "edition",
      "gamecube",
      "ereader",
      "prg",
      "two",
      "player"
    ]);
    const tokens = normalizePosterLookupValue(value).split(" ").map((token) => token.trim()).filter((token) => token.length > 0).filter((token) => {
      if (ignoredTokens.has(token)) return false;
      if (/^\d+$/.test(token)) return false;
      if (/^\d{4}$/.test(token)) return false;
      return true;
    });
    return tokens.join(" ").trim();
  }
  function buildCanonicalGameKeys(game) {
    const fileBase = stripLikelyFileExtension2(game.fileName);
    const rawCandidates = [
      getGameDisplayTitle(game),
      fileBase,
      fileBase.replace(/\s*-\s*.*$/, "").trim(),
      fileBase.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim()
    ];
    const keys = rawCandidates.map((value) => normalizePosterCanonicalValue(value)).filter(Boolean);
    return Array.from(new Set(keys));
  }
  function getPreferredRegionTokens(region) {
    if (!region) return [];
    const normalized = region.toLowerCase();
    if (normalized.includes("usa") || normalized.includes("us")) return ["(us)", "(usa)", "(jp-us)"];
    if (normalized.includes("japan") || normalized.includes("jp")) return ["(jp)", "(japan)"];
    if (normalized.includes("europe") || normalized.includes("eur")) return ["(eu)", "(europe)"];
    if (normalized.includes("world")) return ["(world)", "(jp-us)", "(us)", "(usa)"];
    return [];
  }
  function sortGames(games, platform, query, lang) {
    const normalizedQuery = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesPlatform = platform === "all" || getEffectivePlatform(game) === platform;
      const haystack = `${getGameDisplayTitle(game)} ${game.fileName} ${game.metadata?.searchTitle ?? ""}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesPlatform && matchesQuery;
    }).sort((left, right) => {
      if (!!left.favorite !== !!right.favorite) return left.favorite ? -1 : 1;
      if (!!left.missing !== !!right.missing) return left.missing ? 1 : -1;
      const leftPlayed = left.lastPlayedAt ?? "";
      const rightPlayed = right.lastPlayedAt ?? "";
      if (leftPlayed !== rightPlayed) return rightPlayed.localeCompare(leftPlayed);
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), lang);
    });
  }
  var DEFAULT_GRID_PROFILE = { aspectRatio: 2 / 3, minColWidth: 150 };
  var GRID_PROFILE_BY_PLATFORM = {
    nes: { aspectRatio: 0.71, minColWidth: 150 },
    // portrait box
    snes: { aspectRatio: 4 / 3, minColWidth: 240 },
    // landscape box
    gb: { aspectRatio: 0.9, minColWidth: 165 },
    // small near-square box
    gbc: { aspectRatio: 0.9, minColWidth: 165 },
    gba: { aspectRatio: 3 / 2, minColWidth: 235 },
    // landscape box
    genesis: { aspectRatio: 0.72, minColWidth: 150 },
    // tall VHS-style box
    n64: { aspectRatio: 0.92, minColWidth: 185 },
    // near-square box
    ps1: { aspectRatio: 0.69, minColWidth: 150 }
    // portrait jewel case
  };
  var GRID_DENSITY_FACTOR = {
    compact: 0.8,
    standard: 1,
    large: 1.3,
    xl: 1.65
  };
  function getGridProfileForPlatform(platform, density = "standard") {
    const base = platform === "all" ? DEFAULT_GRID_PROFILE : GRID_PROFILE_BY_PLATFORM[platform] ?? DEFAULT_GRID_PROFILE;
    const factor = GRID_DENSITY_FACTOR[density] ?? 1;
    return { aspectRatio: base.aspectRatio, minColWidth: Math.round(base.minColWidth * factor) };
  }
  var GRID_DENSITY_ORDER = ["compact", "standard", "large", "xl"];
  var GRID_DENSITY_LABEL = {
    compact: "S",
    standard: "M",
    large: "L",
    xl: "XL"
  };
  function GridDensityPicker({
    value,
    onChange,
    label
  }) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", title: label, "aria-label": label, children: GRID_DENSITY_ORDER.map((density) => {
      const selected = density === value;
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(density),
          className: `h-9 rounded-full border px-3 text-[0.6rem] font-normal uppercase tracking-[0.2em] transition-all ${selected ? activePillClass : neutralPillClass}`,
          children: GRID_DENSITY_LABEL[density]
        },
        density
      );
    }) });
  }
  function gridContainerStyle(profile) {
    return {
      display: "grid",
      gap: "0.75rem",
      gridTemplateColumns: `repeat(auto-fill, minmax(${profile.minColWidth}px, 1fr))`
    };
  }
  function PlatformChips({
    active,
    onChange,
    games
  }) {
    const availablePlatformIds = Array.from(new Set(games.map((game) => getEffectivePlatform(game))));
    const availablePlatforms = LUMIOPLAY_PLATFORMS.filter(
      (platform) => platform.id !== "all" && availablePlatformIds.includes(platform.id)
    );
    if (availablePlatforms.length === 0) return null;
    return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: availablePlatforms.map((platform) => {
      const selected = platform.id === active;
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(platform.id),
          className: `h-9 rounded-full border px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] whitespace-nowrap transition-all ${selected ? activePillClass : neutralPillClass}`,
          children: platform.label
        },
        platform.id
      );
    }) });
  }
  function LibraryToolbar({
    onUploadRoms,
    onChooseFolder,
    onRescanFolders,
    onSyncPosters,
    desktopReady,
    hasSavedFolders,
    syncing,
    syncingPosters
  }) {
    const { t } = useLang();
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onUploadRoms,
          className: `${cardButtonClass} ${activePillClass}`,
          children: desktopReady ? t("browserImportRoms") : t("browserUploadRoms")
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onChooseFolder,
          className: `${cardButtonClass} ${neutralPillClass}`,
          children: t("browserChooseFolder")
        }
      ),
      desktopReady && hasSavedFolders ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onRescanFolders,
          className: `${cardButtonClass} ${syncing ? activePillClass : neutralPillClass}`,
          children: syncing ? t("browserSyncing") : t("browserSyncNow")
        }
      ) : null,
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onSyncPosters,
          className: `${cardButtonClass} ${syncingPosters ? activePillClass : neutralPillClass}`,
          children: syncingPosters ? t("browserCancelPosterSync") : t("browserSyncPosters")
        }
      )
    ] });
  }
  function StarButton({
    active,
    onClick
  }) {
    const { t } = useLang();
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick,
        className: `flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-all ${active ? "border-accent-400/50 bg-accent-400/10 text-accent-300" : "border-white/10 bg-black/25 text-slate-400 hover:border-white/20 hover:text-white"}`,
        "aria-label": active ? t("browserRemoveFavorite") : t("browserAddFavorite"),
        children: "\u2605"
      }
    );
  }
  function GamesGrid({
    games,
    activePlatform,
    gridDensity,
    launchState,
    editingGameId,
    onEditGame,
    onToggleFavorite,
    onLaunch,
    onPlatformOverrideChange,
    onCoreOverrideChange
  }) {
    const { t } = useLang();
    const platformOptions = getPlatformOptions();
    const coreSuggestions = getCoreSuggestions();
    const gridProfile = getGridProfileForPlatform(activePlatform, gridDensity);
    if (games.length === 0) {
      return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-sm text-slate-400", children: t("browserEmptyLibrary") });
    }
    return /* @__PURE__ */ jsx("div", { style: gridContainerStyle(gridProfile), children: games.map((game) => {
      const effectivePlatform = getEffectivePlatform(game);
      const effectiveCore = getEffectiveCoreId(game);
      const editing = editingGameId === game.id;
      const displayCoverUrl = game.coverUrl ?? game.metadata?.coverUrl ?? null;
      const posterAspectRatio = getGridProfileForPlatform(effectivePlatform, gridDensity).aspectRatio;
      const regionLabel = getRegionLabel(game.metadata?.region, t);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `group w-full cursor-pointer bg-transparent text-left transition-all duration-300 hover:-translate-y-1 ${game.missing ? "opacity-70" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900", style: { aspectRatio: String(posterAspectRatio) }, children: [
              displayCoverUrl ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: displayCoverUrl,
                  alt: getGameDisplayTitle(game),
                  className: "h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]",
                  onError: (event) => {
                    event.currentTarget.style.display = "none";
                  }
                }
              ) : null,
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
              /* @__PURE__ */ jsxs("div", { className: "absolute left-2 right-2 top-2 flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/[0.08] bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm", children: getPlatformLabel(effectivePlatform, t) }),
                /* @__PURE__ */ jsx(StarButton, { active: Boolean(game.favorite), onClick: () => onToggleFavorite(game.id) })
              ] }),
              game.missing ? /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-2", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-rose-500/80 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm", children: t("browserMissing") }) }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-2.5", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-[9px] uppercase tracking-[0.22em] text-slate-300/60", children: [
                effectiveCore ?? t("browserNoCore"),
                formatFileSize(game.fileSizeBytes) ? ` \xB7 ${formatFileSize(game.fileSizeBytes)}` : ""
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "mt-0.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-white", children: getGameDisplayTitle(game) }),
              regionLabel ? /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-400", children: regionLabel }) : null,
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onLaunch(game),
                    disabled: !canLaunchGame(game) || launchState.gameId === game.id,
                    className: `${cardButtonClass} ${canLaunchGame(game) ? "border-accent-500/40 bg-accent-500/90 text-white hover:bg-accent-500" : `cursor-not-allowed ${neutralPillClass} opacity-50`}`,
                    children: launchState.gameId === game.id ? t("starting") : t("browserPlay")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onEditGame(editing ? null : game.id),
                    className: `${cardButtonClass} ${neutralPillClass}`,
                    children: editing ? t("browserDone") : t("browserCustomize")
                  }
                )
              ] }),
              !canLaunchGame(game) && !game.missing ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-slate-500", children: isPluginDesktopHost() ? t("browserImportHint") : t("browserDesktopRequired") }) : null,
              editing ? /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase tracking-[0.18em] text-slate-500", children: t("browserConsole") }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: game.platformOverride ?? "",
                      onChange: (event) => onPlatformOverrideChange(
                        game.id,
                        event.target.value ? event.target.value : null
                      ),
                      className: "h-10 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white outline-none",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: t("browserAutoDetect").replace("{platform}", getPlatformLabel(game.platform, t)) }),
                        platformOptions.map((platform) => /* @__PURE__ */ jsx("option", { value: platform, children: getPlatformLabel(platform, t) }, platform))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase tracking-[0.18em] text-slate-500", children: t("browserLibretroCore") }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      list: `core-suggestions-${game.id}`,
                      value: game.coreOverride ?? "",
                      onChange: (event) => onCoreOverrideChange(game.id, event.target.value || null),
                      placeholder: effectiveCore ?? t("browserCoreIdPlaceholder"),
                      className: "h-10 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white placeholder:text-slate-500 outline-none"
                    }
                  ),
                  /* @__PURE__ */ jsx("datalist", { id: `core-suggestions-${game.id}`, children: coreSuggestions.map((coreId) => /* @__PURE__ */ jsx("option", { value: coreId }, coreId)) })
                ] })
              ] }) : null
            ] })
          ]
        },
        game.id
      );
    }) });
  }
  function LumioplayBrowsePage(_props) {
    const { lang, t } = useLang();
    const [games, setGames] = useState(() => getStoredGames());
    const [platform, setPlatform] = useState("all");
    const [query, setQuery] = useState("");
    const [gridDensity, setGridDensityState] = useState(() => getGridDensity());
    const [statusMessage, setStatusMessage] = useState(null);
    const [launchState, setLaunchState] = useState({
      gameId: null,
      message: null
    });
    const [editingGameId, setEditingGameId] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [desktopReady, setDesktopReady] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const uploadInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const gameContainerRef = useRef(null);
    const syncInFlightRef = useRef(false);
    const keyboardStateRef = useRef(Array(JOYPAD_BUTTON_COUNT).fill(false));
    const gamepadStateRef = useRef(Array(JOYPAD_BUTTON_COUNT).fill(false));
    const lastSentStateRef = useRef(Array(JOYPAD_BUTTON_COUNT).fill(false));
    const savedFolders = getRomFolders();
    const autoSyncEnabled = getAutoSyncEnabled();
    const autoSyncIntervalSeconds = getAutoSyncIntervalSeconds();
    useEffect(() => {
      setDesktopReady(isPluginDesktopHost());
    }, []);
    function mergeInputStates2() {
      return Array.from({ length: JOYPAD_BUTTON_COUNT }, (_, index) => {
        return Boolean(keyboardStateRef.current[index] || gamepadStateRef.current[index]);
      });
    }
    function pushInputState2() {
      const merged = mergeInputStates2();
      const changed = merged.some((pressed, index) => pressed !== lastSentStateRef.current[index]);
      if (!changed) return;
      lastSentStateRef.current = merged;
      void sendLibretroInput([...merged]);
    }
    function stopActiveGame() {
      void stopLibretroGame();
      keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
      gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
      lastSentStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
      void sendLibretroInput(Array(JOYPAD_BUTTON_COUNT).fill(false));
      setGameActive(false);
    }
    useEffect(() => {
      if (!gameActive) return;
      function onKeyDown2(event) {
        event.preventDefault();
        if (event.code === "Escape") {
          stopActiveGame();
          return;
        }
        const index = KEYBOARD_TO_JOYPAD[event.code];
        if (index !== void 0 && !keyboardStateRef.current[index]) {
          keyboardStateRef.current[index] = true;
          pushInputState2();
        }
      }
      function onKeyUp2(event) {
        const index = KEYBOARD_TO_JOYPAD[event.code];
        if (index !== void 0 && keyboardStateRef.current[index]) {
          keyboardStateRef.current[index] = false;
          pushInputState2();
        }
      }
      window.addEventListener("keydown", onKeyDown2);
      window.addEventListener("keyup", onKeyUp2);
      gameContainerRef.current?.focus();
      return () => {
        keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
        window.removeEventListener("keydown", onKeyDown2);
        window.removeEventListener("keyup", onKeyUp2);
        pushInputState2();
      };
    }, [gameActive]);
    useEffect(() => {
      if (!gameActive) return;
      let rafId2 = 0;
      let comboHeld2 = false;
      const gamepadMapping = getGamepadMapping();
      const exitCombo = getGamepadExitCombo();
      function onFrame2() {
        const pad = navigator.getGamepads?.().find((entry) => Boolean(entry)) ?? null;
        const nextState = Array(JOYPAD_BUTTON_COUNT).fill(false);
        if (pad) {
          Object.entries(gamepadMapping).forEach(([joypadIndexRaw, gamepadButtonRaw]) => {
            const joypadIndex = Number(joypadIndexRaw);
            if (!Number.isFinite(joypadIndex)) return;
            if (joypadIndex < 0 || joypadIndex >= JOYPAD_BUTTON_COUNT) return;
            const pressed = isMappingPressed(String(gamepadButtonRaw), pad);
            nextState[joypadIndex] = pressed;
          });
          const comboPressed = exitCombo.length > 0 && exitCombo.every((buttonIndex) => Boolean(pad.buttons[buttonIndex]?.pressed));
          if (comboPressed && !comboHeld2) {
            comboHeld2 = true;
            stopActiveGame();
            return;
          }
          if (!comboPressed) {
            comboHeld2 = false;
          }
        }
        gamepadStateRef.current = nextState;
        pushInputState2();
        rafId2 = window.requestAnimationFrame(onFrame2);
      }
      rafId2 = window.requestAnimationFrame(onFrame2);
      return () => {
        if (rafId2) window.cancelAnimationFrame(rafId2);
        gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
        pushInputState2();
      };
    }, [gameActive]);
    useEffect(() => {
      if (!gameActive) return;
      const unlisten = onLibretroStopped(() => {
        setGameActive(false);
        keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
        gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
        lastSentStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
      });
      return unlisten;
    }, [gameActive]);
    useEffect(() => {
      if (!gameActive || !gameContainerRef.current) return;
      function syncBounds() {
        const element = gameContainerRef.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const overscanTop = Math.min(GAME_OVERLAY_TOP_OVERSCAN, rect.top);
        void setLibretroBounds(
          rect.left,
          rect.top - overscanTop,
          rect.width,
          rect.height + overscanTop,
          window.innerHeight,
          window.devicePixelRatio
        );
      }
      syncBounds();
      gameContainerRef.current.focus();
      const resizeObserver = new ResizeObserver(syncBounds);
      resizeObserver.observe(gameContainerRef.current);
      window.addEventListener("resize", syncBounds);
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", syncBounds);
      };
    }, [gameActive]);
    const availablePlatformIds = Array.from(new Set(games.map((game) => getEffectivePlatform(game))));
    const resolvedPlatform = platform !== "all" && availablePlatformIds.includes(platform) ? platform : availablePlatformIds[0] ?? "all";
    const filteredGames = useMemo(
      () => sortGames(games, resolvedPlatform, query, lang),
      [games, resolvedPlatform, query, lang]
    );
    function refreshGames() {
      setGames(getStoredGames());
    }
    const [syncingPosters, setSyncingPosters] = useState(false);
    const [posterSyncProgress, setPosterSyncProgress] = useState(null);
    const posterSyncInFlightRef = useRef(false);
    const posterSyncCancelRequestedRef = useRef(false);
    const posterSyncMissCacheRef = useRef(/* @__PURE__ */ new Map());
    const posterSyncMissCacheDirtyRef = useRef(false);
    const posterIndexCacheRef = useRef(
      /* @__PURE__ */ new Map()
    );
    function loadPosterMissCache() {
      try {
        const raw = getScopedStorageItem(POSTER_SYNC_MISS_CACHE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const now = Date.now();
        const next = /* @__PURE__ */ new Map();
        Object.entries(parsed).forEach(([url, expiresAt]) => {
          if (!url || !Number.isFinite(expiresAt)) return;
          if (expiresAt > now) next.set(url, expiresAt);
        });
        posterSyncMissCacheRef.current = next;
        posterSyncMissCacheDirtyRef.current = false;
      } catch {
        posterSyncMissCacheRef.current = /* @__PURE__ */ new Map();
        posterSyncMissCacheDirtyRef.current = false;
      }
    }
    function savePosterMissCache() {
      if (!posterSyncMissCacheDirtyRef.current) return;
      const now = Date.now();
      const entries = Array.from(posterSyncMissCacheRef.current.entries()).filter(([, expiresAt]) => expiresAt > now).sort((a, b) => b[1] - a[1]).slice(0, POSTER_SYNC_MAX_MISS_ENTRIES);
      const payload = {};
      entries.forEach(([url, expiresAt]) => {
        payload[url] = expiresAt;
      });
      setScopedStorageItem(POSTER_SYNC_MISS_CACHE_KEY, JSON.stringify(payload));
      posterSyncMissCacheRef.current = new Map(entries);
      posterSyncMissCacheDirtyRef.current = false;
    }
    function isMissCached(url) {
      const expiresAt = posterSyncMissCacheRef.current.get(url);
      if (!expiresAt) return false;
      if (expiresAt > Date.now()) return true;
      posterSyncMissCacheRef.current.delete(url);
      posterSyncMissCacheDirtyRef.current = true;
      return false;
    }
    function markMissCached(url) {
      posterSyncMissCacheRef.current.set(url, Date.now() + POSTER_SYNC_MISS_TTL_MS);
      posterSyncMissCacheDirtyRef.current = true;
    }
    function clearMissCached(url) {
      if (!posterSyncMissCacheRef.current.has(url)) return;
      posterSyncMissCacheRef.current.delete(url);
      posterSyncMissCacheDirtyRef.current = true;
    }
    useEffect(() => {
      loadPosterMissCache();
    }, []);
    function getPosterCandidates(game) {
      const existing = Array.isArray(game.metadata?.coverCandidates) ? game.metadata?.coverCandidates ?? [] : [];
      const generated = buildCoverCandidates(getEffectivePlatform(game), getGameDisplayTitle(game), game.fileName);
      return Array.from(/* @__PURE__ */ new Set([...generated, ...existing])).slice(0, 48);
    }
    async function getPosterIndexEntries(platform2) {
      const cached = posterIndexCacheRef.current.get(platform2);
      if (cached && Date.now() - cached.fetchedAt < POSTER_INDEX_CACHE_TTL_MS) {
        return cached.entries;
      }
      const systemName = SYSTEM_NAME_BY_PLATFORM[platform2];
      if (!systemName) return [];
      const indexUrl = `https://thumbnails.libretro.com/${encodeURIComponent(systemName)}/Named_Boxarts/`;
      let entries = [];
      try {
        const response = await fetch(indexUrl, { cache: "no-store" });
        if (response.ok) {
          const html = await response.text();
          const matches = html.match(/href="([^"]+\.png)"/gi) ?? [];
          entries = Array.from(
            new Set(
              matches.map((raw) => safeDecodePosterEntry(raw.replace(/^href="/i, "").replace(/"$/i, ""))).filter(Boolean)
            )
          );
        }
      } catch {
      }
      if (entries.length === 0) {
        const repoSlug = systemNameToLibretroRepoSlug(systemName);
        const treeUrl = `https://api.github.com/repos/libretro-thumbnails/${repoSlug}/git/trees/master?recursive=1`;
        try {
          const treeResponse = await fetch(treeUrl, {
            cache: "no-store",
            headers: { Accept: "application/vnd.github+json" }
          });
          if (treeResponse.ok) {
            const payload = await treeResponse.json();
            entries = Array.from(
              new Set(
                (payload.tree ?? []).filter((node) => node.type === "blob" && typeof node.path === "string").map((node) => node.path).filter((path) => path.startsWith("Named_Boxarts/") && path.toLowerCase().endsWith(".png")).map((path) => path.slice("Named_Boxarts/".length)).filter(Boolean)
              )
            );
          }
        } catch {
        }
      }
      posterIndexCacheRef.current.set(platform2, { fetchedAt: Date.now(), entries });
      return entries;
    }
    function rankPosterEntryForGame(entry, game) {
      const decoded = safeDecodePosterEntry(entry);
      const normalizedEntry = normalizePosterLookupValue(decoded);
      if (!normalizedEntry) return -1e3;
      const displayTitle = normalizePosterLookupValue(getGameDisplayTitle(game));
      const fileTitle = normalizePosterLookupValue(stripLikelyFileExtension2(game.fileName));
      const titleTokens = Array.from(
        new Set(
          [...buildPosterLookupTokens(displayTitle), ...buildPosterLookupTokens(fileTitle)].filter(
            (token) => !["the", "and", "for", "with"].includes(token)
          )
        )
      );
      if (titleTokens.length === 0) return -1e3;
      const normalizedEntryCanonical = normalizePosterCanonicalValue(decoded);
      const displayCanonical = normalizePosterCanonicalValue(getGameDisplayTitle(game));
      const fileCanonical = normalizePosterCanonicalValue(stripLikelyFileExtension2(game.fileName));
      let score = 0;
      if (normalizedEntry.startsWith(displayTitle)) score += 80;
      if (displayTitle && normalizedEntry.includes(displayTitle)) score += 40;
      if (fileTitle && normalizedEntry.includes(fileTitle)) score += 30;
      if (displayCanonical && normalizedEntryCanonical === displayCanonical) score += 120;
      if (fileCanonical && normalizedEntryCanonical === fileCanonical) score += 80;
      const tokenHits = titleTokens.reduce((hits, token) => hits + (normalizedEntry.includes(token) ? 1 : 0), 0);
      score += tokenHits * 8;
      score -= Math.max(0, titleTokens.length - tokenHits) * 6;
      const wantedCanonicalTokens = Array.from(
        /* @__PURE__ */ new Set([...extractCanonicalTokens(getGameDisplayTitle(game)), ...extractCanonicalTokens(game.fileName)])
      );
      if (wantedCanonicalTokens.length > 0) {
        const entryCanonicalTokens = new Set(extractCanonicalTokens(decoded));
        const overlapCount = wantedCanonicalTokens.reduce(
          (hits, token) => hits + (entryCanonicalTokens.has(token) ? 1 : 0),
          0
        );
        const overlapRatio = overlapCount / wantedCanonicalTokens.length;
        score += overlapCount * 10;
        score += Math.round(overlapRatio * 30);
        if (overlapCount === 0) score -= 60;
      }
      const gameHasSequenceToken = hasNumericOrRomanToken(getGameDisplayTitle(game)) || hasNumericOrRomanToken(game.fileName);
      const entryHasSequenceToken = hasNumericOrRomanToken(decoded);
      if (!gameHasSequenceToken && entryHasSequenceToken) score -= 22;
      if (/\[(h|b|t|p)/i.test(decoded)) score -= 45;
      if (/\(19xx\)|\(-\)/i.test(decoded)) score -= 30;
      if (/\(nintendo\)|\(konami\)|\(capcom\)|\(sega\)|\(namco\)/i.test(decoded)) score += 8;
      const regionHints = getPreferredRegionTokens(game.metadata?.region);
      if (regionHints.length > 0) {
        const lower = decoded.toLowerCase();
        if (regionHints.some((token) => lower.includes(token))) score += 18;
      }
      return score;
    }
    function clearMissCacheForGames(gamesToClear) {
      if (gamesToClear.length === 0) return;
      const missMap = posterSyncMissCacheRef.current;
      if (missMap.size === 0) return;
      let changed = false;
      gamesToClear.forEach((game) => {
        getPosterCandidates(game).forEach((url) => {
          if (missMap.delete(url)) changed = true;
        });
        const platform2 = getEffectivePlatform(game);
        const systemName = SYSTEM_NAME_BY_PLATFORM[platform2];
        if (!systemName) return;
        const systemPath = `/${encodeURIComponent(systemName)}/Named_Boxarts/`;
        const displayTitle = normalizePosterLookupValue(getGameDisplayTitle(game));
        const fileTitle = normalizePosterLookupValue(stripLikelyFileExtension2(game.fileName));
        const probeTerms = Array.from(/* @__PURE__ */ new Set([...buildPosterLookupTokens(displayTitle), ...buildPosterLookupTokens(fileTitle)]));
        Array.from(missMap.keys()).forEach((url) => {
          if (!url.includes(systemPath)) return;
          const entry = safeDecodePosterEntry((url.split("/").pop() ?? "").replace(/\.png$/i, ""));
          const normalizedEntry = normalizePosterLookupValue(entry);
          const matchesByTerm = probeTerms.length === 0 || probeTerms.some((term) => normalizedEntry.includes(term));
          if (matchesByTerm && missMap.delete(url)) changed = true;
        });
      });
      if (changed) posterSyncMissCacheDirtyRef.current = true;
    }
    async function resolvePosterFromIndex(game, options) {
      const platform2 = getEffectivePlatform(game);
      const entries = await getPosterIndexEntries(platform2);
      if (entries.length === 0) return null;
      const displayTitle = normalizePosterLookupValue(getGameDisplayTitle(game));
      const fileTitle = normalizePosterLookupValue(stripLikelyFileExtension2(game.fileName));
      const probeTerms = Array.from(/* @__PURE__ */ new Set([...buildPosterLookupTokens(displayTitle), ...buildPosterLookupTokens(fileTitle)]));
      const strictLookupKeys = new Set(buildCanonicalGameKeys(game));
      const exactMatch = entries.find((entry) => {
        const normalizedEntry = normalizePosterCanonicalValue(safeDecodePosterEntry(entry).replace(/\.png$/i, ""));
        return normalizedEntry.length > 0 && strictLookupKeys.has(normalizedEntry);
      });
      if (exactMatch) {
        const systemName2 = SYSTEM_NAME_BY_PLATFORM[platform2];
        const exactUrl = buildNamedBoxartUrl(systemName2, exactMatch);
        if (options?.forceRefresh || !isMissCached(exactUrl)) {
          const resolvedExact = await resolveFirstReachableCoverUrl([exactUrl], { timeoutMs: 2500, maxCandidates: 1 });
          if (resolvedExact) return resolvedExact;
          markMissCached(exactUrl);
        }
      }
      const buildShortlist = (relaxed) => entries.filter((entry) => {
        const normalizedEntry = normalizePosterLookupValue(safeDecodePosterEntry(entry));
        const canonicalEntry = normalizePosterCanonicalValue(safeDecodePosterEntry(entry));
        if (canonicalEntry.length > 0 && strictLookupKeys.has(canonicalEntry)) return true;
        if (probeTerms.length === 0) return true;
        const termHits = probeTerms.reduce((hits, term) => hits + (normalizedEntry.includes(term) ? 1 : 0), 0);
        const requiredHits = relaxed ? 1 : probeTerms.length >= 5 ? 1 : Math.min(2, Math.max(1, probeTerms.length));
        return termHits >= requiredHits;
      }).map((entry) => ({ entry, score: rankPosterEntryForGame(entry, game) })).filter((candidate) => candidate.score > (relaxed ? -40 : -8)).sort((left, right) => right.score - left.score).slice(0, relaxed ? 120 : 40);
      let shortlist = buildShortlist(false);
      if (shortlist.length === 0) {
        shortlist = buildShortlist(true);
      }
      if (shortlist.length === 0) return null;
      const systemName = SYSTEM_NAME_BY_PLATFORM[platform2];
      const urls = shortlist.map((candidate) => buildNamedBoxartUrl(systemName, candidate.entry));
      const filteredUrls = options?.forceRefresh ? urls : urls.filter((url) => !isMissCached(url));
      const retryUrls = filteredUrls.length > 0 ? filteredUrls : urls.slice(0, 30);
      if (retryUrls.length === 0) return null;
      return retryUrls[0];
    }
    async function resolvePosterCoverForGame(game, options) {
      const candidates = getPosterCandidates(game);
      const allowedCandidates = options?.forceRefresh ? candidates : candidates.filter((url) => !isMissCached(url));
      if (allowedCandidates.length > 0) {
        const resolvedDirect = await resolveFirstReachableCoverUrl(allowedCandidates, { timeoutMs: 2500, maxCandidates: 24 });
        if (resolvedDirect) {
          clearMissCached(resolvedDirect);
          return resolvedDirect;
        }
        allowedCandidates.forEach((url) => markMissCached(url));
      }
      const resolvedFromIndex = await resolvePosterFromIndex(game, options);
      if (resolvedFromIndex) clearMissCached(resolvedFromIndex);
      return resolvedFromIndex;
    }
    async function syncPostersForGames(sourceGames, options) {
      if (posterSyncInFlightRef.current) return;
      posterSyncInFlightRef.current = true;
      posterSyncCancelRequestedRef.current = false;
      setSyncingPosters(true);
      try {
        loadPosterMissCache();
        const onlyMissing = options?.onlyMissing ?? true;
        const candidates = sourceGames.filter((game) => {
          if (game.missing) return false;
          if (!onlyMissing) return true;
          return !game.coverUrl;
        });
        const limited = candidates.slice(0, Math.max(0, options?.limit ?? candidates.length));
        if (limited.length === 0) {
          if (!options?.silent) setStatusMessage(t("browserNoMissingPosters"));
          return;
        }
        if (options?.forceRefresh) {
          clearMissCacheForGames(limited);
        }
        let resolvedCount = 0;
        let processedCount = 0;
        let cancelled = false;
        setPosterSyncProgress({ processed: 0, total: limited.length, resolved: 0 });
        for (let start = 0; start < limited.length; start += POSTER_SYNC_BATCH_SIZE) {
          if (posterSyncCancelRequestedRef.current) {
            cancelled = true;
            break;
          }
          const batch = limited.slice(start, start + POSTER_SYNC_BATCH_SIZE);
          const updates = [];
          for (let idx = 0; idx < batch.length; idx += POSTER_SYNC_CONCURRENCY) {
            if (posterSyncCancelRequestedRef.current) {
              cancelled = true;
              break;
            }
            const chunk = batch.slice(idx, idx + POSTER_SYNC_CONCURRENCY);
            const chunkResults = await Promise.all(
              chunk.map(async (game) => ({
                gameId: game.id,
                coverUrl: await resolvePosterCoverForGame(game, { forceRefresh: options?.forceRefresh }).catch(() => null)
              }))
            );
            chunkResults.forEach((result) => {
              processedCount += 1;
              if (result.coverUrl) {
                resolvedCount += 1;
                updates.push(result);
              }
            });
            setPosterSyncProgress({ processed: processedCount, total: limited.length, resolved: resolvedCount });
          }
          if (updates.length > 0) {
            setGameCoversBatch(updates);
            refreshGames();
          }
          if (cancelled) break;
          await new Promise((resolve) => window.setTimeout(resolve, 180));
        }
        if (!options?.silent) {
          const unmatchedCount = Math.max(0, processedCount - resolvedCount);
          const key = cancelled ? "browserPosterSyncCancelled" : options?.forceRefresh ? "browserPosterSyncForced" : "browserPosterSyncDone";
          setStatusMessage(
            t(key).replace("{resolved}", String(resolvedCount)).replace("{processed}", String(processedCount)).replace("{unmatched}", String(unmatchedCount))
          );
        }
      } catch (error) {
        if (!options?.silent) {
          const message = error instanceof Error ? error.message : t("browserPosterSyncFailed");
          setStatusMessage(message || t("browserPosterSyncFailed"));
        }
      } finally {
        savePosterMissCache();
        posterSyncInFlightRef.current = false;
        posterSyncCancelRequestedRef.current = false;
        setSyncingPosters(false);
        window.setTimeout(() => setPosterSyncProgress(null), 1800);
      }
    }
    function persistImportedGames(nextGames, sourceLabel) {
      if (nextGames.length === 0) {
        setStatusMessage(t("browserNoSupportedRoms").replace("{source}", sourceLabel));
        return;
      }
      const merged = upsertImportedGames(nextGames);
      setGames(merged);
      setStatusMessage(
        t("browserImportedGames").replace("{count}", String(nextGames.length)).replace("{source}", sourceLabel)
      );
      void syncPostersForGames(nextGames, { limit: POSTER_SYNC_AUTO_LIMIT, silent: true, onlyMissing: true });
    }
    async function importIndexedDirectory(directory) {
      const indexedFiles = await scanPluginDirectory(
        directory,
        IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace(".", ""))
      );
      if (!indexedFiles?.length) {
        setStatusMessage(t("browserNoSupportedRoms").replace("{source}", directory));
        return;
      }
      const importedGames = indexedFiles.map(
        (file) => createImportedGame({
          fileName: file.fileName,
          romPath: file.path,
          source: "folder",
          sourceFolder: directory,
          fileSizeBytes: file.sizeBytes ?? null
        })
      ).filter((game) => Boolean(game));
      const merged = syncFolderGames(directory, importedGames);
      setGames(merged);
      setStatusMessage(
        t("browserSyncedGames").replace("{count}", String(importedGames.length)).replace("{source}", directory)
      );
      void syncPostersForGames(importedGames, { limit: POSTER_SYNC_AUTO_LIMIT, silent: true, onlyMissing: true });
    }
    async function syncSavedFolders(silent = false) {
      if (!desktopReady || !savedFolders.length || syncInFlightRef.current) return;
      syncInFlightRef.current = true;
      setSyncing(true);
      let totalFound = 0;
      try {
        for (const folder of savedFolders) {
          const indexedFiles = await scanPluginDirectory(
            folder,
            IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace(".", ""))
          );
          const importedGames = (indexedFiles ?? []).map(
            (file) => createImportedGame({
              fileName: file.fileName,
              romPath: file.path,
              source: "folder",
              sourceFolder: folder,
              fileSizeBytes: file.sizeBytes ?? null
            })
          ).filter((game) => Boolean(game));
          totalFound += importedGames.length;
          syncFolderGames(folder, importedGames);
        }
        refreshGames();
        if (totalFound > 0) {
          const currentGames = getStoredGames();
          void syncPostersForGames(currentGames, { limit: POSTER_SYNC_AUTO_LIMIT, silent: true, onlyMissing: true });
        }
        if (!silent) {
          setStatusMessage(
            totalFound > 0 ? t("browserSyncedFromSavedFolders").replace("{count}", String(totalFound)) : t("browserNoRomsInSavedFolders")
          );
        }
      } finally {
        syncInFlightRef.current = false;
        setSyncing(false);
      }
    }
    async function handleNativeImport() {
      const paths = await pickPluginFiles([
        { name: t("browserRomFilesFilter"), extensions: IMPORTABLE_ROM_EXTENSIONS.map((extension) => extension.replace(".", "")) }
      ]);
      if (!paths?.length) return;
      const importedGames = paths.map((romPath) => {
        const fileName = romPath.split(/[\\/]/).pop() ?? romPath;
        return createImportedGame({
          fileName,
          romPath,
          source: "upload"
        });
      }).filter((game) => Boolean(game));
      persistImportedGames(importedGames, t("browserSourceDesktopImport"));
    }
    async function handleNativeFolderPick() {
      try {
        const folder = await pickPluginFolder();
        if (!folder) return;
        const existingFolders = new Set(getRomFolders());
        existingFolders.add(folder);
        setRomFolders(Array.from(existingFolders));
        await importIndexedDirectory(folder);
      } catch (error) {
        const message = error instanceof Error ? error.message : t("browserAddFolderFailed");
        setStatusMessage(message);
      }
    }
    function handleFilesSelected(fileList, source) {
      const files = Array.from(fileList ?? []);
      const importedGames = files.map(
        (file) => createImportedGame({
          fileName: file.name,
          romPath: source === "folder" ? file.webkitRelativePath || file.name : file.name,
          source,
          sourceFolder: source === "folder" ? file.webkitRelativePath.includes("/") ? file.webkitRelativePath.split("/")[0] : WEB_FOLDER_SOURCE_ID : null,
          fileSizeBytes: file.size
        })
      ).filter((game) => Boolean(game));
      persistImportedGames(
        importedGames,
        source === "folder" ? t("browserSourceSelectedFolder") : t("browserSourceUpload")
      );
    }
    async function handleLaunch(game) {
      setLaunchState({ gameId: game.id, message: null });
      try {
        if (canLaunchLibretro(game)) {
          await launchLibretroGameEmbedded(game);
          const updated = markGameLaunched(game.id);
          setGames(updated);
          setGameActive(true);
          keyboardStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
          gamepadStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
          lastSentStateRef.current = Array(JOYPAD_BUTTON_COUNT).fill(false);
          setStatusMessage(t("browserStartedInLumio").replace("{title}", getGameDisplayTitle(game)));
        } else if (canLaunchGame(game)) {
          await launchGameWithRetroArch(game);
          const updated = markGameLaunched(game.id);
          setGames(updated);
          setStatusMessage(t("browserStartedInRetroArch").replace("{title}", getGameDisplayTitle(game)));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t("browserLaunchFailed");
        setLaunchState({ gameId: null, message });
        setStatusMessage(message);
        return;
      }
      setLaunchState({ gameId: null, message: null });
    }
    useEffect(() => {
      if (!desktopReady || !autoSyncEnabled || savedFolders.length === 0) return;
      void syncSavedFolders(true);
      const intervalId = window.setInterval(() => {
        void syncSavedFolders(true);
      }, autoSyncIntervalSeconds * 1e3);
      const handleFocus = () => {
        refreshGames();
        void syncSavedFolders(true);
      };
      const handleVisibility = () => {
        if (document.visibilityState === "visible") {
          refreshGames();
          void syncSavedFolders(true);
        }
      };
      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibility);
      return () => {
        window.clearInterval(intervalId);
        window.removeEventListener("focus", handleFocus);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }, [desktopReady, autoSyncEnabled, autoSyncIntervalSeconds, savedFolders.join("|")]);
    return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-slate-500", children: "Lumioplay" }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-white", children: t("browserTitle") })
        ] }),
        /* @__PURE__ */ jsx(
          LibraryToolbar,
          {
            onUploadRoms: () => {
              if (desktopReady) {
                void handleNativeImport();
                return;
              }
              uploadInputRef.current?.click();
            },
            onChooseFolder: () => {
              if (desktopReady) {
                void handleNativeFolderPick();
                return;
              }
              folderInputRef.current?.click();
            },
            onRescanFolders: () => {
              void syncSavedFolders(false);
            },
            onSyncPosters: () => {
              if (syncingPosters) {
                posterSyncCancelRequestedRef.current = true;
                setStatusMessage(t("browserCancellingPosterSync"));
                return;
              }
              void syncPostersForGames(getStoredGames(), { onlyMissing: true, forceRefresh: true });
            },
            desktopReady,
            hasSavedFolders: savedFolders.length > 0,
            syncing,
            syncingPosters
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: query,
              onChange: (event) => setQuery(event.target.value),
              placeholder: t("browserSearchPlaceholder"),
              className: "h-9 w-full max-w-xs rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-[0.8rem] text-white placeholder:text-slate-500 outline-none transition-all focus:border-accent-400/30 focus:bg-white/[0.07]"
            }
          ),
          /* @__PURE__ */ jsx(PlatformChips, { active: resolvedPlatform, onChange: setPlatform, games }),
          /* @__PURE__ */ jsx(
            GridDensityPicker,
            {
              value: gridDensity,
              onChange: (value) => {
                setGridDensityState(value);
                setGridDensity(value);
              },
              label: t("browserCardSize")
            }
          )
        ] }),
        statusMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: statusMessage }) : null,
        posterSyncProgress ? /* @__PURE__ */ jsxs("p", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: [
          t("browserPosterSyncProgress"),
          " ",
          posterSyncProgress.processed,
          "/",
          posterSyncProgress.total,
          " \xB7 ",
          t("browserPosterSyncHits"),
          " ",
          posterSyncProgress.resolved
        ] }) : null,
        launchState.message ? /* @__PURE__ */ jsx("p", { className: "text-sm text-rose-300", children: launchState.message }) : null
      ] }),
      /* @__PURE__ */ jsx(
        GamesGrid,
        {
          gridDensity,
          games: filteredGames,
          activePlatform: resolvedPlatform,
          launchState,
          editingGameId,
          onEditGame: setEditingGameId,
          onToggleFavorite: (gameId) => {
            setGames(toggleFavorite(gameId));
          },
          onLaunch: (game) => void handleLaunch(game),
          onPlatformOverrideChange: (gameId, nextPlatform) => {
            setGames(setGamePlatformOverride(gameId, nextPlatform));
          },
          onCoreOverrideChange: (gameId, nextCoreId) => {
            setGames(setGameCoreOverride(gameId, nextCoreId));
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: uploadInputRef,
          type: "file",
          multiple: true,
          accept: IMPORTABLE_ROM_EXTENSIONS.join(","),
          className: "hidden",
          onChange: (event) => handleFilesSelected(event.target.files, "upload")
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: folderInputRef,
          type: "file",
          multiple: true,
          className: "hidden",
          onChange: (event) => handleFilesSelected(event.target.files, "folder"),
          ...{ webkitdirectory: "", directory: "" }
        }
      ),
      gameActive && /* @__PURE__ */ jsxs(
        "div",
        {
          ref: gameContainerRef,
          className: "fixed inset-0 z-50",
          tabIndex: -1,
          style: {
            outline: "none",
            top: `-${GAME_OVERLAY_TOP_OVERSCAN}px`,
            height: `calc(100vh + ${GAME_OVERLAY_TOP_OVERSCAN}px)`,
            background: "transparent"
          },
          children: [
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-transparent" }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-center p-3", children: /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto flex items-center gap-3 rounded-full border border-white/20 bg-black/65 px-3 py-2 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.55)]", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `${cardButtonClass} border border-white/30 bg-white/10 text-white hover:bg-white/20`,
                  onClick: () => {
                    stopActiveGame();
                  },
                  children: t("browserExitGame")
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-[0.58rem] uppercase tracking-[0.2em] text-white/70 whitespace-nowrap", children: t("browserExitHint") })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-widest text-white/30", children: [
              t("browserExitHint"),
              " \xB7 ",
              t("browserExit")
            ] })
          ]
        }
      )
    ] });
  }
  function LumioplayHomeOverride({ onNavigate }) {
    return /* @__PURE__ */ jsx(
      LumioplayBrowsePage,
      {
        pageId: "lumioplay-library",
        onNavigate
      }
    );
  }

  // runtime/lumioplay-home-input.ts
  var JOYPAD_BUTTON_COUNT2 = 16;
  var KEYBOARD_TO_JOYPAD2 = {
    KeyZ: 0,
    KeyA: 1,
    ShiftRight: 2,
    Enter: 3,
    ArrowUp: 4,
    ArrowDown: 5,
    ArrowLeft: 6,
    ArrowRight: 7,
    KeyX: 8,
    KeyS: 9,
    KeyQ: 10,
    KeyW: 11
  };
  var sessionActive = false;
  var keyboardState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
  var gamepadState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
  var lastSentState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
  var comboHeld = false;
  var rafId = 0;
  var unlistenLibretroStopped = null;
  function isMappingPressed2(mappingValue, pad) {
    if (!mappingValue) return false;
    if (/^\d+$/.test(mappingValue)) {
      const buttonIndex = Number(mappingValue);
      return Boolean(pad.buttons[buttonIndex]?.pressed);
    }
    const axisMatch = mappingValue.match(/^axis:(\d+):([+-]1)$/);
    if (!axisMatch) return false;
    const axisIndex = Number(axisMatch[1]);
    const direction = axisMatch[2];
    const axisValue = pad.axes[axisIndex] ?? 0;
    return direction === "-1" ? axisValue <= -0.5 : axisValue >= 0.5;
  }
  function mergeInputStates() {
    return Array.from({ length: JOYPAD_BUTTON_COUNT2 }, (_, index) => {
      return Boolean(keyboardState[index] || gamepadState[index]);
    });
  }
  function pushInputState() {
    const merged = mergeInputStates();
    const changed = merged.some((pressed, index) => pressed !== lastSentState[index]);
    if (!changed) return;
    lastSentState = merged;
    void sendLibretroInput([...merged]);
  }
  function resetInputState() {
    keyboardState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    gamepadState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    lastSentState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    void sendLibretroInput(Array(JOYPAD_BUTTON_COUNT2).fill(false));
  }
  function onKeyDown(event) {
    if (!sessionActive) return;
    const mapped = KEYBOARD_TO_JOYPAD2[event.code];
    const shouldHandle = event.code === "Escape" || mapped !== void 0;
    if (!shouldHandle) return;
    event.preventDefault();
    if (event.code === "Escape") {
      void stopHomeInputSession();
      return;
    }
    if (mapped !== void 0 && !keyboardState[mapped]) {
      keyboardState[mapped] = true;
      pushInputState();
    }
  }
  function onKeyUp(event) {
    if (!sessionActive) return;
    const mapped = KEYBOARD_TO_JOYPAD2[event.code];
    if (mapped === void 0) return;
    if (keyboardState[mapped]) {
      keyboardState[mapped] = false;
      pushInputState();
    }
  }
  function onFrame() {
    if (!sessionActive) return;
    const pad = navigator.getGamepads?.().find((entry) => Boolean(entry)) ?? null;
    const mapping = getGamepadMapping();
    const exitCombo = getGamepadExitCombo();
    const nextState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    if (pad) {
      Object.entries(mapping).forEach(([joypadIndexRaw, gamepadButtonRaw]) => {
        const joypadIndex = Number(joypadIndexRaw);
        if (!Number.isFinite(joypadIndex)) return;
        if (joypadIndex < 0 || joypadIndex >= JOYPAD_BUTTON_COUNT2) return;
        nextState[joypadIndex] = isMappingPressed2(String(gamepadButtonRaw), pad);
      });
      const comboPressed = exitCombo.length > 0 && exitCombo.every((buttonIndex) => Boolean(pad.buttons[buttonIndex]?.pressed));
      if (comboPressed && !comboHeld) {
        comboHeld = true;
        void stopHomeInputSession();
        return;
      }
      if (!comboPressed) comboHeld = false;
    }
    gamepadState = nextState;
    pushInputState();
    rafId = window.requestAnimationFrame(onFrame);
  }
  function startHomeInputSession() {
    if (sessionActive) return;
    sessionActive = true;
    comboHeld = false;
    keyboardState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    gamepadState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    lastSentState = Array(JOYPAD_BUTTON_COUNT2).fill(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    rafId = window.requestAnimationFrame(onFrame);
    if (!unlistenLibretroStopped) {
      unlistenLibretroStopped = onLibretroStopped(() => {
        void stopHomeInputSession({ skipStopCommand: true });
      });
    }
  }
  async function stopHomeInputSession(options) {
    if (!sessionActive) return;
    sessionActive = false;
    comboHeld = false;
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    resetInputState();
    if (!options?.skipStopCommand) {
      await stopLibretroGame();
    }
  }

  // runtime/lumioplay-home-row.tsx
  var actionButtonClass = "flex h-9 items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 text-[0.6rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white";
  function sortFavoriteGames(games, lang) {
    return games.filter((game) => game.favorite && !game.missing).slice().sort((left, right) => {
      const leftPlayed = left.lastPlayedAt ?? "";
      const rightPlayed = right.lastPlayedAt ?? "";
      if (leftPlayed !== rightPlayed) return rightPlayed.localeCompare(leftPlayed);
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), lang);
    });
  }
  function LumioplayFavoritesHomeRow({
    onNavigate,
    layout = "slider",
    count = 16,
    sliderCardWidth = "calc((100% - 3 * 0.75rem) / 4)"
  }) {
    const { lang, t } = useLang();
    const [games, setGames] = useState(() => sortFavoriteGames(getStoredGames(), lang));
    const [launchingGameId, setLaunchingGameId] = useState(null);
    const [launchError, setLaunchError] = useState(null);
    useEffect(() => {
      const sync = () => setGames(sortFavoriteGames(getStoredGames(), lang));
      sync();
      const intervalId = window.setInterval(sync, 2500);
      const handleFocus = () => sync();
      const handleVisibility = () => {
        if (document.visibilityState === "visible") sync();
      };
      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibility);
      return () => {
        window.clearInterval(intervalId);
        window.removeEventListener("focus", handleFocus);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    }, [lang]);
    const visibleGames = useMemo(() => games.slice(0, Math.max(1, count)), [games, count]);
    async function handlePlay(game) {
      setLaunchError(null);
      if (!canLaunchLibretro(game) && !canLaunchGame(game)) {
        onNavigate({ pageId: "lumioplay-library" });
        return;
      }
      setLaunchingGameId(game.id);
      try {
        if (canLaunchLibretro(game)) {
          await launchLibretroGameEmbedded(game);
          startHomeInputSession();
        } else {
          await launchGameWithRetroArch(game);
        }
        setGames(sortFavoriteGames(markGameLaunched(game.id), lang));
      } catch (error) {
        const message = error instanceof Error ? error.message : t("launchFailed");
        setLaunchError(message);
        onNavigate({ pageId: "lumioplay-library" });
      } finally {
        setLaunchingGameId(null);
      }
    }
    if (visibleGames.length === 0) return null;
    return /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white", children: t("homeRowFavoritesTitle") }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-slate-400", children: t("homeRowFavoritesSubtitle") })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate({ pageId: "lumioplay-library" }),
            className: actionButtonClass,
            children: [
              t("showAll"),
              /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: getPluginHomeRowTrackClass(layout), children: visibleGames.map((game) => {
        const coverUrl = game.coverUrl ?? game.metadata?.coverUrl ?? null;
        const platformLabel = getPlatformLabel(getEffectivePlatform(game), t);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => void handlePlay(game),
            className: `group cursor-pointer overflow-hidden bg-transparent text-left transition-all duration-300 hover:-translate-y-1 ${layout === "slider" ? "flex-none" : "w-full"}`,
            style: layout === "slider" ? { width: sliderCardWidth } : void 0,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900", children: [
                coverUrl ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: coverUrl,
                    alt: getGameDisplayTitle(game),
                    className: "h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]",
                    loading: "lazy",
                    decoding: "async",
                    draggable: false
                  }
                ) : null,
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
                /* @__PURE__ */ jsxs("div", { className: "absolute left-2 right-2 top-2 flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/[0.08] bg-black/50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm", children: platformLabel }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full border border-accent-400/50 bg-accent-400/10 px-2 py-1 text-[10px] text-accent-300 backdrop-blur-sm", children: "\u2605" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-black/65", children: launchingGameId === game.id ? /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.14em]", children: "..." }) : /* @__PURE__ */ jsx("svg", { className: "ml-0.5 h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" }) }) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2.5", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-[0.22em] text-slate-300/60", children: game.lastPlayedAt ? t("lastPlayed") : t("favorite") }),
                /* @__PURE__ */ jsx("h3", { className: "mt-0.5 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-white", children: getGameDisplayTitle(game) })
              ] })
            ]
          },
          game.id
        );
      }) }),
      launchError ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-300", children: launchError }) : null
    ] });
  }

  // runtime/assets/lumioplay-hero-default.jpg
  var lumioplay_hero_default_default = "data:image/jpeg;base64,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";

  // runtime/lumioplay-hero.tsx
  function pickHeroGame(games, mode, lang) {
    const playable = games.filter((game) => !game.missing);
    if (playable.length === 0) return null;
    if (mode === "random") {
      return playable[Math.floor(Math.random() * playable.length)] ?? playable[0] ?? null;
    }
    const sorted = playable.slice().sort((left, right) => {
      const leftPlayed = left.lastPlayedAt ?? "";
      const rightPlayed = right.lastPlayedAt ?? "";
      if (leftPlayed !== rightPlayed) return rightPlayed.localeCompare(leftPlayed);
      return getGameDisplayTitle(left).localeCompare(getGameDisplayTitle(right), lang);
    });
    return sorted[0] ?? null;
  }
  function pickRandomHeroId(games, excludeGameId) {
    const playable = games.filter((game) => !game.missing && game.id !== excludeGameId);
    if (playable.length === 0) return null;
    return playable[Math.floor(Math.random() * playable.length)]?.id ?? null;
  }
  function truncateSummary(value, maxLength) {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}\u2026`;
  }
  function cleanSummaryText(value) {
    return value.replace(/\s+/g, " ").replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  }
  function stripLikelyFileExtension3(value) {
    return value.replace(/\.[a-z0-9]{1,8}$/i, "");
  }
  function buildWikipediaTitleCandidates(game) {
    const candidates = /* @__PURE__ */ new Set();
    const rawValues = [
      getGameDisplayTitle(game),
      game.title,
      game.metadata?.searchTitle?.split(" ").slice(0, 8).join(" ") ?? "",
      stripLikelyFileExtension3(game.fileName)
    ];
    for (const rawValue of rawValues) {
      const value = rawValue.trim().replace(/\s+/g, " ");
      if (!value) continue;
      candidates.add(`${value} (video game)`);
      candidates.add(value);
      const withoutParens = value.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
      if (withoutParens) {
        candidates.add(`${withoutParens} (video game)`);
        candidates.add(withoutParens);
      }
      const beforeSubtitle = value.replace(/\s*[-:]\s.*$/, "").trim();
      if (beforeSubtitle) {
        candidates.add(`${beforeSubtitle} (video game)`);
        candidates.add(beforeSubtitle);
      }
    }
    return Array.from(candidates);
  }
  async function fetchWikipediaSummaryByTitle(candidate) {
    const encoded = encodeURIComponent(candidate.replace(/\s+/g, " "));
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) return null;
      const payload = await response.json();
      if (payload.type === "disambiguation") return null;
      const extract = typeof payload.extract === "string" ? cleanSummaryText(payload.extract) : "";
      if (extract.length === 0) return null;
      return truncateSummary(extract, 220);
    } catch {
      return null;
    }
  }
  async function fetchWikipediaSummary(game) {
    const candidates = buildWikipediaTitleCandidates(game);
    for (const candidate of candidates) {
      const summary = await fetchWikipediaSummaryByTitle(candidate);
      if (summary) return summary;
    }
    const primaryTitle = getGameDisplayTitle(game).trim() || stripLikelyFileExtension3(game.fileName).trim();
    if (!primaryTitle) return null;
    try {
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=${encodeURIComponent(primaryTitle)}`
      );
      if (!searchResponse.ok) return null;
      const payload = await searchResponse.json();
      const matchedTitle = payload[1]?.[0]?.trim();
      if (!matchedTitle) return null;
      return await fetchWikipediaSummaryByTitle(matchedTitle);
    } catch {
      return null;
    }
  }
  function LumioplayHero({ onNavigate, onActiveChange, onBackdropChange }) {
    const { lang, t } = useLang();
    const [games, setGames] = useState(() => getStoredGames());
    const [launching, setLaunching] = useState(false);
    const [launchError, setLaunchError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [heroEnabled, setHeroEnabledFlag] = useState(() => getHeroEnabled());
    const [randomHeroId, setRandomHeroId] = useState(null);
    const mode = getHeroMode();
    useEffect(() => {
      const sync = () => {
        setGames(getStoredGames());
        setHeroEnabledFlag(getHeroEnabled());
      };
      sync();
      const intervalId = window.setInterval(sync, 3e3);
      const onFocus = () => sync();
      const onVisibility = () => {
        if (document.visibilityState === "visible") sync();
      };
      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        window.clearInterval(intervalId);
        window.removeEventListener("focus", onFocus);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, []);
    useEffect(() => {
      if (!heroEnabled || mode !== "random") {
        setRandomHeroId(null);
        return;
      }
      const nextRandomHeroId = pickRandomHeroId(games);
      if (!nextRandomHeroId) {
        setRandomHeroId(null);
        return;
      }
      const currentStillPlayable = games.some((game) => !game.missing && game.id === randomHeroId);
      if (currentStillPlayable) return;
      setRandomHeroId(nextRandomHeroId);
    }, [games, heroEnabled, mode, randomHeroId]);
    const heroGame = useMemo(() => {
      if (!heroEnabled) return null;
      if (mode === "random") return games.find((game) => game.id === randomHeroId && !game.missing) ?? null;
      return pickHeroGame(games, mode, lang);
    }, [games, heroEnabled, lang, mode, randomHeroId]);
    useEffect(() => {
      let cancelled = false;
      if (!heroGame) {
        setSummary(null);
        return;
      }
      setSummary(null);
      void fetchWikipediaSummary(heroGame).then((nextSummary) => {
        if (cancelled) return;
        setSummary(nextSummary);
      });
      return () => {
        cancelled = true;
      };
    }, [heroGame?.id]);
    useEffect(() => {
      const active = Boolean(heroGame);
      onActiveChange(active);
      onBackdropChange(active ? lumioplay_hero_default_default : null);
      return () => {
        onActiveChange(false);
        onBackdropChange(null);
      };
    }, [heroGame, onActiveChange, onBackdropChange]);
    async function handlePlay() {
      if (!heroGame) return;
      setLaunchError(null);
      setLaunching(true);
      try {
        if (canLaunchLibretro(heroGame)) {
          await launchLibretroGameEmbedded(heroGame);
          startHomeInputSession();
        } else if (canLaunchGame(heroGame)) {
          await launchGameWithRetroArch(heroGame);
        } else {
          onNavigate({ pageId: "lumioplay-library" });
          return;
        }
        const updated = markGameLaunched(heroGame.id);
        setGames(updated);
        if (mode === "random") {
          setRandomHeroId(pickRandomHeroId(updated, heroGame.id));
        }
      } catch (error) {
        setLaunchError(error instanceof Error ? error.message : t("launchFailed"));
        onNavigate({ pageId: "lumioplay-library" });
      } finally {
        setLaunching(false);
      }
    }
    if (!heroGame) return null;
    const title = getGameDisplayTitle(heroGame);
    const platform = getPlatformLabel(getEffectivePlatform(heroGame), t);
    const coverUrl = heroGame.coverUrl ?? heroGame.metadata?.coverUrl ?? null;
    const releaseYear = heroGame.metadata?.releaseYear ?? null;
    const region = getRegionLabel(heroGame.metadata?.region, t);
    const playCount = heroGame.playCount ?? 0;
    const coverShellStyle = {
      width: "233px",
      borderRadius: "16px"
    };
    return /* @__PURE__ */ jsx("section", { className: "py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0 overflow-hidden bg-slate-900/35", style: coverShellStyle, children: coverUrl ? /* @__PURE__ */ jsx("img", { src: coverUrl, alt: title, className: "aspect-[2/3] w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "aspect-[2/3] w-full bg-gradient-to-br from-slate-800 to-slate-950" }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.24em] text-slate-400", children: "Lumioplay Hero" }),
        /* @__PURE__ */ jsx("h2", { className: "text-[1.95rem] font-semibold leading-tight text-white", children: title }),
        /* @__PURE__ */ jsx("p", { className: "max-w-[62ch] text-[1rem] leading-8 text-slate-300", children: summary ?? (mode === "random" ? t("heroRandomSubtitle") : t("heroLastPlayedSubtitle")) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200", children: platform }),
          releaseYear ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300", children: releaseYear }) : null,
          region ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300", children: region }) : null,
          playCount > 0 ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300", children: t("heroPlayCount").replace("{count}", String(playCount)) }) : null,
          heroGame.lastPlayedAt ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300", children: t("lastPlayed") }) : null
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => void handlePlay(),
            disabled: launching,
            className: "rounded-full border border-accent-400/40 bg-accent-500/90 px-6 py-2.5 text-[0.6rem] font-normal uppercase tracking-[0.2em] text-white transition hover:bg-accent-500 disabled:opacity-60",
            children: launching ? t("starting") : t("heroPlayNow")
          }
        ) }),
        launchError ? /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-300", children: launchError }) : null
      ] })
    ] }) });
  }

  // runtime-host/lib/home-override-settings.ts
  var KEY = "custom_home_override_plugin";
  var EVENT = "lumio-home-override-changed";
  function emitChanged() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(EVENT));
  }
  function getHomeOverridePluginId() {
    if (typeof window === "undefined") return null;
    const value = getScopedStorageItem(KEY)?.trim() ?? "";
    return value || null;
  }
  function setHomeOverridePluginId(pluginId) {
    const normalized = pluginId.trim();
    if (!normalized) return;
    setScopedStorageItem(KEY, normalized);
    emitChanged();
  }
  function clearHomeOverridePluginId() {
    setScopedStorageItem(KEY, "");
    emitChanged();
  }
  function disableHomeOverridePlugin(pluginId) {
    if (getHomeOverridePluginId() !== pluginId) return;
    clearHomeOverridePluginId();
  }
  function tryEnableHomeOverridePlugin(pluginId) {
    const normalized = pluginId.trim();
    if (!normalized) return { ok: true };
    const current = getHomeOverridePluginId();
    if (current && current !== normalized) {
      return { ok: false, activePluginId: current };
    }
    setHomeOverridePluginId(normalized);
    return { ok: true };
  }
  function onHomeOverridePluginChanged(listener) {
    if (typeof window === "undefined") return () => {
    };
    const wrapped = () => listener();
    window.addEventListener(EVENT, wrapped);
    return () => window.removeEventListener(EVENT, wrapped);
  }

  // runtime/lumioplay-settings-section.tsx
  var pillClass = "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white";
  var activePillClass2 = "rounded-full border border-accent-400/50 bg-accent-400/10 px-4 py-2 text-[0.65rem] font-normal uppercase tracking-[0.2em] text-accent-300 transition-all";
  var HOME_OVERRIDE_PLUGIN_ID = "com.lumio.lumioplay";
  var CORES_PATH_PLACEHOLDER = "/Applications/RetroArch.app/Contents/Resources/cores";
  var ROM_FOLDERS_PLACEHOLDER = "/Users/username/Games/ROMs/NES\n/Users/username/Games/ROMs/SNES";
  function CollapsibleSettingsCard({
    title,
    description,
    open,
    onToggle,
    children
  }) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-slate-900/60 p-4", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: onToggle,
          className: "flex w-full items-start justify-between gap-4 text-left",
          "aria-expanded": open,
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: title }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-400", children: description })
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition ${open ? "rotate-180" : ""}`,
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) })
              }
            )
          ]
        }
      ),
      open ? /* @__PURE__ */ jsx("div", { className: "mt-4", children }) : null
    ] });
  }
  function LumioplaySettingsSection() {
    const { t } = useLang();
    const [retroArchCoresPath, setRetroArchCoresPathState] = useState(() => getRetroArchCoresPath());
    const [romFoldersText, setRomFoldersText] = useState(() => getRomFolders().join("\n"));
    const [autoSyncEnabled, setAutoSyncEnabledState] = useState(() => getAutoSyncEnabled());
    const [autoSyncIntervalSeconds, setAutoSyncIntervalSecondsState] = useState(() => getAutoSyncIntervalSeconds());
    const [heroEnabled, setHeroEnabledState] = useState(() => getHeroEnabled());
    const [heroMode, setHeroModeState] = useState(() => getHeroMode());
    const [gamepadMapping, setGamepadMappingState] = useState(() => getGamepadMapping());
    const [exitComboText, setExitComboText] = useState(() => getGamepadExitCombo().join(", "));
    const [learningBinding, setLearningBinding] = useState(null);
    const [saved, setSaved] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [homeOverrideEnabled, setHomeOverrideEnabled] = useState(false);
    const [homeOverrideError, setHomeOverrideError] = useState(null);
    const [autoSyncExpanded, setAutoSyncExpanded] = useState(false);
    const [gamepadExpanded, setGamepadExpanded] = useState(false);
    function describeBinding(bindingIndex) {
      const binding = LUMIOPLAY_JOYPAD_BINDINGS.find((entry) => entry.index === bindingIndex);
      return binding ? getJoypadBindingLabel(binding, t) : String(bindingIndex);
    }
    useEffect(() => {
      if (learningBinding === null) return;
      let rafId2 = 0;
      let cancelled = false;
      const onFrame2 = () => {
        if (cancelled) return;
        const pad = navigator.getGamepads?.().find((entry) => Boolean(entry)) ?? null;
        if (pad) {
          const pressedIndex = pad.buttons.findIndex((button) => Boolean(button?.pressed));
          if (pressedIndex >= 0) {
            setGamepadMappingState((current) => ({ ...current, [learningBinding]: String(pressedIndex) }));
            setLearningBinding(null);
            setStatusMessage(
              t("settingsMappedToIndex").replace("{button}", describeBinding(learningBinding)).replace("{index}", String(pressedIndex))
            );
            return;
          }
          const axisIndex = pad.axes.findIndex((axis) => Math.abs(axis ?? 0) > 0.5);
          if (axisIndex >= 0) {
            const axisValue = pad.axes[axisIndex] ?? 0;
            const direction = axisValue < 0 ? "-1" : "+1";
            const mappingValue = `axis:${axisIndex}:${direction}`;
            setGamepadMappingState((current) => ({ ...current, [learningBinding]: mappingValue }));
            setLearningBinding(null);
            setStatusMessage(
              t("settingsMappedToValue").replace("{button}", describeBinding(learningBinding)).replace("{value}", mappingValue)
            );
            return;
          }
        }
        rafId2 = window.requestAnimationFrame(onFrame2);
      };
      rafId2 = window.requestAnimationFrame(onFrame2);
      return () => {
        cancelled = true;
        if (rafId2) window.cancelAnimationFrame(rafId2);
      };
    }, [learningBinding]);
    useEffect(() => {
      const sync = () => {
        setHomeOverrideEnabled(getHomeOverridePluginId() === HOME_OVERRIDE_PLUGIN_ID);
        setHomeOverrideError(null);
      };
      sync();
      return onHomeOverridePluginChanged(sync);
    }, []);
    function handleSave() {
      const parsedExitCombo = exitComboText.split(",").map((value) => Number(value.trim())).filter((value) => Number.isFinite(value) && value >= 0).map((value) => Math.floor(value));
      setRetroArchCoresPath(retroArchCoresPath.trim());
      setRomFolders(
        romFoldersText.split("\n").map((value) => value.trim()).filter(Boolean)
      );
      setAutoSyncEnabled(autoSyncEnabled);
      setAutoSyncIntervalSeconds(autoSyncIntervalSeconds);
      setHeroEnabled(heroEnabled);
      setHeroMode(heroMode);
      setGamepadMapping(gamepadMapping);
      setGamepadExitCombo(parsedExitCombo);
      setSaved(true);
      setStatusMessage(t("settingsSaved"));
      window.setTimeout(() => setSaved(false), 1800);
    }
    async function handlePickCoresFolder() {
      try {
        const picked = await pickPluginFolder();
        if (!picked) return;
        setRetroArchCoresPathState(picked);
        setStatusMessage(t("settingsCoresFolderUpdated"));
      } catch (error) {
        const message = error instanceof Error ? error.message : t("settingsPickFolderFailed");
        setStatusMessage(message);
      }
    }
    function handleHomeOverrideToggle(checked) {
      setHomeOverrideError(null);
      if (!checked) {
        disableHomeOverridePlugin(HOME_OVERRIDE_PLUGIN_ID);
        return;
      }
      const result = tryEnableHomeOverridePlugin(HOME_OVERRIDE_PLUGIN_ID);
      if (!result.ok) {
        setHomeOverrideError(t("settingsHomeOverrideConflict"));
      }
    }
    return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] uppercase tracking-[0.22em] text-slate-500", children: "Libretro" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-white", children: "Lumioplay" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-slate-400", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-slate-300", children: t("settingsWhatIsNeeded") }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            t("settingsIntroLead"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: t("settingsIntroCoresFolder") }),
            "."
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            t("settingsCoresAvailableAt"),
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://buildbot.libretro.com/stable/",
                target: "_blank",
                rel: "noreferrer",
                className: "text-accent-400 underline underline-offset-2 hover:text-accent-300",
                children: "buildbot.libretro.com"
              }
            ),
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-slate-900/60 p-4", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm text-slate-200", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: homeOverrideEnabled,
              onChange: (event) => handleHomeOverrideToggle(event.target.checked),
              className: "h-4 w-4 accent-accent-400"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: t("settingsUseAsHome") })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500", children: t("settingsUseAsHomeDesc") }),
        homeOverrideError ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-300", children: homeOverrideError }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: t("settingsCoresFolderLabel") }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: retroArchCoresPath,
              onChange: (event) => setRetroArchCoresPathState(event.target.value),
              placeholder: CORES_PATH_PLACEHOLDER,
              className: "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
            }
          ),
          isPluginDesktopHost() ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => void handlePickCoresFolder(),
              className: pillClass,
              children: t("settingsChoose")
            }
          ) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: t("settingsRomFoldersLabel") }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: romFoldersText,
            onChange: (event) => setRomFoldersText(event.target.value),
            placeholder: ROM_FOLDERS_PLACEHOLDER,
            rows: 6,
            className: "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        CollapsibleSettingsCard,
        {
          title: t("settingsAutoSyncTitle"),
          description: t("settingsAutoSyncDesc"),
          open: autoSyncExpanded,
          onToggle: () => setAutoSyncExpanded((value) => !value),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: t("settingsStatus") }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-300", children: autoSyncEnabled ? t("settingsEnabled") : t("settingsDisabled") })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setAutoSyncEnabledState((value) => !value),
                  className: autoSyncEnabled ? activePillClass2 : pillClass,
                  children: autoSyncEnabled ? t("settingsOn") : t("settingsOff")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 max-w-xs space-y-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: t("settingsSyncIntervalLabel") }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: 15,
                  max: 300,
                  step: 15,
                  value: autoSyncIntervalSeconds,
                  onChange: (event) => setAutoSyncIntervalSecondsState(Number(event.target.value)),
                  className: "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-accent-400/30"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-slate-900/60 p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: "Lumioplay Hero" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-400", children: t("settingsHeroDesc") })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: heroEnabled,
                onChange: (event) => setHeroEnabledState(event.target.checked),
                className: "h-4 w-4 accent-accent-400"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.16em] text-slate-300", children: t("settingsEnable") })
          ] })
        ] }),
        heroEnabled ? /* @__PURE__ */ jsxs("div", { className: "mt-4 max-w-sm space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: t("settingsHeroMode") }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: heroMode,
              onChange: (event) => setHeroModeState(event.target.value === "random" ? "random" : "last_played"),
              className: "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-accent-400/30",
              children: [
                /* @__PURE__ */ jsx("option", { value: "last_played", children: t("lastPlayed") }),
                /* @__PURE__ */ jsx("option", { value: "random", children: t("settingsHeroModeRandom") })
              ]
            }
          )
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxs(
        CollapsibleSettingsCard,
        {
          title: t("settingsGamepadTitle"),
          description: t("settingsGamepadDesc"),
          open: gamepadExpanded,
          onToggle: () => setGamepadExpanded((value) => !value),
          children: [
            /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: LUMIOPLAY_JOYPAD_BINDINGS.map((binding) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-2 text-xs uppercase tracking-[0.16em] text-slate-300", children: getJoypadBindingLabel(binding, t) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: gamepadMapping[binding.index] ?? "0",
                        onChange: (event) => {
                          const value = event.target.value.trim();
                          setGamepadMappingState((current) => ({
                            ...current,
                            [binding.index]: value || "0"
                          }));
                        },
                        placeholder: t("settingsMappingPlaceholder"),
                        className: "h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-accent-400/30"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setLearningBinding((current) => current === binding.index ? null : binding.index),
                        className: `${learningBinding === binding.index ? activePillClass2 : pillClass} h-10 shrink-0 px-4 text-[0.6rem]`,
                        children: learningBinding === binding.index ? t("settingsPressButton") : t("settingsLearn")
                      }
                    )
                  ] })
                ]
              },
              binding.index
            )) }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: t("settingsLearnHint").replace("{action}", t("settingsLearn")) }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs uppercase tracking-[0.16em] text-slate-500", children: t("settingsExitComboLabel") }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: exitComboText,
                  onChange: (event) => setExitComboText(event.target.value),
                  placeholder: "8, 9",
                  className: "h-11 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400/30"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: t("settingsExitComboHint") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleSave,
            className: activePillClass2,
            children: t("settingsSave")
          }
        ),
        saved ? /* @__PURE__ */ jsx("span", { className: "text-xs text-emerald-400", children: t("settingsSavedBadge") }) : null
      ] }),
      statusMessage ? /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-300", children: statusMessage }) : null
    ] });
  }

  // runtime/index.tsx
  var LumioplayPlugin = {
    id: "com.lumio.lumioplay",
    name: { en: "Lumioplay", sv: "Lumioplay" },
    version: "0.4.27",
    description: {
      en: "Browse local ROMs and launch retro games directly inside Lumio via embedded libretro.",
      sv: "Bladdra bland lokala ROMs och starta retrospel direkt i Lumio via inb\xE4ddad libretro."
    },
    preinstalled: false,
    visibility: {
      hideOnLanClient: true
    },
    register(ctx) {
      ctx.registerSettingsSection({
        id: "lumioplay",
        label: { en: "Lumioplay", sv: "Lumioplay" },
        Section: LumioplaySettingsSection
      });
      ctx.registerBrowsePage({
        id: "lumioplay-library",
        label: { en: "Games", sv: "Spel" },
        Page: LumioplayBrowsePage
      });
      ctx.registerHomeOverride({
        id: "lumioplay-home",
        label: { en: "Lumioplay", sv: "Lumioplay" },
        View: LumioplayHomeOverride
      });
      ctx.registerMainMenuItem({
        id: "lumioplay",
        label: { en: "Lumioplay", sv: "Lumioplay" },
        defaultEnabled: true,
        target: { pageId: "lumioplay-library" }
      });
      ctx.registerHomeRow({
        id: "lumioplay-favorites-row",
        title: { en: "Lumioplay favorites", sv: "Lumioplay favoriter" },
        showOnHome: false,
        Row: (props) => /* @__PURE__ */ jsx(LumioplayFavoritesHomeRow, { ...props })
      });
      ctx.registerHomeSource({
        id: "lumioplay-favorites",
        label: { en: "Lumioplay favorites", sv: "Lumioplay favoriter" },
        rowId: "lumioplay-favorites-row"
      });
      ctx.registerHero({
        id: "lumioplay-hero",
        Hero: LumioplayHero,
        blocksNativeHero: true
      });
    }
  };

  // ../../../../private/var/folders/lc/1hd2j0b57z10tx5mflylq4r80000gp/T/lumioplay-build-PJrV59/wrapper-entry.ts
  var plugin = Reflect.get(runtime_exports, "default") ?? Reflect.get(runtime_exports, "LumioplayPlugin") ?? Object.values(runtime_exports).find((value) => value && typeof value === "object" && "id" in value && "register" in value);
  if (!plugin) {
    throw new Error("Could not find Lumioplay plugin export in bundle.");
  }
  globalThis.__lumioPluginRuntimeBundle = plugin;
})();
