"use client"

import { SidebarContent } from "@/components/sidebar-content"

interface SidebarProps {
  onStokGiris?: () => void
  onStokCikis?: () => void
  onStokGoruntule?: () => void
  onRaporlar?: () => void
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside
      className="hidden md:flex w-[250px] h-screen flex-col text-[#C1E8FF]"
      style={{
        background: 'linear-gradient(180deg, #021024, #052659)',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.6)',
        borderRadius: '20px'
      }}
    >
      <SidebarContent {...props} />
    </aside>
  )
}
