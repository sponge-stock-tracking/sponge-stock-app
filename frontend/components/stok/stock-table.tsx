"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { StokDurum } from "@/lib/types"
import { AlertCircle, CheckCircle, Eye, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface StockTableProps {
  stoklar: StokDurum[]
  onDetailClick?: (sungerId: string) => void
}

export function StockTable({ stoklar, onDetailClick }: StockTableProps) {
  const getStockStatus = (stok: StokDurum) => {
    const percentage = (stok.mevcutStok / stok.kritikStok) * 100
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
                <TableHead className="text-right">Mevcut Stok</TableHead>
                <TableHead className="text-right">Kritik Seviye</TableHead>
                <TableHead className="text-center">Son İşlem</TableHead>
                <TableHead className="text-center">Durum</TableHead>
                <TableHead>Son Güncelleme</TableHead>
                <TableHead className="text-center">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stoklar.map((stok) => {
                const status = getStockStatus(stok)
                return (
                  <TableRow key={stok.sungerId}>
                    <TableCell className="font-medium">{stok.sungerAd}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">
                        {stok.mevcutStok.toLocaleString("tr-TR")} {stok.birim}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stok.kritikStok.toLocaleString("tr-TR")} {stok.birim}
                    </TableCell>
                    <TableCell className="text-center">
                      {stok.sonIslemTipi ? (
                        <Badge variant={stok.sonIslemTipi === "giris" ? "default" : "secondary"} className="gap-1">
                          {stok.sonIslemTipi === "giris" ? (
                            <ArrowUpCircle className="h-3 w-3" />
                          ) : (
                            <ArrowDownCircle className="h-3 w-3" />
                          )}
                          {stok.sonIslemTipi === "giris" ? "Giriş" : "Çıkış"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
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
                    <TableCell className="text-muted-foreground">
                      {new Date(stok.sonGuncelleme).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => onDetailClick?.(stok.sungerId)}>
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
