"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { initializeDemoData, getSungerTurleri, saveSungerTuru, deleteSungerTuru } from "@/lib/storage"
import type { SungerTuru } from "@/lib/types"
import { ArrowLeft, Plus, Pencil, Trash2, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SungerYonetimiPage() {
  const [sungerler, setSungerler] = useState<SungerTuru[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSunger, setEditingSunger] = useState<SungerTuru | null>(null)
  const [formData, setFormData] = useState({
    ad: "",
    sku: "",
    birim: "adet",
    kritikStok: "",
    dansite: "",
    sertlik: "",
    olcu: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sungerToDelete, setSungerToDelete] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    initializeDemoData()
    loadSungerler()
  }, [])

  const loadSungerler = () => {
    setSungerler(getSungerTurleri())
  }

  const handleOpenDialog = (sunger?: SungerTuru) => {
    if (sunger) {
      setEditingSunger(sunger)
      setFormData({
        ad: sunger.ad,
        sku: sunger.sku,
        birim: sunger.birim,
        kritikStok: sunger.kritikStok.toString(),
        dansite: sunger.dansite || "",
        sertlik: sunger.sertlik || "",
        olcu: sunger.olcu || "",
      })
    } else {
      setEditingSunger(null)
      setFormData({
        ad: "",
        sku: "",
        birim: "adet",
        kritikStok: "",
        dansite: "",
        sertlik: "",
        olcu: "",
      })
    }
    setError("")
    setSuccess(false)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!formData.ad || !formData.sku || !formData.kritikStok) {
      setError("Lütfen zorunlu alanları doldurun (Ad, SKU, Kritik Stok)")
      return
    }

    const kritikStokNum = Number.parseInt(formData.kritikStok)
    if (isNaN(kritikStokNum) || kritikStokNum <= 0) {
      setError("Geçerli bir kritik stok değeri girin")
      return
    }

    const sunger: SungerTuru = {
      id: editingSunger?.id || Date.now().toString(),
      ad: formData.ad,
      sku: formData.sku,
      birim: formData.birim,
      kritikStok: kritikStokNum,
      dansite: formData.dansite || undefined,
      sertlik: formData.sertlik || undefined,
      olcu: formData.olcu || undefined,
    }

    saveSungerTuru(sunger)
    loadSungerler()
    setSuccess(true)

    setTimeout(() => {
      setIsDialogOpen(false)
      setFormData({
        ad: "",
        sku: "",
        birim: "adet",
        kritikStok: "",
        dansite: "",
        sertlik: "",
        olcu: "",
      })
      setEditingSunger(null)
    }, 1000)
  }

  const handleDeleteClick = (id: string) => {
    setSungerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (sungerToDelete) {
      deleteSungerTuru(sungerToDelete)
      loadSungerler()
      setSungerToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Sünger Türü Yönetimi</h2>
                <p className="text-muted-foreground mt-1">Sünger türlerini ekle, düzenle ve sil</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Sünger Türü
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingSunger ? "Sünger Türünü Düzenle" : "Yeni Sünger Türü Ekle"}</DialogTitle>
                  <DialogDescription>
                    {editingSunger ? "Sünger türü bilgilerini güncelleyin" : "Yeni bir sünger türü ekleyin"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ad">
                        Sünger Adı <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="ad"
                        placeholder="Örn: Yüksek Yoğunluklu Sünger 5cm"
                        value={formData.ad}
                        onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku">
                        SKU Kodu <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="sku"
                        placeholder="Örn: YYS-5CM-001"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birim">
                        Birim <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="birim"
                        placeholder="Örn: adet, kg, m²"
                        value={formData.birim}
                        onChange={(e) => setFormData({ ...formData, birim: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kritikStok">
                        Kritik Stok Seviyesi <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="kritikStok"
                        type="number"
                        min="1"
                        placeholder="Örn: 50"
                        value={formData.kritikStok}
                        onChange={(e) => setFormData({ ...formData, kritikStok: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dansite">Dansite</Label>
                      <Input
                        id="dansite"
                        placeholder="Örn: 35 kg/m³"
                        value={formData.dansite}
                        onChange={(e) => setFormData({ ...formData, dansite: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sertlik">Sertlik</Label>
                      <Input
                        id="sertlik"
                        placeholder="Örn: Sert, Orta, Yumuşak"
                        value={formData.sertlik}
                        onChange={(e) => setFormData({ ...formData, sertlik: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="olcu">Ölçü</Label>
                    <Input
                      id="olcu"
                      placeholder="Örn: 200x100x5 cm"
                      value={formData.olcu}
                      onChange={(e) => setFormData({ ...formData, olcu: e.target.value })}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-900 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {editingSunger ? "Sünger türü güncellendi!" : "Sünger türü eklendi!"}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    {editingSunger ? "Güncelle" : "Ekle"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sünger Türleri</CardTitle>
              <CardDescription>Sistemde kayıtlı tüm sünger türleri</CardDescription>
            </CardHeader>
            <CardContent>
              {sungerler.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Henüz sünger türü eklenmemiş</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sünger Adı</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Birim</TableHead>
                        <TableHead>Dansite</TableHead>
                        <TableHead>Sertlik</TableHead>
                        <TableHead>Ölçü</TableHead>
                        <TableHead className="text-right">Kritik Stok</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sungerler.map((sunger) => (
                        <TableRow key={sunger.id}>
                          <TableCell className="font-medium">{sunger.ad}</TableCell>
                          <TableCell className="text-muted-foreground">{sunger.sku}</TableCell>
                          <TableCell>{sunger.birim}</TableCell>
                          <TableCell className="text-sm">{sunger.dansite || "-"}</TableCell>
                          <TableCell className="text-sm">{sunger.sertlik || "-"}</TableCell>
                          <TableCell className="text-sm">{sunger.olcu || "-"}</TableCell>
                          <TableCell className="text-right">{sunger.kritikStok.toLocaleString("tr-TR")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(sunger)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(sunger.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sünger türünü silmek istediğinizden emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Sünger türü kalıcı olarak silinecektir. Ancak bu sünger türüne ait stok
                hareketleri korunacaktır.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}
