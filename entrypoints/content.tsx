import '../src/ui/overlay/overlay.css'; // injected into shadow root via cssInjectionMode: 'ui'
import ReactDOM from 'react-dom/client';
import { Overlay } from '../src/ui/overlay/Overlay';
import { buildReadingList } from '../src/core/a11y-tree/build-reading-list';
import { createWebSpeechEngine } from '../src/core/speech/web-speech-engine';
import { createPlayer } from '../src/core/player/player';
import { announce } from '../src/core/announcer/announce';
import { createHighlightBox } from '../src/ui/highlight/highlight-box';
import { onMessage } from '../src/messaging';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let mounted = false;
    let ui: Awaited<ReturnType<typeof createShadowRootUi>> | null = null;

    const mount = async () => {
      const { nodes, elements } = buildReadingList(document.body);
      const engine = createWebSpeechEngine();
      const player = createPlayer({ nodes, engine, announce });

      ui = await createShadowRootUi(ctx, {
        name: 'a11y-ally-overlay',
        position: 'inline',
        anchor: 'body',
        onMount: (container) => {
          const host = document.createElement('div');
          container.append(host);
          const highlight = createHighlightBox(document.body);
          const root = ReactDOM.createRoot(host);
          root.render(
            <Overlay
              player={player}
              nodes={nodes}
              onCurrentChange={(node) => {
                const el = node ? elements.get(node.id) : undefined;
                if (el) highlight.show(el);
                else highlight.hide();
              }}
            />,
          );
          return { root, highlight, engine };
        },
        onRemove: (mountState) => {
          mountState?.engine.cancel();
          mountState?.highlight.destroy();
          mountState?.root.unmount();
        },
      });
      ui.mount();
      mounted = true;
    };

    onMessage('toggleOverlay', async () => {
      if (mounted && ui) {
        ui.remove();
        ui = null;
        mounted = false;
      } else {
        await mount();
      }
    });
  },
});
