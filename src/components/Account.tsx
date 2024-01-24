"use client"

import { Loader } from "lucide-react"
import { useAccountManager } from "../app/context/AccountManager"
import { shortenAddress } from "../lib/utils"
import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"
import Identicon from "polkadot-identicon"
import { useCallback } from "react"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { AccountCombobox } from "./AccountCombobox"
import { NetworkCombobox } from "./NetworkCombobox"

export const Account = () => {
  const { connectWallet, connecting, injected, inSignet, setSelectedAccount, signetVault } =
    useAccountManager()

  const handleAccountChange = useCallback(
    (account?: InjectedAccountWithMeta) => {
      setSelectedAccount(account)
    },
    [setSelectedAccount]
  )

  if (inSignet === undefined)
    return (
      <div>
        <Loader />
      </div>
    )

  if (!inSignet) {
    // implement usual connect wallet logic here
    if (injected.length > 0)
      return (
        <div className="flex items-center justify-end gap-3">
          <NetworkCombobox />
          <AccountCombobox accounts={injected} onChange={handleAccountChange} />
        </div>
      )
    return (
      <Button onClick={connectWallet} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
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
