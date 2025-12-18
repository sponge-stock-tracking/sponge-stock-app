"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { StockMovement, Sponge } from "@/lib/types"
import { ArrowDownCircle, ArrowUpCircle, RotateCcw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StockDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sunger: Sponge | null
  hareketler: StockMovement[]
}

export function StockDetailModal({ open, onOpenChange, sunger, hareketler }: StockDetailModalProps) {
  if (!sunger) return null

  const mevcutStok = hareketler.reduce((total, h) => {
    if (h.type === "in" || h.type === "return") {
      return total + h.quantity
    } else {
      return total - h.quantity
    }
  }, 0)

  const getTypeLabel = (type: string) => {
    switch(type) {
      case "in": return "Giriş"
      case "out": return "Çıkış"
      case "return": return "İade"
      default: return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "in": return <ArrowUpCircle className="h-3 w-3" />
      case "out": return <ArrowDownCircle className="h-3 w-3" />
      case "return": return <RotateCcw className="h-3 w-3" />
      default: return null
    }
  }

  const getTypeVariant = (type: string) => {
    switch(type) {
      case "in": return "default" as const
      case "out": return "secondary" as const
      case "return": return "outline" as const
      default: return "default" as const
    }
  }

  // Hareketleri tarihe göre sırala (en yeni önce)
  const sortedHareketler = [...hareketler].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] m-0 p-8 overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0 pb-6">
          <DialogTitle className="text-2xl font-bold pr-8 mb-2">{sunger.name} - Stok Hareket Detayları</DialogTitle>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">Yoğunluk: {sunger.density} kg/m³</span>
            <span className="whitespace-nowrap">Sertlik: {sunger.hardness === 'soft' ? 'Yumuşak' : sunger.hardness === 'medium' ? 'Orta' : 'Sert'}</span>
            <span className="whitespace-nowrap">
              Kritik Seviye: {sunger.critical_stock} {sunger.unit}
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden -mx-6 px-6">
          <ScrollArea className="h-full pr-4">
            {sortedHareketler.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">Bu sünger için henüz hareket kaydı bulunmuyor</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="px-6 py-4 text-base font-semibold min-w-[180px]">Tarih</TableHead>
                    <TableHead className="px-6 py-4 text-base font-semibold min-w-[130px]">İşlem Tipi</TableHead>
                    <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[130px]">Miktar</TableHead>
                    <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[130px]">Fiyat</TableHead>
                    <TableHead className="px-6 py-4 text-base font-semibold min-w-[200px]">Not</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHareketler.map((hareket) => (
                    <TableRow key={hareket.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-6 py-4 text-base whitespace-nowrap">
                        {new Date(hareket.date).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant={getTypeVariant(hareket.type)} className="gap-1 whitespace-nowrap text-sm px-3 py-1">
                          {getTypeIcon(hareket.type)}
                          {getTypeLabel(hareket.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6 py-4 font-semibold text-base whitespace-nowrap">
                        {hareket.quantity.toLocaleString("tr-TR")} {sunger.unit}
                      </TableCell>
                      <TableCell className="text-right px-6 py-4 text-muted-foreground text-base whitespace-nowrap">
                        {hareket.price ? `₺${hareket.price.toLocaleString("tr-TR")}` : "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-base max-w-[250px] truncate" title={hareket.note || "-"}>
                        {hareket.note || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
