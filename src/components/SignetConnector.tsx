"use client"

import { createContext, useContext } from "react"
import { SignetSdk, useSignetSdk } from "@talismn/signet-apps-sdk"

type SignetProps = {
  sdk?: SignetSdk
  inSignet?: boolean
}
const SignetContext = createContext<SignetProps>({})

export const SignetContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { sdk, inSignet } = useSignetSdk()

  return (
    <SignetContext.Provider
      value={{
        sdk,
        inSignet,
      }}
    >
      {children}
    </SignetContext.Provider>
  )
}

export const useSignet = () => {
  return useContext(SignetContext)
}
