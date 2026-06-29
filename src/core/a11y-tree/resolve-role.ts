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
const BUTTON_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image']);

const TAG_ROLES: Record<string, string> = {
  BUTTON: 'button',
  NAV: 'navigation',
  MAIN: 'main',
  HEADER: 'banner',
  FOOTER: 'contentinfo',
  SECTION: 'region',
  UL: 'list',
  OL: 'list',
  LI: 'listitem',
  SELECT: 'combobox',
  P: 'paragraph',
};

export function resolveRole(el: Element): { role: string; level?: number } | null {
  const explicit = el.getAttribute('role');
  if (explicit === 'presentation' || explicit === 'none') return null;
  if (explicit) return { role: explicit };

  if (el.getAttribute('aria-hidden') === 'true') return null;

  const tag = el.tagName;

  if (/^H[1-6]$/.test(tag)) return { role: 'heading', level: Number(tag[1]) };

  if (tag === 'A') {
    return el.hasAttribute('href') ? { role: 'link' } : { role: 'generic' };
  }

  if (tag === 'INPUT') {
    const type = (el.getAttribute('type') ?? '').toLowerCase();
    if (BUTTON_INPUT_TYPES.has(type)) return { role: 'button' };
    if (type === 'checkbox') return { role: 'checkbox' };
    if (type === 'radio') return { role: 'radio' };
    if (type === 'range') return { role: 'slider' };
    if (TEXT_INPUT_TYPES.has(type)) return { role: 'textbox' };
    return { role: 'textbox' };
  }

  if (tag === 'TEXTAREA') return { role: 'textbox' };

  if (tag === 'IMG') {
    return el.getAttribute('alt') === '' ? null : { role: 'image' };
  }

  return TAG_ROLES[tag] ? { role: TAG_ROLES[tag] } : { role: 'generic' };
}
