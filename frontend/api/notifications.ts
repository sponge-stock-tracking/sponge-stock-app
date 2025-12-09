import api from './axios';

export interface Notification {
  id: number;
  user_id: number | null;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationCreate {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  user_id?: number;
}

/**
 * Tüm bildirimleri getir
 */
export async function getNotifications(userId?: number, limit: number = 50): Promise<Notification[]> {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<Notification[]>(`/notifications/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Bildirimler alınırken hata:', error);
    throw error;
  }
}

/**
 * Okunmamış bildirim sayısını getir
 */
export async function getUnreadCount(userId?: number): Promise<number> {
  try {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await api.get<{ unread_count: number }>(`/notifications/unread-count${params}`);
    return response.data.unread_count;
  } catch (error) {
    console.error('Okunmamış bildirim sayısı alınırken hata:', error);
    return 0;
  }
}

/**
 * Yeni bildirim oluştur
 */
export async function createNotification(notification: NotificationCreate): Promise<Notification> {
  try {
    const response = await api.post<Notification>('/notifications/', notification);
    return response.data;
  } catch (error) {
    console.error('Bildirim oluşturulurken hata:', error);
    throw error;
  }
}

/**
 * Bildirimi okundu olarak işaretle
 */
export async function markAsRead(notificationId: number): Promise<Notification> {
  try {
    const response = await api.put<Notification>(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Bildirim okundu olarak işaretlenirken hata:', error);
    throw error;
  }
}

/**
 * Tüm bildirimleri okundu olarak işaretle
 */
export async function markAllAsRead(userId?: number): Promise<number> {
  try {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await api.put<{ marked_count: number }>(`/notifications/mark-all-read${params}`);
    return response.data.marked_count;
  } catch (error) {
    console.error('Tüm bildirimler okundu olarak işaretlenirken hata:', error);
    throw error;
  }
}

/**
 * Bildirimi sil
 */
export async function deleteNotification(notificationId: number): Promise<void> {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.error('Bildirim silinirken hata:', error);
    throw error;
  }
}
