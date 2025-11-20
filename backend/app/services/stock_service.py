# app/services/stock_service.py
from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.schemas.stock_schema import StockCreate
from app.repositories import stock_repository

def add_stock(db: Session, stock_data: StockCreate):
    stock = stock_repository.create(db, stock_data)
    # Kritik stok kontrolü burada yapılabilir
    return stock
