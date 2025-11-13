"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 lg:pt-10 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/50 dark:to-purple-950/30 transition-colors duration-500">
      <div className="mx-auto max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="max-w-2xl space-y-6 lg:text-left text-center lg:order-1 order-2">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight transition-colors duration-300">
              Dapatkan Berbagai{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent transition-all duration-300">
                Keuntungan
              </span>{" "}
              Dengan Premium
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg lg:mx-0 mx-auto transition-colors duration-300">
              Nikmati kemudahan akses aplikasi premium dan solusi digital lainnya dengan harga terjangkau dan proses
              cepat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center pt-4">
              <Link href="/store">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 hover:scale-105">
                  Mulai Berbelanja
                </Button>
              </Link>
            </div>
          </div>

          {/* Image - Normal Size */}
        <div className="lg:w-1/2 w-3/4 max-w-[230px] sm:max-w-sm md:max-w-md lg:max-w-none lg:order-2 order-1">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-3xl blur-3xl opacity-40 group-hover:opacity-20 transition-all duration-500 pointer-events-none"></div>
            <div className="relative">
              <img
                src="/k.png"
                alt="Hero character"
                className="w-full h-auto"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Decorative Elements - More subtle */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>
    </section>
  )
}
