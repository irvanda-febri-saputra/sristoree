"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GroupedPaymentSelector } from "@/components/grouped-payment"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"

interface CartItem {
  name: string
  price: number
  quantity: number
  variantName?: string
  sku?: string
  image_url?: string
  product_url?: string
}

interface CustomerData {
  customer_name: string
  customer_email: string
  paymentMethod: string
}

interface VoucherResponse {
  success: boolean
  message?: string
  data?: {
    calculation?: {
      discount_amount: number
      discount_amount_formatted?: string
    }
  }
}

export default function Cart() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  useEffect(() => {
    const cartData = localStorage.getItem("cart")
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData)
        // Handle both array format and {items: []} format
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart)
        } else if (parsedCart.items && Array.isArray(parsedCart.items)) {
          setCart(parsedCart.items)
        } else {
          setCart([])
        }
      } catch (error) {
        console.error("Error parsing cart:", error)
        setCart([])
      }
    }

    const savedCustomer = localStorage.getItem("customer_data")
    if (savedCustomer) {
      try {
        const customerData = JSON.parse(savedCustomer)
        setCustomerName(customerData.customer_name || "")
        setCustomerEmail(customerData.customer_email || "")
        setSelectedPayment(customerData.paymentMethod || "")
      } catch (error) {
        console.error("Error parsing customer data:", error)
      }
    }

    setIsLoading(false)
  }, [])

  const totalPrice = cart.reduce((sum, item) => {
    const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
    return sum + price * item.quantity
  }, 0)

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Mohon masukkan kode kupon")
      return
    }

    setIsValidatingCoupon(true)
    try {
      const response = await fetch("/api/cekvoucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kode_voucher: couponCode,
          total_harga: totalPrice,
        }),
      })

      const result: VoucherResponse = await response.json()

      if (result.success && result.data && result.data.calculation) {
        const discountAmount = Number(result.data.calculation.discount_amount);
        setDiscount(discountAmount);
        toast.success(`Kupon berhasil digunakan! Diskon: ${result.data.calculation.discount_amount_formatted}`);
      } else {
        setDiscount(0);
        toast.error(result.message || "Kode kupon tidak valid");
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      toast.error("Terjadi kesalahan saat memvalidasi kupon")
      setDiscount(0)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const finalTotal = Math.max(totalPrice - discount, 0)
  const subtotal = totalPrice

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !customerEmail.trim()) {
      alert("Mohon isi nama dan email pelanggan")
      return
    }

    if (!selectedPayment) {
      alert("Mohon pilih metode pembayaran")
      return
    }
    if (couponCode.trim() && finalTotal < 5000) {
      toast.error("Total setelah diskon kupon harus minimal Rp 5.000")
      return
    }

    const customerData: CustomerData = {
      customer_name: customerName,
      customer_email: customerEmail,
      paymentMethod: selectedPayment,
    }
    localStorage.setItem("customer_data", JSON.stringify(customerData))

    setIsSubmitting(true)

    try {
      const orderItems = cart.map((item) => ({
        sku: item.sku || "",
        name: item.name,
        price: typeof item.price === "string" ? item.price : item.price.toString(),
        quantity: item.quantity,
        subtotal: (typeof item.price === "string" ? Number.parseFloat(item.price) : item.price) * item.quantity,
        product_url: item.product_url || "",
        image_url: item.image_url || "",
      }))

      const response = await toast.promise(
        fetch("/api/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: selectedPayment,
            customer_name: customerName,
            customer_email: customerEmail,
            totalHarga: subtotal,
            order_items: orderItems,
            voucher: couponCode,
          }),
        }),
        {
          loading: "Memproses pesanan...",
        },
      )

      if (!response.ok) {
        throw new Error(`${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        localStorage.removeItem("cart")
        window.location.href = "/invoice?id=" + encodeURIComponent(result.data.merchant_ref)
      } else {
        toast.error(result.message || "Terjadi kesalahan saat memproses pesanan.")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses pesanan."
      toast.error(errorMessage)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div>
        <Toaster />
      </div>
      <main className="min-h-screen bg-background py-8 px-4 mt-10">
        <div
          className="absolute inset-0 rounded-2xl blur-3xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.4), rgba(56,189,248,0.3), transparent 70%)",
          }}
        ></div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Keranjang Belanja</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 mb-6 bg-card">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Detail Pesanan</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Keranjang Anda kosong</p>
                    <Link href="/store" className="text-primary hover:underline mt-2 inline-block">
                      Lanjutkan Berbelanja
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => {
                      const itemPrice = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price

                      const handleRemove = () => {
                        const newCart = cart.filter((_, i) => i !== index)
                        setCart(newCart)
                        localStorage.setItem("cart", JSON.stringify(newCart))
                      }

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center pb-4 border-b border-border last:border-b-0"
                        >
                          <div className="flex items-center flex-1 gap-4">
                            {item.image_url && (
                              <img
                                src={item.image_url || "/placeholder.svg"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border border-border bg-background"
                              />
                            )}
                            <div>
                              <h3 className="font-medium text-foreground">{item.name}</h3>
                              {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                              {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                              <p className="text-sm text-muted-foreground">Kuantitas: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="font-semibold text-foreground">
                              Rp {(itemPrice * item.quantity).toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Rp {itemPrice.toLocaleString("id-ID")} × {item.quantity}
                            </p>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleRemove}
                              className="mt-2"
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
              <Card className="p-6 bg-card">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Informasi Pelanggan</h2>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground pb-[3px]">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="bg-background text-foreground border-input"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground pb-[3px]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="bg-background text-foreground border-input"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Metode Pembayaran</h3>
                    <GroupedPaymentSelector selectedPayment={selectedPayment} onPaymentSelect={setSelectedPayment} />
                  </div>
                  {!selectedPayment && (
                    <p className="text-sm text-red-500 mt-2">Mohon pilih metode pembayaran sebelum melanjutkan.</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={cart.length === 0 || isSubmitting || !selectedPayment}
                  >
                    {isSubmitting ? "Memproses..." : "Lanjutkan ke Pembayaran"}
                  </Button>
                </form>
              </Card>
            </div>
            <div>
              <Card className="p-6 sticky top-17 bg-card">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Ringkasan Pesanan</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span className="text-foreground">Rp 0,00-</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <span className="text-green-700 dark:text-green-400">Diskon Kupon</span>
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        -Rp {discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="coupon" className="text-foreground pb-[3px]">
                    Masukkan kupon
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="coupon"
                      type="text"
                      placeholder="Kode kupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-background text-foreground border-input"
                      disabled={isSubmitting || isValidatingCoupon}
                    />
                    <Button
                      type="button"
                      onClick={handleValidateCoupon}
                      disabled={isValidatingCoupon}
                      className="flex items-center gap-1"
                    >
                      {isValidatingCoupon ? "..." : <ArrowRight className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">Rp {finalTotal.toLocaleString("id-ID")}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
