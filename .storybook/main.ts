import type { StorybookConfig } from '@storybook/react-vite';

// WXT owns the extension build; Storybook runs the plain React UI components in
// isolation via its own Vite builder (no project vite.config needed). The repo's
// pinned @vitejs/plugin-react override (pnpm-workspace.yaml) applies here too.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
