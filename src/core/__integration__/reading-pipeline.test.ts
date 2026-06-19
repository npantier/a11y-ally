import { describe, it, expect } from 'vitest';
import { buildReadingList } from '../a11y-tree/build-reading-list';
import { announce } from '../announcer/announce';

const FIXTURE = `
  <header><h1>Find a doctor</h1></header>
  <main>
    <label>Specialty <input type="text" required></label>
    <button>Search</button>
    <img src="logo.png" alt="">
    <a href="/help">Need help?</a>
  </main>
`;

describe('reading pipeline (integration)', () => {
  it('produces the expected announced sequence for a realistic page', () => {
    const root = document.createElement('div');
    root.innerHTML = FIXTURE;
    document.body.append(root);

    const { nodes } = buildReadingList(root);
    const spoken = nodes.map(announce);

    expect(spoken).toEqual([
      'Find a doctor, heading level 1',
      'Specialty, edit text, required',
      'Search, button',
      // empty-alt image is skipped (presentational)
      'Need help?, link',
    ]);
  });
});
