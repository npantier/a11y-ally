import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Report } from '../../src/ui/sidepanel/Report';
import type { ReportModel } from '../../src/core/audit/types';
import { sendMessage } from '../../src/messaging';
import '../../src/ui/sidepanel/report.css';

// @webext-core/messaging rejects with a connection error when the target tab has
// no content script (browser-internal / restricted pages). Reloading won't help
// there, so we steer the user differently from a generic audit failure.
const isNoReceiver = (err: unknown): boolean =>
  err instanceof Error &&
  /receiving end|no response|could not establish connection/i.test(err.message);

function App() {
  const [model, setModel] = useState<ReportModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setError('No active tab to act on.');
        return;
      }
      const report = await sendMessage('runAudit', undefined, tab.id);
      setModel(report);
    } catch (err) {
      // Most often a restricted page (chrome://, the Web Store, PDF viewer) with
      // no content script to receive the message, but any audit failure lands
      // here — log the real cause since the user message is intentionally generic.
      console.error('[a11y-ally] audit failed', err);
      setError(
        isNoReceiver(err)
          ? 'This page cannot be audited (a browser-internal or restricted page). Open a normal website tab and try again.'
          : 'Could not audit this tab. Reload the page and try again.',
      );
    }
  };

  const select = async (selector: string) => {
    setError(null);
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setError('No active tab to act on.');
        return;
      }
      await sendMessage('highlightSelector', selector, tab.id);
    } catch (err) {
      console.error('[a11y-ally] highlight failed', err);
      setError('Could not highlight this element on this page.');
    }
  };

  return (
    <main className="aa-panel">
      <button type="button" onClick={run}>Run audit</button>
      {error && <p className="aa-error">{error}</p>}
      {model && <Report model={model} onSelectFinding={select} />}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
