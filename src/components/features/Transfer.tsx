import { useCallback, useMemo, useState } from "react"
import { ApiPromise } from "@polkadot/api"
import { SendTxRespond, useSignetSdk } from "@talismn/signet-apps-sdk"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Address } from "../../lib/address"
import { useApi } from "../../app/context/ApiManager"
import { useAccountManager } from "../../app/context/AccountManager"

const parseAmount = (amount: string, decimals: number): bigint => {
  const [int, frac] = amount.split(".")
  const intPart = BigInt(int) * BigInt(10 ** decimals)
  if (frac === undefined) return intPart
  const fracPart = BigInt(frac.slice(0, decimals).padEnd(decimals, "0"))
  return intPart + fracPart
}

export const Transfer: React.FC<{ api: ApiPromise }> = () => {
  const { signetVault, selectedAccount } = useAccountManager()
  const { isChainSupported, api } = useApi(signetVault?.chain.id as any)
  const { sdk } = useSignetSdk()
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amountString, setAmountString] = useState("")
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<SendTxRespond>()

  const address = useMemo(() => {
    try {
      const address = Address.fromSs58(recipientAddress)
      if (address) return address
      return null
    } catch (e) {
      return null
    }
  }, [recipientAddress])

  const amountBN = useMemo(() => {
    try {
      if (!api) return null
      const chainProperties = api.registry.getChainProperties()
      if (!chainProperties) return null
      return parseAmount(amountString, chainProperties.tokenDecimals.value[0].toNumber())
    } catch (e) {
      return null
    }
  }, [amountString, api])

  const buildTransferExtrinsic = useCallback(() => {
    if (!api || !address || amountBN === null) return null
    if (api.tx.balances?.transferKeepAlive) {
      return api.tx.balances.transferKeepAlive(address.toSs58(), amountBN)
    } else if (api.tx.assets?.transfer) {
      return api.tx.assets.transfer(address.toSs58(), amountString)
    }
  }, [address, amountBN, amountString, api])

  const extrinsic = useMemo(() => {
    if (!address || !api) return null
    return buildTransferExtrinsic()
  }, [address, api, buildTransferExtrinsic])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setRes(undefined)
    if (!extrinsic) return
    try {
      if (signetVault) {
        setLoading(true)
        const res = await sdk.send(extrinsic.method.toHex())
        if (res) setRes(res)
      } else if (selectedAccount) {
        setLoading(true)
        const { web3FromAddress } = await import("@polkadot/extension-dapp")
        const { signer } = await web3FromAddress(selectedAccount.address)
        const res = await extrinsic.signAndSend(selectedAccount.address, { signer })
        console.log("Transfer done!", res)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const tokenSymbol = useMemo(() => {
    return api?.registry.getChainProperties()?.tokenSymbol.value[0].toString()
  }, [api?.registry])

  return (
    <div className="flex flex-col w-full">
      <h4 className="font-bold text-lg">Transfer</h4>
      <form className="w-full grid gap-3 p-3" onSubmit={handleTransfer}>
        <Input
          label="Recipient"
          placeholder="5HKCpZoi9Nqnq3..."
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <div className="">
          <Input
            label="Amount"
            placeholder="Amount"
            onChange={(e) => setAmountString(e.target.value)}
            suffix={tokenSymbol}
          />
          {amountString.length > 0 && amountBN === null && (
            <p className="text-red-500 mt-1 text-sm">Invalid amount.</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={
            amountBN === null ||
            amountBN <= BigInt(0) ||
            !address ||
            !isChainSupported ||
            !extrinsic ||
            (!signetVault && !selectedAccount)
          }
          onClick={handleTransfer}
        >
          {isChainSupported
            ? loading
              ? "Transferring..."
              : "Transfer Token"
            : "Chain not supported!"}
        </Button>
        {res?.error !== undefined && <p className="text-red-500 mt-2">{res.error}</p>}
        {res?.receipt !== undefined && (
          <p className="text-green-500 mt-2">
            Tx submitted at {res.receipt.blockNumber}-{res.receipt.txIndex}
          </p>
        )}
      </form>
    </div>
  )
}
