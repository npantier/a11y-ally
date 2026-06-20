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
            try {
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
            } catch (err) {
              // onRemove only unwinds the state we return below, so if render
              // throws we must destroy the highlight box (its window listeners)
              // and the React root here before rethrowing — else they orphan.
              highlight.destroy();
              root.unmount();
              throw err;
            }
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
      } catch (err) {
        // Tear the partial mount down through WXT's remove() so onRemove
        // unwinds it, then drop the handle and reset state — otherwise the next
        // toolbar click re-mounts and stacks an orphaned shadow root each time.
        console.error('[a11y-ally] overlay mount failed', err);
        try {
          ui?.remove();
        } catch (cleanupErr) {
          console.error('[a11y-ally] overlay cleanup after failed mount failed', cleanupErr);
        }
        ui = null;
        mounted = false;
      } finally {
        mounting = false;
      }
    };

    onMessage('toggleOverlay', async () => {
      if (mounting) return;
      if (mounted && ui) {
        try {
          ui.remove();
        } catch (err) {
          console.error('[a11y-ally] overlay teardown failed', err);
        }
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
