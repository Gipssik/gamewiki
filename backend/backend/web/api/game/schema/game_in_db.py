from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class GameInDB(BaseModel):
    id: UUID
    title: str
    released_at: datetime
    created_at: datetime

    class Config:
        orm_mode = True
