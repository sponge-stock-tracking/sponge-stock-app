"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { StockSummaryItem } from "@/lib/types"
import { AlertCircle, CheckCircle, Eye } from "lucide-react"

interface StockTableProps {
  stoklar: StockSummaryItem[]
  onDetailClick?: (spongeId: number) => void
}

export function StockTable({ stoklar, onDetailClick }: StockTableProps) {
  const getStockStatus = (stok: StockSummaryItem) => {
    const percentage = (stok.current_stock / stok.critical_stock) * 100
    if (percentage <= 50) return { label: "Çok Düşük", variant: "destructive" as const, color: "text-red-600" }
    if (percentage <= 100) return { label: "Kritik", variant: "secondary" as const, color: "text-orange-600" }
    return { label: "Normal", variant: "default" as const, color: "text-green-600" }
  }

  if (stoklar.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Stok bulunamadı</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="px-6 py-4 text-base font-semibold min-w-[250px]">Sünger Adı</TableHead>
                <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[120px]">Toplam Giriş</TableHead>
                <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[120px]">Toplam Çıkış</TableHead>
                <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[120px]">Mevcut Stok</TableHead>
                <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[120px]">Kritik Seviye</TableHead>
                <TableHead className="text-center px-6 py-4 text-base font-semibold min-w-[140px]">Durum</TableHead>
                <TableHead className="text-center px-6 py-4 text-base font-semibold min-w-[140px]">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stoklar.map((stok) => {
                const status = getStockStatus(stok)
                return (
                  <TableRow key={stok.sponge_id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium px-6 py-4 text-base">{stok.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground px-6 py-4 text-base">
                      {stok.total_in.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground px-6 py-4 text-base">
                      {stok.total_out.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4">
                      <span className="font-semibold text-base">
                        {stok.current_stock.toLocaleString("tr-TR")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground px-6 py-4 text-base">
                      {stok.critical_stock.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {status.variant === "default" ? (
                          <CheckCircle className={`h-5 w-5 ${status.color}`} />
                        ) : (
                          <AlertCircle className={`h-5 w-5 ${status.color}`} />
                        )}
                        <Badge variant={status.variant} className="text-sm px-3 py-1">{status.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-6 py-4">
                      <Button variant="ghost" size="default" onClick={() => onDetailClick?.(stok.sponge_id)} className="gap-2">
                        <Eye className="h-4 w-4" />
                        Detay Gör
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
