import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StockSummaryItem } from "@/lib/types"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface StockDistributionChartProps {
  stockSummary: StockSummaryItem[]
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

export function StockDistributionChart({ stockSummary }: StockDistributionChartProps) {
  const chartData = stockSummary
    .filter(item => item.current_stock > 0)
    .map(item => ({
      name: item.name,
      value: item.current_stock
    }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stok Dağılımı</CardTitle>
          <CardDescription>Mevcut stokların sünger türüne göre dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Henüz stok bulunmamaktadır
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stok Dağılımı</CardTitle>
        <CardDescription>Mevcut stokların sünger türüne göre dağılımı</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => 
                `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
