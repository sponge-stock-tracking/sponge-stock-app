from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str = "info"  # info, warning, error, success
    user_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationRead(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: bool
