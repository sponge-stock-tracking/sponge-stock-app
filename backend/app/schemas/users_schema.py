from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    operator = "operator"
    viewer = "viewer"


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    role: UserRole = UserRole.operator


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class UserResponse(UserBase):
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True  # Pydantic v2 standardı


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # saniye cinsinden access token süresi


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[UserRole] = None
    jti: Optional[str] = None
