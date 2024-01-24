"use client"

import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { Combobox } from "./ui/combobox"
import Identicon from "polkadot-identicon"

type Props = {
  accounts: InjectedAccountWithMeta[]
  onChange?: (account?: InjectedAccountWithMeta) => void
}
export const AccountCombobox: React.FC<Props> = ({ accounts, onChange }) => (
  <Combobox
    placeholder="Select an account"
    onChange={(val) => {
      const account = accounts.find(
        (account) => account.address.toLowerCase() === val.toLowerCase()
      )
      onChange?.(account)
    }}
    options={accounts.map(({ address, meta }) => ({
      value: address,
      keywords: [address, meta.name ?? ""],
      ui: (
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="min-w-6">
            <Identicon className="my-class min-w-6" account={address} size={24} />
          </div>
          <p className="text-ellipsis whitespace-nowrap overflow-hidden">{meta.name}</p>
        </div>
      ),
    }))}
  />
)
