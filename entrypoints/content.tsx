import '../src/ui/overlay/overlay.css'; // injected into shadow root via cssInjectionMode: 'ui'
import ReactDOM from 'react-dom/client';
import { Overlay } from '../src/ui/overlay/Overlay';
import { buildReadingList } from '../src/core/a11y-tree/build-reading-list';
import { createWebSpeechEngine } from '../src/core/speech/web-speech-engine';
import { createPlayer } from '../src/core/player/player';
import { announce } from '../src/core/announcer/announce';
import { createHighlightBox } from '../src/ui/highlight/highlight-box';
import { onMessage } from '../src/messaging';
import { runAudit } from '../src/core/audit/run-audit';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let mounted = false;
    let mounting = false;
    let ui: Awaited<ReturnType<typeof createShadowRootUi>> | null = null;

    const mount = async () => {
      if (mounting) return;
      mounting = true;
      try {
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
      } finally {
        mounting = false;
      }
    };

    onMessage('toggleOverlay', async () => {
      if (mounting) return;
      if (mounted && ui) {
        ui.remove();
        ui = null;
        mounted = false;
      } else {
        await mount();
      }
    });

    const pageHighlight = createHighlightBox(document.documentElement);

    onMessage('runAudit', async () => runAudit(document));

    onMessage('highlightSelector', ({ data: selector }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pageHighlight.show(el);
    });
  },
});
