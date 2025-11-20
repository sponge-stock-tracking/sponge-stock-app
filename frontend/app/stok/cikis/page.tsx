"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { StockForm } from "@/components/stok/stock-form"
import { Button } from "@/components/ui/button"
import { initializeDemoData, getSungerTurleri, getStokDurumlari, saveStokHareket } from "@/lib/storage"
import type { SungerTuru, StokDurum } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

export default function StokCikisPage() {
  const [sungerler, setSungerler] = useState<SungerTuru[]>([])
  const [stokDurumlari, setStokDurumlari] = useState<StokDurum[]>([])
  const router = useRouter()

  useEffect(() => {
    initializeDemoData()
    setSungerler(getSungerTurleri())
    setStokDurumlari(getStokDurumlari())
  }, [])

  const handleSubmit = (data: { sungerId: string; miktar: number; tarih: string; aciklama: string }) => {
    saveStokHareket({
      id: Date.now().toString(),
      sungerId: data.sungerId,
      tip: "cikis",
      miktar: data.miktar,
      tarih: data.tarih,
      aciklama: data.aciklama,
    })

    // Refresh stock status
    setStokDurumlari(getStokDurumlari())
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Stok Çıkışı</h2>
              <p className="text-muted-foreground mt-1">Stok çıkışı yapın</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <StockForm type="cikis" sungerler={sungerler} stokDurumlari={stokDurumlari} onSubmit={handleSubmit} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
