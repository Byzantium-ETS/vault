/**
 * Vault - Background service worker (TypeScript)
 *
 * This is a lightweight skeleton for the background service worker.
 *
 * NOTE:
 *  - This file is a stub and intentionally minimal. It demonstrates
 *    the shape of message handlers and how the l402 module is used.
 *  - Build the project (esbuild/tsc) to emit JS that the manifest references.
 */

import { ChallengeFactory, Token } from "./token";

/**
 * Final note:
 * - This file is intentionally framework-agnostic and simple so you can extend it.
 * - After adding TypeScript build scripts (esbuild), the compiled output should be referenced
 *   by the manifest (manifest.json currently references `dist/background.js`).
 */
