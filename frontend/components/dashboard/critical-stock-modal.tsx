"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { StokDurum } from "@/lib/types"
import { AlertTriangle, Package } from "lucide-react"
import { useRouter } from "next/navigation"

interface CriticalStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kritikStoklar: StokDurum[]
}

export function CriticalStockModal({ open, onOpenChange, kritikStoklar }: CriticalStockModalProps) {
  const router = useRouter()

  const getCriticalLevel = (stok: StokDurum) => {
    const percentage = (stok.mevcutStok / stok.kritikStok) * 100
    if (percentage <= 50) return { label: "Çok Kritik", variant: "destructive" as const, color: "text-red-600" }
    return { label: "Kritik", variant: "secondary" as const, color: "text-orange-600" }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            Kritik Stok Uyarıları
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Kritik seviyenin altında veya yakınında olan {kritikStoklar.length} ürün bulundu
          </p>
        </DialogHeader>

        {kritikStoklar.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <p className="text-lg font-medium text-green-600">Tüm stoklar normal seviyede!</p>
            <p className="text-sm text-muted-foreground mt-2">Kritik stok uyarısı bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sünger Adı</TableHead>
                  <TableHead className="text-right">Mevcut</TableHead>
                  <TableHead className="text-right">Kritik Seviye</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kritikStoklar.map((stok) => {
                  const level = getCriticalLevel(stok)
                  return (
                    <TableRow key={stok.sungerId}>
                      <TableCell className="font-medium">{stok.sungerAd}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${level.color}`}>
                          {stok.mevcutStok.toLocaleString("tr-TR")} {stok.birim}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stok.kritikStok.toLocaleString("tr-TR")} {stok.birim}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={level.variant}>{level.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Kapat
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false)
                  router.push("/stok/giris")
                }}
              >
                Stok Girişi Yap
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
