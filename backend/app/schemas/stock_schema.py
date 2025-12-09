from pydantic import BaseModel, Field, condecimal
from datetime import datetime
from typing import Optional
from enum import Enum


class StockType(str, Enum):
    in_ = "in"
    out = "out"
    return_ = "return"


class StockBase(BaseModel):
    sponge_id: int
    quantity: float = Field(..., gt=0, description="Miktar sıfırdan büyük olmalı")
    type: StockType
    note: Optional[str] = Field(None, max_length=255)
    price: Optional[condecimal(gt=0)] = None


class StockCreate(StockBase):
    pass


class StockResponse(StockBase):
    id: int
    date: datetime
    created_by: Optional[int] = None

    class Config:
        from_attributes = True
