from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CompanyInDB(BaseModel):
    id: UUID
    title: str
    founded_at: datetime
    created_at: datetime

    class Config:
        orm_mode = True
