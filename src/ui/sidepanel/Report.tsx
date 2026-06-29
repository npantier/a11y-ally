import type { Finding, ReportModel, Severity } from '../../core/audit/types';

const ORDER: Severity[] = ['critical', 'serious', 'moderate', 'minor'];

export function Report({
  model,
  onSelectFinding,
}: {
  model: ReportModel;
  onSelectFinding: (selector: string) => void;
}) {
  const { summary } = model;
  return (
    <div className="aa-report">
      <p className="aa-summary">
        <strong>{summary.passes} passing</strong> · {summary.critical} critical · {summary.serious}{' '}
        serious · {summary.moderate} moderate · {summary.minor} minor
      </p>
      {ORDER.map((severity) => {
        const group = model.findings.filter((f) => f.impact === severity);
        if (group.length === 0) return null;
        return (
          <section key={severity} className={`aa-group aa-${severity}`}>
            <h2>
              {severity} ({group.length})
            </h2>
            {group.map((f) => (
              <FindingRow key={f.ruleId} finding={f} onSelect={onSelectFinding} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

function FindingRow({ finding, onSelect }: { finding: Finding; onSelect: (s: string) => void }) {
  return (
    <details className="aa-finding">
      <summary>{finding.description}</summary>
      <a href={finding.helpUrl} target="_blank" rel="noreferrer">
        How to fix
      </a>
      <ul>
        {finding.nodes.map((n, i) => (
          <li key={i}>
            <button type="button" onClick={() => onSelect(n.selector)}>
              {n.selector}
            </button>
            <code>{n.html}</code>
          </li>
        ))}
      </ul>
    </details>
  );
}
