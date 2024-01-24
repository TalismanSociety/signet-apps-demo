"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { SignetSdk, VaultAccount, useSignetSdk } from "@talismn/signet-apps-sdk"
import { web3AccountsSubscribe, web3Enable } from "@polkadot/extension-dapp"
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
    const account = await sdk?.getAccount()
    if (account) setSignetVault(account)
  }, [sdk])

  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true)
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

  useEffect(() => {
    if (!enabled) return
    web3AccountsSubscribe((accounts) => {
      setInjected(accounts)
      if (accounts.length === 0) setEnabled(false)
    }).then((unsub) => {
      unsubCall.current = unsub
    })

    return () => {
      unsubCall.current && unsubCall.current()
    }
  }, [enabled])

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
