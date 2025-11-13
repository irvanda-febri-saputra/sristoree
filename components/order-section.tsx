"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Pilih Produk",
  },
  {
    number: 2,
    title: "Pilih Tier",
  },
  {
    number: 3,
    title: "Scan Qris",
  },
]

export function OrderSection() {
  return (
  <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 dark:from-slate-950 dark:via-blue-950/50 dark:to-purple-950/30 transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 transition-colors duration-300">Cara Order</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <div className="flex flex-col items-center text-center mb-6 md:mb-0">
                <Badge className="mb-4 h-16 w-16 flex items-center justify-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-110">
                  {step.number}
                </Badge>
                <h3 className="text-xl font-bold text-foreground transition-colors duration-300">{step.title}</h3>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block mx-8 animate-pulse">
                  <ArrowRight className="h-8 w-8 text-blue-400 dark:text-blue-400 transition-colors duration-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
