import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Convention: named exports everywhere. Banned via the core no-restricted-syntax
// rule rather than eslint-plugin-import, whose no-default-export rule is broken
// under ESLint 10 flat config. Function style is intentionally unconstrained —
// this repo uses `export function` declarations and we keep them (see CLAUDE.md).
const noDefaultExport = {
  selector: 'ExportDefaultDeclaration',
  message: 'Use named exports. Default exports are only allowed where a framework requires them.',
};

export default tseslint.config(
  {
    // build output, framework scratch, and deps are not ours to lint
    ignores: ['node_modules', '.output', '.wxt', 'dist'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-restricted-syntax': ['error', noDefaultExport],
    },
  },
  {
    // Files the framework/tooling REQUIRE to default-export.
    files: ['**/entrypoints/**', '**/*.config.{ts,js}', '**/*.stories.tsx'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    // Test mocks legitimately need `any` to fake browser globals and SDK shapes
    // (SpeechSynthesis, globalThis constructors, axe results). The no-`any`
    // convention is about production code; tests get the escape hatch.
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'src/core/__integration__/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
