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
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{sunger.name} - Stok Hareket Detayları</DialogTitle>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>Yoğunluk: {sunger.density} kg/m³</span>
            <span>Sertlik: {sunger.hardness === 'soft' ? 'Yumuşak' : sunger.hardness === 'medium' ? 'Orta' : 'Sert'}</span>
            <span>
              Kritik Seviye: {sunger.critical_stock} {sunger.unit}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          {sortedHareketler.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">Bu sünger için henüz hareket kaydı bulunmuyor</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlem Tipi</TableHead>
                  <TableHead className="text-right">Miktar</TableHead>
                  <TableHead className="text-right">Fiyat</TableHead>
                  <TableHead>Not</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHareketler.map((hareket) => (
                  <TableRow key={hareket.id}>
                    <TableCell className="text-sm">
                      {new Date(hareket.date).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(hareket.type)} className="gap-1">
                        {getTypeIcon(hareket.type)}
                        {getTypeLabel(hareket.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {hareket.quantity.toLocaleString("tr-TR")} {sunger.unit}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {hareket.price ? `₺${hareket.price.toLocaleString("tr-TR")}` : "-"}
                    </TableCell>
                    <TableCell className="text-sm">{hareket.note || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
