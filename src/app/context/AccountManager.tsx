"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { SignetSdk, VaultAccount, useSignetSdk } from "@talismn/signet-apps-sdk"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"

type SignetProps = {
  connecting: boolean
  connectWallet: () => void
  injected: InjectedAccountWithMeta[]
  inSignet?: boolean
  loading: boolean
  sdk?: SignetSdk
  selectedAccount?: InjectedAccountWithMeta
  setSelectedAccount: (account?: InjectedAccountWithMeta) => void
  signetVault?: VaultAccount
  web3Enabled: boolean
}

const AccountManagerContext = createContext<SignetProps>({
  connecting: false,
  connectWallet: () => {},
  web3Enabled: false,
  injected: [],
  loading: true,
  setSelectedAccount: () => {},
})

export const AccountManager: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { sdk, inSignet } = useSignetSdk()
  const [connecting, setConnecting] = useState(false)
  const [injected, setInjected] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>()
  const [enabled, setEnabled] = useState(false)
  const [signetVault, setSignetVault] = useState<VaultAccount>()
  const unsubCall = useRef<Function>()

  const handleAutoConnectSignet = useCallback(async () => {
    if (typeof window === "undefined") return
    const account = await sdk?.getAccount()
    if (account) setSignetVault(account)
  }, [sdk])

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window === "undefined") return
      setConnecting(true)
      const { web3Enable } = await import("@polkadot/extension-dapp")
      const enabled = await web3Enable("Signet Apps Demo")
      if (enabled.length > 0) {
        setEnabled(true)
      }
    } catch (e) {
      console.error("Failed to connect wallet", e)
    } finally {
      setConnecting(false)
    }
  }, [])

  const subscribeAccounts = useCallback(async () => {
    if (!enabled) return
    const { web3AccountsSubscribe } = await import("@polkadot/extension-dapp")
    web3AccountsSubscribe((accounts) => {
      setInjected(accounts)
      if (accounts.length === 0) setEnabled(false)
    }).then((unsub) => {
      unsubCall.current = unsub
    })
  }, [enabled])

  useEffect(() => {
    subscribeAccounts()
    return () => {
      unsubCall.current && unsubCall.current()
    }
  }, [enabled, subscribeAccounts])

  useEffect(() => {
    if (inSignet) handleAutoConnectSignet()
  }, [handleAutoConnectSignet, inSignet])

  return (
    <AccountManagerContext.Provider
      value={{
        connecting,
        connectWallet,
        injected,
        inSignet,
        loading: inSignet === undefined,
        sdk,
        selectedAccount,
        setSelectedAccount,
        signetVault,
        web3Enabled: enabled,
      }}
    >
      {children}
    </AccountManagerContext.Provider>
  )
}

export const useAccountManager = () => {
  return useContext(AccountManagerContext)
}
