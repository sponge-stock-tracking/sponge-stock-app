"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { initializeDemoData, getStokDurumlari, getStokHareketler, getSungerTurleri } from "@/lib/storage"
import type { StokDurum, StokHareket, SungerTuru } from "@/lib/types"
import { ArrowLeft, Download, TrendingUp, TrendingDown, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function RaporlarPage() {
  const [stokDurumlari, setStokDurumlari] = useState<StokDurum[]>([])
  const [hareketler, setHareketler] = useState<StokHareket[]>([])
  const [sungerler, setSungerler] = useState<SungerTuru[]>([])
  const [period, setPeriod] = useState("7")
  const router = useRouter()

  useEffect(() => {
    initializeDemoData()
    setStokDurumlari(getStokDurumlari())
    setHareketler(getStokHareketler())
    setSungerler(getSungerTurleri())
  }, [])

  const gunOnce = new Date()
  gunOnce.setDate(gunOnce.getDate() - Number.parseInt(period))

  const filteredHareketler = hareketler.filter((h) => new Date(h.tarih) >= gunOnce)

  // Stok dağılımı için pie chart data
  const stokDagilimi = stokDurumlari.map((stok) => ({
    name: stok.sungerAd,
    value: stok.mevcutStok,
  }))

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  // Günlük hareket trendi
  const trendData = []
  for (let i = Number.parseInt(period) - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const gunHareketler = filteredHareketler.filter((h) => h.tarih.startsWith(dateStr))
    const giris = gunHareketler.filter((h) => h.tip === "giris").reduce((sum, h) => sum + h.miktar, 0)
    const cikis = gunHareketler.filter((h) => h.tip === "cikis").reduce((sum, h) => sum + h.miktar, 0)

    trendData.push({
      tarih: date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      Giriş: giris,
      Çıkış: cikis,
    })
  }

  // Sünger bazında hareket özeti
  const sungerHareketleri = sungerler.map((sunger) => {
    const sungerHareketler = filteredHareketler.filter((h) => h.sungerId === sunger.id)
    const giris = sungerHareketler.filter((h) => h.tip === "giris").reduce((sum, h) => sum + h.miktar, 0)
    const cikis = sungerHareketler.filter((h) => h.tip === "cikis").reduce((sum, h) => sum + h.miktar, 0)
    return {
      ad: sunger.ad,
      giris,
      cikis,
      net: giris - cikis,
    }
  })

  const toplamGiris = filteredHareketler.filter((h) => h.tip === "giris").reduce((sum, h) => sum + h.miktar, 0)
  const toplamCikis = filteredHareketler.filter((h) => h.tip === "cikis").reduce((sum, h) => sum + h.miktar, 0)

  const handleExport = () => {
    const reportData = {
      period: `${period} Gün`,
      date: new Date().toLocaleDateString("tr-TR"),
      summary: {
        toplamGiris,
        toplamCikis,
        net: toplamGiris - toplamCikis,
      },
      stokDurumlari,
      sungerHareketleri,
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rapor-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 space-y-6">
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
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="period">Dönem:</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Son 7 Gün</SelectItem>
                <SelectItem value="14">Son 14 Gün</SelectItem>
                <SelectItem value="30">Son 30 Gün</SelectItem>
                <SelectItem value="90">Son 90 Gün</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Giriş</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">{toplamGiris.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
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
                    <p className="text-3xl font-bold mt-2 text-red-600">{toplamCikis.toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-xl">
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
                      className={`text-3xl font-bold mt-2 ${toplamGiris - toplamCikis >= 0 ? "text-blue-600" : "text-orange-600"}`}
                    >
                      {(toplamGiris - toplamCikis).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Günlük Hareket Trendi</CardTitle>
                <CardDescription>Giriş ve çıkış hareketlerinin günlük dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="tarih" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Giriş" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Çıkış" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stok Dağılımı</CardTitle>
                <CardDescription>Mevcut stokların sünger türüne göre dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stokDagilimi}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stokDagilimi.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sünger Bazında Hareket Özeti</CardTitle>
              <CardDescription>Her sünger türü için giriş, çıkış ve net değişim</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sungerHareketleri}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="ad" className="text-xs" angle={-45} textAnchor="end" height={100} />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="giris" fill="#10b981" name="Giriş" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cikis" fill="#ef4444" name="Çıkış" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
