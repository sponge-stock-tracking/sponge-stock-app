from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class ReportType(str, enum.Enum):
    weekly = "weekly"
    monthly = "monthly"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(Enum(ReportType), nullable=False)
    summary_json = Column(JSON, nullable=False)
    file_path = Column(String(512))
    generated_duration = Column(Float)  # saniye cinsinden (rapor oluşturma süresi)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="reports")

    def __repr__(self):
        return f"<Report(id={self.id}, type='{self.report_type}', created_by={self.created_by})>"
