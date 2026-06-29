import type { Preview } from '@storybook/react-vite';

// The components rely on these stylesheets, which the extension injects into the
// Shadow DOM at runtime. Import them globally so stories render styled.
import '../src/ui/overlay/overlay.css';
import '../src/ui/sidepanel/report.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
