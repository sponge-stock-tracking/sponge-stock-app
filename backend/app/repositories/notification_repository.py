from sqlalchemy.orm import Session
from app.models.notifications import Notification
from app.schemas.notification_schema import NotificationCreate
from typing import List, Optional
from datetime import datetime

class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, notification: NotificationCreate) -> Notification:
        """Yeni bildirim oluştur"""
        db_notification = Notification(**notification.model_dump())
        self.db.add(db_notification)
        self.db.commit()
        self.db.refresh(db_notification)
        return db_notification

    def get_by_user(self, user_id: Optional[int] = None, limit: int = 50) -> List[Notification]:
        """
        Kullanıcıya özel bildirimleri getir.
        user_id None ise genel bildirimleri getir.
        """
        query = self.db.query(Notification)
        
        if user_id:
            # Kullanıcıya özel veya genel bildirimler
            query = query.filter(
                (Notification.user_id == user_id) | (Notification.user_id.is_(None))
            )
        else:
            # Sadece genel bildirimler
            query = query.filter(Notification.user_id.is_(None))
        
        return query.order_by(Notification.created_at.desc()).limit(limit).all()

    def get_unread_count(self, user_id: Optional[int] = None) -> int:
        """Okunmamış bildirim sayısı"""
        query = self.db.query(Notification).filter(Notification.is_read == False)
        
        if user_id:
            query = query.filter(
                (Notification.user_id == user_id) | (Notification.user_id.is_(None))
            )
        else:
            query = query.filter(Notification.user_id.is_(None))
        
        return query.count()

    def mark_as_read(self, notification_id: int, user_id: int) -> Optional[Notification]:
        """
        Bildirimi okundu olarak işaretle.
        Sadece kullanıcının kendi bildirimini işaretlemesine izin verilir.
        """
        notification = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()
        
        if notification:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(notification)
        return notification

    def mark_all_as_read(self, user_id: int) -> int:
        """
        Tüm KİŞİSEL bildirimleri okundu olarak işaretle.
        Global bildirimler (user_id=None) etkilenmez çünkü başkasının verisini bozar.
        """
        # Sadece bu kullanıcıya ait olanları güncelle
        query = self.db.query(Notification).filter(
            Notification.is_read == False,
            Notification.user_id == user_id
        )
        
        count = query.update({
            "is_read": True,
            "read_at": datetime.utcnow()
        })
        self.db.commit()
        return count

    def delete(self, notification_id: int, user_id: int) -> bool:
        """
        Bildirimi sil.
        Sadece kullanıcının kendi bildirimini silmesine izin verilir.
        """
        notification = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()
        
        if notification:
            self.db.delete(notification)
            self.db.commit()
            return True
        return False
