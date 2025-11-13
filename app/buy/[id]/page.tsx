import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ProductViewer from "@/components/product-viewer"

export default async function BuyPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ProductViewer productId={id} />
      </div>
      <Footer />
    </main>
  )
}
