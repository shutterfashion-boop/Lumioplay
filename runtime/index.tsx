import type { LumioPlugin } from '@/lib/plugin-sdk'
import { LumioplayBrowsePage, LumioplayHomeRow } from './lumioplay-browser'
import { LumioplaySettingsSection } from './lumioplay-settings-section'

export const LumioplayPlugin: LumioPlugin = {
  id: 'com.lumio.lumioplay',
  name: { en: 'Lumioplay', sv: 'Lumioplay' },
  version: '0.1.0',
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

    const entry = {
      id: 'lumioplay',
      label: { en: 'Lumioplay', sv: 'Lumioplay' },
      defaultEnabled: true,
      target: { pageId: 'lumioplay-library' },
    }

    ctx.registerMainMenuItem(entry)
    ctx.registerTopbarItem(entry)

    ctx.registerHomeRow({
      id: 'lumioplay-recent-row',
      title: { en: 'Recently played', sv: 'Senast spelade' },
      showOnHome: false,
      Row: (props) => <LumioplayHomeRow {...props} />,
    })

    ctx.registerHomeSource({
      id: 'lumioplay-recent',
      label: { en: 'Recently played', sv: 'Senast spelade' },
      rowId: 'lumioplay-recent-row',
    })
  },
}

