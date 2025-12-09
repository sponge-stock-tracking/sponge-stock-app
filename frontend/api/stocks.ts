// api/stocks.ts
import api from "./axios";
import type { StockCreate, StockMovement } from "@/lib/types";

/**
 * Stok özet bilgilerini çeker
 * Backend: GET /stocks/summary
 */
export const getStockSummary = async () => {
  try {
    const res = await api.get("/stocks/summary");
    return res.data;
  } catch (err: any) {
    console.error("❌ Stock summary error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Belirli tarih aralığındaki stok hareketlerini çeker
 * Backend: GET /stocks/by_date?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export const getStockByDate = async (start: string, end: string) => {
  // Tarihler encode edilmeli (özellikle Safari ve Ubuntu’da kritik!)
  const params = new URLSearchParams({ start, end });

  try {
    const res = await api.get(`/stocks/by_date?${params.toString()}`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Stock by date error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Yeni stok hareketi oluşturur (giriş, çıkış, iade)
 * Backend: POST /stocks/
 */
export const createStock = async (data: StockCreate): Promise<StockMovement> => {
  try {
    const res = await api.post("/stocks/", data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Stock create error:", err.response?.data || err.message);
    throw err;
  }
};
