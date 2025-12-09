from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification_schema import NotificationCreate, NotificationRead, NotificationUpdate
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[NotificationRead])
def get_notifications(
    user_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Bildirimleri getir.
    user_id belirtilirse kullanıcıya özel + genel bildirimler,
    belirtilmezse sadece genel bildirimler gelir.
    """
    repo = NotificationRepository(db)
    return repo.get_by_user(user_id=user_id, limit=limit)


@router.get("/unread-count", status_code=status.HTTP_200_OK)
def get_unread_count(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Okunmamış bildirim sayısı"""
    repo = NotificationRepository(db)
    count = repo.get_unread_count(user_id=user_id)
    return {"unread_count": count}


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=NotificationRead)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db)
):
    """Yeni bildirim oluştur"""
    repo = NotificationRepository(db)
    return repo.create(notification)


@router.put("/{notification_id}", status_code=status.HTTP_200_OK, response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    """Bildirimi okundu olarak işaretle"""
    repo = NotificationRepository(db)
    notification = repo.mark_as_read(notification_id)
    if not notification:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı")
    return notification


@router.put("/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_read(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Tüm bildirimleri okundu olarak işaretle"""
    repo = NotificationRepository(db)
    count = repo.mark_all_as_read(user_id=user_id)
    return {"marked_count": count}


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):
    """Bildirimi sil"""
    repo = NotificationRepository(db)
    success = repo.delete(notification_id)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı")
    return None
