import { describe, it, expect, vi } from 'vitest';
import { createHighlightBox } from './highlight-box';

describe('createHighlightBox', () => {
  it('positions the box over the target rect on show', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const target = document.createElement('button');
    document.body.append(target);
    target.getBoundingClientRect = vi.fn(() => ({
      top: 10,
      left: 20,
      width: 100,
      height: 30,
      right: 120,
      bottom: 40,
      x: 20,
      y: 10,
      toJSON: () => {},
    })) as any;

    const hl = createHighlightBox(root);
    hl.show(target);

    const box = root.querySelector('.a11y-ally-highlight') as HTMLElement;
    expect(box.style.display).toBe('block');
    expect(box.style.top).toBe('10px');
    expect(box.style.left).toBe('20px');
    expect(box.style.width).toBe('100px');
    expect(box.style.height).toBe('30px');
  });

  it('hides the box', () => {
    const root = document.createElement('div');
    const hl = createHighlightBox(root);
    hl.hide();
    const box = root.querySelector('.a11y-ally-highlight') as HTMLElement;
    expect(box.style.display).toBe('none');
  });
});
