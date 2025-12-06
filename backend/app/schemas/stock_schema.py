# app/schemas/stock_schema.py
from pydantic import BaseModel
from datetime import datetime

class StockBase(BaseModel):
    sponge_id: int
    quantity: float
    type: str
    note: str | None = None

class StockCreate(StockBase):
    pass

class StockResponse(StockBase):
    id: int
    date: datetime
    class Config:
        orm_mode = True
