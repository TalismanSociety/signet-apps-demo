"use client"

import { Loader } from "lucide-react"
import { useAccountManager } from "../../app/context/AccountManager"
import { useApi } from "../../app/context/ApiManager"
import { Accordion } from "../ui/accordion"
import { Transfer } from "./Transfer"

const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full">
      <h1 className="font-bold text-lg">Substrate Helper</h1>
      <div className="w-full">{children}</div>
    </div>
  )
}
export const Features: React.FC = () => {
  const { signetVault } = useAccountManager()
  const { isChainSupported, api } = useApi(signetVault?.chain.id as any)
  if (!isChainSupported) return <Wrapper>The chain is not supported!</Wrapper>

  if (!api || !api.isReady)
    return (
      <Wrapper>
        <div className="w-full flex gap-3 items-center">
          <Loader />
          <p>Loading...</p>
        </div>
      </Wrapper>
    )
  return (
    <Wrapper>
      <Accordion type="single" collapsible>
        <Transfer api={api} />
      </Accordion>
    </Wrapper>
  )
}
