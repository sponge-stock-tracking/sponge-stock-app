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
        return self.db.query(Stock).filter(Stock.id == stock_id).first()

    def create(self, stock: StockCreate):
        db_obj = Stock(**stock.dict())
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, stock_id: int):
        db_obj = self.get_by_id(stock_id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()
        return db_obj

    def get_summary(self):
        """
        Sünger türüne göre toplam stok (giriş - çıkış + iade)
        """
        result = (
            self.db.query(
                Stock.sponge_id,
                func.sum(
                    func.case(
                        (Stock.type == StockType.in_, Stock.quantity),
                        (Stock.type == StockType.return_, Stock.quantity),
                        else_=-Stock.quantity,
                    )
                ).label("available_stock"),
            )
            .group_by(Stock.sponge_id)
            .all()
        )
        return result

    def get_by_date_range(self, start_date, end_date):
        return (
            self.db.query(Stock)
            .filter(Stock.date.between(start_date, end_date))
            .all()
        )
