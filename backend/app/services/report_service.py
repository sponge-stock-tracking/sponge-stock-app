import logging
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.report_repository import ReportRepository
from app.repositories.notification_repository import NotificationRepository
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationCreate

logger = logging.getLogger(__name__)

class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ReportRepository(db)
        self.notifier = NotificationService()
        self.notification_repo = NotificationRepository(db)

    def weekly(self):
        data = self.repo.get_weekly_summary()
        if not data:
            return {"message": "Son 7 gün içinde hareket bulunamadı."}

        total_in = sum(row[1] or 0 for row in data)
        total_out = sum(row[2] or 0 for row in data)
        return {
            "period": f"{(datetime.utcnow() - timedelta(days=7)).date()} - {datetime.utcnow().date()}",
            "total_in": total_in,
            "total_out": total_out,
            "top_items": sorted(
                [{"name": row[0], "net": (row[1] or 0) - (row[2] or 0)} for row in data],
                key=lambda x: abs(x["net"]),
                reverse=True,
            ),
        }

    def monthly(self):
        data = self.repo.get_monthly_summary()
        if not data:
            return {"message": "Bu ay içinde hareket bulunamadı."}

        total_in = sum(row[1] or 0 for row in data)
        total_out = sum(row[2] or 0 for row in data)
        return {
            "month": datetime.utcnow().strftime("%B %Y"),
            "total_in": total_in,
            "total_out": total_out,
            "items": [
                {"name": row[0], "in": row[1] or 0, "out": row[2] or 0}
                for row in data
            ],
        }

    def critical(self, notify: bool = False):
        data = self.repo.get_critical_stocks()
        formatted = [
            {
                "name": row[0],
                "available_stock": float(row[1]),
                "critical_stock": float(row[2]),
                "status": "critical",
            }
            for row in data
        ]

        if not formatted:
            return {"message": "Kritik stokta ürün bulunmuyor."}

        # Bildirim oluştur (her zaman)
        for item in formatted:
            notification = NotificationCreate(
                title="⚠️ Kritik Stok Uyarısı",
                message=f"{item['name']} stoğu kritik seviyede: {item['available_stock']:.0f} / {item['critical_stock']:.0f}",
                type="warning"
            )
            try:
                self.notification_repo.create(notification)
                logger.info(f"Kritik stok bildirimi oluşturuldu: {item['name']}")
            except Exception as e:
                logger.error(f"Bildirim oluşturma hatası: {e}")

        # E-posta gönder (isteğe bağlı)
        if notify:
            try:
                body = "<h3>Kritik Stok Uyarısı</h3><ul>"
                for item in formatted:
                    body += f"<li>{item['name']} — {item['available_stock']} / {item['critical_stock']}</li>"
                body += "</ul>"
                result = self.notifier.send_email(
                    to=["admin@factory.com"],
                    subject="⚠️ Kritik Stok Uyarısı",
                    body=body,
                )
                logger.info(f"E-posta gönderimi: {result}")
            except Exception as e:
                logger.error(f"E-posta gönderimi başarısız: {e}")
                raise HTTPException(status_code=500, detail="E-posta gönderimi başarısız.")
        
        return formatted
