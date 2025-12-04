"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { StokHareket } from "@/lib/types"

interface WeeklyChartProps {
  hareketler: StokHareket[]
}

export function WeeklyChart({ hareketler }: WeeklyChartProps) {
  // Son 7 günün verilerini hazırla
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const gunHareketler = hareketler.filter((h) => h.tarih.startsWith(dateStr))
    const giris = gunHareketler.filter((h) => h.tip === "giris").reduce((sum, h) => sum + h.miktar, 0)
    const cikis = gunHareketler.filter((h) => h.tip === "cikis").reduce((sum, h) => sum + h.miktar, 0)

    chartData.push({
      gun: date.toLocaleDateString("tr-TR", { weekday: "short" }),
      Giriş: giris,
      Çıkış: cikis,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Haftalık Stok Hareketleri</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="gun" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar dataKey="Giriş" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Çıkış" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
