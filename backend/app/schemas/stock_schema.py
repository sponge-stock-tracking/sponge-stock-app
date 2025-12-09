from pydantic import BaseModel, Field, condecimal, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum


class StockType(str, Enum):
    in_ = "in"
    out = "out"
    return_ = "return"


class StockBase(BaseModel):
    sponge_id: int
    quantity: float = Field(..., gt=0)
    type: StockType
    note: Optional[str] = Field(None, max_length=255)
    price: Optional[condecimal(gt=0)] = None  # type: ignore

    @field_validator("type", mode="before")
    def normalize_type(cls, v):
        # "IN" → "in", "Out" → "out"
        if isinstance(v, str):
            return v.lower()
        return v


class StockCreate(StockBase):
    pass


class StockResponse(StockBase):
    id: int
    date: datetime
    created_by: Optional[int] = None

    class Config:
        from_attributes = True
