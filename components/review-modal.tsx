"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from 'lucide-react'
import { toast } from "react-hot-toast"

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionId: string
}

export function ReviewModal({ open, onOpenChange, transactionId }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Silakan pilih rating")
      return
    }

    if (comment.trim() === "") {
      toast.error("Silakan tulis komentar")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/buatsaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: transactionId,
          rating_amount: rating,
          ulasan: comment,
        }),
      })

      const result = await response.json()

      if (result.success || response.ok) {
        toast.success("Ulasan berhasil dikirim!")
        setRating(0)
        setComment("")
        onOpenChange(false)
      } else {
        toast.error(result.message || "Gagal mengirim ulasan")
      }
    } catch (err) {
      console.error("Error submitting review:", err)
      toast.error("Gagal mengirim ulasan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Beri Ulasan</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Bagikan pengalaman Anda dengan transaksi ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900 dark:text-white">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Anda memberikan rating {rating} dari 5 bintang
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-slate-900 dark:text-white">
              Komentar
            </label>
            <Textarea
              id="comment"
              placeholder="Tulis komentar Anda di sini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {comment.length}/500 karakter
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-200 dark:border-slate-700"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || comment.trim() === ""}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
