from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from backend.web.api.game import schema as game_schema
from backend.web.api.sale import schema as sale_schema
from backend.web.api.user import schema as user_schema


class PlatformBase(BaseModel):
    title: Optional[str] = None


class PlatformCreate(PlatformBase):
    title: str


class PlatformUpdate(PlatformBase):
    pass


class Platform(BaseModel):
    id: UUID
    title: str
    created_by_user: user_schema.User
    games: list[game_schema.Game] = []
    sales: list[sale_schema.Sale] = []

    class Config:
        orm_mode = True
