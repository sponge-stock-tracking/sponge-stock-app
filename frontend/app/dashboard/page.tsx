"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { CriticalStockAlerts } from "@/components/dashboard/critical-stock-alerts"
import { CriticalStockModal } from "@/components/dashboard/critical-stock-modal"
import {
  initializeDemoData,
  getStokDurumlari,
  getStokHareketler,
  getSungerTurleri,
  getKritikStoklar,
} from "@/lib/storage"
import type { StokDurum, StokHareket, SungerTuru } from "@/lib/types"

export default function DashboardPage() {
  const [stokDurumlari, setStokDurumlari] = useState<StokDurum[]>([])
  const [hareketler, setHareketler] = useState<StokHareket[]>([])
  const [sungerler, setSungerler] = useState<SungerTuru[]>([])
  const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false)
  const [kritikStoklar, setKritikStoklar] = useState<StokDurum[]>([])

  useEffect(() => {
    initializeDemoData()
    setStokDurumlari(getStokDurumlari())
    setHareketler(getStokHareketler())
    setSungerler(getSungerTurleri())
    setKritikStoklar(getKritikStoklar())
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground text-lg">Stok durumunuza genel bakış</p>
          </div>

          <StatsCards stokDurumlari={stokDurumlari} hareketler={hareketler} />

          <CriticalStockAlerts stokDurumlari={stokDurumlari} onViewAll={() => setIsCriticalModalOpen(true)} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyChart hareketler={hareketler} />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <RecentActivities hareketler={hareketler} sungerler={sungerler} />
        </main>

        <Footer />

        <CriticalStockModal
          open={isCriticalModalOpen}
          onOpenChange={setIsCriticalModalOpen}
          kritikStoklar={kritikStoklar}
        />
      </div>
    </ProtectedRoute>
  )
}
