from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any, Optional
from enum import Enum


class ReportType(str, Enum):
    weekly = "weekly"
    monthly = "monthly"


class ReportBase(BaseModel):
    report_type: ReportType
    summary_json: dict[str, Any] = Field(default_factory=dict)
    file_path: Optional[str] = None
    created_by: int


class ReportRead(ReportBase):
    id: int
    generated_at: datetime

    class Config:
        from_attributes = True
