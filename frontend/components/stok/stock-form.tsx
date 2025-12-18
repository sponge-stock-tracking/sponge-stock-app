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
import type { Sponge, StockSummaryItem } from "@/lib/types"
import { AlertCircle, Package, Loader2 } from "lucide-react"

interface StockFormProps {
  type: "in" | "out"
  sungerler: Sponge[]
  stokDurumlari: StockSummaryItem[]
  onSubmit: (data: { sponge_id: number; quantity: number; note?: string }) => Promise<void>
}

export function StockForm({ type, sungerler, stokDurumlari, onSubmit }: StockFormProps) {
  const [spongeId, setSpongeId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedStok = stokDurumlari.find((s) => s.sponge_id === spongeId)
  const selectedSponge = sungerler.find((s) => s.id === spongeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!spongeId || !quantity) {
      setError("Lütfen tüm zorunlu alanları doldurun")
      return
    }

    const quantityNum = Number.parseFloat(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Geçerli bir miktar girin")
      return
    }

    if (type === "out" && selectedStok && quantityNum > selectedStok.current_stock) {
      setError(`Yetersiz stok! Mevcut stok: ${selectedStok.current_stock} ${selectedSponge?.unit || "adet"}`)
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        sponge_id: spongeId,
        quantity: quantityNum,
        note: note || undefined,
      })

      // Form başarılı ise temizle
      setSpongeId(null)
      setQuantity("")
      setNote("")
    } catch (err) {
      // Error toast parent component'te gösteriliyor
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl mb-2">{type === "in" ? "Stok Giriş Formu" : "Stok Çıkış Formu"}</CardTitle>
        <CardDescription className="text-base">
          {type === "in" ? "Yeni stok eklemek için formu doldurun" : "Stok çıkışı yapmak için formu doldurun"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="sunger" className="text-base font-medium">
              Sünger Türü <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={spongeId?.toString() || ""} 
              onValueChange={(val) => setSpongeId(Number(val))}
              disabled={isSubmitting}
            >
              <SelectTrigger id="sunger">
                <SelectValue placeholder="Sünger türü seçin" />
              </SelectTrigger>
              <SelectContent>
                {sungerler?.map((sunger) => (
                  <SelectItem key={sunger.id} value={sunger.id.toString()}>
                    {sunger.name} ({sunger.density} kg/m³)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStok && selectedSponge && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                Mevcut Stok: <span className="font-semibold">{selectedStok.current_stock}</span> {selectedSponge.unit} •
                Kritik Seviye: <span className="font-semibold">{selectedStok.critical_stock}</span> {selectedSponge.unit}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="miktar" className="text-base font-medium">
              Miktar <span className="text-destructive">*</span>
            </Label>
            <Input
              id="miktar"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Örn: 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isSubmitting}
            />
            {selectedSponge && (
              <p className="text-sm text-muted-foreground">Birim: {selectedSponge.unit}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="aciklama" className="text-base font-medium">Not (İsteğe Bağlı)</Label>
            <Textarea
              id="aciklama"
              placeholder="Örn: Tedarikçi A'dan alınan parti"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor...
              </>
            ) : (
              type === "in" ? "Stok Girişi Yap" : "Stok Çıkışı Yap"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
