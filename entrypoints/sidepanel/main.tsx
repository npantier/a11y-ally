import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Report } from '../../src/ui/sidepanel/Report';
import type { ReportModel } from '../../src/core/audit/types';
import { sendMessage } from '../../src/messaging';
import '../../src/ui/sidepanel/report.css';

function App() {
  const [model, setModel] = useState<ReportModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      const report = await sendMessage('runAudit', undefined, tab!.id);
      setModel(report);
    } catch {
      setError('Could not audit this tab. Reload the page and try again.');
    }
  };

  const select = async (selector: string) => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    await sendMessage('highlightSelector', selector, tab!.id);
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
