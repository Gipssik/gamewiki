from uuid import UUID

from pydantic import BaseModel


class GenreInDB(BaseModel):
    id: UUID
    title: str

    class Config:
        orm_mode = True
