from datetime import datetime
from uuid import UUID

from pydantic import AnyHttpUrl, BaseModel


class BackupInDB(BaseModel):
    id: UUID
    title: str
    url: AnyHttpUrl
    created_at: datetime

    class Config:
        orm_mode = True
