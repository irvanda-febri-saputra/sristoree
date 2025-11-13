"use client"

import { CheckCircle, Zap, Shield } from "lucide-react"

const benefits = [
  {
    title: "Serba Otomatis",
    description: "Kamu tidak perlu menunggu admin online",
    icon: CheckCircle,
  },
  {
    title: "Instant Premium",
    description: "Dapatkan aplikasi premiummu secara instant",
    icon: Zap,
  },
  {
    title: "Trusted",
    description: "Kami terpercaya sudah memproses ratusan client",
    icon: Shield,
  },
]

export function BenefitsSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center transition-colors duration-300">Benefit Berbelanja</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-8 hover:border-blue-400 dark:hover:border-blue-700/60 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 transition-colors duration-300">{benefit.title}</h3>
                  <p className="text-muted-foreground transition-colors duration-300">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
