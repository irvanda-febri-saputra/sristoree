"use client"

export function sristoreeSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 dark:bg-slate-950/50 relative transition-colors duration-500">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 transition-colors duration-300">Apa itu Space Digital?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto md:mx-0 rounded-full mb-8"></div>
          </div>
          <div className="max-w-3xl mt-8">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-300 dark:border-blue-800/30 rounded-2xl p-8 md:p-12 hover:border-blue-400 dark:hover:border-blue-700/60 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20">
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed text-center md:text-left transition-colors duration-300">
                sristoree yang menyediakan berbagai macam produk berkualitas dengan harga terjangkau. 
                Sistem pembayaran yang mudah dan aman. Pengiriman cepat dan terpercaya.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end mt-12 md:mt-0">
          <img src="/c.png" alt="Space Digital Illustration" className="w-80 max-w-full h-auto" />
        </div>
      </div>
    </section>
  )
}