"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { StockFilters } from "@/components/stok/stock-filters"
import { StockTable } from "@/components/stok/stock-table"
import { StockDetailModal } from "@/components/stok/stock-detail-modal"
import { getSponges } from "@/api/sponges"
import { getStockSummary, getStockByDate } from "@/api/stocks"
import type { Sponge, StockSummaryItem, StockMovement } from "@/lib/types"
import { Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { StokGirisModal } from "./stok-giris-modal"
import { StokCikisModal } from "./stok-cikis-modal"

interface StokModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StokModal({ open, onOpenChange }: StokModalProps) {
  const [stokDurumlari, setStokDurumlari] = useState<StockSummaryItem[]>([])
  const [sungerler, setSungerler] = useState<Sponge[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isGirisModalOpen, setIsGirisModalOpen] = useState(false)
  const [isCikisModalOpen, setIsCikisModalOpen] = useState(false)
  const [selectedSponge, setSelectedSponge] = useState<Sponge | null>(null)
  const [selectedHareketler, setSelectedHareketler] = useState<StockMovement[]>([])
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

        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)

        const allMovements = await getStockByDate(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        )

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

  const handleGirisSuccess = () => {
    loadData()
    setIsGirisModalOpen(false)
  }

  const handleCikisSuccess = () => {
    loadData()
    setIsCikisModalOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-[98vw] max-h-[95vh] m-0 p-6 overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(5, 38, 89, 0.98), rgba(2, 16, 36, 0.98))',
            color: '#FFFFFF',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(193, 232, 255, 0.2)',
            borderRadius: '18px',
            maxWidth: '98vw'
          }}
        >
          <DialogHeader className="pb-4 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold mb-2" style={{ color: '#C1E8FF' }}>
              Stok Yönetimi
            </DialogTitle>
            <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Tüm stokları görüntüle ve yönet
            </p>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2">
              <div></div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsGirisModalOpen(true)}
                  style={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    color: '#6bcf7f',
                    border: '1px solid rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Stok Girişi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCikisModalOpen(true)}
                  style={{
                    background: 'rgba(255, 107, 107, 0.1)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255, 107, 107, 0.3)'
                  }}
                >
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
          </div>
        </DialogContent>
      </Dialog>

      <StockDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        sunger={selectedSponge}
        hareketler={selectedHareketler}
      />

      <StokGirisModal
        open={isGirisModalOpen}
        onOpenChange={setIsGirisModalOpen}
        onSuccess={handleGirisSuccess}
      />

      <StokCikisModal
        open={isCikisModalOpen}
        onOpenChange={setIsCikisModalOpen}
        onSuccess={handleCikisSuccess}
      />
    </>
  )
}

