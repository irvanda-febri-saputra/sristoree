"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Canva Pro",
    category: "DESAIN",
    categoryColor: "from-yellow-500 to-orange-500",
    description: "Desain profesional dengan ribuan template siap pakai",
    price: "Rp 49.000/bulan",
  },
  {
    id: 2,
    name: "Capcut Pro",
    category: "BELI SEKARANG",
    categoryColor: "from-blue-500 to-purple-500",
    description: "Edit video tanpa batas, dipotong gratis dan tanpa ikon",
    price: "Rp 99.000/tahun",
  },
  {
    id: 3,
    name: "ChatGPT+",
    category: "PROSES MANUAL",
    categoryColor: "from-yellow-500 to-orange-500",
    description: "Akses terbaru AI dengan respons lebih cepat",
    price: "Rp 199.000/bulan",
  },
  {
    id: 4,
    name: "YouTube Premium",
    category: "TERSEDIA",
    categoryColor: "from-red-500 to-pink-500",
    description: "Streaming tanpa iklan, download offline, musik",
    price: "Rp 59.000/bulan",
  },
]

export function ProductCarousel() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Produk Digital Terpopuler</h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {["Semua", "Desain", "Musik & Video", "Productivity"].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                className={`rounded-lg px-6 py-2 font-medium transition-all ${
                  filter === "Semua"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-900/50 border-blue-900/30 text-slate-300 hover:border-blue-800 hover:bg-slate-800/50"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-blue-800/30 overflow-hidden hover:border-blue-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              {/* Product Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <Image
                  src={`/.jpg?height=200&width=200&query=${product.name} product showcase`}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Badge */}
              <div
                className={`absolute top-3 left-3 bg-gradient-to-r ${product.categoryColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
              >
                {product.category}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-400">{product.price}</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Beli
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
