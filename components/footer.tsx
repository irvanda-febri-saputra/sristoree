"use client"

import { Mail, MessageCircle, Send, Heart } from "lucide-react"

export function Footer() {
  return (
  <footer className="border-t border-border bg-slate-100 dark:bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              sristoree.com
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              sristoree menawarkan produk digital berkualitas di berbagai bidang hiburan, termasuk musik, film, dan
              konten digital lainnya.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://chat.whatsapp.com/CCMyNQGxGgs8mfW9kiMkLi" className="p-2 bg-card hover:bg-accent rounded-full transition-colors">
                <MessageCircle className="h-5 w-5 text-foreground" />
              </a>
              <a href="mailto:support@sristoree.com" className="p-2 bg-card hover:bg-accent rounded-full transition-colors">
                <Mail className="h-5 w-5 text-foreground" />
              </a>
              <a href="https://www.instagram.com/sristoree?igsh=MWhkbW01bTNuZnNzdQ==" className="p-2 bg-card hover:bg-accent rounded-full transition-colors">
                <Send className="h-5 w-5 text-foreground" />
              </a>
            </div>
          </div>

          {/* Kategori Produk */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kategori Produk</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/store" className="hover:text-primary transition-colors">
                  Desain
                </a>
              </li>
              <li>
                <a href="/store" className="hover:text-blue-400 transition-colors">
                  Musik & Video
                </a>
              </li>
              <li>
                <a href="/store" className="hover:text-blue-400 transition-colors">
                  Productivity
                </a>
              </li>
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Fitur-Fitur Seru
                </a>
              </li>
              <li>
                <a href="/cara-order" className="hover:text-blue-400 transition-colors">
                  Cara Order
                </a>
              </li>
             
            </ul>
          </div>

          {/* Lainnya */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Lainnya</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://chat.whatsapp.com/CCMyNQGxGgs8mfW9kiMkLi" className="hover:text-primary transition-colors">
                  Tanya Admin
                </a>
              </li>
              <li>
                <a href="/cara-order" className="hover:text-blue-400 transition-colors">
                  Cara Pembelian
                </a>
              </li>
      
              <li>
                <a href="/faq" className="hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
  <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> sristoree
            </p>
            <div className="flex flex-col items-center">
              <p
              className="text-center text-xs text-muted-foreground mt-2 transition-all cursor-pointer select-none blur-sm hover:blur-none focus:blur-none"
              tabIndex={0}
              onClick={e => {
                const el = e.currentTarget;
                el.classList.toggle("blur-none");
                el.classList.toggle("blur-sm");
              }}
              onBlur={e => {
                e.currentTarget.classList.add("blur-sm");
                e.currentTarget.classList.remove("blur-none");
              }}
              onFocus={e => {
                e.currentTarget.classList.remove("blur-sm");
                e.currentTarget.classList.add("blur-none");
              }}
              >
              Billing Module By Aisbir Nusantara
              </p>
            </div>
        </div>
      </div>
    </footer>
  )
}
