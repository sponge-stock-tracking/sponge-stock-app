import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeeklyReport, MonthlyReport } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SpongeMovementChartProps {
  data: WeeklyReport | MonthlyReport | null
}

export function SpongeMovementChart({ data }: SpongeMovementChartProps) {
  if (!data) {
    return null
  }

  // Backend'den gelen data yapısına göre chart data oluştur
  let chartData: { name: string; in: number; out: number }[] = []

  if ('top_items' in data) {
    // WeeklyReport
    chartData = data.top_items
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
      .slice(0, 10)
      .map(item => ({
        name: item.name,
        in: item.net > 0 ? item.net : 0,
        out: item.net < 0 ? Math.abs(item.net) : 0
      }))
  } else if ('items' in data) {
    // MonthlyReport
    chartData = data.items
      .sort((a, b) => (b.in + b.out) - (a.in + a.out))
      .slice(0, 10)
      .map(item => ({
        name: item.name,
        in: item.in,
        out: item.out
      }))
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sünger Bazında Hareket Özeti</CardTitle>
          <CardDescription>Her sünger türü için giriş, çıkış ve net değişim</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Bu dönemde hareket bulunmamaktadır
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sünger Bazında Hareket Özeti</CardTitle>
        <CardDescription>
          Her sünger türü için giriş ve çıkış miktarları (En aktif 10 sünger)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
            />
            <YAxis className="text-xs" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar
              dataKey="in"
              fill="#10b981"
              name="Giriş"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar
              dataKey="out"
              fill="#ef4444"
              name="Çıkış"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
