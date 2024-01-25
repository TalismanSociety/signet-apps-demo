import { Account } from "../components/Account"
import { Features } from "../components/features"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full p-4 justify-end flex items-start">
        <Account />
      </div>
      <section className="w-full p-4">
        <div className="w-full max-w-xl mx-auto">
          <Features />
        </div>
      </section>
      <footer className="flex w-full p-4 gap-3 justify-center items-center">
        <a className="text-gray-700 hover:text-lime-400" href="https://talisman.xyz/signet">
          Signet
        </a>
        <a
          className="text-gray-700 hover:text-lime-400"
          href="https://github.com/TalismanSociety/signet-apps-demo"
        >
          Github (Demo)
        </a>
        <a
          className="text-gray-700 hover:text-lime-400"
          href="https://github.com/TalismanSociety/signet-apps-sdk"
        >
          Github (SDK)
        </a>
      </footer>
    </main>
  )
}
