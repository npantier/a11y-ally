export interface HighlightBox {
  show(el: Element): void;
  hide(): void;
  reposition(): void;
  destroy(): void;
}

export function createHighlightBox(root: HTMLElement): HighlightBox {
  const box = document.createElement('div');
  box.className = 'a11y-ally-highlight';
  Object.assign(box.style, {
    position: 'fixed',
    display: 'none',
    pointerEvents: 'none',
    zIndex: '2147483646',
    border: '3px solid #1a73e8',
    borderRadius: '3px',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.8)',
  } satisfies Partial<CSSStyleDeclaration>);
  root.append(box);

  let target: Element | null = null;

  const reposition = () => {
    if (!target) return;
    const r = target.getBoundingClientRect();
    box.style.top = `${r.top}px`;
    box.style.left = `${r.left}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
  };

  const onScrollOrResize = () => reposition();
  window.addEventListener('scroll', onScrollOrResize, true);
  window.addEventListener('resize', onScrollOrResize);

  return {
    show(el) {
      target = el;
      box.style.display = 'block';
      reposition();
    },
    hide() {
      target = null;
      box.style.display = 'none';
    },
    reposition,
    destroy() {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      box.remove();
    },
  };
}
