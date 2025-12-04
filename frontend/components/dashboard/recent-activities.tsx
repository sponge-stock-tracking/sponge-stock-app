"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import type { StokHareket, SungerTuru } from "@/lib/types"

interface RecentActivitiesProps {
  hareketler: StokHareket[]
  sungerler: SungerTuru[]
}

export function RecentActivities({ hareketler, sungerler }: RecentActivitiesProps) {
  const sonHareketler = [...hareketler]
    .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
    .slice(0, 5)

  const getSungerAd = (sungerId: string) => {
    return sungerler.find((s) => s.id === sungerId)?.ad || "Bilinmeyen"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Hareketler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sonHareketler.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Henüz hareket yok</p>
          ) : (
            sonHareketler.map((hareket) => (
              <div key={hareket.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className={`mt-0.5 ${hareket.tip === "giris" ? "text-green-600" : "text-red-600"}`}>
                  {hareket.tip === "giris" ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate">{getSungerAd(hareket.sungerId)}</p>
                    <Badge variant={hareket.tip === "giris" ? "default" : "destructive"} className="shrink-0">
                      {hareket.tip === "giris" ? "Giriş" : "Çıkış"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {hareket.miktar} adet • {new Date(hareket.tarih).toLocaleDateString("tr-TR")}
                  </p>
                  {hareket.aciklama && <p className="text-xs text-muted-foreground mt-1">{hareket.aciklama}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
