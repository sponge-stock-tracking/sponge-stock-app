"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package } from "lucide-react"

// Resim dosyanızın yolunu buraya ekleyin.
// LÜTFEN RESMİ public KLASÖRÜNE TAŞIYIP YOLU BUNA GÖRE DÜZELTİN!
const BACKGROUND_IMAGE_URL = '/imge.jpg'; // ÖRNEK: Eğer public/imge.jpg ise, '/imge.jpg' yazın.

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    try {
      await login(username, password)
      router.push("/dashboard")
    } catch (error: any) {
      const status = error.response?.status
      const detail = error.response?.data?.detail
      
      if (status === 401) {
        setError("Kullanıcı adı veya şifre hatalı")
      } else if (detail) {
        setError(detail)
      } else {
        setError("Giriş yapılırken bir hata oluştu")
      }
    }
  }

  return (
    // 1. ANA DİV (ARKA PLAN)
    // Inline stil ile arka plan resmi eklendi.
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ 
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      
      {/* 2. OVERLAY (Resmi karartmak ve okunabilirliği artırmak için) */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0"></div>

      {/* 3. CARD BİLEŞENİ (GLASSMORPHISM EFEKTİ) */}
      <Card 
        className="w-full max-w-md shadow-2xl bg-background/5 backdrop-blur-x0.90 border-border/30 dark:bg-background/10 dark:border-border/10 transition-all duration-300 z-10"
      >
        <CardHeader className="space-y-4 text-center">
         <img 
            src="/logo.png" 
            alt="Uygulama Logosu" 
            className="w-full h-full object-cover" 
          />
          <div>
            <CardTitle className="text-2xl font-bold">İYS Sünger ve Malzemecilik</CardTitle>
            <CardDescription className="text-primary/40 mt-2 text-lg">Hesabınıza giriş yapın</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 
                   bg-card/40 
                   text-foreground/50 
                   focus:border-primary 
                   focus:ring-2 
                   focus:ring-primary/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 
                   bg-card/40 
                   text-foreground/50
                   focus:border-primary 
                   focus:ring-2 
                   focus:ring-primary/50" 
              />

            </div>

            {error && (
             <Alert 
              variant="destructive"
              className="bg-destructive/15 backdrop-blur-sm border-destructive/50 transition-all duration-300" 
             >
             <AlertDescription>{error}</AlertDescription></Alert>
            )}

            <Button type="submit" className="w-full h-11 text-base font-medium">
              Giriş Yap
            </Button>

           
          </form>
        </CardContent>
      </Card>
    </div>
  )
}