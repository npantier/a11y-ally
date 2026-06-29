import type { StorybookConfig } from '@storybook/react-vite';

// WXT owns the extension build; Storybook runs the plain React UI components in
// isolation via its own Vite builder (no project vite.config needed). The repo's
// pinned @vitejs/plugin-react override (pnpm-workspace.yaml) applies here too.
const config: StorybookConfig = {
  // Stories live in __stories__/ folders next to the component (mirrors __tests__/).
  // The glob only loads from there, so a misplaced colocated story won't silently appear.
  stories: ['../src/**/__stories__/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
