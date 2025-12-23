"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StockForm } from "@/components/stok/stock-form"
import { getSponges } from "@/api/sponges"
import { createStock, getStockSummary } from "@/api/stocks"
import type { Sponge, StockSummaryItem } from "@/lib/types"
import { toast } from "sonner"

interface StokCikisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StokCikisModal({ open, onOpenChange, onSuccess }: StokCikisModalProps) {
  const [sungerler, setSungerler] = useState<Sponge[]>([])
  const [stokDurumlari, setStokDurumlari] = useState<StockSummaryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      setLoading(true)
      const [spongeList, summary] = await Promise.all([
        getSponges(),
        getStockSummary()
      ])
      setSungerler(spongeList || [])
      setStokDurumlari(summary || [])
    } catch (error) {
      console.error("Veri yükleme hatası:", error)
      toast.error("Veriler yüklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: {
    sponge_id: number
    quantity: number
    note?: string
  }) => {
    try {
      await createStock({
        sponge_id: data.sponge_id,
        quantity: data.quantity,
        type: "out",
        note: data.note
      })

      toast.success("Stok çıkışı başarıyla kaydedildi!")

      await loadData()
      onSuccess?.()
      onOpenChange(false)

    } catch (error: any) {
      console.error("Stok çıkış hatası:", error)
      toast.error(error.response?.data?.detail || "Stok çıkışı sırasında bir hata oluştu")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90vw] max-w-[500px] m-0 p-8 overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: 'linear-gradient(135deg, rgba(5, 38, 89, 0.98), rgba(2, 16, 36, 0.98))',
          color: '#FFFFFF',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(193, 232, 255, 0.2)',
          borderRadius: '18px'
        }}
      >
        <DialogHeader className="pb-6 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold mb-2" style={{
            color: '#C1E8FF',
            textAlign: 'center',
            marginBottom: '25px'
          }}>Stok Çıkış Paneli</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Yükleniyor...</p>
        ) : (
          <StockForm
            type="out"
            sungerler={sungerler}
            stokDurumlari={stokDurumlari}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

