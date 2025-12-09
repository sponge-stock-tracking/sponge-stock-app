from sqlalchemy import (
    Column, Integer, Float, String, DateTime, ForeignKey,
    Enum, Text, CheckConstraint, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class StockType(str, enum.Enum):
    in_ = "in"        # Giriş
    out = "out"       # Çıkış
    return_ = "return"  # İade


class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    sponge_id = Column(Integer, ForeignKey("sponges.id", ondelete="CASCADE"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    quantity = Column(Float, nullable=False)
    type = Column(Enum(StockType), nullable=False)
    price = Column(Float)
    note = Column(Text)
    date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints & Index
    __table_args__ = (
        CheckConstraint("quantity >= 0", name="ck_quantity_positive"),
        Index("idx_stock_sponge_date", "sponge_id", "date"),
    )

    # Relationships
    sponge = relationship("Sponge", back_populates="stocks")
    user = relationship("User", back_populates="stocks")

    def __repr__(self):
        return f"<Stock(id={self.id}, sponge_id={self.sponge_id}, qty={self.quantity}, type={self.type})>"
