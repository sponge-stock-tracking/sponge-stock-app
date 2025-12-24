"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { RaporlarModal } from "@/components/modals/raporlar-modal"
import { StokModal } from "@/components/modals/stok-modal"
import { SungerYonetimiModal } from "@/components/modals/sunger-yonetimi-modal"
import { StokGirisModal } from "@/components/modals/stok-giris-modal"
import { StokCikisModal } from "@/components/modals/stok-cikis-modal"
import { ChatbotButton } from "@/components/chatbot/chatbot-button"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarContent } from "@/components/sidebar-content"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [raporlarOpen, setRaporlarOpen] = useState(false)
  const [stokOpen, setStokOpen] = useState(false)
  const [stokGirisOpen, setStokGirisOpen] = useState(false)
  const [stokCikisOpen, setStokCikisOpen] = useState(false)
  const [sungerYonetimiOpen, setSungerYonetimiOpen] = useState(false)

  const sidebarProps = {
    onStokGiris: () => setStokGirisOpen(true),
    onStokCikis: () => setStokCikisOpen(true),
    onStokGoruntule: () => setStokOpen(true),
    onRaporlar: () => setRaporlarOpen(true),
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gradient-to-b from-[#052659] to-[#021024]">
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40 text-[#C1E8FF] hover:text-white hover:bg-white/10"
            >
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none bg-transparent w-[280px]">
            <SidebarContent
              {...sidebarProps}
              style={{
                background: 'linear-gradient(180deg, #021024, #052659)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.6)',
                borderRadius: '0 20px 20px 0',
                height: '100%'
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <Sidebar {...sidebarProps} />

        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {children}
        </main>
      </div>

      <RaporlarModal open={raporlarOpen} onOpenChange={setRaporlarOpen} />
      <StokModal open={stokOpen} onOpenChange={setStokOpen} />
      <StokGirisModal open={stokGirisOpen} onOpenChange={setStokGirisOpen} />
      <StokCikisModal open={stokCikisOpen} onOpenChange={setStokCikisOpen} />
      <SungerYonetimiModal open={sungerYonetimiOpen} onOpenChange={setSungerYonetimiOpen} />
      <ChatbotButton />
    </ProtectedRoute>
  )
}
