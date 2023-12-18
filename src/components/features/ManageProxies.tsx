import { ApiPromise } from "@polkadot/api"
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

export const ManageProxies: React.FC<{ api: ApiPromise }> = () => {
  return (
    <AccordionItem value="manage-proxies">
      <AccordionTrigger>
        <h4>Manage Proxies</h4>
      </AccordionTrigger>
      <AccordionContent>WIP</AccordionContent>
    </AccordionItem>
  )
}
