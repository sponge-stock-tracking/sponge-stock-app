from sqlalchemy.orm import Session
from app.models.stocks import Stock, StockType
from app.schemas.stock_schema import StockCreate
from sqlalchemy import func

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
        # Raporlama için doldurulacak
        pass

    def get_by_date_range(self, start, end):
        # Raporlama için doldurulacak
        pass