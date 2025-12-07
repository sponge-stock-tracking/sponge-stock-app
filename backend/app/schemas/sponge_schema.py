from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class SpongeBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    density: float = Field(..., gt=0, lt=100, description="Dansite 0-100 arasında olmalı")
    hardness: str = Field(..., pattern="^(soft|medium|hard)$")
    unit: str = Field(..., pattern="^(m3|adet)$")
    width: Optional[float] = Field(None, gt=0)
    height: Optional[float] = Field(None, gt=0)
    thickness: Optional[float] = Field(None, gt=0)
    critical_stock: float = Field(5, ge=0)


class SpongeCreate(SpongeBase):
    pass


class SpongeRead(SpongeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
