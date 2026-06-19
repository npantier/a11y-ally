export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export interface FindingNode {
  selector: string;
  html: string;
}

export interface Finding {
  ruleId: string;
  impact: Severity;
  description: string;
  helpUrl: string;
  nodes: FindingNode[];
}

export interface ReportModel {
  summary: { critical: number; serious: number; moderate: number; minor: number; passes: number };
  findings: Finding[];
}
