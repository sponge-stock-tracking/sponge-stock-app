"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { UserPlus, Settings, Users, Package, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { register } from "@/api/auth"
import { getSponges, createSponge, updateSponge, deleteSponge } from "@/api/sponges"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { UserRole, Sponge, SpongeHardness, SpongeUnit } from "@/lib/types"
import { toast } from "sonner"

interface AyarlarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AyarlarModal({ open, onOpenChange }: AyarlarModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast: toastHook } = useToast()
  const { user } = useAuth()

  // Kullanıcı form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "operator" as UserRole,
  })

  // Sünger yönetimi state
  const [sungerler, setSungerler] = useState<Sponge[]>([])
  const [isSungerDialogOpen, setIsSungerDialogOpen] = useState(false)
  const [editingSunger, setEditingSunger] = useState<Sponge | null>(null)
  const [sungerFormData, setSungerFormData] = useState({
    name: "",
    density: "",
    hardness: "medium" as SpongeHardness,
    unit: "m3" as SpongeUnit,
    width: "",
    height: "",
    thickness: "",
    critical_stock: "",
  })
  const [sungerError, setSungerError] = useState("")
  const [sungerLoading, setSungerLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sungerToDelete, setSungerToDelete] = useState<number | null>(null)

  // Sünger yükleme
  useEffect(() => {
    if (open) {
      loadSungerler()
    }
  }, [open])

  const loadSungerler = async () => {
    try {
      setSungerLoading(true)
      const data = await getSponges()
      setSungerler(data || [])
    } catch (error) {
      console.error("Sünger yükleme hatası:", error)
      toast.error("Süngerler yüklenirken bir hata oluştu")
    } finally {
      setSungerLoading(false)
    }
  }

  const handleSungerOpenDialog = (sunger?: Sponge) => {
    if (sunger) {
      setEditingSunger(sunger)
      setSungerFormData({
        name: sunger.name,
        density: sunger.density.toString(),
        hardness: sunger.hardness,
        unit: sunger.unit,
        width: sunger.width?.toString() || "",
        height: sunger.height?.toString() || "",
        thickness: sunger.thickness?.toString() || "",
        critical_stock: sunger.critical_stock.toString(),
      })
    } else {
      setEditingSunger(null)
      setSungerFormData({
        name: "",
        density: "",
        hardness: "medium",
        unit: "m3",
        width: "",
        height: "",
        thickness: "",
        critical_stock: "",
      })
    }
    setSungerError("")
    setIsSungerDialogOpen(true)
  }

  const handleSungerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSungerError("")

    if (!sungerFormData.name || !sungerFormData.density || !sungerFormData.critical_stock) {
      setSungerError("Lütfen zorunlu alanları doldurun (Ad, Dansite, Kritik Stok)")
      return
    }

    const densityNum = Number.parseFloat(sungerFormData.density)
    if (isNaN(densityNum) || densityNum <= 0 || densityNum >= 100) {
      setSungerError("Dansite 0-100 arasında olmalı")
      return
    }

    const criticalStockNum = Number.parseFloat(sungerFormData.critical_stock)
    if (isNaN(criticalStockNum) || criticalStockNum < 0) {
      setSungerError("Geçerli bir kritik stok değeri girin")
      return
    }

    try {
      setIsSubmitting(true)
      
      const spongeData = {
        name: sungerFormData.name,
        density: densityNum,
        hardness: sungerFormData.hardness,
        unit: sungerFormData.unit,
        width: sungerFormData.width ? Number.parseFloat(sungerFormData.width) : undefined,
        height: sungerFormData.height ? Number.parseFloat(sungerFormData.height) : undefined,
        thickness: sungerFormData.thickness ? Number.parseFloat(sungerFormData.thickness) : undefined,
        critical_stock: criticalStockNum,
      }

      if (editingSunger) {
        await updateSponge(editingSunger.id, spongeData)
        toast.success("Sünger türü güncellendi!")
      } else {
        await createSponge(spongeData)
        toast.success("Sünger türü eklendi!")
      }

      await loadSungerler()
      setIsSungerDialogOpen(false)
      setSungerFormData({
        name: "",
        density: "",
        hardness: "medium",
        unit: "m3",
        width: "",
        height: "",
        thickness: "",
        critical_stock: "",
      })
      setEditingSunger(null)
    } catch (error: any) {
      console.error("Sünger kaydetme hatası:", error)
      setSungerError(error.response?.data?.detail || "Sünger kaydedilirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSungerDeleteClick = (id: number) => {
    setSungerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleSungerDeleteConfirm = async () => {
    if (sungerToDelete) {
      try {
        await deleteSponge(sungerToDelete)
        toast.success("Sünger türü silindi!")
        await loadSungerler()
        setSungerToDelete(null)
      } catch (error: any) {
        console.error("Sünger silme hatası:", error)
        toast.error(error.response?.data?.detail || "Sünger silinirken bir hata oluştu")
      }
    }
    setDeleteDialogOpen(false)
  }

  // Kullanıcı ekleme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        username: formData.username,
        email: formData.email.trim() ? formData.email : undefined,
        password: formData.password,
        role: formData.role,
      }
      
      await register(payload)

      toastHook({
        title: "Kullanıcı Oluşturuldu",
        description: `${formData.username} başarıyla sisteme eklendi.`,
      })

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "operator",
      })
    } catch (error: any) {
      console.error("Register error:", error)
      
      let errorMessage = "Kullanıcı oluşturulamadı"
      
      const detail = error.response?.data?.detail
      if (typeof detail === "string") {
        errorMessage = detail
      } else if (Array.isArray(detail)) {
        errorMessage = detail.map((err: any) => {
          const field = err.loc?.[1] || err.loc?.[0] || "alan"
          return `${field}: ${err.msg}`
        }).join(", ")
      }
      
      toastHook({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] m-0 p-8 overflow-hidden flex flex-col">
        <DialogHeader className="pb-6 flex-shrink-0">
          <DialogTitle className="text-3xl font-bold mb-2 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            Ayarlar
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="users" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Kullanıcı Yönetimi
            </TabsTrigger>
            <TabsTrigger value="sponges" className="gap-2">
              <Package className="h-4 w-4" />
              Sünger Türleri
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              Genel Ayarlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 mt-6 flex-1 overflow-y-auto">
            {isAdmin ? (
              <>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Yeni Kullanıcı Ekle
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Sisteme yeni bir kullanıcı ekleyin. Oluşturduğunuz kullanıcı bilgileriyle giriş yapabilecek.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-base font-medium">
                      Kullanıcı Adı <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="johndoe"
                      required
                      minLength={3}
                      className="h-11"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">
                      E-posta
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="h-11"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-medium">
                      Şifre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="h-11"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-base font-medium">
                      Rol
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                      disabled={loading}
                    >
                      <SelectTrigger id="role" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="operator">Operatör</SelectItem>
                        <SelectItem value="viewer">Görüntüleyici</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                      İptal
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Oluşturuluyor...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Kullanıcı Ekle
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">
                  Kullanıcı yönetimi için admin yetkisi gereklidir
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bu özelliği kullanmak için admin rolüne sahip olmanız gerekir.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sponges" className="space-y-6 mt-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Sünger Türü Yönetimi
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sünger türlerini ekle, düzenle ve sil
                </p>
              </div>
              <Dialog open={isSungerDialogOpen} onOpenChange={setIsSungerDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleSungerOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Sünger Türü
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] m-0 p-8 overflow-hidden flex flex-col">
                  <DialogHeader className="pb-6 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold mb-2">
                      {editingSunger ? "Sünger Türünü Düzenle" : "Yeni Sünger Türü Ekle"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSungerSubmit} className="space-y-5 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="sunger-name" className="text-base font-medium">
                          Sünger Adı <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="sunger-name"
                          placeholder="Örn: Yüksek Yoğunluklu Sünger"
                          value={sungerFormData.name}
                          onChange={(e) => setSungerFormData({ ...sungerFormData, name: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-density" className="text-base font-medium">
                          Dansite (kg/m³) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="sunger-density"
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="99.9"
                          placeholder="Örn: 35"
                          value={sungerFormData.density}
                          onChange={(e) => setSungerFormData({ ...sungerFormData, density: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-hardness" className="text-base font-medium">
                          Sertlik <span className="text-destructive">*</span>
                        </Label>
                        <Select 
                          value={sungerFormData.hardness} 
                          onValueChange={(value) => setSungerFormData({ ...sungerFormData, hardness: value as SpongeHardness })}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="sunger-hardness" className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soft">Yumuşak</SelectItem>
                            <SelectItem value="medium">Orta</SelectItem>
                            <SelectItem value="hard">Sert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-unit" className="text-base font-medium">
                          Birim <span className="text-destructive">*</span>
                        </Label>
                        <Select 
                          value={sungerFormData.unit} 
                          onValueChange={(value) => setSungerFormData({ ...sungerFormData, unit: value as SpongeUnit })}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="sunger-unit" className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="m3">m³</SelectItem>
                            <SelectItem value="adet">Adet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-width" className="text-base font-medium">Genişlik (cm)</Label>
                        <Input
                          id="sunger-width"
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="Örn: 200"
                          value={sungerFormData.width}
                          onChange={(e) => setSungerFormData({ ...sungerFormData, width: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-height" className="text-base font-medium">Yükseklik (cm)</Label>
                        <Input
                          id="sunger-height"
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="Örn: 100"
                          value={sungerFormData.height}
                          onChange={(e) => setSungerFormData({ ...sungerFormData, height: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-thickness" className="text-base font-medium">Kalınlık (cm)</Label>
                        <Input
                          id="sunger-thickness"
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="Örn: 5"
                          value={sungerFormData.thickness}
                          onChange={(e) => setSungerFormData({ ...sungerFormData, thickness: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sunger-critical-stock" className="text-base font-medium">
                          Kritik Stok Seviyesi <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="sunger-critical-stock"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Örn: 50"
                          value={sungerFormData.critical_stock}
                          onChange={(e) => setSungerFormData({ ...sungerFormData, critical_stock: e.target.value })}
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>
                    </div>

                    {sungerError && (
                      <Alert variant="destructive">
                        <AlertDescription>{sungerError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsSungerDialogOpen(false)} disabled={isSubmitting}>
                        İptal
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {editingSunger ? "Güncelleniyor..." : "Ekleniyor..."}
                          </>
                        ) : (
                          editingSunger ? "Güncelle" : "Ekle"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Sünger Türleri</CardTitle>
                <CardDescription>Sistemde kayıtlı tüm sünger türleri</CardDescription>
              </CardHeader>
              <CardContent>
                {sungerLoading ? (
                  <p className="text-center text-muted-foreground py-8">Yükleniyor...</p>
                ) : sungerler.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Henüz sünger türü eklenmemiş</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="px-6 py-4 text-base font-semibold min-w-[250px]">Sünger Adı</TableHead>
                          <TableHead className="px-6 py-4 text-base font-semibold min-w-[120px]">Dansite</TableHead>
                          <TableHead className="px-6 py-4 text-base font-semibold min-w-[120px]">Sertlik</TableHead>
                          <TableHead className="px-6 py-4 text-base font-semibold min-w-[100px]">Birim</TableHead>
                          <TableHead className="px-6 py-4 text-base font-semibold min-w-[180px]">Ölçüler (G×Y×K)</TableHead>
                          <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[130px]">Kritik Stok</TableHead>
                          <TableHead className="text-right px-6 py-4 text-base font-semibold min-w-[140px]">İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sungerler.map((sunger) => {
                          const hardnessLabel = sunger.hardness === 'soft' ? 'Yumuşak' : sunger.hardness === 'medium' ? 'Orta' : 'Sert'
                          const dimensions = [sunger.width, sunger.height, sunger.thickness]
                            .filter(d => d !== null && d !== undefined)
                            .map(d => `${d}cm`)
                            .join(' × ') || '-'
                          
                          return (
                            <TableRow key={sunger.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-medium px-6 py-4 text-base">{sunger.name}</TableCell>
                              <TableCell className="px-6 py-4 text-base">{sunger.density} kg/m³</TableCell>
                              <TableCell className="px-6 py-4 text-base">{hardnessLabel}</TableCell>
                              <TableCell className="px-6 py-4 text-base">{sunger.unit}</TableCell>
                              <TableCell className="px-6 py-4 text-base">{dimensions}</TableCell>
                              <TableCell className="text-right px-6 py-4 text-base">{sunger.critical_stock.toLocaleString("tr-TR")}</TableCell>
                              <TableCell className="text-right px-6 py-4">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="default" onClick={() => handleSungerOpenDialog(sunger)} className="gap-2">
                                    <Pencil className="h-4 w-4" />
                                    Düzenle
                                  </Button>
                                  <Button variant="ghost" size="default" onClick={() => handleSungerDeleteClick(sunger.id)} className="gap-2 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    onClick={handleSungerDeleteConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          <TabsContent value="general" className="space-y-6 mt-6 flex-1 overflow-y-auto">
            <div>
              <h3 className="text-xl font-semibold mb-4">Genel Ayarlar</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Sistem genel ayarları yakında eklenecektir.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

