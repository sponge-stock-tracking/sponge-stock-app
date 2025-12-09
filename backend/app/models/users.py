from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean
from sqlalchemy.sql import func
import enum
from app.core.database import Base
from sqlalchemy.orm import relationship


class UserRole(str, enum.Enum):
    admin = "admin"
    operator = "operator"
    viewer = "viewer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.operator)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    stocks = relationship("Stock", back_populates="user", cascade="all, delete")
    reports = relationship("Report", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
