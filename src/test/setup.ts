import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

// Under Vitest's jsdom environment, esbuild (pulled in by the WxtVitest plugin)
// checks `new TextEncoder().encode("") instanceof Uint8Array` at startup. jsdom
// installs its own realm's typed-array + encoder globals, so that check fails
// against Node's esbuild. Restore Node's implementations so both agree.
const NodeUint8Array = Object.getPrototypeOf(Buffer.prototype).constructor as Uint8ArrayConstructor;
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
globalThis.Uint8Array = NodeUint8Array;
