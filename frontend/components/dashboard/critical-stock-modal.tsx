"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { DashboardStockStatus } from "@/lib/types"
import { AlertTriangle, Package, Plus } from "lucide-react"

interface CriticalStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kritikStoklar: DashboardStockStatus[]
  onStokGiris?: () => void
}

export function CriticalStockModal({ open, onOpenChange, kritikStoklar, onStokGiris }: CriticalStockModalProps) {
  const getPercentage = (stok: DashboardStockStatus) => {
    return Math.round((stok.current_stock / stok.critical_stock) * 100)
  }

  const getSeverity = (percentage: number) => {
    if (percentage <= 25) return { color: "bg-red-500", text: "Çok Kritik" }
    if (percentage <= 50) return { color: "bg-orange-500", text: "Kritik" }
    return { color: "bg-yellow-500", text: "Düşük" }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] m-0 p-8 overflow-hidden flex flex-col">
        <DialogHeader className="pb-6 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 rounded-lg bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div>Kritik Stok Uyarıları</div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {kritikStoklar.length} ürün kritik seviyede
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {kritikStoklar.length === 0 ? (
          <div className="py-16 text-center">
            <div className="p-4 rounded-full bg-green-100 w-fit mx-auto mb-4">
              <Package className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-xl font-semibold text-green-600 mb-2">Tüm stoklar normal seviyede!</p>
            <p className="text-sm text-muted-foreground">Kritik stok uyarısı bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {kritikStoklar.map((stok) => {
              const percentage = getPercentage(stok)
              const severity = getSeverity(percentage)
              const eksik = stok.critical_stock - stok.current_stock
              
              return (
                <div
                  key={stok.sponge_id}
                  className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg mb-2 truncate">{stok.name}</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Mevcut Stok</span>
                          <span className="font-bold text-orange-600">
                            {stok.current_stock.toLocaleString("tr-TR")}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full ${severity.color} transition-all duration-300`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{percentage}% dolu</span>
                          <span className="font-medium text-orange-600">
                            {eksik > 0 ? `${eksik.toLocaleString("tr-TR")} eksik` : "Kritik seviyede"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severity.color} text-white`}>
                        {severity.text}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Hedef: {stok.critical_stock.toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="flex gap-3 justify-end pt-4 border-t mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Kapat
              </Button>
              {onStokGiris && (
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    onStokGiris()
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Stok Girişi Yap
                </Button>
              )}
            </div>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
