"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { StockForm } from "@/components/stok/stock-form"
import { Button } from "@/components/ui/button"
import { getSponges } from "@/api/sponges"
import { createStock, getStockSummary } from "@/api/stocks"
import type { Sponge, StockSummaryItem } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function StokCikisPage() {
  const [sungerler, setSungerler] = useState<Sponge[]>([])
  const [stokDurumlari, setStokDurumlari] = useState<StockSummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

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
      
      // Stok durumlarını yenile
      await loadData()
      
    } catch (error: any) {
      console.error("Stok çıkış hatası:", error)
      toast.error(error.response?.data?.detail || "Stok çıkışı sırasında bir hata oluştu")
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/stok")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Stok Çıkışı</h2>
              <p className="text-muted-foreground mt-1">Stok çıkışı yapın</p>
            </div>
          </div>

          <div className="max-w-2xl">
            {loading ? (
              <p className="text-muted-foreground">Yükleniyor...</p>
            ) : (
              <StockForm 
                type="out" 
                sungerler={sungerler} 
                stokDurumlari={stokDurumlari} 
                onSubmit={handleSubmit} 
              />
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
