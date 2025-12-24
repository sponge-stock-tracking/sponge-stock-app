"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import {
    LogIn as SignInIcon,
    LogOut as SignOutIcon,
    Eye,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Save,
    X
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SidebarContentProps {
    onStokGiris?: () => void
    onStokCikis?: () => void
    onStokGoruntule?: () => void
    onRaporlar?: () => void
    className?: string
    style?: React.CSSProperties
}

export function SidebarContent({
    onStokGiris,
    onStokCikis,
    onStokGoruntule,
    onRaporlar,
    className,
    style
}: SidebarContentProps) {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [noteModalOpen, setNoteModalOpen] = useState(false)
    const [noteText, setNoteText] = useState("")
    const [noteData, setNoteData] = useState<Record<string, string>>({})

    const monthNames = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ]

    useEffect(() => {
        const stored = localStorage.getItem('dashboardNotes')
        if (stored) {
            setNoteData(JSON.parse(stored))
        }
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        return firstDay === 0 ? 6 : firstDay - 1
    }

    const isToday = (day: number) => {
        const today = new Date()
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        )
    }

    const hasNote = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return noteData[dateStr] && noteData[dateStr].trim() !== ''
    }

    const handleDayClick = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        setSelectedDate(dateStr)
        setNoteText(noteData[dateStr] || '')
        setNoteModalOpen(true)
    }

    const saveNote = () => {
        if (!selectedDate) return

        const newNoteData = { ...noteData }
        if (noteText.trim()) {
            newNoteData[selectedDate] = noteText.trim()
        } else {
            delete newNoteData[selectedDate]
        }

        setNoteData(newNoteData)
        localStorage.setItem('dashboardNotes', JSON.stringify(newNoteData))
        setNoteModalOpen(false)
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

    return (
        <>
            <div
                className={cn("flex flex-col text-[#C1E8FF] h-full", className)}
                style={style}
            >
                <div className="p-[30px_20px] text-center">
                    <img
                        src="https://via.placeholder.com/80"
                        className="w-20 h-20 rounded-full border-[3px] border-[#C1E8FF] mb-2.5 mx-auto"
                        alt="Kullanıcı Resmi"
                    />
                    <h3 className="font-bold text-lg">{user?.username?.toUpperCase() || "KULLANICI ADI"}</h3>
                    <p className="text-sm opacity-80">{user?.username || "kullanıcı@example.com"}</p>
                </div>

                <nav className="flex-1">
                    <ul className="list-none p-0">
                        <li
                            className="transition-all cursor-pointer"
                            style={{
                                borderTopRightRadius: '30px',
                                borderBottomRightRadius: '30px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(193, 232, 255, 0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={onStokGiris}
                        >
                            <a className="flex items-center p-[15px_20px] text-[#C1E8FF] no-underline">
                                <SignInIcon className="mr-4 w-4 h-4" />
                                Stok Giriş
                            </a>
                        </li>
                        <li
                            className="transition-all cursor-pointer"
                            style={{
                                borderTopRightRadius: '30px',
                                borderBottomRightRadius: '30px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(193, 232, 255, 0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={onStokCikis}
                        >
                            <a className="flex items-center p-[15px_20px] text-[#C1E8FF] no-underline">
                                <SignOutIcon className="mr-4 w-4 h-4" />
                                Stok Çıkış
                            </a>
                        </li>
                        <li
                            className="transition-all cursor-pointer"
                            style={{
                                borderTopRightRadius: '30px',
                                borderBottomRightRadius: '30px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(193, 232, 255, 0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={onStokGoruntule}
                        >
                            <a className="flex items-center p-[15px_20px] text-[#C1E8FF] no-underline">
                                <Eye className="mr-4 w-4 h-4" />
                                Stok Görüntüle
                            </a>
                        </li>
                        <li
                            className="transition-all cursor-pointer"
                            style={{
                                borderTopRightRadius: '30px',
                                borderBottomRightRadius: '30px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(193, 232, 255, 0.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={onRaporlar}
                        >
                            <a className="flex items-center p-[15px_20px] text-[#C1E8FF] no-underline">
                                <BarChart3 className="mr-4 w-4 h-4" />
                                Raporlar
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 rounded-xl mx-4 mb-4" style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div className="flex justify-between items-center mb-2.5">
                        <button
                            onClick={prevMonth}
                            className="bg-transparent border-none text-[#C1E8FF] cursor-pointer text-lg p-1 rounded transition-all"
                            style={{
                                transition: 'background-color 0.2s, color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#5483B3'
                                e.currentTarget.style.color = '#FFFFFF'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#C1E8FF'
                            }}
                            aria-label="Önceki Ay"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-center font-bold text-base text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </div>
                        <button
                            onClick={nextMonth}
                            className="bg-transparent border-none text-[#C1E8FF] cursor-pointer text-lg p-1 rounded transition-all"
                            style={{
                                transition: 'background-color 0.2s, color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#5483B3'
                                e.currentTarget.style.color = '#FFFFFF'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#C1E8FF'
                            }}
                            aria-label="Sonraki Ay"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        <div className="text-xs text-[#5483B3]">Pzt</div>
                        <div className="text-xs text-[#5483B3]">Sal</div>
                        <div className="text-xs text-[#5483B3]">Çar</div>
                        <div className="text-xs text-[#5483B3]">Per</div>
                        <div className="text-xs text-[#5483B3]">Cum</div>
                        <div className="text-xs text-[#5483B3]">Cmt</div>
                        <div className="text-xs text-[#5483B3]">Paz</div>
                        {emptyDays.map((_, i) => (
                            <div key={`empty-${i}`} className="invisible" />
                        ))}
                        {days.map((day) => (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={cn(
                                    "text-sm py-1.5 rounded-md cursor-pointer transition-colors relative",
                                    isToday(day)
                                        ? "bg-[#7DA0CA] font-bold text-[#021024]"
                                        : "text-white hover:bg-[rgba(255,255,255,0.1)]"
                                )}
                            >
                                {day}
                                {hasNote(day) && (
                                    <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-5 text-center mt-auto"></div>
            </div>

            <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
                <DialogContent className="max-w-[500px] border-[rgba(193,232,255,0.2)]" style={{
                    background: 'linear-gradient(135deg, rgba(5, 38, 89, 0.98), rgba(2, 16, 36, 0.98))',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)'
                }}>
                    <h3 className="text-xl font-bold mb-4 pb-2.5" style={{
                        borderBottom: '2px solid #7DA0CA'
                    }}>
                        {selectedDate && (
                            <>
                                {new Date(selectedDate).getDate()} {monthNames[new Date(selectedDate).getMonth()]} {new Date(selectedDate).getFullYear()} Notları
                            </>
                        )}
                    </h3>
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Bu güne özel notlarınızı buraya yazın..."
                        className="w-full h-[150px] p-2.5 mb-4 rounded-lg outline-none text-base box-border"
                        style={{
                            border: '1px solid #5483B3',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#FFFFFF',
                            resize: 'vertical'
                        }}
                    />
                    <div className="flex gap-2.5">
                        <button
                            onClick={saveNote}
                            className="px-5 py-2.5 border-none rounded-md cursor-pointer font-bold transition-colors"
                            style={{
                                background: '#4CAF50',
                                color: '#FFFFFF'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#43A047'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#4CAF50'}
                        >
                            <Save className="w-4 h-4 inline mr-2" />
                            Kaydet
                        </button>
                        <button
                            onClick={() => setNoteModalOpen(false)}
                            className="px-5 py-2.5 border-none rounded-md cursor-pointer font-bold transition-colors"
                            style={{
                                background: '#5483B3',
                                color: '#FFFFFF'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#4A7099'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#5483B3'}
                        >
                            <X className="w-4 h-4 inline mr-2" />
                            Kapat
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
