"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { StockFilters } from "@/components/stok/stock-filters"
import { StockTable } from "@/components/stok/stock-table"
import { StockDetailModal } from "@/components/stok/stock-detail-modal"
import { Button } from "@/components/ui/button"
import { initializeDemoData, getStokDurumlari, getSungerTurleri, getSungerHareketleri } from "@/lib/storage"
import type { StokDurum, SungerTuru, StokHareket } from "@/lib/types"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StokPage() {
  const [stokDurumlari, setStokDurumlari] = useState<StokDurum[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSunger, setSelectedSunger] = useState<SungerTuru | null>(null)
  const [selectedHareketler, setSelectedHareketler] = useState<StokHareket[]>([])
  const [sungerler, setSungerler] = useState<SungerTuru[]>([])
  const router = useRouter()

  useEffect(() => {
    initializeDemoData()
    setStokDurumlari(getStokDurumlari())
    setSungerler(getSungerTurleri())
  }, [])

  const filteredStoklar = stokDurumlari.filter((stok) => {
    const matchesSearch = stok.sungerAd.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterType === "critical") {
      matchesFilter = stok.mevcutStok <= stok.kritikStok
    } else if (filterType === "normal") {
      matchesFilter = stok.mevcutStok > stok.kritikStok
    }

    return matchesSearch && matchesFilter
  })

  const handleDetailClick = (sungerId: string) => {
    const sunger = sungerler.find((s) => s.id === sungerId)
    if (sunger) {
      setSelectedSunger(sunger)
      setSelectedHareketler(getSungerHareketleri(sungerId))
      setIsDetailModalOpen(true)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Stok Yönetimi</h2>
                <p className="text-muted-foreground mt-1">Tüm stokları görüntüle ve yönet</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/stok/giris")}>
                <Plus className="h-4 w-4 mr-2" />
                Stok Girişi
              </Button>
              <Button variant="outline" onClick={() => router.push("/stok/cikis")}>
                <Minus className="h-4 w-4 mr-2" />
                Stok Çıkışı
              </Button>
            </div>
          </div>

          <StockFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterChange={setFilterType}
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Toplam <span className="font-semibold text-foreground">{filteredStoklar.length}</span> stok gösteriliyor
            </p>
            <p>
              Kritik stok:{" "}
              <span className="font-semibold text-orange-600">
                {filteredStoklar.filter((s) => s.mevcutStok <= s.kritikStok).length}
              </span>
            </p>
          </div>

          <StockTable stoklar={filteredStoklar} onDetailClick={handleDetailClick} />
        </main>

        <StockDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          sunger={selectedSunger}
          hareketler={selectedHareketler}
        />
      </div>
    </ProtectedRoute>
  )
}
