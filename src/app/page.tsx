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
    </main>
  )
}
