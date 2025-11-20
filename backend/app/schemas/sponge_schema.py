# app/schemas/sponge_schema.py
from pydantic import BaseModel

class SpongeBase(BaseModel):
    name: str
    density: float
    hardness: str
    unit: str
    critical_stock: float

class SpongeCreate(SpongeBase):
    pass

class SpongeResponse(SpongeBase):
    id: int
    class Config:
        orm_mode = True
