"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "react-hot-toast"
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  X,
  Package,
  Search,
  Zap,
  Star,
  CheckCheckIcon,
  DollarSign,
} from "lucide-react"

interface Variant {
  kode_variant: string
  nama_variant: string
  harga: string
  harga_formatted: string
  total_stock: number
}

interface Product {
  kode_barang: string
  nama_produk: string
  deskripsi: string
  kategori: string
  image_url: string
  total_variants: number
  total_terjual: number
  variants: Variant[]
  badges?: string[]
}

interface Review {
  id: number
  transaction_id: string
  kode_produk: string
  customer_name: string
  customer_email: string
  rating_amount: number
  ulasan: string
  created_at: string
  updated_at: string
}

interface ReviewsData {
  success: boolean
  data: {
    kode_barang: string
    total_reviews: number
    average_rating: number
    reviews: Review[]
    pagination: {
      current_page: number
      total_pages: number
      per_page: number
      total: number
    }
  }
}

interface CartItem {
  sku: string
  name: string
  price: string
  quantity: number
  subtotal: number
  product_url: string
  image_url: string
}

export default function ProductViewer({ productId = "demo" }: { productId?: string }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<"variants" | "reviews">("variants")
  const [searchVariant, setSearchVariant] = useState("")
  const [darkMode, setDarkMode] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ReviewsData | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        setCart(cartData)
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/getproduk/${productId}`)
        const data = await response.json()
        if (data.success) {
          setProduct(data.data)

          if (isHydrated && cart.length > 0) {
            const matchingCartItem = cart.find((item) => {
              return data.data.variants.some((v: Variant) => v.kode_variant === item.sku)
            })

            if (matchingCartItem) {
              const matchingVariant = data.data.variants.find((v: Variant) => v.kode_variant === matchingCartItem.sku)
              if (matchingVariant) {
                setSelectedVariant(matchingVariant)
              }
            }
          }
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, isHydrated, cart])

  const fetchReviews = async () => {
    if (!product) return
    setReviewsLoading(true)
    try {
      const response = await fetch("/api/myulasan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kode_barang: product.kode_barang,
        }),
      })
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to load reviews")
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "reviews" && !reviews && product) {
      fetchReviews()
    }
  }, [activeTab, product, reviews])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isHydrated])

  const getAvailableStock = (sku: string, total_stock: number) => {
    const cartItem = cart.find((item) => item.sku === sku)
    const cartQuantity = cartItem?.quantity || 0
    return Math.max(0, total_stock - cartQuantity)
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return

    const availableStock = getAvailableStock(selectedVariant.kode_variant, selectedVariant.total_stock)
    if (quantity > availableStock) {
      toast.error("Quantity exceeds available stock")
      return
    }

    const price = Number.parseInt(selectedVariant.harga)
    const subtotal = price * quantity

    const newCartItem: CartItem = {
      sku: selectedVariant.kode_variant,
      name: `${product.nama_produk} - ${selectedVariant.nama_variant}`,
      price: selectedVariant.harga,
      quantity: quantity,
      subtotal: subtotal,
      product_url: `/buy/${productId}`,
      image_url: product.image_url,
    }

    const existingIndex = cart.findIndex((item) => item.sku === newCartItem.sku)

    if (existingIndex >= 0) {
      const updatedCart = [...cart]
      updatedCart[existingIndex].quantity += quantity
      updatedCart[existingIndex].subtotal += subtotal
      setCart(updatedCart)
    } else {
      setCart([...cart, newCartItem])
    }

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    setQuantity(1)
  }

  const updateQuantity = (sku: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.sku === sku) {
          const newQty = Math.max(1, item.quantity + delta)
          const price = Number.parseInt(item.price)
          return { ...item, quantity: newQty, subtotal: price * newQty }
        }
        return item
      }),
    )
  }

  const removeFromCart = (sku: string) => {
    setCart(cart.filter((item) => item.sku !== sku))
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const filteredVariants =
    product?.variants.filter((v) => v.nama_variant.toLowerCase().includes(searchVariant.toLowerCase())) || []

  const getBoringAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-lg">Product not found</div>
      </div>
    )
  }

  return (
    <>
      <div>
        <Toaster
          toastOptions={{
            duration: 1000,
            removeDelay: 500,
          }}
        />
      </div>
      <div className="pt-10 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-0">
          <button
            onClick={() => router.push("/store")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors mb-2"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </button>
        </div>
        <div
          className="absolute inset-0 rounded-2xl blur-3xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0, 238, 255, 0.4), rgba(0, 179, 255, 0.34), transparent 70%)",
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {alertMessage && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
              <X className="w-5 h-5" />
              {alertMessage}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4">
              <div className="aspect-square lg:aspect-[3/2] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center sticky top-10">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.nama_produk}
                  className="relative z-10 w-auto h-auto max-w-[50%] max-h-[50%] object-contain hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {product.nama_produk}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {product.kategori}
                    </span>
                    <span className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {product.total_terjual} Sale
                    </span>
                  </div>
                </div>
                <p className={`text-slate-700 dark:text-slate-300 leading-relaxed mb-4 ${showFullDesc ? "" : "line-clamp-3"}`}>
                  {product.deskripsi
                    ? showFullDesc
                      ? product.deskripsi
                      : product.deskripsi
                  : "Tidak ada deskripsi pada produk ini"}
                </p>
                {product.deskripsi && product.deskripsi.length > 120 && (
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mb-2"
                    onClick={() => setShowFullDesc((prev) => !prev)}
                  >
                    {showFullDesc ? "Read less" : "Read more"}
                  </button>
                )}
              </div>

              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab("variants")}
                  className={`px-4 sm:px-6 py-3 font-medium transition-colors relative text-sm sm:text-base ${
                    activeTab === "variants"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  Variants
                  {activeTab === "variants" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-4 sm:px-6 py-3 font-medium transition-colors relative text-sm sm:text-base ${
                    activeTab === "reviews"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Reviews
                  {activeTab === "reviews" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>
              </div>

              {activeTab === "variants" && (
                <div>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari varian produk"
                        value={searchVariant}
                        onChange={(e) => setSearchVariant(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Choose your needs</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {filteredVariants.map((variant) => {
                      const isSelected = selectedVariant?.kode_variant === variant.kode_variant
                      const isAvailable = variant.total_stock > 0

                      return (
                        <button
                          key={variant.kode_variant}
                          onClick={() => {
                            if (isAvailable) {
                              setSelectedVariant(variant)
                              setQuantity(1)
                            }
                          }}
                          disabled={!isAvailable}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all text-left
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-slate-700"
                                : isAvailable
                                  ? "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                                  : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 opacity-60 cursor-not-allowed"
                            }
                          `}
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm sm:text-base">
                            {variant.nama_variant}
                          </h4>

                          <div className="flex items-center gap-2 mb-3">
                            {isAvailable ? (
                              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                                <CheckCheckIcon className="w-3 h-3" />
                                TERSEDIA {variant.total_stock}
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                                <X className="w-3 h-3" />
                                HABIS
                              </span>
                            )}
                          </div>

                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {variant.harga_formatted}
                          </div>

                          {isSelected && isAvailable && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {selectedVariant && (
                    <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Quantity
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors border border-slate-300 dark:border-slate-600"
                            >
                              <Minus className="w-4 h-4 text-slate-900 dark:text-white" />
                            </button>
                            <div className="w-16 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 font-semibold text-slate-900 dark:text-white">
                              {quantity}
                            </div>
                            <button
                              onClick={() => {
                                const availableStock = getAvailableStock(
                                  selectedVariant.kode_variant,
                                  selectedVariant.total_stock,
                                )
                                setQuantity(Math.min(availableStock, quantity + 1))
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors border border-slate-300 dark:border-slate-600"
                            >
                              <Plus className="w-4 h-4 text-slate-900 dark:text-white" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right w-full sm:w-auto">
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Price</div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            Rp. {(Number.parseInt(selectedVariant.harga) * quantity).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleAddToCart}
                          className={`
                            flex-1 py-2 rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2 text-white
                            ${addedToCart ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                          `}
                          style={{ minWidth: 0 }}
                        >
                          {addedToCart ? (
                            <>
                              <Check className="w-4 h-4" />
                              Added to Cart!
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowCart(!showCart)}
                          className="flex-1 py-2 rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700"
                          style={{ minWidth: 0 }}
                        >
                          Your Cart
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  {reviewsLoading ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                      <p className="text-slate-500 dark:text-slate-400">Loading reviews...</p>
                    </div>
                  ) : reviews?.success && reviews.data.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {/* Rating Summary */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.round(reviews.data.average_rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              {reviews.data.average_rating.toFixed(1)}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 ml-2">
                              ({reviews.data.total_reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      {reviews.data.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                        >
                          <div className="flex gap-4 items-start">
                            {/* Avatar */}
                            <img
                              src={getBoringAvatarUrl(review.customer_name) || "/placeholder.svg"}
                              alt={review.customer_name}
                              className="w-12 h-12 rounded-full flex-shrink-0"
                            />

                            {/* Review Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-white">
                                    {review.customer_name}
                                  </h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatDate(review.created_at)}
                                  </p>
                                </div>
                              </div>

                              {/* Rating */}
                              <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating_amount
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300 dark:text-slate-600"
                                    }`}
                                  />
                                ))}
                              </div>

                              {/* Review Text */}
                              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {review.ulasan}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                      <Star className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-500 dark:text-slate-400">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showCart && (
          <>
            <div className="pt-10 bg-white dark:bg-slate-900 transition-colors duration-300">
              <>
                {/* Backdrop with fade animation */}
                <div
                  className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                    showCart ? "opacity-100 bg-black/60 backdrop-blur-sm" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setShowCart(false)}
                />

                {/* Cart panel with slide animation */}
                <div
                  className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
                    showCart ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart</h2>
                      <button
                        onClick={() => setShowCart(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-6 h-6 text-slate-900 dark:text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                        <Package className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg">Keranjang Belanjaanmu Kosong</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.sku}
                            className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                          >
                            <div className="flex gap-3 items-start">
                              <img
                                src={item.image_url || "/placeholder.svg"}
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover bg-white"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-bold mt-1 text-sm">
                                  Rp. {Number.parseInt(item.price).toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-slate-900 dark:text-white">{item.quantity}x</span>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.sku)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-center justify-between text-lg">
                        <span className="text-slate-600 dark:text-slate-400">Total Items:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{getTotalItems()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xl">
                        <span className="font-semibold text-slate-900 dark:text-white">Total:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          Rp. {getTotalPrice().toLocaleString("id-ID")}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          router.push("/cart")
                          setShowCart(false)
                        }}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-all text-white"
                      >
                        Checkout Now
                      </button>
                    </div>
                  )}
                </div>
              </>
            </div>
          </>
        )}
      </div>
    </>
  )
}
