"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SungerTuru, StokDurum } from "@/lib/types"
import { AlertCircle, Package } from "lucide-react"
import { toast } from "sonner"

interface StockFormProps {
  type: "giris" | "cikis"
  sungerler: SungerTuru[]
  stokDurumlari: StokDurum[]
  onSubmit: (data: { sungerId: string; miktar: number; tarih: string; aciklama: string }) => void
}

export function StockForm({ type, sungerler, stokDurumlari, onSubmit }: StockFormProps) {
  const [sungerId, setSungerId] = useState("")
  const [miktar, setMiktar] = useState("")
  const [tarih, setTarih] = useState(new Date().toISOString().split("T")[0])
  const [aciklama, setAciklama] = useState("")
  const [error, setError] = useState("")

  const selectedStok = stokDurumlari.find((s) => s.sungerId === sungerId)
  const selectedSunger = sungerler.find((s) => s.id === sungerId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!sungerId || !miktar || !tarih) {
      setError("Lütfen tüm zorunlu alanları doldurun")
      return
    }

    const miktarNum = Number.parseInt(miktar)
    if (isNaN(miktarNum) || miktarNum <= 0) {
      setError("Geçerli bir miktar girin")
      return
    }

    if (type === "cikis" && selectedStok && miktarNum > selectedStok.mevcutStok) {
      setError(`Yetersiz stok! Mevcut stok: ${selectedStok.mevcutStok} ${selectedStok.birim}`)
      return
    }

    onSubmit({
      sungerId,
      miktar: miktarNum,
      tarih: new Date(tarih).toISOString(),
      aciklama,
    })

    toast.success(type === "giris" ? "Stok girişi başarıyla kaydedildi!" : "Stok çıkışı başarıyla kaydedildi!", {
      description: `${selectedSunger?.ad} - ${miktarNum} ${selectedStok?.birim || "adet"}`,
      icon: <Package className="h-4 w-4" />,
    })

    setSungerId("")
    setMiktar("")
    setAciklama("")
    setTarih(new Date().toISOString().split("T")[0])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{type === "giris" ? "Stok Giriş Formu" : "Stok Çıkış Formu"}</CardTitle>
        <CardDescription>
          {type === "giris" ? "Yeni stok eklemek için formu doldurun" : "Stok çıkışı yapmak için formu doldurun"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sunger">
              Sünger Türü <span className="text-destructive">*</span>
            </Label>
            <Select value={sungerId} onValueChange={setSungerId}>
              <SelectTrigger id="sunger">
                <SelectValue placeholder="Örn: Yüksek Yoğunluklu Sünger 5cm" />
              </SelectTrigger>
              <SelectContent>
                {sungerler.map((sunger) => (
                  <SelectItem key={sunger.id} value={sunger.id}>
                    {sunger.ad} {sunger.sku && `(${sunger.sku})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStok && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                Mevcut Stok: <span className="font-semibold">{selectedStok.mevcutStok}</span> {selectedStok.birim} •
                Kritik Seviye: <span className="font-semibold">{selectedStok.kritikStok}</span> {selectedStok.birim}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="miktar">
                Miktar <span className="text-destructive">*</span>
              </Label>
              <Input
                id="miktar"
                type="number"
                min="1"
                placeholder="Örn: 100"
                value={miktar}
                onChange={(e) => setMiktar(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tarih">
                Tarih <span className="text-destructive">*</span>
              </Label>
              <Input id="tarih" type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aciklama">Açıklama (İsteğe Bağlı)</Label>
            <Textarea
              id="aciklama"
              placeholder="Örn: Tedarikçi A'dan alınan parti"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg">
            {type === "giris" ? "Stok Girişi Yap" : "Stok Çıkışı Yap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
