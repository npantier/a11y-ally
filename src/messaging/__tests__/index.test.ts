import { describe, it, expect, vi } from 'vitest';
import { onMessage, sendMessage } from '../index';

describe('messaging protocol', () => {
  it('round-trips a typed runAudit message', async () => {
    const handler = vi.fn(async () => ({
      summary: { critical: 0, serious: 0, moderate: 0, minor: 0, passes: 1 },
      findings: [],
    }));
    onMessage('runAudit', handler);
    const result = await sendMessage('runAudit', undefined);
    expect(handler).toHaveBeenCalled();
    expect(result.summary.passes).toBe(1);
  });
});
