"use client"

import { ApiPromise, WsProvider } from "@polkadot/api"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const supportedChains = {
  "rococo-testnet": {
    name: "Rococo",
    url: "wss://rococo-rpc.polkadot.io",
  },
  "westend-testnet": {
    name: "Westend",
    url: "wss://westend-rpc.polkadot.io",
  },
  kusama: {
    name: "Kusama",
    url: "wss://kusama-rpc.polkadot.io",
  },
  polkadot: {
    name: "Polkadot",
    url: "wss://rpc.polkadot.io",
  },
}

type SupportedChainIds = keyof typeof supportedChains

type ApiManagerProps = {
  apiStore: Partial<Record<SupportedChainIds, ApiPromise>>
  createApi: (chain: SupportedChainIds) => void
}

const ApiManagerContext = createContext<ApiManagerProps>({ apiStore: {}, createApi: () => {} })

export const ApiManager: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [apiStore, setApiStore] = useState<Partial<Record<SupportedChainIds, ApiPromise>>>({})

  const createApi = useCallback(async (chain: SupportedChainIds) => {
    const { url } = supportedChains[chain]
    const provider = new WsProvider([url])
    const api = await ApiPromise.create({ provider })
    await api.isReady
    setApiStore((prev) => ({ ...prev, [chain]: api }))
  }, [])

  return (
    <ApiManagerContext.Provider value={{ apiStore, createApi }}>
      {children}
    </ApiManagerContext.Provider>
  )
}

export const useApi = (chain: SupportedChainIds) => {
  const { apiStore, createApi } = useContext(ApiManagerContext)
  const isChainSupported = useMemo(() => supportedChains[chain] !== undefined, [chain])

  const api = useMemo(() => apiStore[chain], [apiStore, chain])

  useEffect(() => {
    if (!isChainSupported || api !== undefined) return
    createApi(chain)
  }, [api, chain, createApi, isChainSupported])

  return {
    api,
    isChainSupported,
  }
}
