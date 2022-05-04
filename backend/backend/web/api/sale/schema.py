from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from backend.web.api.game import schema as game_schema
from backend.web.api.platform import schema as platform_schema
from backend.web.api.user import schema as user_schema


class SaleBase(BaseModel):
    amount: Optional[float] = None


class SaleCreate(SaleBase):
    amount: float
    game_id: UUID
    platform_id: UUID


class SaleUpdate(SaleBase):
    game_id: Optional[UUID] = None
    platform_id: Optional[UUID] = None


class Sale(BaseModel):
    id: UUID
    amount: float
    game: game_schema.Game
    platform: platform_schema.Platform
    created_by_user: user_schema.User

    class Config:
        orm_mode = True
