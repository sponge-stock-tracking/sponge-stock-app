"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { StokHareket, SungerTuru } from "@/lib/types"
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StockDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sunger: SungerTuru | null
  hareketler: StokHareket[]
  onEdit?: (hareket: StokHareket) => void
  onDelete?: (hareketId: string) => void
}

export function StockDetailModal({ open, onOpenChange, sunger, hareketler, onEdit, onDelete }: StockDetailModalProps) {
  if (!sunger) return null

  const mevcutStok = hareketler.reduce((total, h) => {
    return h.tip === "giris" ? total + h.miktar : total - h.miktar
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{sunger.ad} - Stok Hareket Detayları</DialogTitle>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>SKU: {sunger.sku}</span>
            <span>
              Mevcut Stok:{" "}
              <strong className="text-foreground">
                {mevcutStok} {sunger.birim}
              </strong>
            </span>
            <span>
              Kritik Seviye: {sunger.kritikStok} {sunger.birim}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          {hareketler.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">Bu sünger için henüz hareket kaydı bulunmuyor</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlem</TableHead>
                  <TableHead className="text-right">Miktar</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Kullanım Amacı</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hareketler.map((hareket) => (
                  <TableRow key={hareket.id}>
                    <TableCell className="text-sm">
                      {new Date(hareket.tarih).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hareket.tip === "giris" ? "default" : "secondary"} className="gap-1">
                        {hareket.tip === "giris" ? (
                          <ArrowUpCircle className="h-3 w-3" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3" />
                        )}
                        {hareket.tip === "giris" ? "Giriş" : "Çıkış"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {hareket.miktar.toLocaleString("tr-TR")} {sunger.birim}
                    </TableCell>
                    <TableCell className="text-sm">{hareket.aciklama || "-"}</TableCell>
                    <TableCell className="text-sm">{hareket.kullanimAmaci || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {onEdit && (
                          <Button variant="ghost" size="sm" onClick={() => onEdit(hareket)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="sm" onClick={() => onDelete(hareket.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
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
