import api from './axios';

export interface DashboardStats {
  total_products: number;
  total_stock: number;
  critical_stock_count: number;
  recent_movements_24h: number;
}

export interface WeeklyTrend {
  date: string;
  total_in: number;
  total_out: number;
  net: number;
}

export interface TopMover {
  name: string;
  movement_count: number;
  total_quantity: number;
}

/**
 * Dashboard genel istatistikleri
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Dashboard istatistikleri alınırken hata:', error);
    throw error;
  }
}

/**
 * Son 7 günün günlük trendi
 */
export async function getWeeklyTrend(): Promise<WeeklyTrend[]> {
  try {
    const response = await api.get<WeeklyTrend[]>('/dashboard/weekly-trend');
    return response.data;
  } catch (error) {
    console.error('Haftalık trend alınırken hata:', error);
    throw error;
  }
}

/**
 * En çok hareket gören ürünler
 */
export async function getTopMovers(limit: number = 5): Promise<TopMover[]> {
  try {
    const response = await api.get<TopMover[]>('/dashboard/top-movers', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('En çok hareket eden ürünler alınırken hata:', error);
    throw error;
  }
}
