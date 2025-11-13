"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { ChevronDown } from "lucide-react"

interface PaymentMethod {
  code: string
  name: string
  icon?: string
  status?: boolean
  total_fee?: string
}

interface GroupedPaymentSelectorProps {
  selectedPayment: string
  onPaymentSelect: (code: string) => void
}

export function GroupedPaymentSelector({ selectedPayment, onPaymentSelect }: GroupedPaymentSelectorProps) {
  const [paymentGroups, setPaymentGroups] = useState<Record<string, PaymentMethod[]>>({})
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("/api/payment")
        if (!response.ok) throw new Error("API error")
        const data = await response.json()
        if (!data || Object.keys(data).length === 0) {
          setHasError(true)
        } else {
          setPaymentGroups(data)
          setExpandedGroups({})
        }
      } catch (error) {
        setHasError(true)
        console.error("Error fetching payment methods:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  const toggleGroup = (groupName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading payment methods...</div>
  }

  if (hasError) {
    return <div className="text-muted-foreground">No payment available, Report to the website owner to activate the payment channel</div>
  }

  return (
    <div className="space-y-3">
      {Object.entries(paymentGroups).map(([groupName, methods]) => (
        <div key={groupName} className="border border-input rounded-lg overflow-hidden">
          {/* Group Header */}
          <button
            type="button"
            onClick={(e) => toggleGroup(groupName, e)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors bg-muted/30"
          >
            <span className="font-semibold text-foreground">{groupName}</span>
            <ChevronDown
              size={20}
              className={`transition-transform ${expandedGroups[groupName] ? "rotate-180" : ""} text-muted-foreground`}
            />
          </button>

          {/* Group Content */}
          {expandedGroups[groupName] && (
            <div className="p-4 bg-card space-y-3 border-t border-input">
              <div className="flex flex-wrap gap-3">
                {methods.map((method) => (
                  <button
                    key={method.code}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onPaymentSelect(method.code)
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPayment === method.code
                        ? "border-primary bg-primary/10"
                        : "border-input hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    {/* Thumbnail */}
                    {method.icon && (
                      <img
                        src={method.icon || "/placeholder.svg"}
                        alt={method.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/payment-icon.jpg"
                        }}
                      />
                    )}

                    {/* Payment Method Name */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{method.name}</p>
                      {method.total_fee && <p className="text-xs text-muted-foreground">Fee: {method.total_fee}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
