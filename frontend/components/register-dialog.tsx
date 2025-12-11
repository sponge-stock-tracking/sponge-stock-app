"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus } from "lucide-react"
import { register } from "@/api/auth"
import { useToast } from "@/hooks/use-toast"
import { UserRole } from "@/lib/types"

export function RegisterDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "operator" as UserRole,
  })

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
      
      console.log("Register payload:", payload)
      await register(payload)

      toast({
        title: "Kullanıcı Oluşturuldu",
        description: `${formData.username} başarıyla sisteme eklendi.`,
      })

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "operator",
      })
      setOpen(false)
    } catch (error: any) {
      console.error("Register error full:", error)
      console.error("Register error response:", error.response)
      console.error("Register error message:", error.message)
      console.error("Register error detail:", error.response?.data?.detail)
      
      let errorMessage = "Kullanıcı oluşturulamadı"
      
      // Backend'den gelen hatayı parse et
      const detail = error.response?.data?.detail
      if (typeof detail === "string") {
        errorMessage = detail
      } else if (Array.isArray(detail)) {
        // Pydantic validation hataları
        errorMessage = detail.map((err: any) => {
          const field = err.loc?.[1] || err.loc?.[0] || "alan"
          return `${field}: ${err.msg}`
        }).join(", ")
      }
      
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Yeni Kullanıcı
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            <DialogDescription>
              Sisteme yeni bir kullanıcı ekleyin. Oluşturduğunuz kullanıcı bilgileriyle giriş yapabilecek.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanıcı Adı *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                required
                minLength={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Şifre *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="operator">Operatör</SelectItem>
                  <SelectItem value="viewer">Görüntüleyici</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Kullanıcı Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
