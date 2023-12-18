"use client"

import { Loader } from "lucide-react"
import { useAccountManager } from "../app/context/AccountManager"
import { shortenAddress } from "../lib/utils"
import { Button } from "./ui/button"

export const Account = () => {
  const { inSignet, signetVault } = useAccountManager()

  if (inSignet === undefined)
    return (
      <div>
        <Loader />
      </div>
    )

  if (!inSignet) {
    // implement usual connect wallet logic here
    return <Button>Connect Wallet</Button>
  }

  return signetVault ? (
    <div className="flex items-center gap-3">
      <div className="border rounded-lg border-primary px-3 py-1">
        <p>{signetVault.name}</p>
        <p className="text-gray-700 text-sm">{shortenAddress(signetVault.vaultAddress)}</p>
      </div>

      <div className="border rounded-lg border-primary px-3 py-1">
        <p>{signetVault.chain.name}</p>
        <p className="text-gray-700 text-sm">({signetVault.chain.id})</p>
      </div>
    </div>
  ) : (
    <p>Connecting Signet...</p>
  )
}
