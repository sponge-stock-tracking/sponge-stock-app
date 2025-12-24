"use client";

import { useEffect, useState } from "react";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { CriticalStockModal } from "@/components/dashboard/critical-stock-modal";
import { StokGirisModal } from "@/components/modals/stok-giris-modal";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { StokAramaModal } from "@/components/modals/stok-arama-modal";
import { AyarlarModal } from "@/components/modals/ayarlar-modal";
import { Search, Settings, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const [isStokGirisModalOpen, setIsStokGirisModalOpen] = useState(false);
  const [kritikStoklar, setKritikStoklar] = useState<DashboardStockStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAramaModalOpen, setIsAramaModalOpen] = useState(false);
  const [isAyarlarModalOpen, setIsAyarlarModalOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const spongeList = await getSponges();
        setSungerler(spongeList);

        const summary: StockSummaryItem[] = await getStockSummary();

        const mappedSummary: DashboardStockStatus[] = summary?.map((item) => ({
          sponge_id: item.sponge_id,
          name: item.name,
          current_stock: item.current_stock,
          critical_stock: item.critical_stock,
          is_critical: item.current_stock < item.critical_stock,
        })) || [];

        setStokDurumlari(mappedSummary);

        const kritik = mappedSummary.filter((s) => s.is_critical);
        setKritikStoklar(kritik);

        // Son 12 ayın verilerini çek (grafik için)
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 12);

        const start = twelveMonthsAgo.toISOString().slice(0, 10);
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1E8FF]"></div>
      </div>
    );
  }

  const toplamStok = stokDurumlari.reduce((sum, stok) => sum + stok.current_stock, 0);
  const kritikStokSayisi = kritikStoklar.length;
  const yediGunOnce = new Date();
  yediGunOnce.setDate(yediGunOnce.getDate() - 7);
  const sonHareketler = hareketler?.filter((h) => new Date(h.date) >= yediGunOnce) || [];
  const haftalikGiris = sonHareketler.filter((h) => h.type === "in").reduce((sum, h) => sum + h.quantity, 0);
  const haftalikCikis = sonHareketler.filter((h) => h.type === "out").reduce((sum, h) => sum + h.quantity, 0);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto p-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 flex-shrink-0 gap-4">
        <h1 className="text-2xl md:text-[2.4rem] font-extrabold text-[#C1E8FF] m-0 pl-12 md:pl-0 pt-2 md:pt-0">
          İYS SÜNGER
        </h1>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <form
            className="flex items-center bg-[rgba(193,232,255,0.15)] rounded-[10px] p-[5px_12px] h-[45px] border border-[rgba(193,232,255,0.2)] shadow-[0_4px_10px_rgba(0,0,0,0.2)] w-full md:w-auto"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                setIsAramaModalOpen(true);
              }
            }}
          >
            <input
              type="text"
              placeholder="ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent text-white p-0 mr-2.5 outline-none text-base w-full md:w-[250px] placeholder:text-[#C1E8FF] placeholder:opacity-80"
            />
            <button type="submit" className="bg-transparent border-none text-[#C1E8FF] cursor-pointer p-0 text-xl transition-colors hover:text-white flex-shrink-0">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-end gap-3 md:gap-4 mt-2 md:mt-0">
            <div className="relative">
              <NotificationDropdown />
              {kritikStoklar.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F87171] text-white text-xs px-1.5 py-0.5 rounded-full min-w-[16px] text-center border border-[#021024] pointer-events-none">
                  {kritikStokSayisi}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#C1E8FF] hover:text-white"
              onClick={() => setIsAyarlarModalOpen(true)}
            >
              <Settings className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#C1E8FF] hover:text-white" onClick={handleLogout}>
              <LogOut className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-5 flex-shrink-0">
        <div className="p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">📦</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Toplam Stok</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{toplamStok.toLocaleString("tr-TR")}</div>
        </div>
        <div className="p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">⚠️</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Kritik Stok</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{kritikStokSayisi}</div>
        </div>
        <div className="p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">⬇️</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Haftalık Giriş</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{haftalikGiris.toLocaleString("tr-TR")}</div>
        </div>
        <div className="p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">⬆️</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Haftalık Çıkış</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{haftalikCikis.toLocaleString("tr-TR")}</div>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch flex-grow mb-5 min-h-0">
        <div className="flex-grow flex flex-col bg-gradient-to-br from-[rgba(193,232,255,0.3)] to-[rgba(84,131,179,0.25)] backdrop-blur-[16px] rounded-[22px] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.55)] lg:basis-[60%] w-full min-h-[300px]">
          <div className="font-semibold text-[#C1E8FF] mb-3 p-[5px_10px] flex-shrink-0 text-base">Stok Giriş / Çıkış Grafiği</div>
          <div className="flex-grow relative min-h-[250px]">
            <WeeklyChart hareketler={hareketler} />
          </div>
        </div>
        <div className="flex-grow flex flex-col bg-gradient-to-br from-[rgba(193,232,255,0.3)] to-[rgba(84,131,179,0.25)] backdrop-blur-[16px] rounded-[22px] p-3 shadow-[0_12px_35px_rgba(0,0,0,0.55)] lg:basis-[40%] w-full min-h-[300px]">
          <div className="font-semibold text-[#C1E8FF] mb-2.5 p-[5px_10px] flex-shrink-0">Son Hareketler</div>
          <div className="overflow-y-auto flex-grow h-[300px] lg:h-auto">
            <RecentActivities hareketler={hareketler} sungerler={sungerler} />
          </div>
        </div>
      </div>

      {/* Critical Stock Alert */}
      {kritikStoklar.length > 0 && (
        <div
          className="flex-shrink-0 p-5 rounded-[18px] bg-gradient-to-r from-red-950/80 to-slate-900/80 border border-red-900/50 shadow-lg cursor-pointer hover:from-red-900/80 hover:to-slate-800/80 transition-all mb-2.5 backdrop-blur-md group"
          onClick={() => setIsCriticalModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 group-hover:bg-red-500/20 transition-colors">
                <Bell className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <h4 className="m-0 text-lg font-bold text-white flex items-center gap-3">
                  Kritik Stok Uyarısı
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-xs font-bold shadow-sm shadow-red-900/50">
                    {kritikStoklar.length} Ürün
                  </span>
                </h4>
                <p className="text-sm text-slate-400 mt-1 max-w-md">
                  Stok seviyesi kritik eşiğin altına düşen ürünleriniz var. Sipariş oluşturmak için tıklayın.
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-3xl font-bold text-red-500">{kritikStoklar.length}</div>
              <div className="text-xs text-red-400/60 font-medium uppercase tracking-wider">Acil İşlem</div>
            </div>
          </div>
        </div>
      )}

      <CriticalStockModal
        open={isCriticalModalOpen}
        onOpenChange={setIsCriticalModalOpen}
        kritikStoklar={kritikStoklar}
        onStokGiris={() => setIsStokGirisModalOpen(true)}
      />

      <StokGirisModal
        open={isStokGirisModalOpen}
        onOpenChange={setIsStokGirisModalOpen}
        onSuccess={() => {
          // Dashboard verilerini yenile
          window.location.reload();
        }}
      />

      <StokAramaModal
        open={isAramaModalOpen}
        onOpenChange={setIsAramaModalOpen}
        searchTerm={searchTerm}
      />

      <AyarlarModal
        open={isAyarlarModalOpen}
        onOpenChange={setIsAyarlarModalOpen}
      />
    </div>
  );
}
