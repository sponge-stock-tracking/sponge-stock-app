import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StockSummaryItem } from "@/lib/types"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface StockDistributionChartProps {
  stockSummary: StockSummaryItem[]
}

// Premium cool spectrum palette
const COLORS = [
  "#3b82f6", // blue-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
  "#ec4899", // pink-500
  "#0ea5e9", // sky-500
  "#a855f7"  // purple-500
]

export function StockDistributionChart({ stockSummary }: StockDistributionChartProps) {
  // Group small values into "Others"
  const totalStock = stockSummary.reduce((sum, item) => sum + item.current_stock, 0)

  let chartData = stockSummary
    .filter(item => item.current_stock > 0)
    .sort((a, b) => b.current_stock - a.current_stock)

  // If we have many items, group the smaller ones
  if (chartData.length > 6) {
    const mainItems = chartData.slice(0, 5)
    const otherItems = chartData.slice(5)
    const otherTotal = otherItems.reduce((sum, item) => sum + item.current_stock, 0)

    chartData = [
      ...mainItems.map(item => ({ name: item.name, value: item.current_stock })),
      { name: "Diğer", value: otherTotal }
    ]
  } else {
    chartData = chartData.map(item => ({ name: item.name, value: item.current_stock }))
  }

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
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
