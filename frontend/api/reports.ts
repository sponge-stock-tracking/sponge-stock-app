import api from './axios';

export interface WeeklyReport {
  period: string;
  total_in: number;
  total_out: number;
  top_items: {
    name: string;
    net: number;
  }[];
}

export interface MonthlyReport {
  month: string;
  total_in: number;
  total_out: number;
  items: {
    name: string;
    in: number;
    out: number;
  }[];
}

export interface CriticalStock {
  name: string;
  available_stock: number;
  critical_stock: number;
  status: 'critical';
}

/**
 * Haftalık rapor - Son 7 günlük stok giriş/çıkış özeti
 */
export async function getWeeklyReport(): Promise<WeeklyReport> {
  try {
    const response = await api.get<WeeklyReport>('/reports/weekly');
    return response.data;
  } catch (error) {
    console.error('Haftalık rapor alınırken hata:', error);
    throw error;
  }
}

/**
 * Aylık rapor - Mevcut ay stok hareketleri
 */
export async function getMonthlyReport(): Promise<MonthlyReport> {
  try {
    const response = await api.get<MonthlyReport>('/reports/monthly');
    return response.data;
  } catch (error) {
    console.error('Aylık rapor alınırken hata:', error);
    throw error;
  }
}

/**
 * Kritik stok raporu - Kritik seviyenin altındaki ürünler
 * @param notify - E-posta bildirimi gönderilsin mi?
 */
export async function getCriticalStocks(notify: boolean = false): Promise<CriticalStock[]> {
  try {
    const response = await api.get<CriticalStock[]>('/reports/critical', {
      params: { notify }
    });
    return response.data;
  } catch (error) {
    console.error('Kritik stok raporu alınırken hata:', error);
    throw error;
  }
}
