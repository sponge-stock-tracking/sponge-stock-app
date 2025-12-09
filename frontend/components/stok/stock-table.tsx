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
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sünger Adı</TableHead>
                <TableHead className="text-right">Toplam Giriş</TableHead>
                <TableHead className="text-right">Toplam Çıkış</TableHead>
                <TableHead className="text-right">Mevcut Stok</TableHead>
                <TableHead className="text-right">Kritik Seviye</TableHead>
                <TableHead className="text-center">Durum</TableHead>
                <TableHead className="text-center">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stoklar.map((stok) => {
                const status = getStockStatus(stok)
                return (
                  <TableRow key={stok.sponge_id}>
                    <TableCell className="font-medium">{stok.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stok.total_in.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stok.total_out.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">
                        {stok.current_stock.toLocaleString("tr-TR")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stok.critical_stock.toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {status.variant === "default" ? (
                          <CheckCircle className={`h-4 w-4 ${status.color}`} />
                        ) : (
                          <AlertCircle className={`h-4 w-4 ${status.color}`} />
                        )}
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => onDetailClick?.(stok.sponge_id)}>
                        <Eye className="h-4 w-4 mr-2" />
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
