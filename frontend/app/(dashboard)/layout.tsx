"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { RaporlarModal } from "@/components/modals/raporlar-modal"
import { StokModal } from "@/components/modals/stok-modal"
import { SungerYonetimiModal } from "@/components/modals/sunger-yonetimi-modal"
import { StokGirisModal } from "@/components/modals/stok-giris-modal"
import { StokCikisModal } from "@/components/modals/stok-cikis-modal"

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gradient-to-b from-[#052659] to-[#021024]">
        <Sidebar
          onStokGiris={() => setStokGirisOpen(true)}
          onStokCikis={() => setStokCikisOpen(true)}
          onStokGoruntule={() => setStokOpen(true)}
          onRaporlar={() => setRaporlarOpen(true)}
        />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {children}
        </main>
      </div>

      <RaporlarModal open={raporlarOpen} onOpenChange={setRaporlarOpen} />
      <StokModal open={stokOpen} onOpenChange={setStokOpen} />
      <StokGirisModal open={stokGirisOpen} onOpenChange={setStokGirisOpen} />
      <StokCikisModal open={stokCikisOpen} onOpenChange={setStokCikisOpen} />
      <SungerYonetimiModal open={sungerYonetimiOpen} onOpenChange={setSungerYonetimiOpen} />
    </ProtectedRoute>
  )
}
