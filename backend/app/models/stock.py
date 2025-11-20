# app/models/stock.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from datetime import datetime
from app.core.database import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    sponge_id = Column(Integer, ForeignKey("sponges.id"))
    quantity = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    type = Column(String)  # 'in' or 'out'
    note = Column(String)
