from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories.dashboard_repository import DashboardRepository
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", status_code=status.HTTP_200_OK)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Dashboard için genel istatistikler
    - Toplam ürün sayısı
    - Toplam stok miktarı
    - Kritik stokta olan ürün sayısı
    - Son 24 saat içindeki hareket sayısı
    """
    repo = DashboardRepository(db)
    return repo.get_overview_stats()


@router.get("/weekly-trend", status_code=status.HTTP_200_OK)
def get_weekly_trend(db: Session = Depends(get_db)):
    """
    Son 7 günün günlük giriş/çıkış trendi
    """
    repo = DashboardRepository(db)
    return repo.get_weekly_trend()


@router.get("/top-movers", status_code=status.HTTP_200_OK)
def get_top_movers(limit: int = 5, db: Session = Depends(get_db)):
    """
    Son 7 gündeki en çok hareket gören ürünler
    """
    repo = DashboardRepository(db)
    return repo.get_top_movers(limit=limit)
