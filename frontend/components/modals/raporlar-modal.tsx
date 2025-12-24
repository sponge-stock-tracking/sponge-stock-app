"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, TrendingDown, Package, Bell, Loader2, FileBarChart, PieChart, Activity } from "lucide-react"
import { getWeeklyReport, getMonthlyReport, getCriticalStocks } from "@/api/reports"
import { getStockSummary } from "@/api/stocks"
import type { WeeklyReport, MonthlyReport, CriticalStock, StockSummaryItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { DailyTrendChart } from "@/components/raporlar/daily-trend-chart"
import { StockDistributionChart } from "@/components/raporlar/stock-distribution-chart"
import { SpongeMovementChart } from "@/components/raporlar/sponge-movement-chart"
import { CriticalStockTable } from "@/components/raporlar/critical-stock-table"
import { generatePDF } from "@/lib/pdf-generator"

type ReportPeriod = "weekly" | "monthly"

interface RaporlarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RaporlarModal({ open, onOpenChange }: RaporlarModalProps) {
  const [period, setPeriod] = useState<ReportPeriod>("weekly")
  const [weeklyData, setWeeklyData] = useState<WeeklyReport | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyReport | null>(null)
  const [criticalStocks, setCriticalStocks] = useState<CriticalStock[]>([])
  const [stockSummary, setStockSummary] = useState<StockSummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadReportData()
    }
  }, [period, open])

  const loadReportData = async () => {
    try {
      setLoading(true)
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

  const currentData = period === "weekly" ? weeklyData : monthlyData
  const totalIn = currentData?.total_in || 0
  const totalOut = currentData?.total_out || 0
  const netChange = totalIn - totalOut

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)

      const summaryItems = [
        { label: "Toplam Giriş", value: `+${totalIn.toLocaleString("tr-TR")}`, color: "green" },
        { label: "Toplam Çıkış", value: `-${totalOut.toLocaleString("tr-TR")}`, color: "red" },
        { label: "Net Değişim", value: `${netChange >= 0 ? '+' : ''}${netChange.toLocaleString("tr-TR")}`, color: "blue" },
        { label: "Kritik Stok", value: `${criticalStocks.length} Ürün`, color: "red" }
      ]

      // Prepare table data from movements
      // Assuming currentData has a 'daily_stats' or similar array if available, or we construct it.
      // If the API allows fetching detailed movements for a period, that would be ideal.
      // For this example, we'll try to map existing data or use a placeholder if detail data isn't in currentData.
      // Let's assume 'movements' are not directly in WeeklyReport but we can use 'daily_trends' if available or just use summary for now.
      // As a better approach for the PDF, we might want to list the TOP MOVERS or summary by Sponge Type.

      const tableHeaders = ["Tarih", "Giriş Miktarı", "Çıkış Miktarı", "Net"]
      const tableData = (currentData as any)?.daily_trends?.map((day: any) => [
        day.date,
        day.in_count,
        day.out_count,
        day.in_count - day.out_count
      ]) || []

      await generatePDF({
        title: "Stok Hareket Raporu",
        period: period === "weekly" ? "Haftalık Rapor" : "Aylık Rapor",
        date: new Date().toLocaleDateString("tr-TR"),
        summary: summaryItems,
        tableHeaders,
        tableData
      })

      toast({
        title: "Başarılı",
        description: "Rapor PDF olarak indirildi."
      })
    } catch (error) {
      console.error("PDF oluşturma hatası:", error)
      toast({
        title: "Hata",
        description: "PDF oluşturulurken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] !max-w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden flex flex-col bg-slate-950 border-slate-800 sm:max-w-none"
        style={{
          background: 'linear-gradient(135deg, #021024, #052659)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-[#C1E8FF]">
              <div className="p-2 rounded-lg bg-blue-500/20 ring-1 ring-blue-400/30">
                <FileBarChart className="h-6 w-6 text-blue-300" />
              </div>
              Raporlama Merkezi
            </DialogTitle>
            <p className="text-sm text-slate-400 mt-1">Stok hareketlerini detaylı analiz edin ve raporlayın</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/10">
              {["weekly", "monthly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as ReportPeriod)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${period === p
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {p === "weekly" ? "Haftalık" : "Aylık"}
                </button>
              ))}
            </div>

            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              PDF İndir
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/30">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
                <p className="text-slate-400">Veriler analiz ediliyor...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-900/50 border border-slate-800 p-1 w-auto inline-flex">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Genel Bakış</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Detaylı Tablo</TabsTrigger>
                <TabsTrigger value="critical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Kritik Stoklar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Özet Kartlar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Toplam Giriş</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-500">{totalIn.toLocaleString("tr-TR")}</div>
                      <p className="text-xs text-slate-500 mt-1">Birim ürün girişi</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Toplam Çıkış</CardTitle>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-500">{totalOut.toLocaleString("tr-TR")}</div>
                      <p className="text-xs text-slate-500 mt-1">Birim ürün çıkışı</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-xl overflow-hidden relative group">
                    <div className={`absolute inset-0 transition-colors ${netChange >= 0 ? "bg-blue-500/5 group-hover:bg-blue-500/10" : "bg-orange-500/5 group-hover:bg-orange-500/10"}`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Net Değişim</CardTitle>
                      <Activity className={`h-4 w-4 ${netChange >= 0 ? "text-blue-500" : "text-orange-500"}`} />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${netChange >= 0 ? "text-blue-500" : "text-orange-500"}`}>
                        {netChange.toLocaleString("tr-TR")}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Giriş vs Çıkış dengesi</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Grafikler Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-800 shadow-xl col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Günlük Trend Analizi
                      </CardTitle>
                      <CardDescription>Seçili dönemdeki günlük hareket dağılımı</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <DailyTrendChart period={period} data={currentData} />
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 shadow-xl col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-400" />
                        Stok Dağılımı
                      </CardTitle>
                      <CardDescription>Mevcut ürünlerin stoğa göre dağılımı</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <StockDistributionChart stockSummary={stockSummary} />
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 shadow-xl col-span-1 lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        Sünger Hareket Analizi
                      </CardTitle>
                      <CardDescription>Sünger bazında giriş/çıkış karşılaştırması</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[450px]">
                      <SpongeMovementChart data={currentData} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-200">Detaylı Veri Tablosu</CardTitle>
                    <CardDescription>Gün bazında hareket detayları</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border border-slate-800">
                      <Table>
                        <TableHeader className="bg-slate-900">
                          <TableRow className="hover:bg-transparent border-slate-800">
                            <TableHead className="text-slate-300">Tarih</TableHead>
                            <TableHead className="text-slate-300 text-right">Giriş Miktarı</TableHead>
                            <TableHead className="text-slate-300 text-right">Çıkış Miktarı</TableHead>
                            <TableHead className="text-slate-300 text-right">Net Değişim</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(currentData as any)?.daily_trends?.map((day: any, idx: number) => (
                            <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                              <TableCell className="font-medium text-slate-300">{day.date}</TableCell>
                              <TableCell className="text-green-400 text-right">+{day.in_count}</TableCell>
                              <TableCell className="text-red-400 text-right">-{day.out_count}</TableCell>
                              <TableCell className={`text-right font-bold ${day.in_count - day.out_count >= 0 ? "text-blue-400" : "text-orange-400"}`}>
                                {day.in_count - day.out_count}
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!(currentData as any)?.daily_trends || (currentData as any).daily_trends.length === 0) && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-slate-500">Bu dönem için veri bulunamadı.</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="critical" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-slate-900/50 border-slate-800 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-red-500" />
                        Kritik Stok Listesi
                      </CardTitle>
                      <CardDescription>Stok seviyesi kritik olan ürünler</CardDescription>
                    </div>
                    {criticalStocks.length > 0 && (
                      <Button variant="outline" onClick={handleNotifyCritical} className="text-red-400 border-red-900/50 hover:bg-red-900/20">
                        Herkese Bildir
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {(criticalStocks && criticalStocks.length > 0) ? (
                      <CriticalStockTable criticalStocks={criticalStocks} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Package className="h-12 w-12 mb-4 opacity-50" />
                        <p>Kritik seviyede ürün bulunmuyor.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


