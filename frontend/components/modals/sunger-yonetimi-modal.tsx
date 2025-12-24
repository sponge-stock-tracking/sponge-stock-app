"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSponges, createSponge, updateSponge, deleteSponge } from "@/api/sponges"
import type { Sponge, SpongeHardness, SpongeUnit } from "@/lib/types"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SungerYonetimiModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SungerYonetimiModal({ open, onOpenChange }: SungerYonetimiModalProps) {
    const [sungerler, setSungerler] = useState<Sponge[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingSunger, setEditingSunger] = useState<Sponge | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        density: "",
        hardness: "medium" as SpongeHardness,
        unit: "m3" as SpongeUnit,
        width: "",
        height: "",
        thickness: "",
        critical_stock: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [sungerToDelete, setSungerToDelete] = useState<number | null>(null)

    useEffect(() => {
        if (open) {
            loadSungerler()
        }
    }, [open])

    const loadSungerler = async () => {
        try {
            setLoading(true)
            const data = await getSponges()
            setSungerler(data || [])
        } catch (error) {
            console.error("Sünger yükleme hatası:", error)
            toast.error("Süngerler yüklenirken bir hata oluştu")
        } finally {
            setLoading(false)
        }
    }

    const handleOpenDialog = (sunger?: Sponge) => {
        if (sunger) {
            setEditingSunger(sunger)
            setFormData({
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
            setFormData({
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
        setError("")
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.name || !formData.density || !formData.critical_stock) {
            setError("Lütfen zorunlu alanları doldurun (Ad, Dansite, Kritik Stok)")
            return
        }

        const densityNum = Number.parseFloat(formData.density)
        if (isNaN(densityNum) || densityNum <= 0 || densityNum >= 100) {
            setError("Dansite 0-100 arasında olmalı")
            return
        }

        const criticalStockNum = Number.parseFloat(formData.critical_stock)
        if (isNaN(criticalStockNum) || criticalStockNum < 0) {
            setError("Geçerli bir kritik stok değeri girin")
            return
        }

        try {
            setIsSubmitting(true)

            const spongeData = {
                name: formData.name,
                density: densityNum,
                hardness: formData.hardness,
                unit: formData.unit,
                width: formData.width ? Number.parseFloat(formData.width) : undefined,
                height: formData.height ? Number.parseFloat(formData.height) : undefined,
                thickness: formData.thickness ? Number.parseFloat(formData.thickness) : undefined,
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
            setIsDialogOpen(false)
            setFormData({
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
            setError(error.response?.data?.detail || "Sünger kaydedilirken bir hata oluştu")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClick = (id: number) => {
        setSungerToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
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

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] m-0 p-8 overflow-hidden flex flex-col">
                    <DialogHeader className="pb-6">
                        <DialogTitle className="text-3xl font-bold mb-2">Sünger Türü Yönetimi</DialogTitle>
                        <p className="text-muted-foreground text-base">Sünger türlerini ekle, düzenle ve sil</p>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">Sünger türlerini ekle, düzenle ve sil</p>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenDialog()}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Yeni Sünger Türü
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto p-8">
                                    <DialogHeader>
                                        <DialogTitle>{editingSunger ? "Sünger Türünü Düzenle" : "Yeni Sünger Türü Ekle"}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Sünger Adı <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Örn: Yüksek Yoğunluklu Sünger"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="density">
                                                    Dansite (kg/m³) <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="density"
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    max="99.9"
                                                    placeholder="Örn: 35"
                                                    value={formData.density}
                                                    onChange={(e) => setFormData({ ...formData, density: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="hardness">
                                                    Sertlik <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.hardness}
                                                    onValueChange={(value) => setFormData({ ...formData, hardness: value as SpongeHardness })}
                                                    disabled={isSubmitting}
                                                >
                                                    <SelectTrigger id="hardness">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="soft">Yumuşak</SelectItem>
                                                        <SelectItem value="medium">Orta</SelectItem>
                                                        <SelectItem value="hard">Sert</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="unit">
                                                    Birim <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={formData.unit}
                                                    onValueChange={(value) => setFormData({ ...formData, unit: value as SpongeUnit })}
                                                    disabled={isSubmitting}
                                                >
                                                    <SelectTrigger id="unit">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="m3">m³</SelectItem>
                                                        <SelectItem value="adet">Adet</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="width">Genişlik (cm)</Label>
                                                <Input
                                                    id="width"
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    placeholder="Örn: 200"
                                                    value={formData.width}
                                                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="height">Yükseklik (cm)</Label>
                                                <Input
                                                    id="height"
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    placeholder="Örn: 100"
                                                    value={formData.height}
                                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="thickness">Kalınlık (cm)</Label>
                                                <Input
                                                    id="thickness"
                                                    type="number"
                                                    step="0.1"
                                                    min="0.1"
                                                    placeholder="Örn: 5"
                                                    value={formData.thickness}
                                                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="critical_stock">
                                                    Kritik Stok Seviyesi <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="critical_stock"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    placeholder="Örn: 50"
                                                    value={formData.critical_stock}
                                                    onChange={(e) => setFormData({ ...formData, critical_stock: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {editingSunger ? "Güncelleniyor..." : "Ekleniyor..."}
                                                </>
                                            ) : (
                                                editingSunger ? "Güncelle" : "Ekle"
                                            )}
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
                                {loading ? (
                                    <p className="text-center text-muted-foreground py-8">Yükleniyor...</p>
                                ) : sungerler.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">Henüz sünger türü eklenmemiş</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead className="px-4 py-3 font-semibold text-left">Sünger Adı</TableHead>
                                                    <TableHead className="px-4 py-3 font-semibold text-center w-[100px]">Düzenle</TableHead>
                                                    <TableHead className="px-4 py-3 font-semibold text-center w-[100px]">Sil</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sungerler.map((sunger) => (
                                                    <TableRow key={sunger.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell className="font-medium px-4 py-3 text-left">
                                                            {sunger.name}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleOpenDialog(sunger)}
                                                                className="h-8 w-full flex items-center justify-center gap-2 hover:bg-blue-500/10 hover:text-blue-400"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                <span className="hidden sm:inline">Düzenle</span>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(sunger.id)}
                                                                className="h-8 w-full flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="hidden sm:inline">Sil</span>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

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
        </>
    )
}

