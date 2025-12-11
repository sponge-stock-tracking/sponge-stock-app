"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { CriticalStockAlerts } from "@/components/dashboard/critical-stock-alerts";
import { CriticalStockModal } from "@/components/dashboard/critical-stock-modal";
import { TopMoversWidget } from "@/components/dashboard/top-movers-widget";
import { StockCalculator } from "@/components/dashboard/stock-calculator";

import { getStockSummary, getStockByDate } from "@/api/stocks";
import { getSponges } from "@/api/sponges";

import type { 
  Sponge, 
  StockMovement, 
  StockSummaryItem, 
  DashboardStockStatus 
} from "@/lib/types";

export default function DashboardPage() {
  const [stokDurumlari, setStokDurumlari] = useState<DashboardStockStatus[]>([]);
  const [hareketler, setHareketler] = useState<StockMovement[]>([]);
  const [sungerler, setSungerler] = useState<Sponge[]>([]);
  const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);
  const [kritikStoklar, setKritikStoklar] = useState<DashboardStockStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Sünger listesi
        const spongeList = await getSponges();
        setSungerler(spongeList);

        // 2) Stok özet
        const summary: StockSummaryItem[] = await getStockSummary();
        
        // Backend'den gelen summary'yi DashboardStockStatus'a map et
        const mappedSummary: DashboardStockStatus[] = summary?.map((item) => ({
          sponge_id: item.sponge_id,
          name: item.name,
          current_stock: item.current_stock,
          critical_stock: item.critical_stock,
          is_critical: item.current_stock < item.critical_stock,
        })) || [];
        
        setStokDurumlari(mappedSummary);

        // 3) Kritik stokları filtrele
        const kritik = mappedSummary.filter((s) => s.is_critical);
        setKritikStoklar(kritik);

        // 4) Tarih aralığına göre hareketler (son 7 gün)
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const start = sevenDaysAgo.toISOString().slice(0, 10);
        const end = today.toISOString().slice(0, 10);

        const moves: StockMovement[] = await getStockByDate(start, end);
        setHareketler(moves);

      } catch (e) {
        console.error("Dashboard data yüklenirken hata:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with gradient */}
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Stok durumunuza genel bakış
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <StatsCards stokDurumlari={stokDurumlari} hareketler={hareketler} />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <CriticalStockAlerts
          stokDurumlari={stokDurumlari}
          onViewAll={() => setIsCriticalModalOpen(true)}
        />
      </div>

      {/* Üst alan - Haftalık Chart (tam genişlik) */}
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <WeeklyChart hareketler={hareketler} />
      </div>

      {/* Alt alan - 3 sütunlu grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        {/* Hızlı İşlemler */}
        <div className="transform transition-all hover:scale-[1.02] duration-200">
          <QuickActions />
        </div>

        {/* Hesap Makinesi */}
        <div className="transform transition-all hover:scale-[1.02] duration-200">
          <StockCalculator />
        </div>

        {/* En Aktif Ürünler */}
        <div className="transform transition-all hover:scale-[1.02] duration-200">
          <TopMoversWidget />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        <RecentActivities hareketler={hareketler} sungerler={sungerler} />
      </div>

      <CriticalStockModal
        open={isCriticalModalOpen}
        onOpenChange={setIsCriticalModalOpen}
        kritikStoklar={kritikStoklar}
      />
    </div>
  );
}
