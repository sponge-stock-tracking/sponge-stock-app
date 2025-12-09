// ------------------------------
// USER
// ------------------------------
export type UserRole = "admin" | "operator" | "viewer";

export interface User {
  id: number;
  username: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
}

export interface UserCreate {
  username: string;
  email?: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;  // seconds
}



// ------------------------------
// SPONGE (Sünger)
// ------------------------------
export type SpongeHardness = "soft" | "medium" | "hard";
export type SpongeUnit = "m3" | "adet";

export interface Sponge {
  id: number;
  name: string;
  density: number;
  hardness: SpongeHardness;
  width?: number | null;
  height?: number | null;
  thickness?: number | null;
  unit: SpongeUnit;
  critical_stock: number;
  created_at: string;      // ISO datetime
}

export interface SpongeCreate {
  name: string;
  density: number;
  hardness: SpongeHardness;
  unit: SpongeUnit;
  width?: number;
  height?: number;
  thickness?: number;
  critical_stock?: number;
}



// ------------------------------
// STOCK (Stok Hareketleri)
// ------------------------------
export type StockType = "in" | "out" | "return";

export interface StockMovement {
  id: number;
  sponge_id: number;
  quantity: number;
  type: StockType;
  price?: number | null;
  note?: string | null;
  date: string;           // ISO datetime
  created_by?: number | null;
}

export interface StockCreate {
  sponge_id: number;
  quantity: number;
  type: StockType;
  note?: string;
  price?: number;
}



// ------------------------------
// STOCK SUMMARY (backend: /stocks/summary)
// ------------------------------
export interface StockSummaryItem {
  sponge_id: number;
  name: string;
  total_in: number;
  total_out: number;
  total_return: number;
  current_stock: number;
  critical_stock: number;
}



// ------------------------------
// FRONTEND DASHBOARD MODELLERİ (Map edilen)
// ------------------------------
export interface DashboardStockStatus {
  sponge_id: number;
  name: string;
  current_stock: number;
  critical_stock: number;
  is_critical: boolean;
}



// ------------------------------
// REPORTS (Raporlar)
// ------------------------------
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

