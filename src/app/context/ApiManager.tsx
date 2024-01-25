"use client"

import { ApiPromise, WsProvider } from "@polkadot/api"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export const supportedChains = {
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
  chain: (typeof supportedChains)[SupportedChainIds] & { id: SupportedChainIds }
  setChainId: (chainId: SupportedChainIds) => void
}

const ApiManagerContext = createContext<ApiManagerProps>({
  apiStore: {},
  createApi: () => {},
  chain: { ...supportedChains.polkadot, id: "polkadot" },
  setChainId: () => {},
})

export const ApiManager: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [apiStore, setApiStore] = useState<Partial<Record<SupportedChainIds, ApiPromise>>>({})
  const [chainId, setChainId] = useState<SupportedChainIds>("polkadot")

  const chain = useMemo(() => ({ ...supportedChains[chainId], id: chainId }), [chainId])

  const createApi = useCallback(async (chain: SupportedChainIds) => {
    const { url } = supportedChains[chain]
    const provider = new WsProvider([url])
    const api = await ApiPromise.create({ provider })
    await api.isReady
    setApiStore((prev) => ({ ...prev, [chain]: api }))
  }, [])

  return (
    <ApiManagerContext.Provider value={{ apiStore, createApi, chain, setChainId }}>
      {children}
    </ApiManagerContext.Provider>
  )
}

export const useApi = (_chain?: SupportedChainIds) => {
  const { apiStore, createApi, chain } = useContext(ApiManagerContext)

  const isChainSupported = useMemo(
    () => (_chain ? supportedChains[_chain] !== undefined : true),
    [_chain]
  )

  const api = useMemo(() => apiStore[_chain ?? chain.id], [_chain, apiStore, chain.id])

  useEffect(() => {
    if (!isChainSupported || api !== undefined) return
    createApi(_chain ?? chain.id)
  }, [_chain, api, chain, createApi, isChainSupported])

  return {
    api,
    isChainSupported,
  }
}

export const useNetwork = () => {
  const { chain, setChainId } = useContext(ApiManagerContext)
  return { chain, setChainId }
}
