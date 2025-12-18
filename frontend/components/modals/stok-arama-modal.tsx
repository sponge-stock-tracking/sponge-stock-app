"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { StockTable } from "@/components/stok/stock-table"
import { StockDetailModal } from "@/components/stok/stock-detail-modal"
import { getSponges } from "@/api/sponges"
import { getStockSummary, getStockByDate } from "@/api/stocks"
import type { Sponge, StockSummaryItem, StockMovement } from "@/lib/types"
import { Search } from "lucide-react"
import { toast } from "sonner"

interface StokAramaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchTerm?: string
}

export function StokAramaModal({ open, onOpenChange, searchTerm: initialSearchTerm = "" }: StokAramaModalProps) {
  const [stokDurumlari, setStokDurumlari] = useState<StockSummaryItem[]>([])
  const [sungerler, setSungerler] = useState<Sponge[]>([])
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSponge, setSelectedSponge] = useState<Sponge | null>(null)
  const [selectedHareketler, setSelectedHareketler] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setSearchTerm(initialSearchTerm)
      loadData()
    }
  }, [open, initialSearchTerm])

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
    return stok.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] m-0 p-8 overflow-hidden flex flex-col">
          <DialogHeader className="pb-6 flex-shrink-0">
            <DialogTitle className="text-3xl font-bold mb-2">Stok Arama</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sünger adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            {loading ? (
              <p className="text-muted-foreground text-center py-8">Yükleniyor...</p>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>
                    {searchTerm ? (
                      <>
                        <span className="font-semibold text-foreground">{filteredStoklar.length}</span> sonuç bulundu
                      </>
                    ) : (
                      <>
                        Toplam <span className="font-semibold text-foreground">{filteredStoklar.length}</span> stok
                      </>
                    )}
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
    </>
  )
}

