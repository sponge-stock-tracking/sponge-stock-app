from sqlalchemy.orm import Session
from app.models.stocks import Stock, StockType
from app.models.sponges import Sponge
from app.schemas.stock_schema import StockCreate
from sqlalchemy import func
from datetime import datetime

class StockRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Stock).all()

    def get_by_id(self, stock_id: int):
        return (
            self.db.query(Stock)
            .filter(Stock.id == stock_id)
            .first()
        )

    def create(self, stock: StockCreate):
        # DÜZELTME 1: Pydantic V2 uyumu (dict -> model_dump)
        obj = Stock(**stock.model_dump())
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, stock_id: int):
        record = self.get_by_id(stock_id)
        if not record:
            return None
        self.db.delete(record)
        self.db.commit()
        return record

    def get_total_stock(self, sponge_id: int) -> float:
        records = (
            self.db.query(Stock)
            .filter(Stock.sponge_id == sponge_id)
            .all()
        )

        total = 0.0
        for r in records:
            if r.type == StockType.in_ or r.type == StockType.return_:
                total += r.quantity
            elif r.type == StockType.out:
                total -= r.quantity
        return total

    def get_summary(self):
        """
        Her sünger için toplam giriş, çıkış, iade ve mevcut stok bilgisini döner.
        """
        sponges = self.db.query(Sponge).all()
        
        result = []
        for sponge in sponges:
            stocks = self.db.query(Stock).filter(Stock.sponge_id == sponge.id).all()
            
            total_in = sum(s.quantity for s in stocks if s.type == StockType.in_)
            total_out = sum(s.quantity for s in stocks if s.type == StockType.out)
            total_return = sum(s.quantity for s in stocks if s.type == StockType.return_)
            
            current_stock = total_in + total_return - total_out
            
            result.append({
                "sponge_id": sponge.id,
                "name": sponge.name,
                "total_in": total_in,
                "total_out": total_out,
                "total_return": total_return,
                "current_stock": current_stock,
                "critical_stock": sponge.critical_stock
            })
        
        return result

    def get_by_date_range(self, start: str, end: str):
        """
        Belirtilen tarih aralığındaki stok hareketlerini döner.
        start ve end formatı: YYYY-MM-DD
        """
        try:
            start_date = datetime.strptime(start, "%Y-%m-%d")
            end_date = datetime.strptime(end, "%Y-%m-%d")
            # End date'i günün sonuna kadar dahil et
            end_date = end_date.replace(hour=23, minute=59, second=59)
        except ValueError:
            return []
        
        return (
            self.db.query(Stock)
            .filter(Stock.date >= start_date)
            .filter(Stock.date <= end_date)
            .order_by(Stock.date.desc())
            .all()
        )