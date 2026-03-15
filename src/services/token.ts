// Minimal L402 (LSAT-style) TypeScript skeleton for Amper
//
// Purpose:
//  - Provide a compact, dependency-free shape for the L402 helper module.
//  - Export types and minimal async stubs so other modules can import safely.
//  - Keep implementation intentionally small; flesh out storage, crypto,
//    and payment adapter logic later when needed.
//
// Notes:
//  - This file avoids using browser globals (e.g., `chrome`) directly so it
//    remains a pure TS module. Integrations with extension storage or RPC
//    should be done by the background/content layer or via adapters.

import { Macaroon } from "../macaroon";
import { Either } from "fp-ts/lib/Either";

export interface ChallengeFactory {
  /**
   * Creates a payment challenge based on the specified amount and payment method.
   *
   * @param amount - The monetary amount for the challenge.
   * @param paymentMethod - The payment method to be used (e.g., "lightning", "bitcoin", "etc..").
   * @returns Challenge - The payment challenge.
   */
  createChallenge(
    amount: number,
    paymentMethod: string,
  ): Either<string, Challenge>;
}

/** A payment challenge */
export type Challenge = {
  invoice: string;
  receipt: string;
};

/** A token is a macaroon that can be used to authenticate requests */
export type Token = {
  macaroon: Macaroon;
  // The receipt associated with the Challenge
  receipt: string;
};
