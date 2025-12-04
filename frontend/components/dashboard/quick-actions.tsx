"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Package, FileText, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Stok Girişi",
      description: "Yeni stok ekle",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => router.push("/stok/giris"),
    },
    {
      title: "Stok Çıkışı",
      description: "Stok çıkar",
      icon: Minus,
      color: "text-red-600",
      bgColor: "bg-red-50",
      onClick: () => router.push("/stok/cikis"),
    },
    {
      title: "Stok Görüntüle",
      description: "Tüm stokları gör",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => router.push("/stok"),
    },
    {
      title: "Raporlar",
      description: "Detaylı raporlar",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => router.push("/raporlar"),
    },
    {
      title: "Sünger Yönetimi",
      description: "Türleri yönet",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => router.push("/sunger-yonetimi"),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hızlı İşlemler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex items-start gap-3 hover:bg-accent bg-transparent justify-start"
              onClick={action.onClick}
            >
              <div className={`${action.bgColor} p-2 rounded-lg shrink-0`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
