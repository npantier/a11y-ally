import { describe, it, expect } from 'vitest';
import { resolveRole } from './resolve-role';

function el(html: string): Element {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild as Element;
}

describe('resolveRole', () => {
  it('honors an explicit role attribute', () => {
    expect(resolveRole(el('<div role="button">x</div>'))).toEqual({ role: 'button' });
  });

  it('maps a button element', () => {
    expect(resolveRole(el('<button>x</button>'))).toEqual({ role: 'button' });
  });

  it('maps a submit input to button', () => {
    expect(resolveRole(el('<input type="submit">'))).toEqual({ role: 'button' });
  });

  it('maps an anchor with href to link', () => {
    expect(resolveRole(el('<a href="/x">x</a>'))).toEqual({ role: 'link' });
  });

  it('maps an anchor without href to generic', () => {
    expect(resolveRole(el('<a>x</a>'))).toEqual({ role: 'generic' });
  });

  it('maps text inputs to textbox', () => {
    expect(resolveRole(el('<input type="email">'))).toEqual({ role: 'textbox' });
    expect(resolveRole(el('<input>'))).toEqual({ role: 'textbox' });
    expect(resolveRole(el('<textarea></textarea>'))).toEqual({ role: 'textbox' });
  });

  it('maps checkbox and radio', () => {
    expect(resolveRole(el('<input type="checkbox">'))).toEqual({ role: 'checkbox' });
    expect(resolveRole(el('<input type="radio">'))).toEqual({ role: 'radio' });
  });

  it('maps headings with a level', () => {
    expect(resolveRole(el('<h2>x</h2>'))).toEqual({ role: 'heading', level: 2 });
  });

  it('maps landmarks and lists', () => {
    expect(resolveRole(el('<nav></nav>'))).toEqual({ role: 'navigation' });
    expect(resolveRole(el('<main></main>'))).toEqual({ role: 'main' });
    expect(resolveRole(el('<ul></ul>'))).toEqual({ role: 'list' });
    expect(resolveRole(el('<li></li>'))).toEqual({ role: 'listitem' });
  });

  it('treats an alt-less / empty-alt image as presentational', () => {
    expect(resolveRole(el('<img alt="">'))).toBeNull();
    expect(resolveRole(el('<img src="x.png">'))).toEqual({ role: 'image' });
  });

  it('returns null for role=presentation', () => {
    expect(resolveRole(el('<div role="presentation">x</div>'))).toBeNull();
  });
});
