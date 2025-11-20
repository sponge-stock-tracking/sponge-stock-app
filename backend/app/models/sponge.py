# app/models/sponge.py
from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Sponge(Base):
    __tablename__ = "sponges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    density = Column(Float)
    hardness = Column(String)
    unit = Column(String)
    critical_stock = Column(Float)
