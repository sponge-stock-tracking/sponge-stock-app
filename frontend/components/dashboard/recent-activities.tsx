"use client"

import type { StockMovement, Sponge } from "@/lib/types"

interface RecentActivitiesProps {
  hareketler: StockMovement[]
  sungerler: Sponge[]
}

export function RecentActivities({ hareketler, sungerler }: RecentActivitiesProps) {
  const sonHareketler = [...(hareketler || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const getSungerAd = (sungerId: number) => {
    return sungerler?.find((s) => s.id === sungerId)?.name || "Bilinmeyen"
  }

  return (
    <table className="w-full border-collapse text-sm text-[#C1E8FF] flex-grow">
      <thead>
        <tr>
          <th className="p-2 text-left border-b border-[rgba(125,160,202,0.3)]">Ürün</th>
          <th className="p-2 text-left border-b border-[rgba(125,160,202,0.3)]">Miktar</th>
          <th className="p-2 text-left border-b border-[rgba(125,160,202,0.3)]">Tip</th>
          <th className="p-2 text-left border-b border-[rgba(125,160,202,0.3)]">Tarih</th>
        </tr>
      </thead>
      <tbody>
        {sonHareketler.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-4 text-center text-[#C1E8FF] opacity-60">
              Henüz hareket yok
            </td>
          </tr>
        ) : (
          sonHareketler.map((hareket) => (
            <tr key={hareket.id} className="hover:bg-[rgba(125,160,202,0.1)] transition-colors">
              <td className="p-2 border-b border-[rgba(125,160,202,0.3)]">{getSungerAd(hareket.sponge_id)}</td>
              <td className="p-2 border-b border-[rgba(125,160,202,0.3)]">
                {hareket.type === "in" ? "+" : "-"}{hareket.quantity}
              </td>
              <td className={`p-2 border-b border-[rgba(125,160,202,0.3)] font-bold ${
                hareket.type === "in" ? "text-[#72f1b8]" : "text-[#ff8e8e]"
              }`}>
                {hareket.type === "in" ? "Giriş" : hareket.type === "out" ? "Çıkış" : "İade"}
              </td>
              <td className="p-2 border-b border-[rgba(125,160,202,0.3)]">
                {new Date(hareket.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short"
                })}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
