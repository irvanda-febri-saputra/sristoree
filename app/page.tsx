import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { sristoreeSection } from "@/components/space-digital-section"
import { OrderSection } from "@/components/order-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <sristoreeSection />
      <OrderSection />
      <Footer />
    </main>
  )
}
