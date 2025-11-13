import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Cart from "@/components/cart"
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Cart />
      <Footer />
    </main>
  )
}
