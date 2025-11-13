"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, CreditCard, Mail, Package, ShoppingCart, ArrowRight } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HowToOrderPage() {
    const steps = [
        {
            number: 1,
            title: "Jelajahi Produk",
            description: "Kunjungi toko kami dan lihat paket yang tersedia",
            icon: ShoppingCart,
        },
        {
            number: 2,
            title: "Pilih Paket Anda",
            description: "Pilih paket yang sesuai dengan kebutuhan Anda",
            icon: Package,
        },
        {
            number: 3,
            title: "Masukkan Detail Pembayaran",
            description: "Berikan informasi pembayaran Anda dengan aman",
            icon: CreditCard,
        },
        {
            number: 4,
            title: "Konfirmasi Pesanan",
            description: "Tinjau pesanan Anda dan lakukan pembayaran",
            icon: CheckCircle2,
        },
        {
            number: 5,
            title: "Terima Konfirmasi",
            description: "Dapatkan email berisi ID transaksi dan faktur Anda",
            icon: Mail,
        },
    ]

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <Header />
            
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
                <div className="container mx-auto px-4 py-20 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <Link href="/">
                            <Button variant="ghost" className="mb-6 group hover:bg-primary/10">
                                <ArrowRight className="h-4 w-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                        
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
                            Cara Memesan
                        </h1>
                        
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Ikuti langkah-langkah sederhana ini untuk mendapatkan 
                            <span className="text-primary font-semibold"> langganan Premium </span>
                            Anda dalam hitungan menit
                        </p>
                    </div>
                </div>
            </div>

            {/* Steps Section */}
            <div className="container mx-auto px-4 pb-20 mt-10">
                <div className="max-w-4xl mx-auto">
                    <div className="grid gap-8 md:gap-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isLast = index === steps.length - 1
                            
                            return (
                                <div key={step.number} className="relative">
                                    {/* Connector Line */}
                                    {!isLast && (
                                        <div className="absolute left-6 top-24 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent hidden md:block" />
                                    )}
                                    
                                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
                                        <CardContent className="p-8">
                                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                                {/* Icon and Number */}
                                                <div className="flex-shrink-0 relative">
                                                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                        <Icon className="h-8 w-8" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 bg-background border-2 border-primary rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold text-primary">
                                                        {step.number}
                                                    </div>
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-grow space-y-2">
                                                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                                
                                                {/* Arrow for larger screens */}
                                                {!isLast && (
                                                    <div className="hidden lg:block text-primary/30">
                                                        <ArrowRight className="h-6 w-6 rotate-90" />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Siap Untuk Memulai?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Bergabunglah dengan ribuan pelanggan yang sudah merasakan layanan premium kami
                        </p>
                        
                        <Link href="/store">
                            <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow group">
                                Mulai Memesan Sekarang
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    )
}
