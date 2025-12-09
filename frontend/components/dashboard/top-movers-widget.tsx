"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package } from "lucide-react"
import { getTopMovers } from "@/api/dashboard"
import type { TopMover } from "@/api/dashboard"

export function TopMoversWidget() {
  const [topMovers, setTopMovers] = useState<TopMover[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTopMovers(5)
        setTopMovers(data)
      } catch (error) {
        console.error('Top movers yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            En Aktif Ürünler
          </CardTitle>
          <CardDescription>Son 7 gün içinde en çok hareket gören ürünler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Yükleniyor...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (topMovers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            En Aktif Ürünler
          </CardTitle>
          <CardDescription>Son 7 gün içinde en çok hareket gören ürünler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Henüz hareket bulunmuyor
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          En Aktif Ürünler
        </CardTitle>
        <CardDescription>Son 7 gün içinde en çok hareket gören ürünler</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMovers.map((mover, index) => (
            <div key={mover.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{mover.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {mover.movement_count} hareket
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {mover.total_quantity.toLocaleString('tr-TR')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
