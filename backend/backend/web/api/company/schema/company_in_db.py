from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class CompanyInDB(BaseModel):
    id: UUID
    title: str
    founded_at: date
    created_at: datetime

    class Config:
        orm_mode = True
