import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AccountManager } from "./context/AccountManager"
import { ApiManager } from "./context/ApiManager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Signet Apps Demo",
  description: "Build great multisig experience with Signet.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApiManager>
          <AccountManager>{children}</AccountManager>
        </ApiManager>
      </body>
    </html>
  )
}
