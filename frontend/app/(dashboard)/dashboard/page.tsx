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
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 className="text-[2.4rem] font-extrabold text-[#C1E8FF] m-0">
          İYS SÜNGER VE MALZEMECİLİK
        </h1>
        <div className="flex items-center gap-5">
          <form 
            className="flex items-center bg-[rgba(193,232,255,0.15)] rounded-[10px] p-[5px_12px] h-[45px] border border-[rgba(193,232,255,0.2)] shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                setIsAramaModalOpen(true);
              }
            }}
          >
            <input
              type="text"
              placeholder="search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent text-white p-0 mr-2.5 outline-none text-base w-[250px] placeholder:text-[#C1E8FF] placeholder:opacity-80"
            />
            <button type="submit" className="bg-transparent border-none text-[#C1E8FF] cursor-pointer p-0 text-xl transition-colors hover:text-white">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center gap-4">
            <div className="relative">
              <NotificationDropdown />
              {kritikStokSayisi > 0 && (
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
      <div className="flex gap-5 mb-5 flex-shrink-0">
        <div className="flex-1 p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all hover:translate-y-[-5px] hover:scale-[1.01] hover:bg-gradient-to-br hover:from-[rgba(193,232,255,0.55)] hover:to-[rgba(125,160,202,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">📦</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Toplam Stok</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{toplamStok.toLocaleString("tr-TR")}</div>
        </div>
        <div className="flex-1 p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all hover:translate-y-[-5px] hover:scale-[1.01] hover:bg-gradient-to-br hover:from-[rgba(193,232,255,0.55)] hover:to-[rgba(125,160,202,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">⚠️</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Kritik Stok</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{kritikStokSayisi}</div>
        </div>
        <div className="flex-1 p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all hover:translate-y-[-5px] hover:scale-[1.01] hover:bg-gradient-to-br hover:from-[rgba(193,232,255,0.55)] hover:to-[rgba(125,160,202,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">⬇️</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Haftalık Giriş</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{haftalikGiris.toLocaleString("tr-TR")}</div>
        </div>
        <div className="flex-1 p-4 rounded-[18px] bg-gradient-to-br from-[rgba(193,232,255,0.35)] to-[rgba(125,160,202,0.25)] backdrop-blur-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all hover:translate-y-[-5px] hover:scale-[1.01] hover:bg-gradient-to-br hover:from-[rgba(193,232,255,0.55)] hover:to-[rgba(125,160,202,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]">
          <div className="text-[1.4rem] text-[#021024] mb-1">⬆️</div>
          <h4 className="text-sm mt-1 mb-1 text-[#021024]">Haftalık Çıkış</h4>
          <div className="text-[1.4rem] font-bold text-[#021024]">{haftalikCikis.toLocaleString("tr-TR")}</div>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div className="flex gap-5 items-stretch flex-grow mb-5 min-h-0">
        <div className="flex-grow flex flex-col bg-gradient-to-br from-[rgba(193,232,255,0.3)] to-[rgba(84,131,179,0.25)] backdrop-blur-[16px] rounded-[22px] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.55)] flex-basis-[60%] max-w-[700px] min-w-[300px]">
          <div className="font-semibold text-[#C1E8FF] mb-3 p-[5px_10px] flex-shrink-0 text-base">Stok Giriş / Çıkış Grafiği</div>
          <div className="flex-grow relative min-h-0">
            <WeeklyChart hareketler={hareketler} />
          </div>
        </div>
        <div className="flex-grow flex flex-col bg-gradient-to-br from-[rgba(193,232,255,0.3)] to-[rgba(84,131,179,0.25)] backdrop-blur-[16px] rounded-[22px] p-3 shadow-[0_12px_35px_rgba(0,0,0,0.55)] flex-basis-[40%]">
          <div className="font-semibold text-[#C1E8FF] mb-2.5 p-[5px_10px] flex-shrink-0">Son Hareketler</div>
          <div className="overflow-y-auto flex-grow">
            <RecentActivities hareketler={hareketler} sungerler={sungerler} />
          </div>
        </div>
      </div>

      {/* Critical Stock Alert */}
      {kritikStoklar.length > 0 && (
        <div 
          className="flex-shrink-0 p-5 rounded-[18px] bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400/30 shadow-lg cursor-pointer hover:from-orange-500/30 hover:to-red-500/30 transition-all mb-2.5"
          onClick={() => setIsCriticalModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Bell className="w-6 h-6 text-orange-300" />
              </div>
              <div>
                <h4 className="m-0 text-lg font-bold text-white flex items-center gap-2">
                  Kritik Stok Uyarısı
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {kritikStoklar.length}
                  </span>
                </h4>
                <p className="text-sm text-orange-100 mt-1">
                  {kritikStoklar.length} ürün kritik seviyede - Tıklayarak detayları görüntüleyin
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{kritikStoklar.length}</div>
              <div className="text-xs text-orange-200">Kritik</div>
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
