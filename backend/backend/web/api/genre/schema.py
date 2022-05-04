from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from backend.web.api.game import schema as game_schema
from backend.web.api.user import schema as user_schema


class GenreBase(BaseModel):
    title: Optional[str] = None


class GenreCreate(GenreBase):
    title: str


class GenreUpdate(GenreBase):
    ...


class Genre(BaseModel):
    id: UUID
    title: str
    created_by_user: user_schema.User
    games: list[game_schema.Game] = []

    class Config:
        orm_mode = True
