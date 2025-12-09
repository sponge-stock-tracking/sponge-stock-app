"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { DashboardStockStatus } from "@/lib/types"

interface CriticalStockAlertsProps {
  stokDurumlari: DashboardStockStatus[]
  onViewAll?: () => void
}

export function CriticalStockAlerts({ stokDurumlari, onViewAll }: CriticalStockAlertsProps) {
  const kritikStoklar = stokDurumlari.filter((stok) => stok.is_critical)

  if (kritikStoklar.length === 0) {
    return null
  }

  const displayedStoklar = kritikStoklar.slice(0, 3)
  const hasMore = kritikStoklar.length > 3

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <AlertTriangle className="h-5 w-5" />
            Kritik Stok Uyarıları ({kritikStoklar.length})
          </CardTitle>
          {hasMore && onViewAll && (
            <Button variant="outline" size="sm" onClick={onViewAll}>
              Tümünü Gör
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedStoklar.map((stok) => (
            <Alert key={stok.sponge_id} variant="destructive" className="bg-white">
              <AlertDescription>
                <span className="font-semibold">{stok.name}</span> - Mevcut: {stok.current_stock} (Kritik Seviye: {stok.critical_stock})
              </AlertDescription>
            </Alert>
          ))}
          {hasMore && onViewAll && (
            <Button variant="link" className="w-full text-orange-700" onClick={onViewAll}>
              +{kritikStoklar.length - 3} daha fazla kritik stok göster
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
