import * as crypto from "crypto";
import { Caveat } from "./caveat";
import { Macaroon } from "./macaroon";

/** Compute HMAC-SHA256(key, data) returning a Buffer */
function hmacSha256(key: Buffer, data: Buffer | string): Buffer {
  return crypto
    .createHmac("SHA256", key)
    .update(typeof data === "string" ? Buffer.from(data, "utf8") : data)
    .digest();
}

/**
 * Represents an oven for creating macaroons with optional caveats.
 */
export class Oven {
  private rootKey: string;
  private identifier: string;
  private caveats: Caveat[];

  constructor(rootKey: string, identifier: string) {
    this.rootKey = rootKey;
    this.identifier = identifier;
    this.caveats = [];
  }

  /**
   * Add a caveat to the oven.
   * @param caveat The caveat to add.
   */
  addCaveat(caveat: Caveat): void {
    this.caveats.push(caveat);
  }

  /**
   * Bake a new macaroon with the given user ID and optional caveats.
   * @returns A new Macaroon instance.
   */
  bake(): Macaroon {
    const rootKeyBuffer = Buffer.from(this.rootKey, "utf8");
    let signature = hmacSha256(rootKeyBuffer, this.identifier);

    for (const caveat of this.caveats) {
      signature = hmacSha256(signature, caveat.toString());
    }

    return new Macaroon(
      this.identifier,
      this.caveats.map((caveat) => caveat.toString()),
      signature.toString("base64url"),
    );
  }
}
