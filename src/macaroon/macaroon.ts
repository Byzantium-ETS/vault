/**
 * Minimal TypeScript implementation of Macaroons (first-party caveats only).
 *
 * Design notes (very small subset of the real spec):
 * - A macaroon has an `identifier`, a list of textual `caveats` and a `signature`.
 * - Signature is computed with HMAC-SHA256:
 *     sig0 = HMAC(rootKey, identifier)
 *     sigN = HMAC(sigN-1, caveatN)  (applied sequentially for each caveat)
 * - Verification recomputes the signature from the root key + identifier + caveats.
 *
 * This file intentionally keeps the API small and synchronous.
 */

import { Caveat } from "./caveat";
import { Oven } from "./oven";

/** Base64-url encode a Buffer */
function b64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Base64-url decode to Buffer */
function b64urlDecode(s: string): Buffer {
  // add padding
  const pad = 4 - (s.length % 4);
  const padded = s + (pad < 4 ? "=".repeat(pad) : "");
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

/**
 * A macaroon is a type of cryptographic token that conveys authorization.
 * It is similar to a cookie but with added security features.
 *
 * Key characteristics of macaroons:
 * - They are bearer tokens, meaning possession of the token grants access.
 * - They support attenuation, allowing restrictions to be added via caveats.
 * - They use HMAC (Hash-based Message Authentication Code) for integrity.
 *
 * In this implementation:
 * - The `identifier` is a unique string that identifies the macaroon.
 * - `caveats` are conditions that must be satisfied for the macaroon to be valid.
 * - The `signature` ensures the macaroon's integrity and authenticity.
 */
export class Macaroon {
  public readonly identifier: string;
  public readonly caveats: string[];
  public readonly signature: string; // base64url

  constructor(identifier: string, caveats: string[], signature: string) {
    this.identifier = identifier;
    this.caveats = caveats;
    this.signature = signature;
  }

  /**
   * Converts the macaroon into a string representation.
   */
  public toString(): string {
    const caveatsString = this.caveats
      .map((caveat) => `<${caveat}>`)
      .join("\n");
    return `identifier: ${this.identifier}\n${caveatsString}`;
  }

  /**
   * Verifies the macaroon using the given root key.
   * @param rootKey - The root key used to verify the macaroon.
   * @returns true if the macaroon is valid, false otherwise.
   */
  public verify(rootKey: string): boolean {
    let oven = new Oven(rootKey, this.identifier);

    // Sequentially add each caveat to the signature
    for (const caveat of this.caveats) {
      oven.addCaveat(Caveat.fromString(caveat));
    }

    // Compare the computed signature with the macaroon's signature
    const computedSignature = oven.bake().signature;
    return computedSignature === this.signature;
  }
}
