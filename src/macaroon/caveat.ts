/**
 * Represents a condition or restriction associated with a macaroon.
 */
export class Caveat {
  constructor(
    public readonly key: string,
    public readonly value: string,
  ) {}

  /** Convert the caveat to a string representation. */
  toString(): string {
    return `${this.key} = ${this.value}`;
  }

  /** Create a caveat from its string representation. */
  static fromString(caveatString: string): Caveat {
    const parts = caveatString.split(" = ");
    if (
      parts.length !== 2 ||
      parts[0] === undefined ||
      parts[1] === undefined
    ) {
      throw new Error("Invalid caveat format");
    }
    return new Caveat(parts[0], parts[1]);
  }
}
