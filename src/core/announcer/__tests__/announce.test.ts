import { describe, it, expect } from 'vitest';
import { announce } from '../announce';
import type { AnnounceableNode } from '../../types';

const base: AnnounceableNode = { id: '1', role: 'generic', name: '', state: {} };

describe('announce', () => {
  it('reads name then role', () => {
    expect(announce({ ...base, role: 'button', name: 'Submit' })).toBe('Submit, button');
  });

  it('reads a required text field', () => {
    expect(announce({ ...base, role: 'textbox', name: 'Email', state: { required: true } })).toBe(
      'Email, edit text, required',
    );
  });

  it('reads a heading name-first with its level', () => {
    expect(announce({ ...base, role: 'heading', name: 'Doctors near you', level: 2 })).toBe(
      'Doctors near you, heading level 2',
    );
  });

  it('reads a checked checkbox', () => {
    expect(
      announce({ ...base, role: 'checkbox', name: 'Remember me', state: { checked: true } }),
    ).toBe('Remember me, checkbox, checked');
  });

  it('reads value after state', () => {
    expect(announce({ ...base, role: 'textbox', name: 'Email', value: 'a@b.com' })).toBe(
      'Email, edit text, a@b.com',
    );
  });

  it('reads set position for list items', () => {
    expect(
      announce({
        ...base,
        role: 'listitem',
        name: 'Cardiology',
        setInfo: { position: 2, size: 5 },
      }),
    ).toBe('Cardiology, list item, 2 of 5');
  });

  it('omits an empty name', () => {
    expect(announce({ ...base, role: 'image', name: '' })).toBe('image');
  });
});
