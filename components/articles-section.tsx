"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const articles = [
  {
    id: 1,
    title: "sristoree Tools – Semua yang Perlu Kamu Tahu",
    description: "sristoree Tools adalah layanan terbaru dari sristoree yang menghadirkan berbagai alat praktis.",
    date: "18 Aug 2025",
    image: "/premium-tools-interface.jpg",
  },
  {
    id: 2,
    title: "Cara Order Di Website sristoree",
    description: "sristoree menawarkan cara mudah untuk membeli produk digital premium. Cukup buka website-nya...",
    date: "10 Jul 2025",
    image: "/online-shopping-checkout.jpg",
  },
  {
    id: 3,
    title: "Fitur-Fitur Seru Di sristoree",
    description: "Di sristoree, kamu bisa menemukan berbagai produk digital berkualitas seperti Spotify Premium...",
    date: "05 Jul 2025",
    image: "/premium-features-showcase.jpg",
  },
]

export function ArticlesSection() {
  return (
  <section className="px-4 sm:px-6 lg:px-8 py-20 bg-background/80">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">Artikel Terbaru</h2>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-800/30 overflow-hidden hover:border-blue-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              {/* Article Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{article.date}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 gap-2"
                  >
                    Baca <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/30 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Dapatkan Berbagai Keuntungan Dengan Mendaftar
          </h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Kamu akan bebas biaya admin, lebih mudah mengelola transaksi dan pesanan, serta bebas mengatur jumlah dan
            menyimpannya ke dalam keranjang.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg">
            Daftar Sekarang
          </Button>
        </div>
      </div>
    </section>
  )
}
