from uuid import UUID

from pydantic import BaseModel


class PlatformInDB(BaseModel):
    id: UUID
    title: str

    class Config:
        orm_mode = True
