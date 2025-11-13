"use client"

import { Moon, Sun, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import Link from "next/link"

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    const loadCartCount = () => {
      const cart = localStorage.getItem("cart")
      if (cart) {
        const cartData = JSON.parse(cart)
        const count = cartData.reduce((total: any, item: { quantity: any }) => total + (item.quantity || 0), 0)
        setCartCount(count)
      }
    }
    loadCartCount()

    const handleStorageChange = () => {
      loadCartCount()
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-border bg-background/80 backdrop-blur-xl transition-colors duration-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Home" className="inline-block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-400 bg-clip-text text-transparent transition-all duration-300">
                  sristoree
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/cart" aria-label="Shopping cart">
                <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:scale-110">
                  <ShoppingCart className="size-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle theme"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="relative overflow-hidden transition-all duration-300 hover:scale-110"
                >
                  <Sun className="size-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute size-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
