// api/sponges.ts
import api from "./axios";
import type { Sponge, SpongeCreate } from "@/lib/types";

/**
 * Tüm süngerleri listeler
 * Backend: GET /sponges/
 */
export const getSponges = async (): Promise<Sponge[]> => {
  try {
    const res = await api.get("/sponges/");
    return res.data;
  } catch (err: any) {
    console.error("❌ Get sponges error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * ID'ye göre sünger getirir
 * Backend: GET /sponges/{sponge_id}
 */
export const getSponge = async (id: number): Promise<Sponge> => {
  try {
    const res = await api.get(`/sponges/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Get sponge error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Yeni sünger oluşturur
 * Backend: POST /sponges/
 */
export const createSponge = async (data: SpongeCreate): Promise<Sponge> => {
  try {
    const res = await api.post("/sponges/", data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Create sponge error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Sünger günceller
 * Backend: PUT /sponges/{sponge_id}
 */
export const updateSponge = async (id: number, data: SpongeCreate): Promise<Sponge> => {
  try {
    const res = await api.put(`/sponges/${id}`, data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Update sponge error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Sünger siler
 * Backend: DELETE /sponges/{sponge_id}
 */
export const deleteSponge = async (id: number): Promise<void> => {
  try {
    await api.delete(`/sponges/${id}`);
  } catch (err: any) {
    console.error("❌ Delete sponge error:", err.response?.data || err.message);
    throw err;
  }
};
