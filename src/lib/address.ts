import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"
import { shortenAddress } from "./utils"
const { hexToU8a, isHex } = require("@polkadot/util")

// Represent addresses as bytes except for when we need to display them to the user.
// Allows us to confidently do stuff like equality checks, don't need to worry about SS52 encoding.
export class Address {
  readonly bytes: Uint8Array

  constructor(bytes: Uint8Array) {
    if (bytes.length !== 32) throw new Error("Address must be 32 bytes!")
    this.bytes = bytes
  }

  static fromSs58(addressCandidate: string): Address | false {
    try {
      const bytes = isHex(addressCandidate)
        ? (hexToU8a(addressCandidate) as Uint8Array)
        : decodeAddress(addressCandidate, false)
      return new Address(bytes)
    } catch (error) {
      return false
    }
  }

  isEqual(other: Address): boolean {
    return this.bytes.every((byte, index) => byte === other.bytes[index])
  }

  /* to generic address if chain is not provided */
  toSs58(prefix?: number): string {
    return encodeAddress(this.bytes, prefix)
  }

  toShortSs58(prefix: number): string {
    return shortenAddress(this.toSs58(prefix))
  }
}
