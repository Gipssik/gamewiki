from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class GameInDB(BaseModel):
    id: UUID
    title: str
    released_at: date
    created_at: datetime

    class Config:
        orm_mode = True
