import logging
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import func  # <--- EKLENDI

from app.repositories.stock_repository import StockRepository
from app.schemas.stock_schema import StockCreate, StockType
from app.repositories.sponge_repository import SpongeRepository
from app.models.stocks import Stock # <--- EKLENDI

logger = logging.getLogger(__name__)

class StockService:
    def __init__(self, db):
        self.db = db
        self.repo = StockRepository(db)
        self.sponge_repo = SpongeRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_id(self, stock_id: int):
        return self.repo.get_by_id(stock_id)

    def create(self, stock: StockCreate):
        # 1) Sünger kontrolü
        sponge = self.sponge_repo.get_by_id(stock.sponge_id)
        if not sponge:
            raise HTTPException(status_code=404, detail="Sponge not found")

        # 2) OUT işleminde stok yeterli mi?
        # Not: get_total_stock metodunu repository'den çağırmak daha güvenlidir
        current = self.repo.get_total_stock(stock.sponge_id)

        if stock.type == StockType.out and stock.quantity > current:
            raise HTTPException(status_code=400, detail="Not enough stock")

        # 3) Kayıt oluştur
        return self.repo.create(stock)

    def delete(self, stock_id: int):
        return self.repo.delete(stock_id)

    def get_summary(self):
        return self.repo.get_summary()

    def get_by_date_range(self, start, end):
        return self.repo.get_by_date_range(start, end)

    def get_status(self, sponge_id: int):
        sponge = self.sponge_repo.get_by_id(sponge_id)
        if not sponge:
            raise HTTPException(status_code=404, detail="Sponge not found")

        total = self.repo.get_total_stock(sponge_id)

        return {
            "sponge_id": sponge_id,
            "total": total,
            "critical": total <= sponge.critical_stock,
        }

    def get_total_quantity(self, sponge_id: int):
        # COALESCE kullanarak None dönmesini engelliyoruz (0 döner)
        in_qty = (
            self.db.query(func.coalesce(func.sum(Stock.quantity), 0))
            .filter(Stock.sponge_id == sponge_id, Stock.type == StockType.in_)
            .scalar()
        )

        out_qty = (
            self.db.query(func.coalesce(func.sum(Stock.quantity), 0))
            .filter(Stock.sponge_id == sponge_id, Stock.type == StockType.out)
            .scalar()
        )

        return_qty = (
            self.db.query(func.coalesce(func.sum(Stock.quantity), 0))
            .filter(Stock.sponge_id == sponge_id, Stock.type == StockType.return_)
            .scalar()
        )

        return in_qty + return_qty - out_qty