"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  ArrowRight,
  User,
  Mail,
  RefreshCw,
  MessageSquare,
} from "lucide-react"
import { ReviewModal } from "@/components/review-modal"
import Image from "next/image"
import { Toaster } from "react-hot-toast"

interface CartItem {
  kode_barang: string
  kode_variant: string
  nama_produk: string
  harga: string
  quantity: number
  subtotal: number
  product_url: string
  image_url: string
}

interface TransactionData {
  idTransaksi: string
  paymentUrl: string
  customer_name: string
  email: string
  idMerchant: string
  status: "pending" | "paid" | "expired"
  nominal: string
  nominal_formatted: string
  expired_at: string
  created_at: string
  updated_at: string
  cart: CartItem[]
  stokUrl: string | null
  stokPath: string | null
  has_stock: boolean
}

export default function InvoicePage() {
  const searchParams = useSearchParams()
  const trxId = searchParams.get("id")

  const [transaction, setTransaction] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const hasDownloaded = useRef(false)

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate a refresh action
    setTimeout(() => {
      setRefreshing(false)
      // Fetch transaction data again
      fetchTransactionData(trxId!)
    }, 2000)
  }

const downloadFromStokUrl = async (stokUrl: string, trxId: string) => {
  try {
    const response = await fetch(stokUrl)
    const blob = await response.blob()

    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = `stock-${trxId}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (err) {
    console.error("Error downloading stock:", err)
  }
}

// Automatically download file on load if status is "paid"
useEffect(() => {
  if (
    transaction &&
    transaction.status === "paid" &&
    transaction.stokUrl &&
    !hasDownloaded.current
  ) {
    hasDownloaded.current = true
    downloadFromStokUrl(transaction.stokUrl, transaction.idTransaksi)
  }
}, [transaction])

     const fetchTransactionData = async (trxId: string) => {
      try {
        const response = await fetch("/api/trxapi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trxid: trxId }),
        })
        const result = await response.json()

        if (result.success && result.data) {
          setTransaction(result.data)

          if (result.data.status === "paid" && result.data.stokUrl && !hasDownloaded.current) {
            hasDownloaded.current = true
            downloadFromStokUrl(result.data.stokUrl, result.data.idTransaksi)
          }
        } else {
          setError(result.message || "Transaksi tidak ditemukan")
        }
      } catch (err) {
        console.error("Error fetching transaction:", err)
        setError("Gagal memuat data transaksi")
      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    if (trxId) {
      fetchTransactionData(trxId)
    }
  }, [trxId])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Memuat invoice...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !transaction) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Transaksi tidak ditemukan"}</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </main>
    )
  }

  const statusConfig = {
    pending: {
      color: "bg-amber-500",
      text: "Menunggu Pembayaran",
      icon: Clock,
      bgClass: "bg-amber-50 dark:bg-amber-950/20",
    },
    paid: {
      color: "bg-green-500",
      text: "Pembayaran Berhasil",
      icon: CheckCircle2,
      bgClass: "bg-green-50 dark:bg-green-950/20",
    },
    expired: {
      color: "bg-red-500",
      text: "Transaksi Kadaluarsa",
      icon: AlertCircle,
      bgClass: "bg-red-50 dark:bg-red-950/20",
    },
  }

  const config = statusConfig[transaction.status]
  const StatusIcon = config.icon
  const totalAmount = Number.parseFloat(transaction.nominal)

  return (
    <>
      <div>
        <Toaster />
      </div>
      <ReviewModal open={reviewModalOpen} onOpenChange={setReviewModalOpen} transactionId={transaction.idTransaksi} />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl mt-10">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <Badge className={`${config.color} hover:${config.color} text-white px-4 py-2 text-sm font-medium`}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {config.text}
            </Badge>
          </div>

          {/* Invoice Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {transaction.idTransaksi}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {new Date(transaction.created_at).toLocaleString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Customer Info & Products */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Informasi Pelanggan</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800">
                      <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nama Lengkap</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{transaction.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800">
                      <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                        {transaction.email}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Products */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Rincian Produk</h2>
                <div className="space-y-4">
                  {transaction.cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.nama_produk}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-slate-400">No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm mb-1 truncate">
                          {item.nama_produk}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {item.kode_variant}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          1× Rp {Number.parseFloat(item.harga).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Rp {Number.parseFloat(item.harga).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Total Summary */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Total Pembayaran
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </p>

                  {transaction.status === "pending" && (
                    <div className="pt-4 border-t border-blue-200 dark:border-blue-900">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Berlaku hingga:</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {new Date(transaction.expired_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {transaction.status === "pending" && (
                  <>
                    <div className="flex gap-3">
                      <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <a href={transaction.paymentUrl} target="_blank" rel="noopener noreferrer">
                          Bayar Invoice
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        size="icon"
                        className="bg-slate-600 hover:bg-slate-700 text-white"
                      >
                        <RefreshCw className={`h-7 w-7 ${refreshing ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </>
                )}

                {transaction.status === "paid" && transaction.stokUrl && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => downloadFromStokUrl(transaction.stokUrl!, transaction.idTransaksi)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Unduh File
                  </Button>
                )}

                {transaction.status === "paid" && (
                  <Button
                    onClick={() => setReviewModalOpen(true)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Beri Ulasan
                  </Button>
                )}

                {transaction.status === "expired" && (
                  <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-sm text-red-800 dark:text-red-300">
                      Transaksi telah kadaluarsa. Silakan buat pesanan baru.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
