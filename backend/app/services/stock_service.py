import logging
from datetime import datetime
from fastapi import HTTPException
from app.repositories.stock_repository import StockRepository
from app.schemas.stock_schema import StockCreate

logger = logging.getLogger(__name__)

class StockService:
    def __init__(self, db):
        self.repo = StockRepository(db)

    def get_all(self):
        return self.repo.get_all()

    def get_by_id(self, stock_id: int):
        stock = self.repo.get_by_id(stock_id)
        if not stock:
            raise HTTPException(status_code=404, detail="Stok kaydı bulunamadı.")
        return stock

    def create(self, stock: StockCreate):
        if stock.quantity <= 0:
            raise HTTPException(status_code=400, detail="Miktar 0'dan büyük olmalıdır.")
        try:
            return self.repo.create(stock)
        except ValueError as e:
            logger.error(f"Stok eklenemedi: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    def delete(self, stock_id: int):
        deleted = self.repo.delete(stock_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Stok kaydı silinemedi.")
        return deleted

    def get_summary(self):
        data = self.repo.get_summary()
        return [{"sponge_id": s[0], "available_stock": float(s[1] or 0)} for s in data]

    def get_by_date_range(self, start: str, end: str):
        try:
            start_date = datetime.fromisoformat(start)
            end_date = datetime.fromisoformat(end)
            if start_date > end_date:
                raise HTTPException(status_code=400, detail="Başlangıç tarihi bitişten büyük olamaz.")
            return self.repo.get_by_date_range(start_date, end_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Geçersiz tarih formatı. ISO format kullanın (YYYY-MM-DD).")
