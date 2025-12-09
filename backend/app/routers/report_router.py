from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
import logging
from app.core.database import get_db
from app.services.report_service import ReportService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/weekly", status_code=status.HTTP_200_OK)
def get_weekly_report(db: Session = Depends(get_db)):
    """
    Son 7 gün içindeki stok giriş/çıkış raporu.
    """
    logger.info("Weekly report generated.")
    return ReportService(db).weekly()


@router.get("/monthly", status_code=status.HTTP_200_OK)
def get_monthly_report(db: Session = Depends(get_db)):
    """
    İçinde bulunulan aya ait stok hareketleri.
    """
    logger.info("Monthly report generated.")
    return ReportService(db).monthly()


@router.get("/critical", status_code=status.HTTP_200_OK)
def get_critical_stocks(
    notify: bool = Query(False, description="E-posta bildirimi gönderilsin mi?"),
    db: Session = Depends(get_db),
):
    """
    Kritik stok seviyesinin altındaki ürünleri döndürür.
    notify=True ise e-posta bildirimi gönderir.
    """
    logger.info("Critical stock report requested.")
    return ReportService(db).critical(notify=notify)
