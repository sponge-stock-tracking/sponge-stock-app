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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-lg">Stok durumunuza genel bakış</p>
      </div>

      <StatsCards stokDurumlari={stokDurumlari} hareketler={hareketler} />

      <CriticalStockAlerts
        stokDurumlari={stokDurumlari}
        onViewAll={() => setIsCriticalModalOpen(true)}
      />

      {/* Üst alan - Haftalık Chart (tam genişlik) */}
      <div className="w-full">
        <WeeklyChart hareketler={hareketler} />
      </div>

      {/* Alt alan - 3 sütunlu grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Hızlı İşlemler */}
        <div>
          <QuickActions />
        </div>

        {/* Hesap Makinesi */}
        <div>
          <StockCalculator />
        </div>

        {/* En Aktif Ürünler */}
        <div>
          <TopMoversWidget />
        </div>
      </div>

      <RecentActivities hareketler={hareketler} sungerler={sungerler} />

      <CriticalStockModal
        open={isCriticalModalOpen}
        onOpenChange={setIsCriticalModalOpen}
        kritikStoklar={kritikStoklar}
      />
    </div>
  );
}
