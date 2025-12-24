"use client"

import { useEffect, useState } from "react"
import { Bell, Check, CheckCheck, Trash2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from "@/api/notifications"
import type { Notification } from "@/api/notifications"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const loadNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        getNotifications(20),
        getUnreadCount()
      ])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error)
    }
  }

  useEffect(() => {
    loadNotifications()

    // Her 30 saniyede bir yenile
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId)
      await loadNotifications()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bildirim güncellenemedi",
        variant: "destructive"
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true)
      await markAllAsRead()
      await loadNotifications()
      toast({
        title: "Başarılı",
        description: "Tüm bildirimler okundu olarak işaretlendi"
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem başarısız",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId)
      await loadNotifications()
      toast({
        title: "Başarılı",
        description: "Bildirim silindi"
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bildirim silinemedi",
        variant: "destructive"
      })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" style={{ color: '#ff6b6b' }} />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" style={{ color: '#ffd93d' }} />
      case 'success':
        return <Check className="h-4 w-4" style={{ color: '#6bcf7f' }} />
      default:
        return <Info className="h-4 w-4" style={{ color: '#74b9ff' }} />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Az önce'
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays === 1) return 'Dün'
    if (diffDays < 7) return `${diffDays} gün önce`

    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-all hover:scale-110"
          style={{
            color: '#C1E8FF'
          }}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs border-2"
              style={{
                background: '#f87171',
                color: 'white',
                borderColor: '#021024'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96"
        style={{
          background: 'linear-gradient(135deg, rgba(5, 38, 89, 0.98), rgba(2, 16, 36, 0.98))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(193, 232, 255, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
          color: '#FFFFFF'
        }}
      >
        <DropdownMenuLabel className="flex items-center justify-between py-3">
          <span style={{ color: '#C1E8FF', fontWeight: 'bold', fontSize: '1rem' }}>Bildirimler</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              style={{
                background: 'rgba(193, 232, 255, 0.1)',
                color: '#C1E8FF',
                border: '1px solid rgba(193, 232, 255, 0.3)'
              }}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Tümünü Okundu İşaretle
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ background: 'rgba(193, 232, 255, 0.2)' }} />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bell className="h-14 w-14 mb-3" style={{ opacity: 0.2, color: '#C1E8FF' }} />
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Bildirim bulunmuyor</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              Yeni bildirimler burada görünecek
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[450px]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer transition-all my-1 mx-2 rounded-lg",
                  !notification.is_read && "bg-accent/50"
                )}
                style={{
                  background: !notification.is_read
                    ? 'rgba(193, 232, 255, 0.15)'
                    : 'transparent',
                  border: !notification.is_read
                    ? '1px solid rgba(193, 232, 255, 0.2)'
                    : '1px solid transparent'
                }}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-none" style={{ color: '#C1E8FF' }}>
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0 mt-1"
                        style={{ background: '#4CAF50' }}
                      />
                    )}
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {formatDate(notification.created_at)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 transition-all hover:scale-110"
                      style={{
                        color: '#f87171'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(notification.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
