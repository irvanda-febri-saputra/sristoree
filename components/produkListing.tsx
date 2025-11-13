"use client"

import * as React from "react"

interface Product {
  id: number
  kode_barang: string
  nama_produk: string
  deskripsi?: string
  kategori: string
  image_url?: string
}

export function ProdukListing({
  products,
  isLoading,
  error,
  isTransitioning,
}: {
  products: Product[]
  isLoading: boolean
  error: unknown
  isTransitioning: boolean
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
      <div
    className="absolute inset-0 rounded-2xl blur-3xl opacity-40 pointer-events-none"
    style={{
      background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.4), rgba(56,189,248,0.3), transparent 70%)",
    }}
  ></div>
      {isLoading ? (
        <div className="col-span-full text-center py-12">
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      ) : error ? (
        <div className="col-span-full text-center py-12">
          <p className="text-sm text-red-500">Error loading products</p>
        </div>
      ) : products.length > 0 ? (
        products.map((product, index) => (
          <div
            key={product.id}
            className={`rounded-xl bg-card border border-border overflow-hidden hover:shadow-md transition-all duration-500 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ animationDelay: isTransitioning ? "0ms" : `${index * 50}ms` }}
          >
            <a href={`/buy/${product.kode_barang}`} className="block relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-5 flex items-center justify-center h-32">
                <img src={product.image_url || "/placeholder.svg"} alt={product.nama_produk} className="h-24 w-24 object-contain" />
              </div>
            </a>

            <div className="p-3 space-y-1.5 text-center">
              <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">{product.kategori}</div>
              <h3 className="font-semibold text-foreground text-sm line-clamp-2">{product.nama_produk}</h3>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-sm text-muted-foreground">Tidak ada produk yang ditemukan</p>
        </div>
      )}
    </div>
  )
}

export default ProdukListing
