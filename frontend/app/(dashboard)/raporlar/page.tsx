"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download, TrendingUp, TrendingDown, Package, Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getWeeklyReport, getMonthlyReport, getCriticalStocks } from "@/api/reports"
import { getStockSummary } from "@/api/stocks"
import type { WeeklyReport, MonthlyReport, CriticalStock, StockSummaryItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { DailyTrendChart } from "@/components/raporlar/daily-trend-chart"
import { StockDistributionChart } from "@/components/raporlar/stock-distribution-chart"
import { SpongeMovementChart } from "@/components/raporlar/sponge-movement-chart"
import { CriticalStockTable } from "@/components/raporlar/critical-stock-table"

type ReportPeriod = "weekly" | "monthly"

export default function RaporlarPage() {
  const [period, setPeriod] = useState<ReportPeriod>("weekly")
  const [weeklyData, setWeeklyData] = useState<WeeklyReport | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyReport | null>(null)
  const [criticalStocks, setCriticalStocks] = useState<CriticalStock[]>([])
  const [stockSummary, setStockSummary] = useState<StockSummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadReportData()
  }, [period])

  const loadReportData = async () => {
    try {
      setLoading(true)
      
      // Paralel veri yükleme
      const [weekly, monthly, critical, summary] = await Promise.all([
        getWeeklyReport(),
        getMonthlyReport(),
        getCriticalStocks(false),
        getStockSummary()
      ])

      setWeeklyData(weekly)
      setMonthlyData(monthly)
      setCriticalStocks(critical)
      setStockSummary(summary)
    } catch (error) {
      console.error('Rapor verileri yüklenirken hata:', error)
      toast({
        title: "Hata",
        description: "Rapor verileri yüklenemedi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNotifyCritical = async () => {
    try {
      await getCriticalStocks(true)
      toast({
        title: "Bildirim Gönderildi",
        description: "Kritik stok uyarısı e-posta ile gönderildi",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "E-posta gönderilemedi",
        variant: "destructive"
      })
    }
  }

  const handleExport = () => {
    const currentData = period === "weekly" ? weeklyData : monthlyData
    const reportData = {
      period: period === "weekly" ? "Haftalık" : "Aylık",
      date: new Date().toLocaleDateString("tr-TR"),
      data: currentData,
      criticalStocks,
      stockSummary
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rapor-${period}-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Rapor İndirildi",
      description: "Rapor JSON formatında indirildi"
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentData = period === "weekly" ? weeklyData : monthlyData
  const totalIn = currentData?.total_in || 0
  const totalOut = currentData?.total_out || 0
  const netChange = totalIn - totalOut

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
                <p className="text-muted-foreground mt-1">Detaylı stok analizi ve raporlama</p>
              </div>
            </div>
            <div className="flex gap-2">
              {criticalStocks.length > 0 && (
                <Button variant="outline" onClick={handleNotifyCritical}>
                  <Bell className="h-4 w-4 mr-2" />
                  Kritik Stok Bildirimi
                </Button>
              )}
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="period">Dönem:</Label>
            <Select value={period} onValueChange={(val) => setPeriod(val as ReportPeriod)}>
              <SelectTrigger id="period" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Haftalık (Son 7 Gün)</SelectItem>
                <SelectItem value="monthly">Aylık (Bu Ay)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Özet Kartlar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Giriş</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">{totalIn.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Çıkış</p>
                    <p className="text-3xl font-bold mt-2 text-red-600">{totalOut.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-xl">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Değişim</p>
                    <p
                      className={`text-3xl font-bold mt-2 ${
                        netChange >= 0 ? "text-blue-600" : "text-orange-600"
                      }`}
                    >
                      {netChange.toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-xl">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grafikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyTrendChart period={period} data={currentData} />
            <StockDistributionChart stockSummary={stockSummary} />
          </div>

          <SpongeMovementChart data={currentData} />

      {criticalStocks.length > 0 && (
        <CriticalStockTable criticalStocks={criticalStocks} />
      )}
    </div>
  )
}
