from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.stock_schema import StockCreate, StockResponse
from app.services.stock_service import StockService

router = APIRouter(prefix="/stocks", tags=["Stocks"])

@router.get("/", response_model=List[StockResponse])
def list_stocks(db: Session = Depends(get_db)):
    return StockService(db).get_all()

@router.get("/{stock_id}", response_model=StockResponse)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    stock = StockService(db).get_by_id(stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.post("/", response_model=StockResponse, status_code=201)
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    try:
        return StockService(db).create(stock)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    StockService(db).delete(stock_id)
    return {"message": "Stock record deleted successfully"}

@router.get("/summary")
def get_stock_summary(db: Session = Depends(get_db)):
    return StockService(db).get_summary()

@router.get("/by_date")
def get_stocks_by_date(
    start: str = Query(..., description="YYYY-MM-DD"),
    end: str = Query(..., description="YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    return StockService(db).get_by_date_range(start, end)

@router.get("/{sponge_id}/status")
def stock_status(sponge_id: int, db: Session = Depends(get_db)):
    return StockService(db).get_status(sponge_id)

# stock_router.py içinde
@router.get("/{sponge_id}/total")
def total_stock(sponge_id: int, db: Session = Depends(get_db)):
    # DÜZELTME: Repo yerine Service'deki hesaplama metodunu kullanıyoruz
    # Service katmanında get_total_quantity metodu zaten vardı.
    total = StockService(db).get_total_quantity(sponge_id)
    return {"sponge_id": sponge_id, "total": total}