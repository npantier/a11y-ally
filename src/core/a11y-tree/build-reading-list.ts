import { computeAccessibleName } from 'dom-accessibility-api';
import type { AnnounceableNode, NodeState } from '../types';
import { resolveRole } from './resolve-role';

const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'textbox',
  'checkbox',
  'radio',
  'combobox',
  'slider',
]);

export interface ReadingList {
  nodes: AnnounceableNode[];
  elements: Map<string, Element>;
}

export function buildReadingList(root: HTMLElement): ReadingList {
  const nodes: AnnounceableNode[] = [];
  const elements = new Map<string, Element>();
  let counter = 0;

  const walk = (el: Element) => {
    if (isHidden(el)) return; // hidden subtrees are fully skipped

    const resolved = resolveRole(el);
    if (resolved) {
      const name = computeAccessibleName(el);
      const role = resolved.role;
      const meaningful = INTERACTIVE_ROLES.has(role) || role === 'heading' || role === 'image';
      if (meaningful || name) {
        const id = `n${counter++}`;
        nodes.push({
          id,
          role,
          name,
          level: resolved.level,
          state: readState(el),
          value: readValue(el),
        });
        elements.set(id, el);
      }
    }

    for (const child of Array.from(el.children)) walk(child);
  };

  for (const child of Array.from(root.children)) walk(child);
  return { nodes, elements };
}

function isHidden(el: Element): boolean {
  if (el.getAttribute('aria-hidden') === 'true') return true;
  if (el.hasAttribute('hidden')) return true;
  const style = (el.ownerDocument.defaultView ?? window).getComputedStyle(el);
  return style.display === 'none' || style.visibility === 'hidden';
}

function readState(el: Element): NodeState {
  const state: NodeState = {};
  if (
    (el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement) &&
    el.disabled
  ) {
    state.disabled = true;
  }
  if (el.hasAttribute('required') || el.getAttribute('aria-required') === 'true') {
    state.required = true;
  }
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    state.checked = el.checked;
  }
  const ariaChecked = el.getAttribute('aria-checked');
  if (ariaChecked === 'mixed') state.checked = 'mixed';
  else if (ariaChecked === 'true') state.checked = true;
  else if (ariaChecked === 'false') state.checked = false;
  const expanded = el.getAttribute('aria-expanded');
  if (expanded === 'true') state.expanded = true;
  else if (expanded === 'false') state.expanded = false;
  if (el.getAttribute('aria-selected') === 'true') state.selected = true;
  return state;
}

function readValue(el: Element): string | undefined {
  const TEXT_INPUT_TYPES = new Set([
    'text',
    'email',
    'password',
    'search',
    'tel',
    'url',
    'number',
    '',
  ]);
  if (el instanceof HTMLInputElement && TEXT_INPUT_TYPES.has(el.type)) {
    return el.value || undefined;
  }
  if (el instanceof HTMLTextAreaElement) return el.value || undefined;
  return undefined;
}
