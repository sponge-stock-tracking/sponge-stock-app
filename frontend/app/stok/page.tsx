"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { StockFilters } from "@/components/stok/stock-filters"
import { StockTable } from "@/components/stok/stock-table"
import { StockDetailModal } from "@/components/stok/stock-detail-modal"
import { Button } from "@/components/ui/button"
import { getSponges } from "@/api/sponges"
import { getStockSummary, getStockByDate } from "@/api/stocks"
import type { Sponge, StockSummaryItem, StockMovement } from "@/lib/types"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function StokPage() {
  const [stokDurumlari, setStokDurumlari] = useState<StockSummaryItem[]>([])
  const [sungerler, setSungerler] = useState<Sponge[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSponge, setSelectedSponge] = useState<Sponge | null>(null)
  const [selectedHareketler, setSelectedHareketler] = useState<StockMovement[]>([])
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

  const filteredStoklar = stokDurumlari.filter((stok) => {
    const matchesSearch = stok.name.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterType === "critical") {
      matchesFilter = stok.current_stock <= stok.critical_stock
    } else if (filterType === "normal") {
      matchesFilter = stok.current_stock > stok.critical_stock
    }

    return matchesSearch && matchesFilter
  })

  const handleDetailClick = async (spongeId: number) => {
    const sponge = sungerler.find((s) => s.id === spongeId)
    if (sponge) {
      try {
        setSelectedSponge(sponge)
        
        // Son 30 günün hareketlerini çek
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        
        const allMovements = await getStockByDate(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        )
        
        // Bu süngere ait hareketleri filtrele
        const spongeMovements = allMovements?.filter(
          (m: StockMovement) => m.sponge_id === spongeId
        ) || []
        
        setSelectedHareketler(spongeMovements)
        setIsDetailModalOpen(true)
      } catch (error) {
        console.error("Hareket yükleme hatası:", error)
        toast.error("Stok hareketleri yüklenirken bir hata oluştu")
      }
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

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Yükleniyor...</p>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Toplam <span className="font-semibold text-foreground">{filteredStoklar.length}</span> stok gösteriliyor
                </p>
                <p>
                  Kritik stok:{" "}
                  <span className="font-semibold text-orange-600">
                    {filteredStoklar.filter((s) => s.current_stock <= s.critical_stock).length}
                  </span>
                </p>
              </div>

              <StockTable stoklar={filteredStoklar} onDetailClick={handleDetailClick} />
            </>
          )}
        </main>

        <StockDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          sunger={selectedSponge}
          hareketler={selectedHareketler}
        />
      </div>
    </ProtectedRoute>
  )
}
