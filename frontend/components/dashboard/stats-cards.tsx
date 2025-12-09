"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import type { DashboardStockStatus, StockMovement } from "@/lib/types"
import { useRouter } from "next/navigation"

interface StatsCardsProps {
  stokDurumlari: DashboardStockStatus[]
  hareketler: StockMovement[]
}

export function StatsCards({ stokDurumlari, hareketler }: StatsCardsProps) {
  const router = useRouter()

  const toplamStok = stokDurumlari.reduce((sum, stok) => sum + stok.current_stock, 0)
  const kritikStokSayisi = stokDurumlari.filter((stok) => stok.is_critical).length

  // Son 7 gün
  const yediGunOnce = new Date()
  yediGunOnce.setDate(yediGunOnce.getDate() - 7)

  const sonHareketler = hareketler?.filter((h) => new Date(h.date) >= yediGunOnce) || []
  const haftalikGiris = sonHareketler.filter((h) => h.type === "in").reduce((sum, h) => sum + h.quantity, 0)
  const haftalikCikis = sonHareketler.filter((h) => h.type === "out").reduce((sum, h) => sum + h.quantity, 0)

  const stats = [
    {
      title: "Toplam Stok",
      value: toplamStok.toLocaleString("tr-TR"),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => router.push("/stok"),
    },
    {
      title: "Kritik Stok",
      value: kritikStokSayisi,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => router.push("/stok?filter=kritik"),
    },
    {
      title: "Haftalık Giriş",
      value: haftalikGiris.toLocaleString("tr-TR"),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => router.push("/stok/giris"),
    },
    {
      title: "Haftalık Çıkış",
      value: haftalikCikis.toLocaleString("tr-TR"),
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      onClick: () => router.push("/stok/cikis"),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={stat.onClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
