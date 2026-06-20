import axe, { type AxeResults, type ElementContext } from 'axe-core';
import type { Finding, ReportModel, Severity } from './types';

const SEVERITY_ORDER: Severity[] = ['critical', 'serious', 'moderate', 'minor'];

export function toReportModel(results: AxeResults): ReportModel {
  const summary = { critical: 0, serious: 0, moderate: 0, minor: 0, passes: results.passes.length };

  const findings: Finding[] = results.violations.map((v) => {
    const impact = (v.impact ?? 'minor') as Severity;
    summary[impact] += 1;
    return {
      ruleId: v.id,
      impact,
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map((n) => ({ selector: n.target.join(' '), html: n.html })),
    };
  });

  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.impact) - SEVERITY_ORDER.indexOf(b.impact));
  return { summary, findings };
}

export async function runAudit(context: ElementContext = document): Promise<ReportModel> {
  const results = await axe.run(context);
  return toReportModel(results);
}
