import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'a11y-ally',
    description: 'Screen-reader simulator and accessibility audit.',
    // WXT auto-adds "sidepanel" when entrypoints/sidepanel exists,
    // and "scripting"/"tabs" in dev. activeTab covers messaging to the active tab.
    permissions: ['activeTab'],
  },
});
