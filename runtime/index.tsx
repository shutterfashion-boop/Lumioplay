import type { LumioPlugin } from '@/lib/plugin-sdk'
import { LumioplayBrowsePage } from './lumioplay-browser'
import { LumioplayFavoritesHomeRow } from './lumioplay-home-row'
import { LumioplayHero } from './lumioplay-hero'
import { LumioplaySettingsSection } from './lumioplay-settings-section'

export const LumioplayPlugin: LumioPlugin = {
  id: 'com.lumio.lumioplay',
  name: { en: 'Lumioplay', sv: 'Lumioplay' },
  version: '0.3.37',
  description: {
    en: 'Browse local ROMs and launch retro games directly inside Lumio via embedded libretro.',
    sv: 'Bladdra bland lokala ROMs och starta retrospel direkt i Lumio via inbäddad libretro.',
  },
  preinstalled: false,

  register(ctx) {
    ctx.registerSettingsSection({
      id: 'lumioplay',
      label: { en: 'Lumioplay', sv: 'Lumioplay' },
      Section: LumioplaySettingsSection,
    })

    ctx.registerBrowsePage({
      id: 'lumioplay-library',
      label: { en: 'Games', sv: 'Spel' },
      Page: LumioplayBrowsePage,
    })

    ctx.registerMainMenuItem({
      id: 'lumioplay',
      label: { en: 'Lumioplay', sv: 'Lumioplay' },
      defaultEnabled: true,
      target: { pageId: 'lumioplay-library' },
    })

    ctx.registerHomeRow({
      id: 'lumioplay-favorites-row',
      title: { en: 'Lumioplay favorites', sv: 'Lumioplay favoriter' },
      showOnHome: false,
      Row: (props) => <LumioplayFavoritesHomeRow {...props} />,
    })

    ctx.registerHomeSource({
      id: 'lumioplay-favorites',
      label: { en: 'Lumioplay favorites', sv: 'Lumioplay favoriter' },
      rowId: 'lumioplay-favorites-row',
    })

    ctx.registerHero({
      id: 'lumioplay-hero',
      Hero: LumioplayHero,
    })
  },
}
