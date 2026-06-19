import { describe, it, expect } from 'vitest';
import { buildReadingList } from './build-reading-list';

function mount(html: string): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.append(root);
  return root;
}

describe('buildReadingList', () => {
  it('emits announceable nodes in document order', () => {
    const root = mount(`
      <h1>Find a doctor</h1>
      <button>Search</button>
      <a href="/help">Help</a>
    `);
    const { nodes } = buildReadingList(root);
    expect(nodes.map((n) => [n.role, n.name])).toEqual([
      ['heading', 'Find a doctor'],
      ['button', 'Search'],
      ['link', 'Help'],
    ]);
    expect(nodes[0]!.level).toBe(1);
  });

  it('skips hidden and aria-hidden nodes', () => {
    const root = mount(`
      <button>Visible</button>
      <button style="display:none">Hidden</button>
      <button aria-hidden="true">Aria hidden</button>
    `);
    const { nodes } = buildReadingList(root);
    expect(nodes.map((n) => n.name)).toEqual(['Visible']);
  });

  it('skips generic containers with no name but keeps their children', () => {
    const root = mount(`<div><span>ignored</span><button>Keep</button></div>`);
    const { nodes } = buildReadingList(root);
    expect(nodes.map((n) => n.name)).toEqual(['Keep']);
  });

  it('captures required state and value for inputs', () => {
    const root = mount(`<label>Email<input type="email" required value="a@b.com"></label>`);
    const { nodes } = buildReadingList(root);
    const field = nodes.find((n) => n.role === 'textbox')!;
    expect(field.name).toBe('Email');
    expect(field.state.required).toBe(true);
    expect(field.value).toBe('a@b.com');
  });

  it('maps node ids back to their elements', () => {
    const root = mount(`<button>Search</button>`);
    const { nodes, elements } = buildReadingList(root);
    const el = elements.get(nodes[0]!.id)!;
    expect(el.tagName).toBe('BUTTON');
  });

  it('reads ARIA state on non-input elements', () => {
    const root = mount(
      `<div role="checkbox" aria-checked="true" aria-expanded="true" aria-label="Toggle me"></div>`,
    );
    const { nodes } = buildReadingList(root);
    const node = nodes.find((n) => n.role === 'checkbox')!;
    expect(node).toBeDefined();
    expect(node.state.checked).toBe(true);
    expect(node.state.expanded).toBe(true);
  });

  it('skips elements with the hidden attribute', () => {
    const root = mount(`
      <button>Visible</button>
      <button hidden>Hidden attribute</button>
    `);
    const { nodes } = buildReadingList(root);
    expect(nodes.map((n) => n.name)).toEqual(['Visible']);
  });

  it('skips elements with visibility:hidden', () => {
    const root = mount(`
      <button>Visible</button>
      <button style="visibility:hidden">Visibility hidden</button>
    `);
    const { nodes } = buildReadingList(root);
    expect(nodes.map((n) => n.name)).toEqual(['Visible']);
  });

  it('skips children of aria-hidden containers', () => {
    const root = mount(`
      <button>Visible</button>
      <div aria-hidden="true"><button>Inside hidden</button></div>
    `);
    const { nodes } = buildReadingList(root);
    expect(nodes.map((n) => n.name)).toEqual(['Visible']);
  });
});
