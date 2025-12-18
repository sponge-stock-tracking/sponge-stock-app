"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import type { StockMovement } from "@/lib/types"

type ChartPeriod = "daily" | "weekly" | "monthly"

interface WeeklyChartProps {
  hareketler: StockMovement[]
}

export function WeeklyChart({ hareketler }: WeeklyChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>("monthly")
  
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
  
  const getChartData = () => {
    const chartData = []
    
    if (period === "daily") {
      // Son 30 gün
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        
        const gunHareketler = hareketler?.filter((h) => h.date.startsWith(dateStr)) || []
        const giris = gunHareketler.filter((h) => h.type === "in" || h.type === "return").reduce((sum, h) => sum + h.quantity, 0)
        const cikis = gunHareketler.filter((h) => h.type === "out").reduce((sum, h) => sum + h.quantity, 0)
        
        chartData.push({
          label: `${date.getDate()} ${monthNames[date.getMonth()].substring(0, 1)}`,
          "Stok Giriş": giris,
          "Stok Çıkış": cikis,
        })
      }
    } else if (period === "weekly") {
      // Son 12 hafta
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - (i * 7))
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay() + 1) // Pazartesi
        
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6) // Pazar
        
        const haftaHareketler = hareketler?.filter((h) => {
          const hareketDate = new Date(h.date)
          return hareketDate >= weekStart && hareketDate <= weekEnd
        }) || []
        
        const giris = haftaHareketler.filter((h) => h.type === "in" || h.type === "return").reduce((sum, h) => sum + h.quantity, 0)
        const cikis = haftaHareketler.filter((h) => h.type === "out").reduce((sum, h) => sum + h.quantity, 0)
        
        chartData.push({
          label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
          "Stok Giriş": giris,
          "Stok Çıkış": cikis,
        })
      }
    } else {
      // Son 12 ay
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.getMonth()
        const year = date.getFullYear()
        
        const ayHareketler = hareketler?.filter((h) => {
          const hareketDate = new Date(h.date)
          return hareketDate.getMonth() === month && hareketDate.getFullYear() === year
        }) || []
        
        const giris = ayHareketler.filter((h) => h.type === "in" || h.type === "return").reduce((sum, h) => sum + h.quantity, 0)
        const cikis = ayHareketler.filter((h) => h.type === "out").reduce((sum, h) => sum + h.quantity, 0)

        chartData.push({
          label: monthNames[month],
          "Stok Giriş": Math.round(giris / 1000),
          "Stok Çıkış": Math.round(cikis / 1000),
        })
      }
    }
    
    return chartData
  }
  
  const chartData = getChartData()
  const yAxisFormatter = period === "monthly" ? (value: number) => `${value}K` : (value: number) => value.toString()

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-2 mb-4 px-2">
        <Button
          variant={period === "daily" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("daily")}
          className="text-xs h-7"
        >
          Günlük
        </Button>
        <Button
          variant={period === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("weekly")}
          className="text-xs h-7"
        >
          Haftalık
        </Button>
        <Button
          variant={period === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setPeriod("monthly")}
          className="text-xs h-7"
        >
          Aylık
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(193,232,255,0.15)" />
            <XAxis 
              dataKey="label" 
              tick={{ fill: '#C1E8FF', fontSize: period === "daily" ? 9 : 11 }}
              axisLine={false}
              angle={period === "daily" ? -45 : 0}
              textAnchor={period === "daily" ? "end" : "middle"}
              height={period === "daily" ? 60 : 30}
            />
            <YAxis 
              tick={{ fill: '#C1E8FF', fontSize: 11 }}
              axisLine={false}
              tickFormatter={yAxisFormatter}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(5, 38, 89, 0.95)",
                border: "1px solid rgba(193,232,255,0.2)",
                borderRadius: "8px",
                color: "#C1E8FF"
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#C1E8FF', fontSize: '11px' }}
              iconSize={10}
            />
            <Bar 
              dataKey="Stok Giriş" 
              fill="rgba(125,160,202,0.85)" 
              radius={[8, 8, 0, 0]}
              name={period === "monthly" ? "Stok Giriş (K)" : "Stok Giriş"}
            />
            <Bar 
              dataKey="Stok Çıkış" 
              fill="rgba(84,131,179,0.85)" 
              radius={[8, 8, 0, 0]}
              name={period === "monthly" ? "Stok Çıkış (K)" : "Stok Çıkış"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
