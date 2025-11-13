import { Suspense } from "react"
import InvoiceClient from "./InvoiceClient"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading invoice...</div>}>
      <InvoiceClient />
    </Suspense>
  )
}