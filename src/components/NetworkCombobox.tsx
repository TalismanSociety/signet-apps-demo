"use client"

import { supportedChains, useApi, useNetwork } from "@/app/context/ApiManager"
import { useMemo } from "react"
import { Combobox } from "./ui/combobox"

export const NetworkCombobox: React.FC = () => {
  const { chain, setChainId } = useNetwork()
  const networks = useMemo(
    () => Object.entries(supportedChains).map(([id, chain]) => ({ id, ...chain })),
    []
  )
  return (
    <Combobox
      className="w-32"
      value={chain.id}
      placeholder="Select Network"
      onChange={(value) => {
        const chainId = networks.find(({ id }) => id === value)?.id
        if (chainId) setChainId(chainId as any)
      }}
      options={networks.map(({ id, name }) => ({
        value: id,
        ui: name,
        keywords: [name, id],
      }))}
    />
  )
}
