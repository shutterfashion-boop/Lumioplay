import type { LumioPlugin } from '@/lib/plugin-sdk'
import { LumioplayBrowsePage } from './lumioplay-browser'
import { LumioplaySettingsSection } from './lumioplay-settings-section'

export const LumioplayPlugin: LumioPlugin = {
  id: 'com.lumio.lumioplay',
  name: { en: 'Lumioplay', sv: 'Lumioplay' },
  version: '0.2.2',
  description: {
    en: 'Browse local ROMs and launch retro games through RetroArch.',
    sv: 'Bladdra bland lokala ROMs och starta retrospel via RetroArch.',
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
  },
}
