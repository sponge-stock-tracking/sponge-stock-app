import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeeklyReport, MonthlyReport, StockMovement } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getStockByDate } from "@/api/stocks"
import { useEffect, useState } from "react"

interface DailyTrendChartProps {
  period: "weekly" | "monthly"
  data: WeeklyReport | MonthlyReport | null
}

interface TrendDataPoint {
  date: string
  in: number
  out: number
}

export function DailyTrendChart({ period, data }: DailyTrendChartProps) {
  const [chartData, setChartData] = useState<TrendDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrendData()
  }, [period])

  const loadTrendData = async () => {
    try {
      setLoading(true)
      const days = period === "weekly" ? 7 : 30
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const movements = await getStockByDate(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )

      // Günlük toplam hesapla
      const dailyMap = new Map<string, { in: number; out: number }>()

      movements.forEach((movement: StockMovement) => {
        const dateKey = movement.date.split('T')[0]
        const current = dailyMap.get(dateKey) || { in: 0, out: 0 }

        if (movement.type === 'in' || movement.type === 'return') {
          current.in += movement.quantity
        } else if (movement.type === 'out') {
          current.out += movement.quantity
        }

        dailyMap.set(dateKey, current)
      })

      // Chart data oluştur
      const trend: TrendDataPoint[] = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split('T')[0]
        const stats = dailyMap.get(dateKey) || { in: 0, out: 0 }

        trend.push({
          date: date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
          in: stats.in,
          out: stats.out
        })
      }

      setChartData(trend)
    } catch (error) {
      console.error('Trend data yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Günlük Hareket Trendi</CardTitle>
          <CardDescription>Giriş ve çıkış hareketlerinin günlük dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Yükleniyor...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Günlük Hareket Trendi</CardTitle>
        <CardDescription>Giriş ve çıkış hareketlerinin günlük dağılımı</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fontSize: 12 }}
              minTickGap={30}
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
            <Line
              type="monotone"
              dataKey="in"
              stroke="#22d3ee" // cyan-400 (Brighter input)
              strokeWidth={3}
              dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#fff" }}
              name="Giriş"
            />
            <Line
              type="monotone"
              dataKey="out"
              stroke="#f87171" // red-400 (Brighter output)
              strokeWidth={3}
              dot={{ r: 4, fill: "#f87171", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#fff" }}
              name="Çıkış"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
