"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import ProdukListing from "@/components/produkListing"
import { Toaster } from "react-hot-toast"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch products")
  const json = await res.json()
  return json.data || []
}

interface Product {
  id: number
  kode_barang: string
  nama_produk: string
  deskripsi: string
  kategori: string
  image_url: string
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("semua")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { data: products = [], isLoading, error } = useSWR<Product[]>("/api/listproduk", fetcher)

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((product) => product.kategori))).sort()
    return [{ id: "semua", label: "Semua" }, ...uniqueCategories.map((cat) => ({ id: cat, label: cat }))]
  }, [products])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "semua" || product.kategori === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (categoryId: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveCategory(categoryId)
      setIsTransitioning(false)
    }, 150)
  }

  return (
    <>
<div><Toaster /></div>
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>

            {/* Category Filter Navigation - Compact */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid - 3 columns on PC, 2 on tablet, 2 on mobile */}
          <ProdukListing
            products={filteredProducts}
            isLoading={!!isLoading}
            error={error}
            isTransitioning={isTransitioning}
          />

          {/* Promo Card Section - Compact */}
          <div className="mt-10 mb-12">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 dark:from-slate-900/50 dark:via-blue-900/20 dark:to-purple-900/20 border border-border overflow-hidden shadow-md transition-all duration-500 hover:shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                {/* Left Content */}
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Orderan Satset Anti Ribet</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Dapatkan aplikasi premium mu secara instant dalam waktu hitungan detik langsung siap dipakai dengan
                    biaya yang competitif dan terjangkau dari yang lainnya!
                  </p>
                </div>

                {/* Right Image */}
                <div className="flex-shrink-0">
                  <img
                    src="/horn.png"
                    alt="Promo Character"
                    className="w-32 h-auto object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}
