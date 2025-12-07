from sqlalchemy import (
    Column, Integer, String, Float, DateTime,
    UniqueConstraint
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Sponge(Base):
    __tablename__ = "sponges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    density = Column(Float, nullable=False)
    hardness = Column(String(20), nullable=False)
    width = Column(Float)
    height = Column(Float)
    thickness = Column(Float)
    unit = Column(String(10), nullable=False)  # "m3" veya "adet"
    critical_stock = Column(Float, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints
    __table_args__ = (
        UniqueConstraint("density", "hardness", "thickness", name="uq_sponge_variant"),
    )

    # Relationships
    stocks = relationship("Stock", back_populates="sponge", cascade="all, delete")

    def __repr__(self):
        return f"<Sponge(id={self.id}, name='{self.name}', density={self.density}, hardness='{self.hardness}')>"
