"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { SignetSdk, VaultAccount, useSignetSdk } from "@talismn/signet-apps-sdk"

type SignetProps = {
  sdk?: SignetSdk
  inSignet?: boolean
  loading: boolean
  signetVault?: VaultAccount
}

const AccountManagerContext = createContext<SignetProps>({ loading: true })

export const AccountManager: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { sdk, inSignet } = useSignetSdk()
  const [signetVault, setSignetVault] = useState<VaultAccount>()

  const handleAutoConnectSignet = useCallback(async () => {
    const account = await sdk?.getAccount()
    if (account) setSignetVault(account)
  }, [sdk])

  useEffect(() => {
    if (inSignet) handleAutoConnectSignet()
  }, [handleAutoConnectSignet, inSignet])

  return (
    <AccountManagerContext.Provider
      value={{
        sdk,
        signetVault,
        inSignet,
        loading: inSignet === undefined,
      }}
    >
      {children}
    </AccountManagerContext.Provider>
  )
}

export const useAccountManager = () => {
  return useContext(AccountManagerContext)
}
